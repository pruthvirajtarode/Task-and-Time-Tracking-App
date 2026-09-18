import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { Plus, Search, Loader2, CheckSquare } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Tasks = () => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ['tasks', filter, search],
    queryFn: () => api.get('/tasks', { params: { status: filter, search } })
  });

  const tasks = tasksResponse?.data || [];

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filters = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <>
      <SEO title="Tasks" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text">My Tasks</h1>
            <p className="text-textMuted text-sm mt-1">Organize your work and track your progress.</p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="btn-primary"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-textMuted hover:text-text'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search tasks..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-xl border border-border border-dashed text-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
              <CheckSquare className="w-8 h-8 text-textMuted" />
            </div>
            <h3 className="text-lg font-medium text-text">No tasks found</h3>
            <p className="text-textMuted text-sm mt-1 max-w-sm">
              {search || filter !== 'ALL' ? 'Try adjusting your filters or search.' : 'Create your first task and start tracking your productivity.'}
            </p>
            {!(search || filter !== 'ALL') && (
              <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-6">
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => (
              <TaskCard key={task.id} task={task} onEdit={() => handleEdit(task)} />
            ))}
          </div>
        )}

        {isModalOpen && (
          <TaskModal
            task={editingTask}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};
