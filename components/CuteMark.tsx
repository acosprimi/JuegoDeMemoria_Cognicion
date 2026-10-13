/** Logo: a chubby heart with a sleepy smile and a little sparkle. */
export function CuteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true" focusable="false">
      <path
        d="M20 36C8 27.5 4 21 4 15.5C4 10.5 7.8 7 12.2 7C15.7 7 18.5 8.9 20 12C21.5 8.9 24.3 7 27.8 7C32.2 7 36 10.5 36 15.5C36 21 32 27.5 20 36Z"
        fill="#FF8CB5"
        stroke="#E8639A"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <ellipse cx="13" cy="9.8" rx="3.4" ry="1.7" fill="#fff" opacity="0.7" transform="rotate(-30 13 9.8)" />
      <circle cx="14.5" cy="19" r="1.9" fill="#6B4A5E" />
      <circle cx="25.5" cy="19" r="1.9" fill="#6B4A5E" />
      <ellipse cx="10.8" cy="23" rx="2.6" ry="1.6" fill="#FFC9DA" />
      <ellipse cx="29.2" cy="23" rx="2.6" ry="1.6" fill="#FFC9DA" />
      <path d="M18 23.6Q20 26 22 23.6" stroke="#6B4A5E" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M33 2C33.4 4.6 34.4 5.6 37 6C34.4 6.4 33.4 7.4 33 10C32.6 7.4 31.6 6.4 29 6C31.6 5.6 32.6 4.6 33 2Z"
        fill="#FFD54D"
      />
    </svg>
  );
}
