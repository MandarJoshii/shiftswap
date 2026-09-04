const API_URL = import.meta.env.VITE_API_URL;

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: "SWAP_REQUESTED" | "SWAP_APPROVED" | "SWAP_REJECTED" | "NEW_CLAIM";
  isRead: boolean;
  relatedSwapId: number | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function handle<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message || "Something went wrong");
  return body.data;
}

export async function fetchNotifications(token: string): Promise<NotificationsResponse> {
  const response = await fetch(`${API_URL}/api/notifications`, { headers: authHeaders(token) });
  return handle<NotificationsResponse>(response);
}

export async function markNotificationRead(token: string, id: number): Promise<Notification> {
  const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  return handle<Notification>(response);
}

export async function markAllNotificationsRead(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  await handle<{ message: string }>(response);
}