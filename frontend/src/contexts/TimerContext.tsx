import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface ActiveTimer {
  id: string;
  taskId: string;
  startedAt: string;
  task: {
    title: string;
  };
}

interface TimerContextType {
  activeTimer: ActiveTimer | null;
  elapsedSeconds: number;
  isLoading: boolean;
  startTimer: (taskId: string) => Promise<void>;
  stopTimer: (taskId: string) => Promise<void>;
  refreshTimer: () => Promise<void>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  const fetchActiveTimer = async () => {
    try {
      // Append timestamp to prevent aggressive browser/CDN caching on Vercel
      const res: any = await api.get(`/timer/active?t=${Date.now()}`);
      if (res.success && res.data.activeTimer) {
        setActiveTimer(res.data.activeTimer);
      } else {
        setActiveTimer(null);
      }
    } catch (error) {
      console.error('Failed to fetch active timer', error);
      setActiveTimer(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveTimer();
    } else {
      setActiveTimer(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTimer) {
      // Calculate initial elapsed time
      const start = new Date(activeTimer.startedAt).getTime();
      const current = new Date().getTime();
      setElapsedSeconds(Math.floor((current - start) / 1000));

      intervalRef.current = window.setInterval(() => {
        const now = new Date().getTime();
        setElapsedSeconds(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setElapsedSeconds(0);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTimer]);

  const startTimer = async (taskId: string) => {
    setIsLoading(true);
    try {
      await api.post(`/tasks/${taskId}/timer/start`);
      toast.success('Timer started');
      await fetchActiveTimer();
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to start timer');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const stopTimer = async (taskId: string) => {
    setIsLoading(true);
    try {
      await api.post(`/tasks/${taskId}/timer/stop`);
      toast.success('Timer stopped');
      setActiveTimer(null);
      // Invalidate everything that depends on time logs
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['timeLogs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to stop timer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TimerContext.Provider value={{
      activeTimer,
      elapsedSeconds,
      isLoading,
      startTimer,
      stopTimer,
      refreshTimer: fetchActiveTimer
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
