import prisma from '../config/db';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export const getDashboardSummary = async (userId: string) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todayTimeLogs = await prisma.timeLog.findMany({
    where: {
      userId,
      startedAt: { gte: todayStart, lte: todayEnd },
      endedAt: { not: null }
    }
  });

  const tasksWorkedOn = new Set(todayTimeLogs.map(log => log.taskId)).size;
  const totalTrackedSeconds = todayTimeLogs.reduce((acc, log) => acc + (log.durationSeconds || 0), 0);

  const completedTasks = await prisma.task.count({
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: { gte: todayStart, lte: todayEnd }
    }
  });

  const pendingTasks = await prisma.task.count({ where: { userId, status: 'PENDING' } });
  const inProgressTasks = await prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } });

  // Weekly Activity Chart Data
  const sevenDaysAgo = subDays(todayStart, 6);
  const weeklyLogs = await prisma.timeLog.findMany({
    where: {
      userId,
      startedAt: { gte: sevenDaysAgo },
      endedAt: { not: null }
    }
  });
  
  const weeklyDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = subDays(todayStart, i);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    weeklyDataMap[dayStr] = 0;
  }
  
  weeklyLogs.forEach(log => {
    const dayStr = log.startedAt.toLocaleDateString('en-US', { weekday: 'short' });
    if (weeklyDataMap[dayStr] !== undefined) {
      weeklyDataMap[dayStr] += (log.durationSeconds || 0);
    }
  });
  
  const weeklyActivity = Object.entries(weeklyDataMap).map(([name, seconds]) => ({
    name,
    hours: Number((seconds / 3600).toFixed(2))
  }));

  // Task Status Chart Data
  const taskStatusData = [
    { name: 'Pending', value: pendingTasks, fill: '#9CA3AF' },
    { name: 'In Progress', value: inProgressTasks, fill: '#6366F1' },
    { name: 'Completed', value: completedTasks, fill: '#10B981' }
  ];

  return {
    tasksWorkedOn,
    totalTrackedSeconds,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    weeklyActivity,
    taskStatusData
  };
};
