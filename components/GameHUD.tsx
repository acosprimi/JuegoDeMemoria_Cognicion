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

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-hairline pt-3">
      <dt className="text-[10px] tracking-[0.22em] text-mute sm:text-[11px]">{label}</dt>
      <dd className="mt-1 font-mono text-lg font-medium tabular-nums text-ice sm:text-2xl lg:text-4xl">
        {children}
      </dd>
    </div>
  );
}

export function GameHUD({ level, score, sequenceLength, accuracy }: GameHUDProps) {
  return (
    <dl className="grid w-full grid-cols-4 gap-x-3 sm:gap-x-5 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-7">
      <Stat label="LEVEL">{pad2(level)}</Stat>
      <Stat label="SCORE">
        <AnimatedNumber value={score} format={formatScore} />
      </Stat>
      <Stat label="SEQUENCE">{pad2(sequenceLength)}</Stat>
      <Stat label="ACCURACY">{formatPercent(accuracy)}</Stat>
    </dl>
  );
}
