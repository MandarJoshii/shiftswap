import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function FlipUnit({ value }: { value: string }) {
  return (
    <span
      className="relative inline-block w-[0.62em] h-[1.3em] overflow-hidden"
      style={{ perspective: "220px" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformOrigin: "50% 50%" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function FlipClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");

  return (
    <div className="flex items-center gap-0.5 font-mono text-lg tabular-nums text-paper/70">
      {hh.split("").map((c, i) => (
        <FlipUnit key={`h${i}`} value={c} />
      ))}
      <span className="text-paper/30">:</span>
      {mm.split("").map((c, i) => (
        <FlipUnit key={`m${i}`} value={c} />
      ))}
      <span className="text-paper/30">:</span>
      {ss.split("").map((c, i) => (
        <FlipUnit key={`s${i}`} value={c} />
      ))}
    </div>
  );
}