import prisma from '../config/db';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export const getWeeklyAnalytics = async (userId: string) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date,
      start: startOfDay(date),
      end: endOfDay(date),
      dayName: format(date, 'EEEE')
    };
  });

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      userId,
      startedAt: { gte: days[0].start },
      endedAt: { not: null }
    }
  });

  const completedTasks = await prisma.task.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: { gte: days[0].start }
    }
  });

  const dailyStats = days.map(day => {
    const dayLogs = timeLogs.filter(log => log.startedAt >= day.start && log.startedAt <= day.end);
    const dayTasks = completedTasks.filter(t => t.completedAt! >= day.start && t.completedAt! <= day.end);
    
    return {
      name: day.dayName,
      trackedSeconds: dayLogs.reduce((acc, log) => acc + (log.durationSeconds || 0), 0),
      completedTasks: dayTasks.length
    };
  });

  // Time by task (top 5)
  const taskSummary = await prisma.timeLog.groupBy({
    by: ['taskId'],
    where: { userId, endedAt: { not: null } },
    _sum: { durationSeconds: true },
    orderBy: { _sum: { durationSeconds: 'desc' } },
    take: 5
  });

  const taskIds = taskSummary.map(t => t.taskId);
  const tasks = await prisma.task.findMany({ where: { id: { in: taskIds } }, select: { id: true, title: true } });
  
  const timeByTask = taskSummary.map(t => {
    const task = tasks.find(task => task.id === t.taskId);
    return {
      name: task?.title || 'Unknown Task',
      durationSeconds: t._sum.durationSeconds || 0
    };
  });

  return {
    daily: dailyStats,
    timeByTask
  };
};
