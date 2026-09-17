import prisma from '../config/db';

export const createTask = async (userId: string, data: any) => {
  return prisma.task.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      status: data.status || 'PENDING',
      priority: data.priority || 'MEDIUM',
    },
  });
};

export const getTasks = async (userId: string, filters: any) => {
  const { status, search } = filters;
  
  const where: any = { userId };
  
  if (status && status !== 'ALL') {
    where.status = status;
  }
  
  if (search) {
    where.title = { contains: search, mode: 'insensitive' };
  }

  return prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });
  
  if (!task) {
    throw { code: 'NOT_FOUND', message: 'Task not found' };
  }
  
  return task;
};

export const updateTask = async (userId: string, taskId: string, data: any) => {
  await getTaskById(userId, taskId); // Ensure ownership and existence
  
  const updateData: any = { ...data };
  if (data.status === 'COMPLETED') {
    updateData.completedAt = new Date();
  }
  
  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  await getTaskById(userId, taskId); // Ensure ownership and existence
  
  return prisma.task.delete({
    where: { id: taskId },
  });
};
