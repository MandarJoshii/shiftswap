import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOpenShifts,
  postShiftForSwap,
  claimShift,
  fetchSwaps,
  approveSwap,
  rejectSwap,
} from "../api/swaps";
import { useAuth } from "../context/AuthContext";

export function useOpenShifts() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["openShifts"],
    queryFn: () => fetchOpenShifts(token!),
    enabled: !!token,
  });
}

export function usePostForSwap() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shiftId: number) => postShiftForSwap(token!, shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["openShifts"] });
    },
  });
}

export function useClaimShift() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shiftId: number) => claimShift(token!, shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openShifts"] });
      queryClient.invalidateQueries({ queryKey: ["swaps"] });
    },
  });
}

export function useSwaps(status?: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["swaps", status],
    queryFn: () => fetchSwaps(token!, status),
    enabled: !!token,
  });
}

export function useApproveSwap() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveSwap(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["swaps"] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["openShifts"] });
    },
  });
}

export function useRejectSwap() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rejectSwap(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["swaps"] });
    },
  });
}