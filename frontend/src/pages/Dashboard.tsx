import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { formatDuration } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, CheckCircle2, Clock, ListTodo, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: summaryRes, isLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => api.get('/dashboard/summary')
  });

  const summary = summaryRes?.data || {
    tasksWorkedOn: 0,
    totalTrackedSeconds: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Dashboard" />
      <div className="space-y-8 animate-fade-in pb-20">
        <div>
          <h1 className="text-3xl font-bold text-text">{getGreeting()} 👋</h1>
        <p className="text-textMuted mt-2">Here's your productivity overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Tasks Worked On</h3>
            <p className="text-3xl font-bold text-text mt-2">{summary.tasksWorkedOn}</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-warning relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Total Tracked Time</h3>
            <p className="text-3xl font-bold text-text mt-2">{formatDuration(summary.totalTrackedSeconds)}</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-success relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Completed Today</h3>
            <p className="text-3xl font-bold text-text mt-2">{summary.completedTasks}</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-textMuted relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ListTodo size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Remaining Tasks</h3>
            <p className="text-3xl font-bold text-text mt-2">{summary.pendingTasks + summary.inProgressTasks}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card flex flex-col items-center justify-center text-center p-10 h-64 border-dashed bg-transparent hover:bg-surfaceHover/30 transition-colors cursor-pointer">
          <Link to="/tasks" className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 shadow-premium">
              <ListTodo size={32} />
            </div>
            <h3 className="text-xl font-bold text-text">Manage Tasks</h3>
            <p className="text-textMuted text-sm mt-2">View all your tasks or create a new one to start tracking time.</p>
          </Link>
        </div>
        
        <div className="card flex flex-col items-center justify-center text-center p-10 h-64 border-dashed bg-transparent hover:bg-surfaceHover/30 transition-colors cursor-pointer">
          <Link to="/analytics" className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center text-warning mb-4 shadow-premium">
              <Activity size={32} />
            </div>
            <h3 className="text-xl font-bold text-text">View Analytics</h3>
            <p className="text-textMuted text-sm mt-2">Deep dive into your weekly productivity trends and task distribution.</p>
          </Link>
        </div>
      </div>
    </>
  );
};
