import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Kanban,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', to: '/projects', icon: FolderKanban },
    { name: 'Tasks', to: '/tasks', icon: CheckSquare },
    { name: 'Kanban Board', to: '/kanban', icon: Kanban },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const activeStyle = 'bg-brand-accent/10 text-brand-accent border-r-2 border-brand-accent';
  const inactiveStyle = 'text-brand-text/70 hover:text-brand-text hover:bg-brand-surface-light';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar navigation panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-brand-border bg-brand-surface transition-transform duration-300 md:translate-x-0 md:static md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-accent/15 border border-brand-accent/30 shadow-lg shadow-brand-accent/5">
              <svg className="w-5 h-5 text-brand-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9S3 16.97 3 12a9 9 0 0 1 6.36-8.58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
                <path d="M12 6a6 6 0 0 1 6 6c0 3.31-2.69 6-6 6s-6-2.69-6-6a6 6 0 0 1 4.24-5.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70" />
                <path d="M12 9a3 3 0 0 1 3 3c0 1.66-1.34 3-3 3s-3-1.34-3-3a3 3 0 0 1 2.12-2.86" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="1.5" className="fill-brand-accent animate-ping" />
                <circle cx="12" cy="12" r="1" className="fill-brand-accent" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-brand-text font-display">
              Flow<span className="text-brand-accent">Nest</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-brand-surface-light md:hidden text-brand-text/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive ? activeStyle : inactiveStyle
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Profile / Logout footer */}
        <div className="p-4 border-t border-brand-border bg-brand-bg/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold bg-brand-accent text-brand-bg select-none shadow-lg shadow-brand-accent/20">
              {getInitials(user?.name)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-brand-text truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-brand-text/50 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium border border-brand-border rounded-lg bg-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-brand-text/75 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
