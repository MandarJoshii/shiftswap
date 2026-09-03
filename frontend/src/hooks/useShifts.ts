import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchShifts, createShift, updateShift, deleteShift } from "../api/shifts";
import type { CreateShiftInput, UpdateShiftInput } from "../api/shifts";
import { fetchEmployees } from "../api/users";
import { useAuth } from "../context/AuthContext";

export function useShifts(params?: { employeeId?: number; startDate?: string; endDate?: string }) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["shifts", params],
    queryFn: () => fetchShifts(token!, params),
    enabled: !!token,
  });
}

export function useCreateShift() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateShiftInput) => createShift(token!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}

export function useUpdateShift() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateShiftInput }) =>
      updateShift(token!, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}

export function useDeleteShift() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteShift(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}

export function useEmployees() {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(token!),
    enabled: !!token && user?.role === "MANAGER",
  });
}