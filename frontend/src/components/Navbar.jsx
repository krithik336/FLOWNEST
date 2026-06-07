import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuOpen, pageTitle }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-brand-border bg-brand-surface sticky top-0 z-30">
      {/* Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuOpen}
          className="p-1 rounded-lg hover:bg-brand-surface-light md:hidden text-brand-text/70 hover:text-brand-text transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-brand-text capitalize tracking-wide font-display">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right Actions / Greeting */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <span className="hidden sm:inline text-xs font-semibold text-brand-text/40 bg-brand-bg px-2.5 py-1 rounded-full border border-brand-border">
          {getFormattedDate()}
        </span>

        {/* Notifications Mock Icon */}
        <button className="p-1.5 rounded-lg hover:bg-brand-surface-light text-brand-text/60 hover:text-brand-text transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-brand-border hidden sm:block" />

        {/* User Greeting */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs text-brand-text/45">{getGreeting()},</span>
          <span className="text-sm font-semibold text-brand-text">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
