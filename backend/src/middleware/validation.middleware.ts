import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error && error.name === 'ZodError') {
        const message = error.errors.map((e: any) => e.message).join(', ');
        return sendError(res, { code: 'VALIDATION_ERROR', message }, 422);
      }
      return sendError(res, { code: 'INTERNAL_ERROR', message: 'Validation failed' }, 500);
    }
  };
};
