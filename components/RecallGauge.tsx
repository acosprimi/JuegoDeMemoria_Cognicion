import { motion } from 'motion/react';

interface RecallGaugeProps {
  cleared: number;
  total: number;
  /** True when the last level was cleared. */
  mastered: boolean;
}

const CENTER = 50;
const RADIUS = 44;
const SEGMENT_SPAN = 24;

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

/** One segment per level: lit when cleared, dashed where the pattern was lost. */
export function RecallGauge({ cleared, total, mastered }: RecallGaugeProps) {
  const lostIndex = mastered || cleared >= total ? -1 : cleared;

  return (
    <div className="relative aspect-square w-full max-w-[260px]">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="img"
        aria-label={`${cleared} of ${total} levels cleared`}
      >
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="0.3" />
        <circle
          cx="50"
          cy="50"
          r="31"
          fill="none"
          stroke="rgba(139,92,246,0.2)"
          strokeWidth="0.3"
          strokeDasharray="1 2.4"
        />
        {Array.from({ length: total }, (_, i) => {
          const isCleared = i < cleared;
          const isLost = i === lostIndex;
          return (
            <motion.path
              key={i}
              d={arc(i, total)}
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              stroke={isCleared ? '#22D3EE' : isLost ? '#FF5D7A' : 'rgba(56,189,248,0.18)'}
              strokeDasharray={isLost ? '1.4 2.2' : undefined}
              style={isCleared ? { filter: 'drop-shadow(0 0 1.5px rgba(34,211,238,0.9))' } : undefined}
              initial={isCleared ? { pathLength: 0, opacity: 0 } : { opacity: 0 }}
              animate={isCleared ? { pathLength: 1, opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-mono text-4xl font-medium tabular-nums text-ice">
          {String(cleared).padStart(2, '0')}
          <span className="text-xl text-mute">/{total}</span>
        </p>
        <p className="mt-1 text-[10px] tracking-[0.22em] text-mute">LEVELS CLEARED</p>
      </div>
    </div>
  );
}
