import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { formatDuration } from '../utils/format';
import { SEO } from '../components/SEO';

export const Analytics = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics/weekly')
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { daily, timeByTask } = response?.data || { daily: [], timeByTask: [] };

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl">
          <p className="font-medium text-text mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'trackedSeconds' || entry.name === 'durationSeconds'
                ? `Time: ${formatDuration(entry.value)}`
                : `Tasks: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <SEO title="Analytics" />
      <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-text">Productivity Analytics</h1>
        <p className="text-textMuted text-sm mt-1">Insights into your weekly performance and time distribution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card h-96 flex flex-col">
          <h3 className="text-lg font-bold text-text mb-6">Daily Tracked Time</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${Math.round(val / 3600)}h`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#252B3B' }} />
                <Bar dataKey="trackedSeconds" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card h-96 flex flex-col">
          <h3 className="text-lg font-bold text-text mb-6">Tasks Completed (7 Days)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="completedTasks" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card h-96 flex flex-col lg:col-span-2">
          <h3 className="text-lg font-bold text-text mb-6">Time by Task (Top 5)</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            {timeByTask.length === 0 ? (
              <p className="text-textMuted">No time data available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeByTask}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="durationSeconds"
                  >
                    {timeByTask.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {timeByTask.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {timeByTask.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-textMuted">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
