const API_URL = import.meta.env.VITE_API_URL;

export interface Employee {
  id: number;
  name: string;
  email: string;
}

export async function fetchEmployees(token: string): Promise<Employee[]> {
  const response = await fetch(`${API_URL}/api/users/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error?.message || "Failed to load employees");
  }

  return body.data;
}