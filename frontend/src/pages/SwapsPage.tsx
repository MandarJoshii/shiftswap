import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { useOpenShifts, useClaimShift } from "../hooks/useSwaps";
import Button from "../components/ui/Button";

export default function SwapsPage() {
  const { user } = useAuth();
  const { data: shifts, isLoading, isError } = useOpenShifts();
  const claimShift = useClaimShift();

  function handleClaim(shiftId: number) {
    claimShift.mutate(shiftId, {
      onError: (err) => {
        window.alert(err instanceof Error ? err.message : "Couldn't claim this shift");
      },
    });
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ink mb-1">Swap marketplace</h2>
      <p className="font-sans text-sm text-ink/60 mb-6">
        Shifts your teammates have posted, open for anyone to claim.
      </p>

      {isLoading && <p className="font-sans text-sm text-ink/50">Loading open shifts...</p>}
      {isError && (
        <p className="font-sans text-sm text-stamp-deep">Couldn't load open shifts. Please try again.</p>
      )}

      {shifts && shifts.length === 0 && (
        <div className="border border-rule py-16 text-center">
          <p className="font-sans text-sm text-ink/50">No shifts are currently open for swap.</p>
        </div>
      )}

      {shifts && shifts.length > 0 && (
        <div className="border-t border-rule">
          {shifts.map((shift) => {
            const isOwnShift = shift.employeeId === user?.id;
            const canClaim = user?.role === "EMPLOYEE" && !isOwnShift;

            return (
              <div
                key={shift.id}
                className="flex items-center justify-between border-b border-rule py-4"
              >
                <div>
                  <div className="font-mono text-sm tabular-nums text-ink">
                    {format(new Date(shift.date), "EEE, MMM d")} · {format(new Date(shift.startTime), "h:mma").toLowerCase()} – {format(new Date(shift.endTime), "h:mma").toLowerCase()}
                  </div>
                  <div className="font-sans text-sm text-ink/60 mt-1">
                    Posted by {shift.employee?.name ?? "Unknown"}
                  </div>
                </div>

                {!canClaim ? (
  <span className="font-sans text-xs uppercase tracking-wide text-ink/40">
    {isOwnShift ? "Your shift" : "Manager view"}
  </span>
) : (
  <Button
                    onClick={() => handleClaim(shift.id)}
                    isLoading={claimShift.isPending && claimShift.variables === shift.id}
                    className="bg-stamp hover:bg-stamp-deep"
                  >
                    Claim shift
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}