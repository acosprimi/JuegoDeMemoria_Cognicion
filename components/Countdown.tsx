import { AnimatePresence, motion } from 'motion/react';

interface CountdownProps {
  /** 3, 2, 1, then 0 which renders as BEGIN. */
  value: number;
}

export function Countdown({ value }: CountdownProps) {
  const isBegin = value === 0;
  const label = isBegin ? 'BEGIN' : String(value);

  return (
    <motion.div
      role="status"
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[radial-gradient(circle,rgba(2,6,17,0.82),rgba(2,6,17,0.35)_70%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.35, filter: 'blur(10px)' }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute size-[15rem] sm:size-[19rem]"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(34,211,238,0.35)" strokeWidth="0.4" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(139,92,246,0.45)"
              strokeWidth="0.4"
              strokeDasharray="1 2.4"
            />
          </svg>
          <span
            className={
              isBegin
                ? 'relative text-3xl font-light tracking-[0.5em] text-ice [text-shadow:0_0_36px_rgba(34,211,238,0.7)] sm:text-4xl'
                : 'relative text-[clamp(5.5rem,17vw,9rem)] font-light leading-none text-ice [text-shadow:0_0_44px_rgba(34,211,238,0.7)]'
            }
          >
            {label}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
