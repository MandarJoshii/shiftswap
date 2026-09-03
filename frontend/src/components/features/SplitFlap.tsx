import { useEffect, useState } from "react";

interface SplitFlapProps {
  messages: string[];
  intervalMs?: number;
}

export default function SplitFlap({ messages, intervalMs = 2600 }: SplitFlapProps) {
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlipping(true);
      const flipDelay = setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFlipping(false);
      }, 220);
      return () => clearTimeout(flipDelay);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [messages.length, intervalMs]);

  return (
    <div
      className="inline-block bg-ink text-paper font-mono text-lg px-4 py-2 tracking-wide"
      aria-live="polite"
    >
      <span
        className={`inline-block transition-all duration-200 ${
          flipping ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        {messages[index]}
      </span>
    </div>
  );
}