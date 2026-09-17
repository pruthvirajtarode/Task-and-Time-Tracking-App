import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { formatDuration } from '../utils/format';
import { Loader2, Clock, Calendar } from 'lucide-react';

export const TimeLogs = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['timeLogs'],
    queryFn: () => api.get('/timer')
  });

  const logs = response?.data || [];

  const today = new Date().toDateString();
  const todayLogs = logs.filter((log: any) => new Date(log.startedAt).toDateString() === today);
  const totalTrackedToday = todayLogs.reduce((acc: number, log: any) => acc + (log.durationSeconds || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Time Logs</h1>
          <p className="text-textMuted text-sm mt-1">Review your tracked time and productivity history.</p>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-3 flex items-center gap-4 shadow-premium">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-textMuted">Tracked Today</p>
            <p className="text-xl font-bold text-primary">{formatDuration(totalTrackedToday)}</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surfaceHover/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-textMuted w-1/4">Date</th>
                <th className="px-6 py-4 font-semibold text-textMuted w-1/3">Task</th>
                <th className="px-6 py-4 font-semibold text-textMuted w-1/4">Time Window</th>
                <th className="px-6 py-4 font-semibold text-textMuted text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-textMuted">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="w-12 h-12 text-border mb-3" />
                      <p>No time logs recorded yet.</p>
                      <p className="text-xs mt-1">Start tracking time on a task to see it here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-surfaceHover/30 transition-colors">
                    <td className="px-6 py-4 text-text font-medium">
                      {format(new Date(log.startedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-text truncate block max-w-[250px]">
                        {log.task.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textMuted">
                      {format(new Date(log.startedAt), 'h:mm a')} - {log.endedAt ? format(new Date(log.endedAt), 'h:mm a') : 'Now'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-primary">
                      {formatDuration(log.durationSeconds)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
