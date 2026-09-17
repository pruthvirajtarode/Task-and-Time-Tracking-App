import React from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

export const Topbar = () => {
  const location = useLocation();
  
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
      <div className="text-sm font-medium text-textMuted bg-surface px-4 py-1.5 rounded-full border border-border">
        {format(new Date(), 'EEEE, MMMM do')}
      </div>
    </header>
  );
};
