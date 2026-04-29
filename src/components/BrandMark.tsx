interface BrandMarkProps {
  className?: string;
}

/**
 * Helpers brand mark:
 * A minimal, geometric "H" built from two pillars + connector,
 * with a warm accent dot for a premium but friendly identity.
 */
export default function BrandMark({ className = "h-7 w-7" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="28" height="28" rx="9" fill="#111827" />
      <rect x="9" y="9" width="4" height="14" rx="2" fill="white" />
      <rect x="19" y="9" width="4" height="14" rx="2" fill="white" />
      <rect x="12" y="14" width="8" height="4" rx="2" fill="white" />
      <circle cx="24.5" cy="7.5" r="2.5" fill="#F59E0B" />
    </svg>
  );
}
