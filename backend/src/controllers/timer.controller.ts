import { Request, Response, NextFunction } from 'express';
import * as timerService from '../services/timer.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const startTimer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeLog = await timerService.startTimer(req.user!.id, req.params.id as string);
    return sendSuccess(res, timeLog, 201);
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') return sendError(res, error, 404);
    if (error.code === 'CONFLICT') return sendError(res, error, 409);
    next(error);
  }
};

export const stopTimer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeLog = await timerService.stopTimer(req.user!.id, req.params.id as string);
    return sendSuccess(res, timeLog);
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') return sendError(res, error, 404);
    next(error);
  }
};

export const getActiveTimer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeTimer = await timerService.getActiveTimer(req.user!.id);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return sendSuccess(res, { activeTimer });
  } catch (error) {
    next(error);
  }
};

export const getAllTimeLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeLogs = await timerService.getTimeLogs(req.user!.id);
    return sendSuccess(res, timeLogs);
  } catch (error) {
    next(error);
  }
};

export const getTaskTimeLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeLogs = await timerService.getTimeLogs(req.user!.id, req.params.id as string);
    return sendSuccess(res, timeLogs);
  } catch (error) {
    next(error);
  }
};

export const getTaskTimeSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await timerService.getTaskTimeSummary(req.user!.id, req.params.id as string);
    return sendSuccess(res, summary);
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') return sendError(res, error, 404);
    next(error);
  }
};
