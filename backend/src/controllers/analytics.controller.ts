import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';
import { sendSuccess } from '../utils/apiResponse';

export const getWeeklyAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analytics = await analyticsService.getWeeklyAnalytics(req.user!.id);
    return sendSuccess(res, analytics);
  } catch (error) {
    next(error);
  }
};
