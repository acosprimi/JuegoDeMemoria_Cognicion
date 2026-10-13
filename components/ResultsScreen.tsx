import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { GAME_CONFIG, getPerformance } from '@/lib/game-engine';
import { formatPercent, formatScore, formatTime, pad2 } from '@/lib/format';
import type { PersonalRecords, RecordUpdate, SessionSummary } from '@/lib/types';
import { AnimatedNumber } from './AnimatedNumber';
import { HeartDoodle, SparkleDoodle, StarDoodle } from './Doodles';
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
      <dt className="text-sm font-bold text-mute">{label}</dt>
      <span aria-hidden="true" className="mb-1 h-px flex-1 border-b-2 border-dotted border-pink" />
      <dd className="flex items-baseline gap-3 font-display text-2xl font-semibold tabular-nums text-cocoa sm:text-3xl">
        {isNewRecord && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sun px-2.5 py-0.5 text-[11px] font-bold text-cocoa">
            <StarDoodle className="size-3" fill="#FFF8EC" stroke="#FFF8EC" />
            new best!
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
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
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

      <div className="stitched rounded-[2.5rem] border-[4px] border-pink bg-paper/90 px-6 py-7 shadow-[0_8px_0_#FFC2D9] sm:px-9" style={{ '--stitch': '#FFE3EE' } as CSSProperties}>
        <div className="relative z-10">
          <h1 className="flex items-center gap-3 text-balance font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight text-cocoa">
            You finished!
            <HeartDoodle className="size-8 shrink-0 text-rose sm:size-10" />
          </h1>
          <p className="mt-2 flex gap-4 text-[13px] font-bold text-mute">
            <span>Round {pad2(sessionNumber)}</span>
            <span>{time}</span>
          </p>

          <dl className="mt-5 divide-y-2 divide-dashed divide-pink/50 border-y-2 border-dashed border-pink/50">
            <ReportRow label="Final score" isNewRecord={update?.newBestScore}>
              <AnimatedNumber value={summary.score} from={0} format={formatScore} duration={1.1} />
            </ReportRow>
            <ReportRow label="Best level" isNewRecord={update?.newBestLevel}>
              {pad2(summary.maxLevel)}
            </ReportRow>
            <ReportRow label="Longest sequence" isNewRecord={update?.newLongestSequence}>
              {pad2(summary.sequenceRecord)}
            </ReportRow>
            <ReportRow label="Accuracy" isNewRecord={update?.newBestAccuracy}>
              {formatPercent(summary.accuracy)}
            </ReportRow>
            <ReportRow label="Play time">{formatTime(summary.durationMs)}</ReportRow>
          </dl>

          <div className="mt-6 rounded-3xl border-2 border-sun bg-butter/70 px-5 py-4">
            <p className="flex items-center gap-2 text-[13px] font-bold text-mute">
              <SparkleDoodle className="size-4 text-[#E8A21F]" />
              Your memory power
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-cocoa sm:text-2xl">
              {performance.title}
            </p>
            <p className="mt-1 max-w-md text-sm font-semibold leading-relaxed text-mute">
              {performance.note}
            </p>
          </div>
          <p className="mt-3 text-xs font-semibold text-mute">
            Just for fun and learning. Not a clinical or medical test.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <PrimaryButton onClick={onReplay} icon="replay" autoFocus>
              Play again
            </PrimaryButton>
            <PrimaryButton onClick={onReturn} icon="back" variant="ghost">
              Back home
            </PrimaryButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
