import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  CheckCircle,
  Plus,
  Loader2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { useToast } from '../components/Toast';

// Custom tooltips for Recharts declared outside render to satisfy React guidelines
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-surface border border-brand-border px-3 py-2 rounded-lg text-sm shadow-xl">
        <p className="font-semibold text-brand-text">{payload[0].name}</p>
        <p className="text-brand-accent font-medium mt-1">
          {payload[0].value}% Complete
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let dashboardData = {};

        try {
          const res = await api.get('/api/dashboard');
          dashboardData = res.data;
        } catch (dashError) {
          console.warn('Dashboard API failed, attempting fallback by fetching projects and tasks directly...', dashError);
          // Fallback: fetch projects and tasks and compute dashboard stats
          const [projectsRes, tasksRes] = await Promise.all([
            api.get('/api/projects'),
            api.get('/api/tasks')
          ]);

          const projects = projectsRes.data || [];
          const tasks = tasksRes.data || [];

          const completedTasks = tasks.filter(t => t.status === 'done' || t.status === 'Done').length;
          const todoTasks = tasks.filter(t => t.status === 'todo' || t.status === 'To Do' || t.status === 'TODO').length;
          const inProgressTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'In Progress').length;
          const inReviewTasks = tasks.filter(t => t.status === 'in_review' || t.status === 'In Review').length;

          // Map projects to progress
          const projectProgress = projects.map(proj => {
            const projTasks = tasks.filter(t => t.projectId === proj.id || t.project === proj.id || t.project?._id === proj.id);
            const total = projTasks.length;
            const completed = projTasks.filter(t => t.status === 'done' || t.status === 'Done').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            return {
              name: proj.title || proj.name || 'Untitled Project',
              progress: progress
            };
          });

          dashboardData = {
            totalProjects: projects.length,
            totalTasks: tasks.length,
            completedTasks,
            pendingTasks: tasks.length - completedTasks,
            tasksByStatus: {
              todo: todoTasks,
              in_progress: inProgressTasks,
              in_review: inReviewTasks,
              done: completedTasks
            },
            projectProgress: projectProgress.slice(0, 5), // Keep top 5
            recentTasks: tasks.slice(0, 5) // Keep top 5
          };
        }

        // Fill in details if some fields are missing
        const finalStats = {
          totalProjects: dashboardData.totalProjects ?? 0,
          totalTasks: dashboardData.totalTasks ?? 0,
          completedTasks: dashboardData.completedTasks ?? 0,
          pendingTasks: dashboardData.pendingTasks ?? 0,
          tasksByStatus: dashboardData.tasksByStatus || { todo: 0, in_progress: 0, in_review: 0, done: 0 },
          projectProgress: dashboardData.projectProgress || [],
          recentTasks: dashboardData.recentTasks || []
        };

        setStats(finalStats);
      } catch {
        showToast('Error loading dashboard statistics.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
          <span className="text-sm font-medium text-brand-text/50">Assembling dashboard data...</span>
        </div>
      </div>
    );
  }

  // Format status data for Pie Chart
  const statusChartData = [
    { name: 'To Do', value: stats.tasksByStatus.todo || 0, color: '#f59e0b' },
    { name: 'In Progress', value: stats.tasksByStatus.in_progress || 0, color: '#3b82f6' },
    { name: 'In Review', value: stats.tasksByStatus.in_review || 0, color: '#a855f7' },
    { name: 'Completed', value: stats.tasksByStatus.done || 0, color: '#4ade80' },
  ].filter(item => item.value > 0);

  // Fallback if no task status data
  const hasStatusData = statusChartData.length > 0;

  // Custom colors and formatting utilities
  const getPriorityBadgeColor = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (p === 'medium') return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  };

  return (
    <div className="p-6 space-y-8 bg-brand-bg">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text tracking-wide font-display">Dashboard Overview</h2>
          <p className="text-sm text-brand-text/50 mt-1">
            Here is a snapshot of your team's tasks and project progress.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-brand-border rounded-xl hover:bg-brand-surface-light text-brand-text transition-colors cursor-pointer"
          >
            Manage Projects
          </button>
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand-accent text-brand-bg hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="p-5 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text/45">Total Projects</span>
            <div className="p-2.5 rounded-xl bg-brand-accent/10 text-brand-accent border border-brand-accent/20 transition-colors group-hover:bg-brand-accent group-hover:text-brand-bg">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">{stats.totalProjects}</h3>
            <p className="text-xs text-brand-text/40 mt-1">Active workspaces managed</p>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-5 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text/45">Total Tasks</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 transition-colors group-hover:bg-blue-500 group-hover:text-white">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">{stats.totalTasks}</h3>
            <p className="text-xs text-brand-text/40 mt-1">Pending and finished tasks</p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="p-5 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text/45">Pending Tasks</span>
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 transition-colors group-hover:bg-yellow-500 group-hover:text-brand-bg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">{stats.pendingTasks}</h3>
            <p className="text-xs text-brand-text/40 mt-1">Tasks in backlog & progress</p>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-accent/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text/45">Completed Tasks</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition-colors group-hover:bg-emerald-500 group-hover:text-brand-bg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-brand-text tracking-tight">{stats.completedTasks}</h3>
            <p className="text-xs text-brand-text/40 mt-1">Successfully closed items</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-brand-border bg-brand-surface">
          <h3 className="text-base font-bold text-brand-text tracking-wide mb-6 font-display">Project Progress (%)</h3>
          {stats.projectProgress.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.projectProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a3c28/40" vertical={false} />
                  <XAxis dataKey="name" stroke="#e8f5ee/40" tickLine={false} fontSize={12} />
                  <YAxis stroke="#e8f5ee/40" tickLine={false} domain={[0, 100]} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74, 222, 128, 0.05)' }} />
                  <Bar dataKey="progress" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center border border-dashed border-brand-border/60 rounded-xl text-brand-text/40">
              <FolderKanban className="w-8 h-8 mb-2" />
              <p className="text-sm">No project progress data to map.</p>
            </div>
          )}
        </div>

        {/* Task Status Breakdown Pie Chart */}
        <div className="p-6 rounded-2xl border border-brand-border bg-brand-surface flex flex-col">
          <h3 className="text-base font-bold text-brand-text tracking-wide mb-6 font-display">Task Status Breakdown</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            {hasStatusData ? (
              <div className="h-56 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f2318',
                        borderColor: '#1a3c28',
                        borderRadius: '8px',
                        color: '#e8f5ee',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Content of Donut */}
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-2xl font-black text-brand-text">{stats.totalTasks}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-text/30">Total Tasks</span>
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-brand-text/40">
                <CheckSquare className="w-8 h-8 mb-2" />
                <p className="text-sm text-center">No tasks found to categorize.</p>
              </div>
            )}

            {/* Custom Legend */}
            {hasStatusData && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-6 w-full max-w-[280px]">
                {statusChartData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-brand-text/60 truncate">{entry.name}</span>
                    <span className="font-bold text-brand-text ml-auto">{entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity / Tasks Row */}
      <div className="p-6 rounded-2xl border border-brand-border bg-brand-surface">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-brand-text tracking-wide font-display">Recent Task Actions</h3>
          <Link to="/tasks" className="flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:text-brand-accent/80 transition-colors">
            View All Tasks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-xs font-semibold uppercase tracking-wider text-brand-text/45">
                  <th className="pb-3.5 pl-2">Task Title</th>
                  <th className="pb-3.5">Status</th>
                  <th className="pb-3.5">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-sm">
                {stats.recentTasks.map((task) => (
                  <tr key={task.id || task._id} className="group hover:bg-brand-bg/25">
                    <td className="py-3.5 pl-2 pr-4 font-medium text-brand-text truncate max-w-xs sm:max-w-md">
                      {task.title}
                    </td>
                    <td className="py-3.5 capitalize">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          (task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed')
                            ? 'text-emerald-400 bg-emerald-400/5 border border-emerald-400/10'
                            : (task.status?.toLowerCase() === 'in progress' || task.status?.toLowerCase() === 'in_progress')
                            ? 'text-blue-400 bg-blue-400/5 border border-blue-400/10'
                            : 'text-amber-400 bg-amber-400/5 border border-amber-400/10'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold capitalize ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority || 'medium'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center border border-dashed border-brand-border/60 rounded-xl text-brand-text/40">
            <Calendar className="w-8 h-8 mb-2" />
            <p className="text-sm">No recent activities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
