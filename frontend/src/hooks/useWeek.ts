import { useState, useMemo } from "react";
import { startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, format } from "date-fns";

export function useWeek() {
  const [anchorDate, setAnchorDate] = useState(new Date());

  const weekStart = useMemo(() => startOfWeek(anchorDate, { weekStartsOn: 1 }), [anchorDate]);
  const weekEnd = useMemo(() => endOfWeek(anchorDate, { weekStartsOn: 1 }), [anchorDate]);

  const days = useMemo(
    () => eachDayOfInterval({ start: weekStart, end: weekEnd }),
    [weekStart, weekEnd]
  );

  function nextWeek() {
    setAnchorDate((prev) => addWeeks(prev, 1));
  }

  function prevWeek() {
    setAnchorDate((prev) => subWeeks(prev, 1));
  }

  function goToToday() {
    setAnchorDate(new Date());
  }

  return {
    weekStart,
    weekEnd,
    days,
    nextWeek,
    prevWeek,
    goToToday,
    weekStartISO: format(weekStart, "yyyy-MM-dd"),
    weekEndISO: format(weekEnd, "yyyy-MM-dd"),
    weekLabel: `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`,
  };
}