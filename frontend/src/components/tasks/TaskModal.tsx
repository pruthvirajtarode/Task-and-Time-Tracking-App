import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { toast } from 'sonner';
import { Loader2, Sparkles, X } from 'lucide-react';

export const TaskModal = ({ task, onClose }: { task?: any; onClose: () => void }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data: any) => task ? api.put(`/tasks/${task.id}`, data) : api.post('/tasks', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success(task ? 'Task updated' : 'Task created');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Failed to save task');
    }
  });

  const enhanceMutation = useMutation({
    mutationFn: (input: string) => api.post('/tasks/enhance', { input }),
    onSuccess: (res: any) => {
      if (res.data) {
        setTitle(res.data.title);
        setDescription(res.data.description);
        toast.success('Task enhanced with AI ✨');
      }
    },
    onError: () => toast.error('AI enhancement failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    saveMutation.mutate({ title, description, priority });
  };

  const handleEnhance = () => {
    const input = title || description;
    if (!input) {
      toast.error('Enter a draft title to enhance');
      return;
    }
    enhanceMutation.mutate(input);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose} className="text-textMuted hover:text-text transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Task Draft or Title</label>
            <input
              type="text"
              className="input-field text-lg font-medium"
              placeholder="e.g. follow up with designer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {!task && (
            <button
              type="button"
              onClick={handleEnhance}
              disabled={enhanceMutation.isPending || !title}
              className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors w-full justify-center"
            >
              {enhanceMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              ✨ Enhance with AI
            </button>
          )}

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Description (Optional)</label>
            <textarea
              className="input-field min-h-[120px] resize-none"
              placeholder="Add details, links, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Priority</label>
            <div className="flex gap-4">
              {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                    className="text-primary focus:ring-primary bg-background border-border"
                  />
                  <span className="text-sm font-medium text-text">{p}</span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-surfaceHover/30 rounded-b-2xl">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={saveMutation.isPending} className="btn-primary">
            {saveMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : (task ? 'Save Changes' : 'Create Task')}
          </button>
        </div>
      </div>
    </div>
  );
};
