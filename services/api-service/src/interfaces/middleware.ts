import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err: any) {
    return res.status(400).json({ error: err.errors });
  }
};

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const rateLimiter = (limit: number, windowMs: number) => (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  if (record.count > limit) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
};

export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[AUDIT] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
};
