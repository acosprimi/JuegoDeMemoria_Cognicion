import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { GAME_CONFIG, getPerformance } from '@/lib/game-engine';
import { formatPercent, formatScore, formatTime, pad2 } from '@/lib/format';
import type { PersonalRecords, RecordUpdate, SessionSummary } from '@/lib/types';
import { AnimatedNumber } from './AnimatedNumber';
import { PersonalBest } from './PersonalBest';
import { PrimaryButton } from './PrimaryButton';
import { RecallGauge } from './RecallGauge';

interface ResultsScreenProps {
  summary: SessionSummary;
  records: PersonalRecords;
  update: RecordUpdate | null;
  sessionNumber: number;
  onReplay: () => void;
  onReturn: () => void;
}

function ReportRow({
  label,
  isNewRecord,
  children,
}: {
  label: string;
  isNewRecord?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-3 py-3.5">
      <dt className="text-xs tracking-[0.2em] text-mute">{label}</dt>
      <span aria-hidden="true" className="mb-1 h-px flex-1 border-b border-dashed border-hairline" />
      <dd className="flex items-baseline gap-3 font-mono text-2xl tabular-nums text-ice sm:text-3xl">
        {isNewRecord && (
          <span className="rounded-sm border border-signal/60 px-1.5 py-0.5 text-[10px] tracking-[0.16em] text-signal">
            NEW RECORD
          </span>
        )}
        {children}
      </dd>
    </div>
  );
}

export function ResultsScreen({
  summary,
  records,
  update,
  sessionNumber,
  onReplay,
  onReturn,
}: ResultsScreenProps) {
  const performance = getPerformance(summary);
  const time = new Date(summary.finishedAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-16"
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.25 } }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex flex-col items-center gap-8 md:items-start">
        <RecallGauge
          cleared={summary.correctSequences}
          total={GAME_CONFIG.maxLevel}
          mastered={summary.mastered}
        />
        <PersonalBest records={records} variant="list" highlightFinishedAt={summary.finishedAt} />
      </div>

      <div>
        <h1 className="text-balance text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.01em] text-ice">
          EXPERIMENT COMPLETE
        </h1>
        <p className="mt-3 flex gap-5 font-mono text-[11px] tracking-[0.2em] text-mute">
          <span>SESSION {pad2(sessionNumber)}</span>
          <span>{time}</span>
        </p>

        <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
          <ReportRow label="FINAL SCORE" isNewRecord={update?.newBestScore}>
            <AnimatedNumber value={summary.score} from={0} format={formatScore} duration={1.1} />
          </ReportRow>
          <ReportRow label="MAX LEVEL" isNewRecord={update?.newBestLevel}>
            {pad2(summary.maxLevel)}
          </ReportRow>
          <ReportRow label="BEST SEQUENCE" isNewRecord={update?.newLongestSequence}>
            {pad2(summary.sequenceRecord)}
          </ReportRow>
          <ReportRow label="ACCURACY" isNewRecord={update?.newBestAccuracy}>
            {formatPercent(summary.accuracy)}
          </ReportRow>
          <ReportRow label="SESSION TIME">{formatTime(summary.durationMs)}</ReportRow>
        </dl>

        <div className="mt-7">
          <p className="text-[11px] tracking-[0.22em] text-mute">MEMORY PERFORMANCE</p>
          <p className="mt-2 text-xl font-semibold tracking-wide text-ice sm:text-2xl">
            {performance.title}
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-mute">{performance.note}</p>
          <p className="mt-3 text-xs text-mute/80">
            Educational demonstration. Not a clinical or medical assessment.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PrimaryButton onClick={onReplay} icon="replay" autoFocus>
            RUN EXPERIMENT AGAIN
          </PrimaryButton>
          <PrimaryButton onClick={onReturn} icon="back" variant="ghost">
            RETURN TO LAB
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}
