import { CloudRain, Eye, Hand, Heart, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatScore, pad2 } from '@/lib/format';
import type { GamePhase, ShowStage } from '@/lib/types';
import { HeartDoodle } from './Doodles';
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
      return { headline: 'Getting ready...', detail: 'Eyes on the friends!', tone: 'neutral' };
    case 'showing':
      if (props.showStage === 'intro') {
        return props.level === 1
          ? { headline: 'Watch closely!', detail: 'Remember the order they light up.', tone: 'observe' }
          : {
              headline: `Level ${pad2(props.level)}`,
              detail: `${props.sequenceLength} friends to remember.`,
              tone: 'observe',
            };
      }
      return { headline: 'Watch carefully', detail: 'Just looking for now, no tapping yet~', tone: 'observe' };
    case 'input':
      return {
        headline: 'Your turn!',
        detail:
          props.level === 1 && props.progress === 0
            ? 'Tap them in the same order.'
            : `Friend ${Math.min(props.progress + 1, props.sequenceLength)} of ${props.sequenceLength}.`,
        tone: 'input',
      };
    case 'success':
      return {
        headline: 'Yay, you did it!',
        detail: props.mastered ? 'Final level cleared!' : `+${formatScore(props.lastScore ?? 0)} points`,
        tone: 'success',
      };
    case 'gameOver':
      return {
        headline: 'Oh no, oopsie!',
        detail:
          props.expectedNode !== null
            ? `It was friend ${props.expectedNode + 1}.`
            : 'The sequence got mixed up.',
        tone: 'error',
      };
    default:
      return { headline: 'Ready!', detail: 'Waiting for you.', tone: 'neutral' };
  }
}

const TONE_CARD: Record<Tone, string> = {
  neutral: 'border-lilac shadow-[0_5px_0_#E0D2FF]',
  observe: 'border-sun shadow-[0_5px_0_#FFE27A]',
  input: 'border-pink shadow-[0_5px_0_#FFC9DD]',
  success: 'border-leaf shadow-[0_5px_0_#B0EACF]',
  error: 'border-coral shadow-[0_5px_0_#FFC2C9]',
};

const TONE_ICON: Record<Tone, ReactNode> = {
  neutral: <Sparkles className="size-6 text-grape" aria-hidden="true" />,
  observe: <Eye className="size-6 text-[#E8A21F]" aria-hidden="true" />,
  input: <Hand className="size-6 text-rose" aria-hidden="true" />,
  success: <Heart className="size-6 fill-leaf text-leaf" aria-hidden="true" />,
  error: <CloudRain className="size-6 text-coral" aria-hidden="true" />,
};

function ProgressPips({ total, filled }: { total: number; filled: number }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <HeartDoodle
          key={i}
          className={cn(
            'size-5 transition-all duration-200',
            i < filled ? 'scale-110 text-rose' : 'text-blush',
          )}
          stroke={i < filled ? '#E8639A' : '#FFB7D2'}
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
      aria-label="Game status"
      className={cn(
        'stitched rounded-[2rem] border-[3px] bg-paper/90 px-6 py-5 transition-colors duration-300',
        TONE_CARD[copy.tone],
      )}
      style={{ '--stitch': '#FFE3EE' } as CSSProperties}
    >
      <div className="relative z-10 flex items-center justify-between gap-4 text-[12px] font-bold text-mute">
        <span>Playing now</span>
        <span className="flex items-center gap-2 rounded-full bg-blush px-3 py-1 text-cocoa">
          <span className="text-mute">Time</span>
          <SessionTimer startTime={props.startTime} endTime={props.endTime} />
        </span>
      </div>

      <div role="status" className="relative z-10 mt-4 min-h-[5.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={copy.headline}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3">
              {TONE_ICON[copy.tone]}
              <h2 className="font-display text-2xl font-semibold tracking-tight text-cocoa sm:text-3xl lg:text-4xl">
                {copy.headline}
              </h2>
            </div>
            <p className="mt-2 text-base font-semibold text-mute sm:text-lg">{copy.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {showPips && <div className="relative z-10">
        <ProgressPips total={props.sequenceLength} filled={pipsFilled} />
      </div>}
    </section>
  );
}
