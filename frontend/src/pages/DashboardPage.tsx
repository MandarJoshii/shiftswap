import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useWeek } from "../hooks/useWeek";
import { useShifts } from "../hooks/useShifts";
import { usePostForSwap } from "../hooks/useSwaps";
import WeekNavigator from "../components/features/WeekNavigator";
import ScheduleGrid from "../components/features/ScheduleGrid";
import ShiftFormModal from "../components/features/ShiftFormModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import Button from "../components/ui/Button";
import type { Shift } from "../api/shifts";

export default function DashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { days, weekStartISO, weekEndISO, weekLabel, nextWeek, prevWeek, goToToday } = useWeek();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shiftToPost, setShiftToPost] = useState<Shift | null>(null);
  const postForSwap = usePostForSwap();

  const { data: shifts, isLoading, isError } = useShifts({
    startDate: weekStartISO,
    endDate: weekEndISO,
  });

  const isManager = user?.role === "MANAGER";

  function handleShiftClick(shift: Shift) {
    const isMine = shift.employeeId === user?.id;
    if (!isMine || shift.status !== "SCHEDULED") return;
    setShiftToPost(shift);
  }

  function confirmPostForSwap() {
    if (!shiftToPost) return;
    postForSwap.mutate(shiftToPost.id, {
      onSuccess: () => {
        showToast("Shift posted for swap.", "success");
        setShiftToPost(null);
      },
      onError: (err) => {
        showToast(err instanceof Error ? err.message : "Couldn't post this shift");
        setShiftToPost(null);
      },
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-3xl text-ink">
          {isManager ? "Team schedule" : "Your schedule"}
        </h2>
        {isManager && (
          <Button onClick={() => setIsFormOpen(true)} className="bg-stamp hover:bg-stamp-deep flex items-center gap-2">
            <Plus size={16} strokeWidth={2.5} />
            New shift
          </Button>
        )}
      </div>
      <p className="font-sans text-sm text-ink/60 mb-6">
        {isManager
          ? "Every shift, every employee, one view."
          : "Your upcoming shifts for the week. Click one of your shifts to post it for swap."}
      </p>

      <WeekNavigator weekLabel={weekLabel} onPrev={prevWeek} onNext={nextWeek} onToday={goToToday} />

      {isLoading && (
        <div className="flex items-center gap-2 text-ink/40 py-12 justify-center">
          <div className="w-3 h-3 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin" />
          <span className="font-sans text-sm">Loading schedule...</span>
        </div>
      )}
      {isError && (
        <p className="font-sans text-sm text-stamp-deep">Couldn't load the schedule. Please try again.</p>
      )}

      {shifts && (
        <ScheduleGrid
          days={days}
          shifts={shifts}
          currentUserId={user?.id}
          onShiftClick={handleShiftClick}
        />
      )}

      {isFormOpen && <ShiftFormModal onClose={() => setIsFormOpen(false)} />}

      {shiftToPost && (
        <ConfirmModal
          title="Post shift for swap?"
          description={`${shiftToPost.date.split("T")[0]}, ${shiftToPost.startTime.slice(11, 16)}–${shiftToPost.endTime.slice(11, 16)} UTC will become visible in the swap marketplace for teammates to claim.`}
          confirmLabel="Post for swap"
          isLoading={postForSwap.isPending}
          onConfirm={confirmPostForSwap}
          onCancel={() => setShiftToPost(null)}
        />
      )}
    </div>
  );
}