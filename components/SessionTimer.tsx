import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/format';

interface SessionTimerProps {
  startTime: number | null;
  endTime: number | null;
}

/** Self-contained ticker so only this small node re-renders every tick. */
export function SessionTimer({ startTime, endTime }: SessionTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  const running = startTime !== null && endTime === null;

  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = startTime === null ? 0 : (endTime ?? now) - startTime;
  return <span className="font-display font-medium tabular-nums">{formatTime(elapsed)}</span>;
}
