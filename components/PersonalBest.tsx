import { cn } from '@/lib/cn';
import { formatScore, pad2 } from '@/lib/format';
import type { PersonalRecords } from '@/lib/types';

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
      <div className="w-full max-w-md border-t border-hairline pt-3">
        <p className="text-[10px] tracking-[0.22em] text-mute sm:text-[11px]">PERSONAL BEST</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span className="font-mono text-2xl font-medium tabular-nums text-ice">
            {formatScore(records.bestScore)}
          </span>
          <span className="font-mono text-xs tracking-wider text-mute">
            LEVEL {pad2(records.bestLevel)} / SEQUENCE {pad2(records.longestSequence)}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <p className="text-[11px] tracking-[0.22em] text-mute">PERSONAL BEST</p>
      <ol className="mt-3 divide-y divide-hairline border-y border-hairline">
        {records.topSessions.map((session, index) => {
          const current = session.finishedAt === highlightFinishedAt;
          return (
            <li
              key={`${session.finishedAt}-${index}`}
              className={cn(
                'flex items-center gap-4 py-2.5 font-mono text-sm tabular-nums',
                current ? 'text-ice' : 'text-ice/70',
              )}
            >
              <span className="w-7 text-mute">#{index + 1}</span>
              <span className="flex-1">{formatScore(session.score)}</span>
              <span className="text-xs text-mute">SEQ {pad2(session.sequence)}</span>
              {current && (
                <span className="rounded-sm border border-signal/60 px-1.5 py-0.5 text-[10px] tracking-[0.16em] text-signal">
                  THIS RUN
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
