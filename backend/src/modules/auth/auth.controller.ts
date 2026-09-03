import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser } from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.parse(req.body);
    const result = await registerUser(parsed);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await loginUser(parsed);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}