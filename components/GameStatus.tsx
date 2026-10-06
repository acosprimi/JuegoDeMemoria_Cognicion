import { Check, Crosshair, Eye, Radar, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatScore, pad2 } from '@/lib/format';
import type { GamePhase, ShowStage } from '@/lib/types';
import { SessionTimer } from './SessionTimer';

interface GameStatusProps {
  phase: GamePhase;
  showStage: ShowStage;
  level: number;
  sequenceLength: number;
  /** Nodes the player has already entered correctly. */
  progress: number;
  expectedNode: number | null;
  mastered: boolean;
  lastScore: number | null;
  startTime: number | null;
  endTime: number | null;
}

type Tone = 'neutral' | 'observe' | 'input' | 'success' | 'error';

interface StatusCopy {
  headline: string;
  detail: string;
  tone: Tone;
}

function getCopy(props: GameStatusProps): StatusCopy {
  switch (props.phase) {
    case 'countdown':
      return { headline: 'PREPARING EXPERIMENT', detail: 'Eyes on the grid.', tone: 'neutral' };
    case 'showing':
      if (props.showStage === 'intro') {
        return props.level === 1
          ? { headline: 'WATCH THE PATTERN', detail: 'Memorize the order of the lights.', tone: 'observe' }
          : {
              headline: `LEVEL ${pad2(props.level)}`,
              detail: `${props.sequenceLength} nodes to memorize.`,
              tone: 'observe',
            };
      }
      return { headline: 'OBSERVE CAREFULLY', detail: 'Do not touch the grid yet.', tone: 'observe' };
    case 'input':
      return {
        headline: 'YOUR TURN',
        detail:
          props.level === 1 && props.progress === 0
            ? 'Repeat it in the same order.'
            : `Node ${Math.min(props.progress + 1, props.sequenceLength)} of ${props.sequenceLength}.`,
        tone: 'input',
      };
    case 'success':
      return {
        headline: 'SEQUENCE CONFIRMED',
        detail: props.mastered ? 'Final level cleared.' : `+${formatScore(props.lastScore ?? 0)} points`,
        tone: 'success',
      };
    case 'gameOver':
      return {
        headline: 'PATTERN LOST',
        detail:
          props.expectedNode !== null ? `Expected node ${props.expectedNode + 1}.` : 'Sequence interrupted.',
        tone: 'error',
      };
    default:
      return { headline: 'SYSTEM READY', detail: 'Awaiting experiment.', tone: 'neutral' };
  }
}

const TONE_BORDER: Record<Tone, string> = {
  neutral: 'border-hairline',
  observe: 'border-signal',
  input: 'border-pulse',
  success: 'border-signal',
  error: 'border-fault',
};

const TONE_ICON: Record<Tone, ReactNode> = {
  neutral: <Radar className="size-5 text-mute" aria-hidden="true" />,
  observe: <Eye className="size-5 text-signal" aria-hidden="true" />,
  input: <Crosshair className="size-5 text-[#A78BFA]" aria-hidden="true" />,
  success: <Check className="size-5 text-signal" aria-hidden="true" />,
  error: <X className="size-5 text-fault" aria-hidden="true" />,
};

function ProgressPips({ total, filled }: { total: number; filled: number }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 w-5 rounded-full border transition-colors duration-200',
            i < filled ? 'border-pulse bg-pulse' : 'border-hairline bg-transparent',
          )}
        />
      ))}
    </div>
  );
}

export function GameStatus(props: GameStatusProps) {
  const copy = getCopy(props);
  const pipsFilled = props.phase === 'success' ? props.sequenceLength : props.progress;
  const showPips = props.phase === 'input' || props.phase === 'success';

  return (
    <section
      aria-label="Experiment status"
      className={cn('border-l-2 pl-5 transition-colors duration-300', TONE_BORDER[copy.tone])}
    >
      <div className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.2em] text-mute">
        <span>ACTIVE SESSION</span>
        <span className="flex items-center gap-2 text-ice/90">
          <span className="text-mute">TIME</span>
          <SessionTimer startTime={props.startTime} endTime={props.endTime} />
        </span>
      </div>

      <div role="status" className="mt-4 min-h-[5.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={copy.headline}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3">
              {TONE_ICON[copy.tone]}
              <h2 className="text-2xl font-semibold tracking-tight text-ice sm:text-3xl lg:text-4xl">
                {copy.headline}
              </h2>
            </div>
            <p className="mt-2 text-sm text-mute sm:text-base">{copy.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {showPips && <ProgressPips total={props.sequenceLength} filled={pipsFilled} />}
    </section>
  );
}
