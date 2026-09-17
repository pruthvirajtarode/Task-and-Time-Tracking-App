import React from 'react';
import { format } from 'date-fns';
import { Play, Square, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useTimer } from '../../contexts/TimerContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'sonner';

export const TaskCard = ({ task, onEdit }: { task: any; onEdit: () => void }) => {
  const { startTimer, stopTimer, activeTimer } = useTimer();
  const queryClient = useQueryClient();

  const isTracking = activeTimer?.taskId === task.id;

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/tasks/${task.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.patch(`/tasks/${task.id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-danger bg-danger/10';
      case 'MEDIUM': return 'text-warning bg-warning/10';
      default: return 'text-success bg-success/10';
    }
  };

  return (
    <div className={`card transition-shadow hover:shadow-lg flex flex-col relative ${isTracking ? 'ring-1 ring-primary' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary bg-background"
            checked={task.status === 'COMPLETED'}
            onChange={(e) => statusMutation.mutate(e.target.checked ? 'COMPLETED' : 'PENDING')}
          />
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-textMuted">
          <button onClick={onEdit} className="p-1 hover:text-text transition-colors"><Edit2 size={16} /></button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                deleteMutation.mutate();
              }
            }} 
            className="p-1 hover:text-danger transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className={`font-semibold text-lg ${task.status === 'COMPLETED' ? 'text-textMuted line-through' : 'text-text'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-textMuted text-sm mt-2 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div className="text-xs text-textMuted">
          Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
        </div>
        
        {task.status !== 'COMPLETED' && (
          <button
            onClick={() => isTracking ? stopTimer(task.id) : startTimer(task.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isTracking 
                ? 'bg-danger/10 text-danger hover:bg-danger hover:text-white' 
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {isTracking ? (
              <><Square size={14} /> Stop</>
            ) : (
              <><Play size={14} /> Start</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
