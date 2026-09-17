import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import prisma from '../config/db';

// Extend Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, { code: 'UNAUTHORIZED', message: 'Authentication required' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return sendError(res, { code: 'UNAUTHORIZED', message: 'Invalid or expired token' }, 401);
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) {
      return sendError(res, { code: 'UNAUTHORIZED', message: 'User no longer exists' }, 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, { code: 'INTERNAL_ERROR', message: 'Authentication failed' }, 500);
  }
};
