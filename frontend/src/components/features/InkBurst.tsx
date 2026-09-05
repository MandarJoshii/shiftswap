import { motion } from "framer-motion";

interface InkBurstProps {
  delay?: number;
}

/**
 * A single expanding, fading ring — simulates the shock of a stamp
 * striking paper. Fires once on mount, driven by `delay` so it can be
 * sequenced against the stamp's own entrance animation.
 */
export default function InkBurst({ delay = 0 }: InkBurstProps) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-stamp pointer-events-none"
      initial={{ scale: 0.4, opacity: 0.9 }}
      animate={{ scale: 1.8, opacity: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    />
  );
}