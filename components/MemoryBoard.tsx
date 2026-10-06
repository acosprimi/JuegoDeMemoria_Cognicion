import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';
import { NODE_COUNT } from '@/lib/board-geometry';
import { cn } from '@/lib/cn';
import { pad2 } from '@/lib/format';
import type { GamePhase, LitNode, NodeStatus } from '@/lib/types';
import { Countdown } from './Countdown';
import { MemoryNode } from './MemoryNode';
import { SignalTrace, type TraceSegment } from './SignalTrace';
import { SuccessBurst } from './SuccessBurst';

interface MemoryBoardProps {
  phase: GamePhase;
  lit: LitNode | null;
  pressedNode: number | null;
  pressCount: number;
  errorNode: number | null;
  expectedNode: number | null;
  /** Nodes the player has entered so far. */
  userPath: number[];
  countdown: number;
  /** Null before a run starts. */
  sequenceLength: number | null;
  onPress: (node: number) => void;
}

const NODE_INDEXES = Array.from({ length: NODE_COUNT }, (_, i) => i);

const FRAME_TONE: Record<GamePhase, string> = {
  idle: 'border-hairline shadow-[0_0_70px_-24px_rgba(34,211,238,0.35)]',
  countdown: 'border-signal/50 shadow-[0_0_90px_-12px_rgba(34,211,238,0.5)]',
  showing: 'border-signal/40 shadow-[0_0_90px_-16px_rgba(34,211,238,0.4)]',
  input: 'border-pulse/60 shadow-[0_0_90px_-16px_rgba(139,92,246,0.5)]',
  success: 'border-signal/80 shadow-[0_0_110px_-8px_rgba(34,211,238,0.6)]',
  gameOver: 'border-fault/60 shadow-[0_0_90px_-16px_rgba(255,93,122,0.45)]',
  results: 'border-hairline shadow-none',
};

const PHASE_LABEL: Record<GamePhase, string> = {
  idle: 'SYSTEM READY',
  countdown: 'CALIBRATING',
  showing: 'ENCODING',
  input: 'RECALL ACTIVE',
  success: 'PATTERN CONFIRMED',
  gameOver: 'PATTERN LOST',
  results: 'SESSION CLOSED',
};

function getRightLabel(phase: GamePhase, progress: number, length: number | null): string {
  switch (phase) {
    case 'idle':
      return 'TOUCH ANY NODE';
    case 'showing':
      return 'OBSERVE';
    case 'input':
      return `INPUT ${pad2(progress)}/${pad2(length ?? 0)}`;
    case 'success':
      return 'CONFIRMED';
    case 'gameOver':
      return 'INTERRUPTED';
    default:
      return 'STANDBY';
  }
}

function buildSegments(
  phase: GamePhase,
  lit: LitNode | null,
  userPath: number[],
  errorNode: number | null,
): TraceSegment[] {
  const segments: TraceSegment[] = [];

  if (phase === 'showing' && lit && lit.from !== null) {
    segments.push({ id: `sys-${lit.from}-${lit.node}`, from: lit.from, to: lit.node, tone: 'system' });
  }

  if (phase === 'input' || phase === 'success' || phase === 'gameOver') {
    for (let i = 1; i < userPath.length; i += 1) {
      segments.push({
        id: `usr-${i}-${userPath[i - 1]}-${userPath[i]}`,
        from: userPath[i - 1],
        to: userPath[i],
        tone: 'user',
      });
    }
    if (phase === 'gameOver' && errorNode !== null && userPath.length > 0) {
      segments.push({
        id: `err-${userPath[userPath.length - 1]}-${errorNode}`,
        from: userPath[userPath.length - 1],
        to: errorNode,
        tone: 'error',
      });
    }
  }

  return segments;
}

function BoardDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="grad-system" cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.96" />
          <stop offset="65%" stopColor="#22D3EE" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.38" />
        </radialGradient>
        <radialGradient id="grad-user" cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.96" />
          <stop offset="65%" stopColor="#8B5CF6" stopOpacity="0.66" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.42" />
        </radialGradient>
        <radialGradient id="grad-fault" cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor="#FFE4E8" stopOpacity="0.96" />
          <stop offset="65%" stopColor="#FF5D7A" stopOpacity="0.66" />
          <stop offset="100%" stopColor="#FF5D7A" stopOpacity="0.42" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CornerBrackets() {
  const corners = [
    'left-3 top-3',
    'right-3 top-3 rotate-90',
    'bottom-3 right-3 rotate-180',
    'bottom-3 left-3 -rotate-90',
  ];
  return (
    <>
      {corners.map((position) => (
        <svg
          key={position}
          viewBox="0 0 20 20"
          className={cn('pointer-events-none absolute size-4 text-signal/60', position)}
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M1 9V1H9" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ))}
    </>
  );
}

export function MemoryBoard({
  phase,
  lit,
  pressedNode,
  pressCount,
  errorNode,
  expectedNode,
  userPath,
  countdown,
  sequenceLength,
  onPress,
}: MemoryBoardProps) {
  const interactive = phase === 'idle' || phase === 'input';
  const segments = useMemo(
    () => buildSegments(phase, lit, userPath, errorNode),
    [phase, lit, userPath, errorNode],
  );

  const getStatus = (index: number): NodeStatus => {
    if (phase === 'gameOver') {
      if (index === errorNode) return 'error';
      if (index === expectedNode) return 'expected';
    }
    if (index === pressedNode) return 'pressed';
    if (lit?.node === index) return 'sequence';
    return 'idle';
  };

  return (
    <motion.div
      className="relative mx-auto aspect-square w-[min(100%,calc(100dvh-9rem))]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
    >
      <div
        className={cn(
          'relative h-full w-full overflow-hidden rounded-3xl border bg-panel/60 backdrop-blur-md transition-[border-color,box-shadow] duration-500',
          FRAME_TONE[phase],
        )}
      >
        <BoardDefs />
        <div className="board-dots absolute inset-0" aria-hidden="true" />
        <div className="board-sweep" aria-hidden="true" />
        <SignalTrace segments={segments} />
        <CornerBrackets />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-9 pt-3.5 font-mono text-[11px] tracking-[0.18em] text-mute"
          aria-hidden="true"
        >
          <span>MEMORY GRID</span>
          <span className={cn(phase === 'gameOver' && 'text-fault', phase === 'input' && 'text-[#C4B5FD]')}>
            {PHASE_LABEL[phase]}
          </span>
        </div>

        <div role="group" aria-label="Memory grid" className="absolute inset-0">
          {NODE_INDEXES.map((index) => (
            <MemoryNode
              key={index}
              index={index}
              status={getStatus(index)}
              disabled={!interactive}
              pulseKey={pressCount}
              idleWave={phase === 'idle'}
              onClick={onPress}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-9 pb-3.5 font-mono text-[11px] tracking-[0.18em] text-mute"
          aria-hidden="true"
        >
          <span>SEQUENCE LENGTH {sequenceLength === null ? '--' : pad2(sequenceLength)}</span>
          <span>{getRightLabel(phase, userPath.length, sequenceLength)}</span>
        </div>

        {phase === 'success' && <SuccessBurst />}

        <AnimatePresence>
          {phase === 'countdown' && <Countdown key="countdown" value={countdown} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
