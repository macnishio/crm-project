import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logger.error('Unhandled error', { error: err });

  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  logger.warn('Not found', { path: req.path });

  res.status(404).json({
    message: 'Resource not found',
  });
}

e
xport function methodNotAllowedHandler(req: Request, res: Response) {
  logger.warn('Method not allowed', { method: req.method, path: req.path });

  res.status(405).json({
    message: 'Method not allowed',
  });
}

// ErrorHandler 型定義を削除または使用