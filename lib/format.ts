export function pad2(value: number): string {
  return String(Math.max(0, Math.trunc(value))).padStart(2, '0');
}

export function formatScore(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return `${pad2(Math.floor(totalSeconds / 60))}:${pad2(totalSeconds % 60)}`;
}

/** Takes a 0..1 ratio. Returns "--" when there is no data yet. */
export function formatPercent(ratio: number | null): string {
  return ratio === null ? '--' : `${Math.round(ratio * 100)}%`;
}
