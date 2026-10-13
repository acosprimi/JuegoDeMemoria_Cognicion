import { motion } from 'motion/react';

interface RecallGaugeProps {
  cleared: number;
  total: number;
  /** True when the last level was cleared. */
  mastered: boolean;
}

const CENTER = 50;
const RADIUS = 44;
const SEGMENT_SPAN = 20;

function polar(angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: Math.round((CENTER + RADIUS * Math.cos(rad)) * 100) / 100,
    y: Math.round((CENTER + RADIUS * Math.sin(rad)) * 100) / 100,
  };
}

function arc(index: number, total: number): string {
  const step = 360 / total;
  const start = polar(index * step + (step - SEGMENT_SPAN) / 2);
  const end = polar(index * step + (step - SEGMENT_SPAN) / 2 + SEGMENT_SPAN);
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`;
}

const CLEARED_COLORS = ['#FF8CB5', '#FFD54D', '#7ED6AB', '#7CC4F2', '#B597F2'];

/** One petal-like segment per level: coloured when cleared, dotted where the pattern got lost. */
export function RecallGauge({ cleared, total, mastered }: RecallGaugeProps) {
  const lostIndex = mastered || cleared >= total ? -1 : cleared;

  return (
    <div className="relative aspect-square w-full max-w-[260px] rounded-full border-[4px] border-pink bg-paper/90 shadow-[0_8px_0_#FFC2D9]">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="img"
        aria-label={`${cleared} of ${total} levels cleared`}
      >
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="#FFD0E2"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="0.1 2.6"
        />
        {Array.from({ length: total }, (_, i) => {
          const isCleared = i < cleared;
          const isLost = i === lostIndex;
          return (
            <motion.path
              key={i}
              d={arc(i, total)}
              fill="none"
              strokeWidth={4.5}
              strokeLinecap="round"
              stroke={
                isCleared ? CLEARED_COLORS[i % CLEARED_COLORS.length] : isLost ? '#FF7C8E' : '#FFE6EF'
              }
              strokeDasharray={isLost ? '0.1 3.6' : undefined}
              initial={isCleared ? { pathLength: 0, opacity: 0 } : { opacity: 0 }}
              animate={isCleared ? { pathLength: 1, opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-5xl font-semibold tabular-nums text-cocoa">
          {String(cleared).padStart(2, '0')}
          <span className="text-2xl text-mute">/{total}</span>
        </p>
        <p className="mt-1 text-[13px] font-bold text-mute">levels cleared</p>
      </div>
    </div>
  );
}
