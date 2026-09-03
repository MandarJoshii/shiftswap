import { Request, Response, NextFunction } from "express";

export function requireRole(...allowedRoles: Array<"EMPLOYEE" | "MANAGER">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Not authenticated",
          code: "UNAUTHORIZED",
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: "You do not have permission to perform this action",
          code: "FORBIDDEN",
        },
      });
      return;
    }

    next();
  };
}