import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

interface AnimatedHeadlineProps {
  lines: string[];
  className?: string;
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Reveals a multi-line headline one line at a time, each line clipped
 * and sliding up from below its own baseline — a "printing press"
 * reveal rather than a generic fade. Falls back to a static, fully
 * visible headline when the user has requested reduced motion.
 */
export default function AnimatedHeadline({ lines, className = "" }: AnimatedHeadlineProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <h1 className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span variants={word} className="block">
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}