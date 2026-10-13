import type { ReactNode } from 'react';
import { formatPercent, formatScore, pad2 } from '@/lib/format';
import { AnimatedNumber } from './AnimatedNumber';

interface GameHUDProps {
  level: number;
  score: number;
  sequenceLength: number;
  /** 0..1, or null while there is no data. */
  accuracy: number | null;
}

const TONES = [
  'border-pink bg-blush shadow-[#FFC9DD]',
  'border-sun bg-butter/80 shadow-[#FFE27A]',
  'border-lilac bg-[#F3ECFF] shadow-[#E0D2FF]',
  'border-ocean bg-[#E4F5FF] shadow-[#A9DBF7]',
] as const;

function Stat({ label, tone, children }: { label: string; tone: number; children: ReactNode }) {
  return (
    <div className={`rounded-3xl border-2 px-3 py-2.5 shadow-[0_4px_0] sm:px-4 sm:py-3 ${TONES[tone]}`}>
      <dt className="text-[11px] font-bold text-mute sm:text-[12px]">{label}</dt>
      <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-cocoa sm:text-2xl lg:text-4xl">
        {children}
      </dd>
    </div>
  );
}

export function GameHUD({ level, score, sequenceLength, accuracy }: GameHUDProps) {
  return (
    <dl className="grid w-full grid-cols-4 gap-2.5 sm:gap-4 lg:grid-cols-2 lg:gap-5">
      <Stat label="Level" tone={0}>
        {pad2(level)}
      </Stat>
      <Stat label="Score" tone={1}>
        <AnimatedNumber value={score} format={formatScore} />
      </Stat>
      <Stat label="Friends" tone={2}>
        {pad2(sequenceLength)}
      </Stat>
      <Stat label="Accuracy" tone={3}>
        {formatPercent(accuracy)}
      </Stat>
    </dl>
  );
}
