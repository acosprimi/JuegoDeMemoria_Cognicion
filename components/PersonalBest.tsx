import { cn } from '@/lib/cn';
import { formatScore, pad2 } from '@/lib/format';
import type { PersonalRecords } from '@/lib/types';
import { StarDoodle } from './Doodles';

interface PersonalBestProps {
  records: PersonalRecords;
  variant: 'compact' | 'list';
  /** `finishedAt` of the run to highlight in the list. */
  highlightFinishedAt?: number;
}

export function PersonalBest({ records, variant, highlightFinishedAt }: PersonalBestProps) {
  if (records.topSessions.length === 0) return null;

  if (variant === 'compact') {
    return (
      <div className="flex w-full max-w-md items-center gap-4 rounded-3xl border-2 border-sun bg-butter/70 px-5 py-3.5 shadow-[0_4px_0_#FFE27A]">
        <StarDoodle className="size-9 shrink-0 text-sun" stroke="#E8AE1F" />
        <div>
          <p className="text-[12px] font-bold text-mute">My best score</p>
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5">
            <span className="font-display text-2xl font-semibold tabular-nums text-cocoa">
              {formatScore(records.bestScore)}
            </span>
            <span className="text-xs font-bold text-mute">
              Level {pad2(records.bestLevel)} · Sequence {pad2(records.longestSequence)}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs rounded-3xl border-2 border-pink bg-paper/90 px-4 py-4 shadow-[0_5px_0_#FFC9DD]">
      <p className="flex items-center gap-2 font-display text-base font-medium text-cocoa">
        <StarDoodle className="size-5 text-sun" stroke="#E8AE1F" />
        My best scores
      </p>
      <ol className="mt-2 divide-y-2 divide-dashed divide-pink/60">
        {records.topSessions.map((session, index) => {
          const current = session.finishedAt === highlightFinishedAt;
          return (
            <li
              key={`${session.finishedAt}-${index}`}
              className={cn(
                'flex items-center gap-3 py-2.5 font-display text-[15px] tabular-nums',
                current ? 'text-cocoa' : 'text-cocoa/75',
              )}
            >
              <span className="w-7 text-rose">#{index + 1}</span>
              <span className="flex-1 font-medium">{formatScore(session.score)}</span>
              <span className="text-xs font-semibold text-mute">Seq {pad2(session.sequence)}</span>
              {current && (
                <span className="rounded-full bg-rose px-2 py-0.5 text-[11px] font-semibold text-white">
                  this run!
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
