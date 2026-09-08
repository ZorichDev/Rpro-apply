import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  // Multer errors (file too large, wrong type) are client mistakes, not
  // server failures — surface them as 400 rather than a generic 500.
  const status = err.status ?? (err.name === "MulterError" ? 400 : 500);
  res.status(status).json({
    message: err.message ?? "Internal server error",
  });
}
