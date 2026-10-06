import { AnimatePresence, motion } from 'motion/react';
import { getNodeCenter, LATTICE_LINKS } from '@/lib/board-geometry';

export type TraceTone = 'system' | 'user' | 'error';

export interface TraceSegment {
  id: string;
  from: number;
  to: number;
  tone: TraceTone;
}

const TONE_STYLE: Record<TraceTone, { stroke: string; glow: string }> = {
  system: { stroke: '#22D3EE', glow: 'drop-shadow(0 0 1.6px rgba(34,211,238,0.95))' },
  user: { stroke: '#A78BFA', glow: 'drop-shadow(0 0 1.6px rgba(139,92,246,0.95))' },
  error: { stroke: '#FF5D7A', glow: 'drop-shadow(0 0 1.6px rgba(255,93,122,0.9))' },
};

function segmentPath(from: number, to: number): string {
  const a = getNodeCenter(from);
  const b = getNodeCenter(to);
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

/** Lattice between the nodes plus the live signal path drawn on top. */
export function SignalTrace({ segments }: { segments: TraceSegment[] }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="board-ring animate-[spin_160s_linear_infinite] motion-reduce:animate-none"
        cx="50"
        cy="50"
        r="47.5"
        fill="none"
        stroke="rgba(56,189,248,0.2)"
        strokeWidth="0.25"
        strokeDasharray="0.5 1.7"
        style={{ transformOrigin: '50px 50px' }}
      />
      <circle
        className="board-ring animate-[spin_220s_linear_infinite_reverse] motion-reduce:animate-none"
        cx="50"
        cy="50"
        r="43"
        fill="none"
        stroke="rgba(139,92,246,0.22)"
        strokeWidth="0.25"
        strokeDasharray="1.2 2.6"
        style={{ transformOrigin: '50px 50px' }}
      />

      <g stroke="rgba(56,189,248,0.2)" strokeWidth="0.3">
        {LATTICE_LINKS.map(([a, b]) => {
          const from = getNodeCenter(a);
          const to = getNodeCenter(b);
          return <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
        })}
      </g>

      <g fill="rgba(125,211,252,0.45)">
        {LATTICE_LINKS.map(([a, b]) => {
          const from = getNodeCenter(a);
          const to = getNodeCenter(b);
          return (
            <circle
              key={`mid-${a}-${b}`}
              cx={(from.x + to.x) / 2}
              cy={(from.y + to.y) / 2}
              r="0.55"
            />
          );
        })}
      </g>

      <AnimatePresence>
        {segments.map((segment) => {
          const style = TONE_STYLE[segment.tone];
          const isError = segment.tone === 'error';
          return (
            <motion.path
              key={segment.id}
              d={segmentPath(segment.from, segment.to)}
              fill="none"
              stroke={style.stroke}
              strokeWidth={0.8}
              strokeLinecap="round"
              strokeDasharray={isError ? '1.6 1.4' : undefined}
              style={{ filter: style.glow }}
              initial={isError ? { opacity: 0 } : { pathLength: 0, opacity: 0.2 }}
              animate={isError ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
