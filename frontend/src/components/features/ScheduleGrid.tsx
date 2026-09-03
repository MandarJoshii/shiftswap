import { format, isSameDay, isToday } from "date-fns";
import type { Shift } from "../../api/shifts";

interface ScheduleGridProps {
  days: Date[];
  shifts: Shift[];
  currentUserId?: number;
  onShiftClick?: (shift: Shift) => void;
}

function formatTime(iso: string) {
  return format(new Date(iso), "h:mma").toLowerCase();
}

export default function ScheduleGrid({ days, shifts, currentUserId, onShiftClick }: ScheduleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 border-t border-l border-rule">
      {days.map((day) => {
        const dayShifts = shifts.filter((s) => isSameDay(new Date(s.date), day));
        const today = isToday(day);

        return (
          <div key={day.toISOString()} className="border-r border-b border-rule min-h-[180px]">
            <div
              className={`px-3 py-2 border-b border-rule ${
                today ? "bg-ink text-paper" : "bg-paper-raised"
              }`}
            >
              <div className="font-sans text-xs uppercase tracking-wide opacity-70">
                {format(day, "EEE")}
              </div>
              <div className="font-mono text-lg tabular-nums">{format(day, "d")}</div>
            </div>

            <div className="p-2 flex flex-col gap-2">
              {dayShifts.length === 0 && (
                <p className="font-sans text-xs text-ink/30 px-1 py-2">No shifts</p>
              )}

              {dayShifts.map((shift) => {
                const isMine = currentUserId && shift.employeeId === currentUserId;
                const isOpen = shift.status === "OPEN_FOR_SWAP";

                return (
                  <button
                    key={shift.id}
                    onClick={() => onShiftClick?.(shift)}
                    className={`
                      text-left px-2.5 py-2 border transition-colors
                      ${isOpen ? "border-stamp bg-stamp/5" : "border-rule bg-paper-raised"}
                      ${isMine ? "border-l-4 border-l-ink" : ""}
                      hover:border-ink
                    `}
                  >
                    <div className="font-mono text-xs tabular-nums text-ink">
                      {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                    </div>
                    <div className="font-sans text-xs text-ink/60 mt-0.5">
                      {shift.employee ? shift.employee.name : "Unassigned"}
                    </div>
                    {isOpen && (
                      <div className="font-sans text-[10px] uppercase tracking-wide text-stamp-deep mt-1">
                        Open for swap
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}