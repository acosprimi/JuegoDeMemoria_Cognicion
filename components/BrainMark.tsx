/** Custom SVG mark: a hexagonal cell with a small asymmetric neural network inside. */
export function BrainMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 3L34 11V29L20 37L6 29V11Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.55"
      />
      <g stroke="currentColor" strokeWidth="1" opacity="0.85">
        <path d="M14 16L20 22L26 14" />
        <path d="M20 22L13 26" />
        <path d="M20 22L27 27" />
        <path d="M14 16L13 26" />
        <path d="M26 14L27 27" />
      </g>
      <g fill="currentColor">
        <circle cx="14" cy="16" r="1.7" />
        <circle cx="26" cy="14" r="1.7" />
        <circle cx="13" cy="26" r="1.7" />
        <circle cx="27" cy="27" r="1.7" />
        <circle cx="20" cy="22" r="2.5" />
      </g>
    </svg>
  );
}
