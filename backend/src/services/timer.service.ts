import prisma from '../config/db';
import { getTaskById } from './task.service';

export const startTimer = async (userId: string, taskId: string) => {
  // Verify task ownership
  await getTaskById(userId, taskId);

  // Check if there is already an active timer
  const activeLog = await prisma.timeLog.findFirst({
    where: { userId, endedAt: null },
  });

  if (activeLog) {
    throw { code: 'CONFLICT', message: 'Another task is currently being tracked. Stop the current timer before starting a new one.' };
  }

  // Create new active time log
  const timeLog = await prisma.timeLog.create({
    data: {
      userId,
      taskId,
    },
  });

  // Optionally update task status to IN_PROGRESS
  await prisma.task.update({
    where: { id: taskId },
    data: { status: 'IN_PROGRESS' },
  });

  return timeLog;
};

export const stopTimer = async (userId: string, taskId: string) => {
  // Find active timer for this specific task and user
  const activeLog = await prisma.timeLog.findFirst({
    where: { userId, taskId, endedAt: null },
  });

  if (!activeLog) {
    throw { code: 'NOT_FOUND', message: 'No active timer found for this task' };
  }

  const endedAt = new Date();
  const startedAt = activeLog.startedAt;
  const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

  const timeLog = await prisma.timeLog.update({
    where: { id: activeLog.id },
    data: {
      endedAt,
      durationSeconds,
    },
  });

  return timeLog;
};

export const getActiveTimer = async (userId: string) => {
  return prisma.timeLog.findFirst({
    where: { userId, endedAt: null },
    include: {
      task: {
        select: { id: true, title: true }
      }
    }
  });
};

export const getTimeLogs = async (userId: string, taskId?: string) => {
  const where: any = { userId, endedAt: { not: null } };
  
  if (taskId) {
    where.taskId = taskId;
  }

  return prisma.timeLog.findMany({
    where,
    include: {
      task: {
        select: { title: true }
      }
    },
    orderBy: { startedAt: 'desc' },
  });
};

export const getTaskTimeSummary = async (userId: string, taskId: string) => {
  await getTaskById(userId, taskId);
  
  const aggregate = await prisma.timeLog.aggregate({
    where: { userId, taskId, endedAt: { not: null } },
    _sum: {
      durationSeconds: true,
    },
  });
  
  return {
    taskId,
    totalDurationSeconds: aggregate._sum.durationSeconds || 0,
  };
};
