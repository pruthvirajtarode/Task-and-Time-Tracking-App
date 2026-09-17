import React from 'react';
import { useTimer } from '../../contexts/TimerContext';
import { formatTimer } from '../../utils/format';
import { StopCircle, Loader2 } from 'lucide-react';

export const TimerWidget = () => {
  const { activeTimer, elapsedSeconds, stopTimer, isLoading } = useTimer();

  if (!activeTimer) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-primary shadow-premium rounded-full px-6 py-3 flex items-center gap-6 animate-slide-up z-50">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">Tracking</span>
          <span className="text-sm font-medium text-text max-w-[200px] truncate" title={activeTimer.task.title}>
            {activeTimer.task.title}
          </span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-primary font-mono w-[110px] text-center">
        {formatTimer(elapsedSeconds)}
      </div>

      <button
        onClick={() => stopTimer(activeTimer.taskId)}
        disabled={isLoading}
        className="flex items-center gap-2 bg-danger/10 text-danger hover:bg-danger hover:text-white px-4 py-2 rounded-full font-medium transition-colors text-sm"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <StopCircle size={16} />}
        Stop
      </button>
    </div>
  );
};
