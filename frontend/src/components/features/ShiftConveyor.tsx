import { motion } from "framer-motion";

const ROW_A = [
  "MON 09:00–17:00", "TUE 13:00–21:00", "WED 22:00–06:00", "THU 09:00–17:00",
  "FRI 15:00–23:00", "SAT 07:00–15:00", "SUN 12:00–20:00", "MON 09:00–17:00",
];
const ROW_B = [
  "CLAIM #2291", "SWAP APPROVED", "COVERAGE FOUND", "PENDING REVIEW",
  "SHIFT POSTED", "CONFLICT CLEARED", "CLAIM #2292", "SWAP APPROVED",
];

function Row({ items, duration, reverse }: { items: string[]; duration: number; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <motion.div
      className="flex gap-8 whitespace-nowrap font-mono text-[13px] tracking-wider text-paper/[0.08]"
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {doubled.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </motion.div>
  );
}

export default function ShiftConveyor() {
  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col justify-evenly py-20 pointer-events-none select-none">
      <Row items={ROW_A} duration={38} />
      <Row items={ROW_B} duration={46} reverse />
      <Row items={ROW_A} duration={52} />
    </div>
  );
}