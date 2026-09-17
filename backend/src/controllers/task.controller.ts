import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import * as aiService from '../services/ai.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.user!.id, req.body);
    return sendSuccess(res, task, 201);
  } catch (error) {
    next(error);
  }
};

export const enhance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { input } = req.body;
    if (!input) {
      return sendError(res, { code: 'BAD_REQUEST', message: 'Input is required' }, 400);
    }
    const result = await aiService.enhanceTask(input);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getTasks(req.user!.id, req.query);
    return sendSuccess(res, tasks);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(req.user!.id, req.params.id as string);
    return sendSuccess(res, task);
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') return sendError(res, error, 404);
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(req.user!.id, req.params.id as string, req.body);
    return sendSuccess(res, task);
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') return sendError(res, error, 404);
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(req.user!.id, req.params.id as string);
    return sendSuccess(res, { message: 'Task deleted successfully' });
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') return sendError(res, error, 404);
    next(error);
  }
};
