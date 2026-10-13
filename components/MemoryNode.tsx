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
  /** Idle bounce used on the home screen. */
  idleWave: boolean;
  onClick: (index: number) => void;
}

const FACE = '#6B4A5E';
const BLUSH = '#FF9DB8';

const RIPPLE_STROKE: Partial<Record<NodeStatus, string>> = {
  sequence: '#FFC93C',
  pressed: '#FF8CB5',
  error: '#FF7C8E',
};

/** A tiny face: it smiles at rest, beams when lit and gets teary on a mistake. */
function Face({ status }: { status: NodeStatus }) {
  const lit = status === 'sequence' || status === 'pressed';
  const error = status === 'error';

  return (
    <g>
      {error ? (
        <g stroke={FACE} strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M-12 -5L-6 -2L-12 1" />
          <path d="M12 -5L6 -2L12 1" />
        </g>
      ) : lit ? (
        <g stroke={FACE} strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M-12.5 0Q-9 -6 -5.5 0" />
          <path d="M5.5 0Q9 -6 12.5 0" />
        </g>
      ) : (
        <g fill={FACE}>
          <circle cx="-9" cy="-2" r="2.8" />
          <circle cx="9" cy="-2" r="2.8" />
          <circle cx="-8.2" cy="-3" r="0.9" fill="#FFFDF8" />
          <circle cx="9.8" cy="-3" r="0.9" fill="#FFFDF8" />
        </g>
      )}

      <ellipse cx="-15" cy="5" rx="4.4" ry="2.8" fill={BLUSH} opacity={lit ? 0.95 : 0.65} />
      <ellipse cx="15" cy="5" rx="4.4" ry="2.8" fill={BLUSH} opacity={lit ? 0.95 : 0.65} />

      {error ? (
        <>
          <path
            d="M-4 9Q-2 6 0 8Q2 10 4 7"
            stroke={FACE}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M-13 3Q-15 8 -13 9.5Q-11 8 -13 3Z" fill="#8FD3F4" />
        </>
      ) : lit ? (
        <path d="M-4.5 4Q0 12 4.5 4Z" fill="#E8607F" stroke={FACE} strokeWidth="1.6" strokeLinejoin="round" />
      ) : (
        <path
          d="M-3.5 4.5Q-1.7 7 0 4.8Q1.7 7 3.5 4.5"
          stroke={FACE}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
    </g>
  );
}

export function MemoryNode({
  index,
  status,
  disabled,
  pulseKey,
  idleWave,
  onClick,
}: MemoryNodeProps) {
  const shape = NODE_SHAPES[index];
  const { palette } = shape;
  const center = getNodeCenter(index);
  const lit = status === 'sequence' || status === 'pressed';
  const error = status === 'error';
  const rippleStroke = RIPPLE_STROKE[status];

  const fill = lit ? palette.strong : error ? '#FFC2C9' : palette.soft;
  const edge = lit ? palette.deep : error ? '#FF7C8E' : palette.mid;
  const shadow = lit
    ? `drop-shadow(0 5px 0 ${palette.deep}66)`
    : `drop-shadow(0 4px 0 ${palette.mid}aa)`;

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
        aria-label={`Friend ${index + 1}`}
        aria-keyshortcuts={String(index + 1)}
        data-index={index}
        data-status={status}
        className="group relative block h-full w-full select-none rounded-full disabled:cursor-default"
        animate={
          status === 'sequence'
            ? { scale: 1.14, x: 0, rotate: [0, -5, 5, 0] }
            : status === 'pressed'
              ? { scale: 1.08, x: 0, rotate: 0 }
              : status === 'error'
                ? { scale: 1, x: [0, -7, 7, -5, 5, 0], rotate: 0 }
                : { scale: 1, x: 0, rotate: 0 }
        }
        transition={
          status === 'error'
            ? { duration: 0.45 }
            : {
                type: 'spring',
                stiffness: 380,
                damping: 15,
                // Keyframe arrays can't use springs, so the wiggle gets its own tween.
                rotate: { type: 'tween', duration: 0.45, ease: 'easeInOut' },
              }
        }
        whileHover={disabled ? undefined : { scale: 1.07, rotate: -3 }}
        whileTap={disabled ? undefined : { scale: 0.9 }}
      >
        {rippleStroke && (
          <motion.svg
            key={`${status}-${pulseKey}`}
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
            focusable="false"
            initial={{ scale: 1, opacity: 0.85 }}
            animate={{ scale: 1.55, opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <path
              d={shape.d}
              fill="none"
              stroke={rippleStroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="0.1 7"
            />
          </motion.svg>
        )}

        <svg
          viewBox="0 0 100 100"
          className="relative h-full w-full overflow-visible transition-[filter] duration-150"
          style={{ filter: shadow }}
          aria-hidden="true"
          focusable="false"
        >
          {/* Outline pass sits under the fill, so overlapping parts (ears, petals) stay clean. */}
          <path
            d={shape.d}
            fill={edge}
            stroke={edge}
            strokeWidth={lit ? 7 : 6}
            strokeLinejoin="round"
            strokeDasharray={status === 'expected' ? '2 9' : undefined}
            strokeLinecap="round"
            className="transition-[stroke,fill] duration-150"
          />
          <path d={shape.d} fill={fill} className="transition-[fill] duration-150" />

          {/* Soft shine, like a gummy candy. */}
          <ellipse
            cx="36"
            cy="30"
            rx="9"
            ry="4.5"
            fill="#FFFFFF"
            opacity={lit ? 0.5 : 0.65}
            transform="rotate(-28 36 30)"
          />

          {idleWave && (
            <path d={shape.d} fill="#FFFFFF" className="node-idle-wave" style={{ animationDelay: `${index * 0.45}s` }} />
          )}

          {status === 'expected' && (
            <g fill="#FFC93C" transform="translate(78 24)">
              <path d="M0 -9C1 -3 3 -1 9 0C3 1 1 3 0 9C-1 3 -3 1 -9 0C-3 -1 -1 -3 0 -9Z" />
            </g>
          )}

          <g transform={`translate(${shape.face.x} ${shape.face.y}) scale(${shape.face.scale})`}>
            <Face status={status} />
          </g>
        </svg>

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -bottom-1 -right-1 flex size-[1.7rem] items-center justify-center rounded-full border-2 bg-paper font-display text-[0.8rem] font-semibold text-cocoa sm:size-8 sm:text-sm',
            lit ? 'border-sun' : error ? 'border-coral' : 'border-pink',
          )}
        >
          {index + 1}
        </span>
      </motion.button>
    </div>
  );
}
