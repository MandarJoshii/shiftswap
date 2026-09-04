import { useQuery } from "@tanstack/react-query";
import { fetchAuditLog } from "../api/audit";
import { useAuth } from "../context/AuthContext";

export function useAuditLog() {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["auditLog"],
    queryFn: () => fetchAuditLog(token!),
    enabled: !!token && user?.role === "MANAGER",
  });
}