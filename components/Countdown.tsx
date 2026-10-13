import { AnimatePresence, motion } from 'motion/react';
import { HeartDoodle, SparkleDoodle, StarDoodle } from './Doodles';

interface CountdownProps {
  /** 3, 2, 1, then 0 which renders as "Go!". */
  value: number;
}

export function Countdown({ value }: CountdownProps) {
  const isBegin = value === 0;
  const label = isBegin ? 'Go!' : String(value);

  return (
    <motion.div
      role="status"
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[radial-gradient(circle,rgba(255,248,236,0.92),rgba(255,248,236,0.6)_70%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.3, rotate: 6 }}
          transition={{ type: 'spring', stiffness: 360, damping: 16 }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute size-[15rem] sm:size-[19rem]"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="50" cy="50" r="46" fill="#FFFDF8" stroke="#FFB7D2" strokeWidth="1.2" />
            <circle
              cx="50"
              cy="50"
              r="41"
              fill="none"
              stroke="#FFC9DD"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="0.1 3.2"
            />
          </svg>
          <HeartDoodle className="absolute -left-2 top-2 size-8 text-pink sm:-left-6 sm:size-10" />
          <StarDoodle className="absolute -right-1 top-0 size-7 text-sun sm:-right-5 sm:size-9" />
          <SparkleDoodle className="absolute -bottom-1 right-2 size-6 text-grape sm:size-8" />
          <span
            className={
              isBegin
                ? 'relative font-display text-6xl font-semibold text-rose [text-shadow:0_5px_0_#FFC2D9] sm:text-7xl'
                : 'relative font-display text-[clamp(5.5rem,17vw,9rem)] font-semibold leading-none text-rose [text-shadow:0_7px_0_#FFC2D9]'
            }
          >
            {label}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
