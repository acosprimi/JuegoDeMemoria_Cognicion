import { AnimatePresence, motion } from 'motion/react';
import { getNodeCenter, LATTICE_LINKS } from '@/lib/board-geometry';

export type TraceTone = 'system' | 'user' | 'error';

export interface TraceSegment {
  id: string;
  from: number;
  to: number;
  tone: TraceTone;
}

const TONE_STYLE: Record<TraceTone, { stroke: string; halo: string }> = {
  system: { stroke: '#FFC93C', halo: '#FFF1A8' },
  user: { stroke: '#FF8CB5', halo: '#FFD9E7' },
  error: { stroke: '#FF7C8E', halo: '#FFD3D8' },
};

function segmentPath(from: number, to: number): string {
  const a = getNodeCenter(from);
  const b = getNodeCenter(to);
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

/** Soft stitched lines between the friends, plus the path of the current round on top. */
export function SignalTrace({ segments }: { segments: TraceSegment[] }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#FFD0E2"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeDasharray="0.1 2.4"
      />

      <g stroke="#FFC9DD" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="0.1 2.2">
        {LATTICE_LINKS.map(([a, b]) => {
          const from = getNodeCenter(a);
          const to = getNodeCenter(b);
          return <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
        })}
      </g>

      <AnimatePresence>
        {segments.map((segment) => {
          const style = TONE_STYLE[segment.tone];
          const isError = segment.tone === 'error';
          const d = segmentPath(segment.from, segment.to);
          return (
            <motion.g
              key={segment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.path
                d={d}
                fill="none"
                stroke={style.halo}
                strokeWidth={2.6}
                strokeLinecap="round"
                initial={isError ? undefined : { pathLength: 0 }}
                animate={isError ? undefined : { pathLength: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <motion.path
                d={d}
                fill="none"
                stroke={style.stroke}
                strokeWidth={1}
                strokeLinecap="round"
                strokeDasharray={isError ? '0.1 2.4' : undefined}
                initial={isError ? undefined : { pathLength: 0 }}
                animate={isError ? undefined : { pathLength: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
