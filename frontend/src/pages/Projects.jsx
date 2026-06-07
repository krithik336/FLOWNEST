import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  FolderOpen
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    let active = true;
    const fetchProjects = async () => {
      try {
        const res = await api.get('/api/projects');
        if (active) {
          setProjects(res.data || []);
          setLoading(false);
        }
      } catch {
        if (active) {
          showToast('Failed to fetch projects.', 'error');
          setLoading(false);
        }
      }
    };

    fetchProjects();
    return () => {
      active = false;
    };
  }, [showToast]);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Project title is required.', 'warning');
      return;
    }

    try {
      if (editingProject) {
        // Edit project
        const id = editingProject.id || editingProject._id;
        const res = await api.put(`/api/projects/${id}`, formData);
        setProjects(projects.map((p) => ((p.id || p._id) === id ? res.data : p)));
        showToast('Project updated successfully.', 'success');
      } else {
        // Create project
        const res = await api.post('/api/projects', formData);
        setProjects([...projects, res.data]);
        showToast('Project created successfully.', 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save project.';
      showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will be affected.')) {
      return;
    }

    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => (p.id || p._id) !== id));
      showToast('Project deleted successfully.', 'success');
    } catch {
      showToast('Failed to delete project.', 'error');
    }
  };

  // Filter and search computation
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = (project.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-8 bg-brand-bg">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text tracking-wide font-display">Projects</h2>
          <p className="text-sm text-brand-text/50 mt-1">Create and manage your project workspaces.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent text-brand-bg hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/10 font-semibold text-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row gap-4 bg-brand-surface p-4 rounded-xl border border-brand-border/60">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text/30">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search projects by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border/85 rounded-lg py-2 pl-9 pr-4 text-sm text-brand-text placeholder-brand-text/30 outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
            <span className="text-sm font-medium text-brand-text/50">Fetching workspaces...</span>
          </div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projectId = project.id || project._id;
            return (
              <div
                key={projectId}
                className="flex flex-col justify-between p-5 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/30 transition-all duration-300 group relative"
              >
                {/* Top Title/Menu */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-brand-text tracking-wide truncate font-display group-hover:text-brand-accent transition-colors">
                      {project.title}
                    </h3>
                    
                    {/* Action buttons (inline) */}
                    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(project)}
                        className="p-1 rounded-lg hover:bg-brand-surface-light text-brand-text/50 hover:text-brand-accent transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(projectId)}
                        className="p-1 rounded-lg hover:bg-brand-surface-light text-brand-text/50 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-brand-text/60 mt-3 line-clamp-3 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between border-t border-brand-border/40 mt-5 pt-4">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/10">
                    <FolderKanban className="w-3.5 h-3.5" /> Workspace Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-brand-border/60 rounded-2xl text-brand-text/40">
          <FolderOpen className="w-12 h-12 mb-3 text-brand-text/20 animate-pulse" />
          <h3 className="text-base font-bold text-brand-text">No Projects Found</h3>
          <p className="text-sm mt-1 max-w-xs text-center text-brand-text/45">
            Create a new workspace or adjust your search to get started.
          </p>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project Workspace' : 'Create Project Workspace'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="modal-title" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Project Title *
            </label>
            <input
              id="modal-title"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Website Overhaul"
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="modal-desc" className="block text-xs font-semibold uppercase tracking-wider text-brand-text/55 mb-2">
              Description
            </label>
            <textarea
              id="modal-desc"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed overview of the goals..."
              className="block w-full rounded-xl border border-brand-border/85 bg-brand-bg/50 px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-accent/50 transition-all resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 border-t border-brand-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm border border-brand-border hover:bg-brand-surface-light text-brand-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-accent text-brand-bg hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/10 cursor-pointer"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
