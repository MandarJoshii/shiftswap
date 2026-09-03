import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { signToken } from "../../utils/jwt";
import type { RegisterInput, LoginInput } from "./auth.validation";

const SALT_ROUNDS = 10;

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "AuthError";
  }
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AuthError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AuthError("Invalid email or password", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}