import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  FolderOpen
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    projectId: '',
  });

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/api/tasks'),
          api.get('/api/projects')
        ]);
        if (active) {
          setTasks(tasksRes.data || []);
          setProjects(projectsRes.data || []);
          setLoading(false);
        }
      } catch {
        if (active) {
          showToast('Error fetching tasks or projects.', 'error');
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [showToast]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      projectId: projects.length > 0 ? (projects[0].id || projects[0]._id) : '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    const taskProjId = task.projectId || task.project || (typeof task.project === 'object' ? task.project?._id : '');

    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'To Do',
      priority: task.priority || 'Medium',
      projectId: taskProjId || (projects.length > 0 ? (projects[0].id || projects[0]._id) : ''),
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Task title is required.', 'warning');
      return;
    }
    if (!formData.projectId) {
      showToast('Please select or create a project first.', 'warning');
      return;
    }

    try {
      if (editingTask) {
        // Edit task
        const id = editingTask.id || editingTask._id;
        const res = await api.put(`/api/tasks/${id}`, formData);
        setTasks(tasks.map((t) => ((t.id || t._id) === id ? res.data : t)));
        showToast('Task updated successfully.', 'success');
      } else {
        // Create task
        const res = await api.post('/api/tasks', formData);
        setTasks([...tasks, res.data]);
        showToast('Task created successfully.', 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save task.';
      showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => (t.id || t._id) !== id));
      showToast('Task deleted successfully.', 'success');
    } catch {
      showToast('Failed to delete task.', 'error');
    }
  };

  // Find project name mapping
  const getProjectName = (task) => {
    const taskProjId = task.projectId || task.project || (typeof task.project === 'object' ? task.project?._id : '');
    if (!taskProjId) return 'Unassigned';
    const proj = projects.find((p) => (p.id || p._id) === taskProjId);
    return proj ? proj.title : 'Unknown Project';
  };

  // Filter Tasks computation
  const filteredTasks = tasks.filter((task) => {
    const taskProjId = task.projectId || task.project || (typeof task.project === 'object' ? task.project?._id : '');
    
    const matchesSearch = (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || task.priority?.toLowerCase() === priorityFilter.toLowerCase();
    const matchesProject = projectFilter === 'all' || taskProjId === projectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const getPriorityStyle = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return 'text-red-400 bg-red-400/5 border border-red-500/25';
    if (p === 'medium') return 'text-yellow-400 bg-yellow-400/5 border border-yellow-500/25';
    return 'text-blue-400 bg-blue-400/5 border border-blue-500/25';
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'done' || s === 'completed') return 'text-emerald-400 bg-emerald-400/5 border border-emerald-400/20';
    if (s === 'in progress' || s === 'in_progress') return 'text-blue-400 bg-blue-400/5 border border-blue-400/20';
    return 'text-amber-400 bg-amber-400/5 border border-amber-400/20';
  };

  return (
    <div className="p-6 space-y-8 bg-brand-bg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text tracking-wide font-display">Tasks</h2>
          <p className="text-sm text-brand-text/50 mt-1">Manage and track your project assignments.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          disabled={projects.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent text-brand-bg hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-accent/10 font-semibold text-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Warning if no projects exist */}
      {projects.length === 0 && !loading && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-yellow-500/20 text-yellow-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>You must create a project workspace first before adding tasks.</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-brand-surface p-4 rounded-xl border border-brand-border/60">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text/30">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border/85 rounded-lg py-2 pl-9 pr-4 text-sm text-brand-text placeholder-brand-text/30 outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all"
          />
        </div>

        {/* Project Selector */}
        <div>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border/85 rounded-lg py-2 px-3 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id || p._id} value={p.id || p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border/85 rounded-lg py-2 px-3 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Completed</option>
          </select>
        </div>

        {/* Priority Selector */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border/85 rounded-lg py-2 px-3 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Task List table */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
            <span className="text-sm font-medium text-brand-text/50">Fetching task listings...</span>
          </div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-xs font-semibold uppercase tracking-wider text-brand-text/45 bg-brand-bg/30">
                  <th className="py-4 pl-6 pr-4">Task Details</th>
                  <th className="py-4 px-4">Project</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-sm">
                {filteredTasks.map((task) => {
                  const taskId = task.id || task._id;
                  return (
                    <tr key={taskId} className="group hover:bg-brand-bg/15 transition-colors">
                      {/* Title & Description */}
                      <td className="py-4 pl-6 pr-4 max-w-sm">
                        <div className="font-bold text-brand-text truncate">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-brand-text/45 line-clamp-1 mt-1 leading-normal">
                            {task.description}
                          </div>
                        )}
                      </td>

                      {/* Project Name */}
                      <td className="py-4 px-4 text-brand-text/75 font-medium truncate max-w-[150px]">
                        {getProjectName(task)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(task.status)}`}>
                          {task.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold capitalize ${getPriorityStyle(task.priority)}`}>
                          {task.priority || 'Medium'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(task)}
                            className="p-1.5 rounded-lg hover:bg-brand-surface-light text-brand-text/50 hover:text-brand-accent transition-all cursor-pointer"
                            title="Edit Task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(taskId)}
                            className="p-1.5 rounded-lg hover:bg-brand-surface-light text-brand-text/50 hover:text-red-400 transition-all cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-brand-border/60 rounded-2xl text-brand-text/40">
          <FolderOpen className="w-12 h-12 mb-3 text-brand-text/20 animate-pulse" />
          <h3 className="text-base font-bold text-brand-text">No Tasks Found</h3>
          <p className="text-sm mt-1 max-w-xs text-center text-brand-text/45">
            Add a new task or change your query filters to review items.
          </p>
        </div>
      )}

      {/* Task Modal (Create & Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task Details' : 'Add New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Implement auth hook"
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Description
            </label>
            <textarea
              id="task-desc"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the steps, requirements, and subtasks..."
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all resize-none"
            />
          </div>

          {/* Project dropdown */}
          <div>
            <label htmlFor="task-project" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Workspace Project *
            </label>
            <select
              id="task-project"
              name="projectId"
              required
              value={formData.projectId}
              onChange={handleInputChange}
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
            >
              <option value="" disabled>Select a workspace...</option>
              {projects.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="task-status" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="task-priority" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
                Priority
              </label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
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
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
