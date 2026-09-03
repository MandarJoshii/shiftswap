import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

interface WeekNavigatorProps {
  weekLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function WeekNavigator({ weekLabel, onPrev, onNext, onToday }: WeekNavigatorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          aria-label="Previous week"
          className="p-2 border border-rule hover:border-ink transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <button
          onClick={onNext}
          aria-label="Next week"
          className="p-2 border border-rule hover:border-ink transition-colors"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
        <span className="font-mono text-sm text-ink tabular-nums ml-2">{weekLabel}</span>
      </div>
      <Button variant="ghost" onClick={onToday} className="text-sm py-2">
        Today
      </Button>
    </div>
  );
}