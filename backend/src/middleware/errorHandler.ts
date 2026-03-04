import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware.
 *
 * Catches any unhandled error thrown in route handlers / services
 * and returns a consistent JSON error response.
 *
 * Must be registered AFTER all routes in app.ts (Express requires
 * error handlers to have exactly 4 parameters to recognise them).
 */
export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  const status = (err as any).status ?? 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

/**
 * 404 Not Found handler — catches unmatched routes.
 * Register this BEFORE globalErrorHandler in app.ts.
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
}
