import type { RegisterFormData, LoginFormData } from "../lib/schemas";

const API_URL = import.meta.env.VITE_API_URL;

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "EMPLOYEE" | "MANAGER";
}

export interface AuthResponse {
  success: true;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: { field: string; message: string }[];
  };
}

async function handleResponse(response: Response): Promise<AuthResponse> {
  const body = await response.json();

  if (!response.ok) {
    const errBody = body as ApiErrorResponse;
    throw new Error(errBody.error?.message || "Something went wrong");
  }

  return body as AuthResponse;
}

export async function registerRequest(data: RegisterFormData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function loginRequest(data: LoginFormData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}