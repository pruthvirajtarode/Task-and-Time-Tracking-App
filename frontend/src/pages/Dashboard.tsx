import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { formatDuration } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, CheckCircle2, Clock, ListTodo, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
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
    inProgressTasks: 0,
    weeklyActivity: [],
    taskStatusData: []
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
          <h1 className="text-3xl font-bold text-text flex items-center gap-2">
            {getGreeting()} <span className="inline-block origin-bottom-right animate-wave cursor-default select-none">👋</span>
          </h1>
        <p className="text-textMuted mt-2">Here's your productivity overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-primary relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <Activity size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Tasks Worked On</h3>
            <p className="text-3xl font-bold text-text mt-2 group-hover:text-primary transition-colors">{summary.tasksWorkedOn}</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-warning relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <Clock size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Total Tracked Time</h3>
            <p className="text-3xl font-bold text-text mt-2 group-hover:text-warning transition-colors">{formatDuration(summary.totalTrackedSeconds)}</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-success relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <CheckCircle2 size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Completed Today</h3>
            <p className="text-3xl font-bold text-text mt-2 group-hover:text-success transition-colors">{summary.completedTasks}</p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-surface to-surfaceHover border-l-4 border-l-textMuted relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <ListTodo size={64} />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-textMuted">Remaining Tasks</h3>
            <p className="text-3xl font-bold text-text mt-2 group-hover:text-text transition-colors">{summary.pendingTasks + summary.inProgressTasks}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Distribution Chart */}
        <div className="card p-6 flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-text mb-6">Task Status</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.taskStatusData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(summary.taskStatusData || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A1F2E', borderColor: '#374151', borderRadius: '0.5rem', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {(summary.taskStatusData || []).map((entry: any) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-sm text-textMuted">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="card p-6 flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-text mb-6">Weekly Activity (Hours)</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.weeklyActivity || []}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#252B3B' }}
                  contentStyle={{ backgroundColor: '#1A1F2E', borderColor: '#374151', borderRadius: '0.5rem', color: '#F3F4F6' }}
                  itemStyle={{ color: '#6366F1', fontWeight: 'bold' }}
                />
                <Bar dataKey="hours" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card flex flex-col items-center justify-center text-center p-10 h-64 border-dashed border-border bg-transparent hover:bg-surfaceHover/30 hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
          <Link to="/tasks" className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 shadow-premium group-hover:scale-110 transition-transform duration-300">
              <ListTodo size={32} />
            </div>
            <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">Manage Tasks</h3>
            <p className="text-textMuted text-sm mt-2">View all your tasks or create a new one to start tracking time.</p>
          </Link>
        </div>
        
        <div className="card flex flex-col items-center justify-center text-center p-10 h-64 border-dashed border-border bg-transparent hover:bg-surfaceHover/30 hover:border-warning/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
          <Link to="/analytics" className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center text-warning mb-4 shadow-premium group-hover:scale-110 transition-transform duration-300">
              <Activity size={32} />
            </div>
            <h3 className="text-xl font-bold text-text group-hover:text-warning transition-colors">View Analytics</h3>
            <p className="text-textMuted text-sm mt-2">Deep dive into your weekly productivity trends and task distribution.</p>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};
