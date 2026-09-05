interface ApprovalStampProps {
  ringText: string;
  centerText: string;
  className?: string;
}

export default function ApprovalStamp({ ringText, centerText, className = "" }: ApprovalStampProps) {
  const id = `stamp-ring-${centerText.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <path id={id} d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
      </defs>

      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.85" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.7" />

      <text fontFamily="IBM Plex Mono, monospace" fontSize="9.5" letterSpacing="2.5" fill="currentColor">
        <textPath href={`#${id}`} startOffset="0%">
          {ringText}
        </textPath>
      </text>

      <text x="100" y="107" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="22" fill="currentColor">
        {centerText}
      </text>
    </svg>
  );
}