import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendSuccess } from '../utils/apiResponse';

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await dashboardService.getDashboardSummary(req.user!.id);
    return sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};
