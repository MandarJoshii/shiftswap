import { format } from "date-fns";
import { useAuditLog } from "../hooks/useAudit";

const actionLabels: Record<string, string> = {
  SHIFT_CREATED: "created a shift",
  SHIFT_UPDATED: "updated a shift",
  SHIFT_DELETED: "deleted a shift",
  SHIFT_POSTED_FOR_SWAP: "posted a shift for swap",
  SWAP_REQUESTED: "requested a shift swap",
  SWAP_APPROVED: "approved a swap request",
  SWAP_REJECTED: "rejected a swap request",
};

export default function HistoryPage() {
  const { data: logs, isLoading, isError } = useAuditLog();

  return (
    <div>
      <h2 className="font-display text-3xl text-ink mb-1">History</h2>
      <p className="font-sans text-sm text-ink/60 mb-6">
        A complete audit trail of scheduling and swap activity.
      </p>

      {isLoading && (
  <div className="flex items-center gap-2 text-ink/40 py-12 justify-center">
    <div className="w-3 h-3 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin" />
    <span className="font-sans text-sm">Loading history...</span>
  </div>
)}
      {isError && (
        <p className="font-sans text-sm text-stamp-deep">Couldn't load history. Please try again.</p>
      )}

      {logs && logs.length === 0 && (
  <div className="border border-rule py-20 text-center">
    <p className="font-mono text-xs uppercase tracking-widest text-ink/30 mb-2">— empty —</p>
    <p className="font-sans text-sm text-ink/50">No activity recorded yet.</p>
  </div>
)}

      {logs && logs.length > 0 && (
        <div className="border-t border-rule">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between border-b border-rule py-3">
              <p className="font-sans text-sm text-ink">
                <span className="font-medium">{log.actor.name}</span>{" "}
                {actionLabels[log.action] ?? log.action.toLowerCase().replace(/_/g, " ")}
              </p>
              <span className="font-mono text-xs text-ink/40 tabular-nums">
                {format(new Date(log.createdAt), "MMM d, h:mma").toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}