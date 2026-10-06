import { motion } from 'motion/react';
import { getNodeCenter, NODE_SIZE_PERCENT } from '@/lib/board-geometry';
import { cn } from '@/lib/cn';
import { NODE_SHAPES } from '@/lib/node-shapes';
import type { NodeStatus } from '@/lib/types';

interface MemoryNodeProps {
  index: number;
  status: NodeStatus;
  disabled: boolean;
  /** Changes on every press so the ripple replays even on the same node. */
  pulseKey: number;
  /** Idle shimmer used on the home screen. */
  idleWave: boolean;
  onClick: (index: number) => void;
}

const STROKE: Record<NodeStatus, string> = {
  idle: 'rgba(56,189,248,0.4)',
  sequence: '#CFFAFE',
  pressed: '#EDE9FE',
  error: '#FFD1DA',
  expected: '#E6F7FF',
};

const GLOW: Record<NodeStatus, string> = {
  idle: 'drop-shadow(0 0 0 rgba(34,211,238,0))',
  sequence: 'drop-shadow(0 0 16px rgba(34,211,238,0.95))',
  pressed: 'drop-shadow(0 0 14px rgba(139,92,246,0.95))',
  error: 'drop-shadow(0 0 14px rgba(255,93,122,0.9))',
  expected: 'drop-shadow(0 0 8px rgba(230,247,255,0.5))',
};

const FILL: Partial<Record<NodeStatus, string>> = {
  sequence: 'url(#grad-system)',
  pressed: 'url(#grad-user)',
  error: 'url(#grad-fault)',
};

const RIPPLE_STROKE: Partial<Record<NodeStatus, string>> = {
  sequence: '#22D3EE',
  pressed: '#A78BFA',
  error: '#FF5D7A',
};

export function MemoryNode({
  index,
  status,
  disabled,
  pulseKey,
  idleWave,
  onClick,
}: MemoryNodeProps) {
  const shape = NODE_SHAPES[index];
  const center = getNodeCenter(index);
  const lit = status === 'sequence' || status === 'pressed' || status === 'error';
  const fill = FILL[status];
  const rippleStroke = RIPPLE_STROKE[status];

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${center.x}%`,
        top: `${center.y}%`,
        width: `${NODE_SIZE_PERCENT}%`,
        aspectRatio: '1 / 1',
      }}
    >
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => onClick(index)}
        aria-label={`Node ${index + 1}`}
        aria-keyshortcuts={String(index + 1)}
        data-index={index}
        data-status={status}
        className="group relative block h-full w-full select-none rounded-full disabled:cursor-default"
        animate={
          status === 'sequence'
            ? { scale: 1.09, x: 0 }
            : status === 'pressed'
              ? { scale: 1.05, x: 0 }
              : status === 'error'
                ? { scale: 1, x: [0, -7, 7, -5, 5, 0] }
                : { scale: 1, x: 0 }
        }
        transition={
          status === 'error' ? { duration: 0.45 } : { type: 'spring', stiffness: 420, damping: 28 }
        }
        whileHover={disabled ? undefined : { scale: 1.04 }}
        whileTap={disabled ? undefined : { scale: 0.93 }}
      >
        {rippleStroke && (
          <motion.svg
            key={`${status}-${pulseKey}`}
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
            focusable="false"
            initial={{ scale: 1, opacity: 0.75 }}
            animate={{ scale: 1.65, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <path d={shape.d} fill="none" stroke={rippleStroke} strokeWidth="1.5" />
          </motion.svg>
        )}

        <svg
          viewBox="0 0 100 100"
          className="relative h-full w-full overflow-visible transition-[filter] duration-150"
          style={{ filter: GLOW[status] }}
          aria-hidden="true"
          focusable="false"
        >
          {/* Opaque base keeps the lattice lines from crossing the node. */}
          <path d={shape.d} fill="rgba(4,12,24,0.92)" />

          {fill && <path d={shape.d} fill={fill} />}

          {idleWave && (
            <path
              d={shape.d}
              fill="rgba(34,211,238,0.16)"
              className="node-idle-wave"
              style={{ animationDelay: `${index * 0.45}s` }}
            />
          )}

          {!disabled && (
            <path
              d={shape.d}
              fill="rgba(139,92,246,0.14)"
              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            />
          )}

          <path
            d={shape.d}
            fill="none"
            stroke={STROKE[status]}
            strokeWidth={lit ? 2.4 : 1.7}
            strokeLinejoin="round"
            strokeDasharray={status === 'expected' ? '4 4' : undefined}
            className="transition-[stroke] duration-150"
          />

          {/* Inner outline: the same shape, smaller. */}
          <g transform="translate(50 50) scale(0.58) translate(-50 -50)">
            <path
              d={shape.d}
              fill="none"
              stroke={STROKE[status]}
              strokeOpacity={lit ? 0.55 : 0.28}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>

          {shape.orbit && (
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={STROKE[status]}
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeDasharray="2 5"
            />
          )}
        </svg>

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-xs font-medium transition-colors duration-150 sm:text-sm',
            lit ? 'text-[#04121E]' : status === 'expected' ? 'text-ice' : 'text-mute',
          )}
        >
          {index + 1}
        </span>
      </motion.button>
    </div>
  );
}
