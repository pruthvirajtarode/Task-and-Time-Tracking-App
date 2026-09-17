import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, result, 201);
  } catch (error: any) {
    if (error.code === 'CONFLICT') {
      return sendError(res, error, 409);
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, result);
  } catch (error: any) {
    if (error.code === 'UNAUTHORIZED') {
      return sendError(res, error, 401);
    }
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // JWT is stateless, so we just return success.
    // Client is responsible for deleting the token.
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendError(res, { code: 'UNAUTHORIZED', message: 'Not authenticated' }, 401);
    }
    const user = await authService.getUserById(req.user.id);
    return sendSuccess(res, { user });
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error, 404);
    }
    next(error);
  }
};
