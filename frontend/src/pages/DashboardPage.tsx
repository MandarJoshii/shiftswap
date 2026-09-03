import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWeek } from "../hooks/useWeek";
import { useShifts } from "../hooks/useShifts";
import WeekNavigator from "../components/features/WeekNavigator";
import ScheduleGrid from "../components/features/ScheduleGrid";
import ShiftFormModal from "../components/features/ShiftFormModal";
import Button from "../components/ui/Button";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { days, weekStartISO, weekEndISO, weekLabel, nextWeek, prevWeek, goToToday } = useWeek();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: shifts, isLoading, isError } = useShifts({
    startDate: weekStartISO,
    endDate: weekEndISO,
  });

  const isManager = user?.role === "MANAGER";

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between px-6 lg:px-10 py-6 border-b border-rule">
        <h1 className="font-display text-2xl text-ink">ShiftSwap</h1>
        <div className="flex items-center gap-4">
          <span className="font-sans text-sm text-ink/70">
            {user?.name} · {user?.role}
          </span>
          <Button variant="ghost" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="px-6 lg:px-10 py-8">
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
            : "Your upcoming shifts for the week."}
        </p>

        <WeekNavigator
          weekLabel={weekLabel}
          onPrev={prevWeek}
          onNext={nextWeek}
          onToday={goToToday}
        />

        {isLoading && <p className="font-sans text-sm text-ink/50">Loading schedule...</p>}

        {isError && (
          <p className="font-sans text-sm text-stamp-deep">
            Couldn't load the schedule. Please try again.
          </p>
        )}

        {shifts && (
          <ScheduleGrid days={days} shifts={shifts} currentUserId={user?.id} />
        )}
      </main>

      {isFormOpen && <ShiftFormModal onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}