import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation error', issues: err.errors });
  }

  if (err && err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  console.error(err);
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' });
}
