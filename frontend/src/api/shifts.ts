const API_URL = import.meta.env.VITE_API_URL;

export interface ShiftEmployee {
  id: number;
  name: string;
  email: string;
}

export interface Shift {
  id: number;
  employeeId: number | null;
  createdById: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "OPEN_FOR_SWAP" | "SWAPPED";
  createdAt: string;
  updatedAt: string;
  employee: ShiftEmployee | null;
}

export interface CreateShiftInput {
  employeeId?: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateShiftInput {
  employeeId?: number | null;
  date?: string;
  startTime?: string;
  endTime?: string;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: { message: string; code: string; details?: { field: string; message: string }[] };
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

export async function fetchShifts(
  token: string,
  params?: { employeeId?: number; startDate?: string; endDate?: string }
): Promise<Shift[]> {
  const query = new URLSearchParams();
  if (params?.employeeId) query.set("employeeId", String(params.employeeId));
  if (params?.startDate) query.set("startDate", params.startDate);
  if (params?.endDate) query.set("endDate", params.endDate);

  const response = await fetch(`${API_URL}/api/shifts?${query.toString()}`, {
    headers: authHeaders(token),
  });
  return handle<Shift[]>(response);
}

export async function createShift(token: string, input: CreateShiftInput): Promise<Shift> {
  const response = await fetch(`${API_URL}/api/shifts`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  return handle<Shift>(response);
}

export async function updateShift(
  token: string,
  id: number,
  input: UpdateShiftInput
): Promise<Shift> {
  const response = await fetch(`${API_URL}/api/shifts/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  return handle<Shift>(response);
}

export async function deleteShift(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/shifts/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  await handle<{ message: string }>(response);
}