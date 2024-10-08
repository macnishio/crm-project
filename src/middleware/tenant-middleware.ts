import { Request, Response, NextFunction } from 'express';

export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }
  res.locals.tenantId = tenantId;
  next();
}
