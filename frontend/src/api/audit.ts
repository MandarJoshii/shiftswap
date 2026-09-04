const API_URL = import.meta.env.VITE_API_URL;

export interface AuditLogEntry {
  id: number;
  actorId: number;
  action: string;
  entityType: string;
  entityId: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: { id: number; name: string; role: string };
}

export async function fetchAuditLog(token: string): Promise<AuditLogEntry[]> {
  const response = await fetch(`${API_URL}/api/audit`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message || "Something went wrong");
  return body.data;
}