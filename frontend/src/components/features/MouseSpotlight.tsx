import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export default function MouseSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((e.clientX - rect.left) / rect.width) * 100);
    y.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  const background = useMotionTemplate`radial-gradient(600px circle at ${x}% ${y}%, rgba(216,72,28,0.14), transparent 65%)`;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="absolute inset-0">
      <motion.div className="absolute inset-0" style={{ background }} />
    </div>
  );
}