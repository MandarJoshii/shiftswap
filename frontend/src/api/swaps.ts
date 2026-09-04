import type { Shift } from "./shifts";

const API_URL = import.meta.env.VITE_API_URL;

export interface SwapUser {
  id: number;
  name: string;
  email: string;
}

export interface SwapRequest {
  id: number;
  shiftId: number;
  requestedById: number;
  claimedById: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  decidedById: number | null;
  decidedAt: string | null;
  createdAt: string;
  shift: Shift;
  requestedBy?: SwapUser;
  claimedBy?: SwapUser;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: { message: string; code: string };
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handle<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    const errBody = body as ApiError;
    throw new Error(errBody.error?.message || "Something went wrong");
  }
  return (body as ApiSuccess<T>).data;
}

export async function fetchOpenShifts(token: string): Promise<Shift[]> {
  const response = await fetch(`${API_URL}/api/swaps/open-shifts`, {
    headers: authHeaders(token),
  });
  return handle<Shift[]>(response);
}

export async function postShiftForSwap(token: string, shiftId: number): Promise<Shift> {
  const response = await fetch(`${API_URL}/api/swaps/${shiftId}/post`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handle<Shift>(response);
}

export async function claimShift(token: string, shiftId: number): Promise<SwapRequest> {
  const response = await fetch(`${API_URL}/api/swaps/claim`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ shiftId }),
  });
  return handle<SwapRequest>(response);
}

export async function fetchSwaps(token: string, status?: string): Promise<SwapRequest[]> {
  const query = status ? `?status=${status}` : "";
  const response = await fetch(`${API_URL}/api/swaps${query}`, {
    headers: authHeaders(token),
  });
  return handle<SwapRequest[]>(response);
}

export async function approveSwap(token: string, id: number): Promise<SwapRequest> {
  const response = await fetch(`${API_URL}/api/swaps/${id}/approve`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  return handle<SwapRequest>(response);
}

export async function rejectSwap(token: string, id: number): Promise<SwapRequest> {
  const response = await fetch(`${API_URL}/api/swaps/${id}/reject`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  return handle<SwapRequest>(response);
}