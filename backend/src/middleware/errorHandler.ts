import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AuthError } from "../modules/auth/auth.service";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (err instanceof AuthError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: "AUTH_ERROR",
      },
    });
    return;
  }

  console.error("Unexpected error:", err);

  res.status(500).json({
    success: false,
    error: {
      message: "Something went wrong. Please try again later.",
      code: "INTERNAL_ERROR",
    },
  });
}