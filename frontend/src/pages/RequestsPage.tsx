import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { useSwaps, useApproveSwap, useRejectSwap } from "../hooks/useSwaps";
import Button from "../components/ui/Button";
import type { SwapRequest } from "../api/swaps";

const statusStyles: Record<SwapRequest["status"], string> = {
  PENDING: "text-ink/60",
  APPROVED: "text-stamp-deep",
  REJECTED: "text-ink/40",
  COMPLETED: "text-stamp-deep",
};

export default function RequestsPage() {
  const { user } = useAuth();
  const isManager = user?.role === "MANAGER";

  const { data: swaps, isLoading, isError } = useSwaps(isManager ? "PENDING" : undefined);
  const approveSwap = useApproveSwap();
  const rejectSwap = useRejectSwap();

  return (
    <div>
      <h2 className="font-display text-3xl text-ink mb-1">
        {isManager ? "Approval queue" : "My requests"}
      </h2>
      <p className="font-sans text-sm text-ink/60 mb-6">
        {isManager
          ? "Pending shift swap requests awaiting your decision."
          : "Shifts you've posted and claims you've made."}
      </p>

      {isLoading && <p className="font-sans text-sm text-ink/50">Loading requests...</p>}
      {isError && (
        <p className="font-sans text-sm text-stamp-deep">Couldn't load requests. Please try again.</p>
      )}

      {swaps && swaps.length === 0 && (
        <div className="border border-rule py-16 text-center">
          <p className="font-sans text-sm text-ink/50">
            {isManager ? "No pending requests right now." : "You haven't made any swap requests yet."}
          </p>
        </div>
      )}

      {swaps && swaps.length > 0 && (
        <div className="border-t border-rule">
          {swaps.map((swap) => (
            <div key={swap.id} className="flex items-center justify-between border-b border-rule py-4">
              <div>
                <div className="font-mono text-sm tabular-nums text-ink">
                  {format(new Date(swap.shift.date), "EEE, MMM d")} ·{" "}
                  {format(new Date(swap.shift.startTime), "h:mma").toLowerCase()} –{" "}
                  {format(new Date(swap.shift.endTime), "h:mma").toLowerCase()}
                </div>
                <div className="font-sans text-sm text-ink/60 mt-1">
                  {swap.requestedBy?.name} → {swap.claimedBy?.name ?? "—"}
                </div>
              </div>

              {isManager ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => approveSwap.mutate(swap.id)}
                    isLoading={approveSwap.isPending && approveSwap.variables === swap.id}
                    className="bg-stamp hover:bg-stamp-deep"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => rejectSwap.mutate(swap.id)}
                    isLoading={rejectSwap.isPending && rejectSwap.variables === swap.id}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <span className={`font-sans text-xs uppercase tracking-wide ${statusStyles[swap.status]}`}>
                  {swap.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}