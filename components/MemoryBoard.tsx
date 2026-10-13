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
import { FlowerDoodle, HeartDoodle, StarDoodle } from './Doodles';

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
  idle: 'border-pink shadow-[0_10px_0_#FFC2D9,0_28px_50px_-18px_rgba(255,140,181,0.45)]',
  countdown: 'border-sun shadow-[0_10px_0_#FFE27A,0_28px_50px_-18px_rgba(255,213,77,0.5)]',
  showing: 'border-sun shadow-[0_10px_0_#FFE27A,0_28px_50px_-18px_rgba(255,213,77,0.5)]',
  input: 'border-grape shadow-[0_10px_0_#CDB8FA,0_28px_50px_-18px_rgba(181,151,242,0.5)]',
  success: 'border-leaf shadow-[0_10px_0_#B0EACF,0_28px_50px_-18px_rgba(126,214,171,0.55)]',
  gameOver: 'border-coral shadow-[0_10px_0_#FFC2C9,0_28px_50px_-18px_rgba(255,124,142,0.45)]',
  results: 'border-pink shadow-none',
};

const PHASE_LABEL: Record<GamePhase, string> = {
  idle: 'Ready when you are',
  countdown: 'Get ready!',
  showing: 'Watch closely',
  input: 'Your turn',
  success: 'Yay!',
  gameOver: 'Oopsie',
  results: 'All done',
};

function getRightLabel(phase: GamePhase, progress: number, length: number | null): string {
  switch (phase) {
    case 'idle':
      return 'Tap any friend';
    case 'showing':
      return 'Watching...';
    case 'input':
      return `Tapped ${pad2(progress)}/${pad2(length ?? 0)}`;
    case 'success':
      return 'Perfect!';
    case 'gameOver':
      return 'Try again';
    default:
      return 'Waiting';
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

function CornerDecorations() {
  return (
    <>
      <FlowerDoodle className="pointer-events-none absolute hidden sm:block left-3 top-9 size-7 text-pink" center="#FFF1A8" />
      <HeartDoodle className="pointer-events-none absolute hidden sm:block right-4 top-10 size-6 text-lilac" />
      <StarDoodle className="pointer-events-none absolute hidden sm:block bottom-10 left-4 size-6 text-sun" />
      <FlowerDoodle className="pointer-events-none absolute hidden sm:block bottom-9 right-3 size-7 text-ocean/70" center="#FFF1A8" />
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
          'stitched relative h-full w-full overflow-hidden rounded-[2.5rem] border-[5px] bg-paper/90 transition-[border-color,box-shadow] duration-500',
          FRAME_TONE[phase],
        )}
      >
        <div className="board-dots absolute inset-0" aria-hidden="true" />
        <SignalTrace segments={segments} />
        <CornerDecorations />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-8 pt-3 font-display text-[11px] sm:px-10 sm:pt-4 sm:text-[13px] font-medium text-mute"
          aria-hidden="true"
        >
          <span>Memory garden</span>
          <span className={cn(phase === 'gameOver' && 'text-coral', phase === 'input' && 'text-grape')}>
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
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-8 pb-3 font-display text-[11px] sm:px-10 sm:pb-4 sm:text-[13px] font-medium text-mute"
          aria-hidden="true"
        >
          <span>Friends to remember {sequenceLength === null ? '--' : pad2(sequenceLength)}</span>
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
