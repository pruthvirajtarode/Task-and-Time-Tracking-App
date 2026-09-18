import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Clock, BarChart2, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Time Logs', path: '/time-logs', icon: Clock },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-text">TaskFlow AI</h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 group hover:translate-x-2",
              isActive ? "bg-primary/10 text-primary" : "text-textMuted hover:bg-surfaceHover hover:text-text"
            )}
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm border border-border">
            <img src="/profile-avatar.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-text truncate">{user?.name}</p>
            <p className="text-xs text-textMuted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
