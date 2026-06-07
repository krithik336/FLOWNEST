import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react';
import Modal from '../components/Modal';

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const { showToast } = useToast();

  // Modal State for quick task creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickTaskLane, setQuickTaskLane] = useState('To Do');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    projectId: '',
  });

  const columns = [
    { id: 'To Do', title: 'To Do', color: 'border-t-amber-500 bg-amber-500/5' },
    { id: 'In Progress', title: 'In Progress', color: 'border-t-blue-500 bg-blue-500/5' },
    { id: 'Done', title: 'Completed', color: 'border-t-emerald-500 bg-emerald-500/5' },
  ];

  // Fetch initial data
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/api/tasks'),
          api.get('/api/projects')
        ]);
        
        if (active) {
          const fetchedTasks = tasksRes.data || [];
          const fetchedProjects = projectsRes.data || [];

          setTasks(fetchedTasks);
          setProjects(fetchedProjects);

          // Default to first project if available and no project selected yet
          setSelectedProjectId(prev => {
            if (fetchedProjects.length > 0 && prev === 'all') {
              return fetchedProjects[0].id || fetchedProjects[0]._id;
            }
            return prev;
          });
          setLoading(false);
        }
      } catch {
        if (active) {
          showToast('Failed to load Kanban data.', 'error');
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [showToast]);

  // Handle Drag & Drop events
  const handleDragStart = (e, task) => {
    const taskId = task.id || task._id;
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    
    // Find the task in local state
    const task = tasks.find(t => (t.id || t._id) === taskId);
    if (!task || task.status === targetStatus) return;

    await updateTaskStatus(taskId, targetStatus);
  };

  // Move task via button controls
  const moveTask = async (task, direction) => {
    const statusOrder = ['To Do', 'In Progress', 'Done'];
    const currentIdx = statusOrder.indexOf(task.status);
    const newIdx = currentIdx + direction;

    if (newIdx >= 0 && newIdx < statusOrder.length) {
      const targetStatus = statusOrder[newIdx];
      const taskId = task.id || task._id;
      await updateTaskStatus(taskId, targetStatus);
    }
  };

  // API Call to Update Task Status (with Optimistic UI update)
  const updateTaskStatus = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    
    // Optimistic UI Update
    setTasks(prev =>
      prev.map(t => ((t.id || t._id) === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const task = previousTasks.find(t => (t.id || t._id) === taskId);
      const taskProjId = task.projectId || task.project || (typeof task.project === 'object' ? task.project?._id : '');

      await api.put(`/api/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        priority: task.priority || 'Medium',
        projectId: taskProjId,
        status: newStatus
      });
      showToast('Task status updated.', 'success', 1500);
    } catch {
      // Revert if API failed
      setTasks(previousTasks);
      showToast('Failed to update task status.', 'error');
    }
  };

  // Open quick create task modal
  const handleOpenQuickCreate = (status) => {
    if (projects.length === 0) {
      showToast('Create a project workspace first.', 'warning');
      return;
    }
    setQuickTaskLane(status);
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      projectId: selectedProjectId !== 'all' ? selectedProjectId : (projects[0].id || projects[0]._id),
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitQuickTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Task title is required.', 'warning');
      return;
    }
    if (!formData.projectId) {
      showToast('Please select a project.', 'warning');
      return;
    }

    try {
      const payload = {
        ...formData,
        status: quickTaskLane,
      };
      const res = await api.post('/api/tasks', payload);
      setTasks([...tasks, res.data]);
      showToast('Task added to board.', 'success');
      setIsModalOpen(false);
    } catch {
      showToast('Failed to add task.', 'error');
    }
  };

  // Filter tasks belonging to selected project
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const taskProjId = task.projectId || task.project || (typeof task.project === 'object' ? task.project?._id : '');
      if (selectedProjectId === 'all') return true;
      return taskProjId === selectedProjectId;
    });
  };

  const getPriorityStyle = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (p === 'medium') return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  };

  const currentBoardTasks = getFilteredTasks();

  return (
    <div className="p-6 space-y-6 bg-brand-bg flex flex-col h-[calc(100vh-4rem)]">
      {/* Header and Project Select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-brand-text tracking-wide font-display">Kanban Board</h2>
          <p className="text-sm text-brand-text/50 mt-1">Visualize workflows and shift project items.</p>
        </div>

        {/* Project workspace filter dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="board-project" className="text-xs font-semibold uppercase tracking-wider text-brand-text/45 shrink-0 hidden md:block">
            Workspace:
          </label>
          <select
            id="board-project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-brand-surface border border-brand-border/85 rounded-xl py-2 px-3 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all w-56 cursor-pointer"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id || p._id} value={p.id || p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {projects.length === 0 && !loading && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-yellow-500/20 text-yellow-400 text-sm flex items-center gap-3 shrink-0">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>You must create a project workspace first before using the Kanban board.</span>
        </div>
      )}

      {/* Kanban lanes container */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
            <span className="text-sm font-medium text-brand-text/50">Rendering board lanes...</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 kanban-scroll items-stretch">
          {columns.map((column) => {
            const laneTasks = currentBoardTasks.filter(
              (t) => t.status === column.id
            );

            return (
              <div
                key={column.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-72 md:w-80 shrink-0 flex flex-col rounded-2xl border border-brand-border bg-brand-surface/40 p-4 border-t-2 ${column.color}`}
              >
                {/* Column Title */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-wide text-brand-text/90 font-display">
                      {column.title}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-brand-surface-light border border-brand-border rounded-full text-brand-text/60">
                      {laneTasks.length}
                    </span>
                  </div>
                  
                  {/* Quick Task Add button */}
                  <button
                    onClick={() => handleOpenQuickCreate(column.id)}
                    disabled={projects.length === 0}
                    className="p-1 rounded-lg hover:bg-brand-surface-light text-brand-text/50 hover:text-brand-accent transition-colors disabled:opacity-30 cursor-pointer"
                    title="Quick Add Task"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Cards Container (Scrollable) */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 kanban-scroll min-h-[150px]">
                  {laneTasks.length > 0 ? (
                    laneTasks.map((task) => {
                      const taskId = task.id || task._id;
                      return (
                        <div
                          key={taskId}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          className="p-4 rounded-xl border border-brand-border bg-brand-surface hover:border-brand-accent/40 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing group relative select-none"
                        >
                          {/* Project Tag */}
                          {selectedProjectId === 'all' && (
                            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block truncate max-w-full mb-1.5">
                              {projects.find((p) => (p.id || p._id) === (task.projectId || task.project || (typeof task.project === 'object' ? task.project?._id : '')))?.title || 'Unassigned'}
                            </span>
                          )}

                          {/* Task Title */}
                          <h4 className="font-semibold text-sm text-brand-text leading-snug group-hover:text-brand-accent transition-colors">
                            {task.title}
                          </h4>

                          {/* Description snippet */}
                          {task.description && (
                            <p className="text-xs text-brand-text/45 mt-2 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Footer Details */}
                          <div className="flex items-center justify-between mt-4 border-t border-brand-border/40 pt-3">
                            {/* Priority Badge */}
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityStyle(task.priority)}`}>
                              {task.priority || 'Medium'}
                            </span>
                          </div>

                          {/* Move Controls (Chevrons for keyboard/mobile users) */}
                          <div className="flex justify-end gap-1.5 mt-3 pt-2 border-t border-brand-border/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            {column.id !== 'To Do' && (
                              <button
                                onClick={() => moveTask(task, -1)}
                                className="p-1 rounded bg-brand-bg hover:bg-brand-surface-light border border-brand-border text-brand-text/60 hover:text-brand-accent transition-colors cursor-pointer"
                                title="Move Left"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {column.id !== 'Done' && (
                              <button
                                onClick={() => moveTask(task, 1)}
                                className="p-1 rounded bg-brand-bg hover:bg-brand-surface-light border border-brand-border text-brand-text/60 hover:text-brand-accent transition-colors cursor-pointer"
                                title="Move Right"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center border border-dashed border-brand-border/40 rounded-xl text-brand-text/25">
                      <Clock className="w-6 h-6 mb-1 text-brand-text/10" />
                      <span className="text-xs">Lane is empty</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Task to ${columns.find((c) => c.id === quickTaskLane)?.title}`}
      >
        <form onSubmit={handleSubmitQuickTask} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="quick-title" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Task Title *
            </label>
            <input
              id="quick-title"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Update API models"
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="quick-desc" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Description
            </label>
            <textarea
              id="quick-desc"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Task details..."
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all resize-none"
            />
          </div>

          {/* Project */}
          {selectedProjectId === 'all' && (
            <div>
              <label htmlFor="quick-project" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
                Workspace Project *
              </label>
              <select
                id="quick-project"
                name="projectId"
                required
                value={formData.projectId}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
              >
                <option value="" disabled>Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Priority */}
          <div>
            <label htmlFor="quick-priority" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Priority
            </label>
            <select
              id="quick-priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 border-t border-brand-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm border border-brand-border hover:bg-brand-surface-light text-brand-text/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-accent text-brand-bg hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/10 cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Kanban;
