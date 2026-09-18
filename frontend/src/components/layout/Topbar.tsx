import React from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Topbar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/tasks')) return 'My Tasks';
    if (path.startsWith('/time-logs')) return 'Time Logs';
    if (path.startsWith('/analytics')) return 'Analytics';
    return '';
  };

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-text">{getPageTitle()}</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-textMuted bg-surface px-4 py-1.5 rounded-full border border-border hidden sm:block">
          {format(new Date(), 'EEEE, MMMM do')}
        </div>
        <button
          onClick={logout}
          className="md:hidden p-2 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
