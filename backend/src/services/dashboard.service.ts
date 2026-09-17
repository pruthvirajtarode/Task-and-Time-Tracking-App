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

  return {
    tasksWorkedOn,
    totalTrackedSeconds,
    completedTasks,
    pendingTasks,
    inProgressTasks
  };
};
