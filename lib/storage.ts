import type { PersonalRecords, RecordUpdate, SessionRecord, SessionSummary } from './types';

const KEYS = {
  records: 'memory-sequence:records:v1',
  sound: 'memory-sequence:sound:v1',
} as const;

export const MAX_TOP_SESSIONS = 5;

export const EMPTY_RECORDS: PersonalRecords = {
  bestScore: 0,
  bestLevel: 0,
  longestSequence: 0,
  bestAccuracy: 0,
  topSessions: [],
};

function readItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, quota). The game keeps working.
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function parseSession(value: unknown): SessionRecord | null {
  if (!isObject(value)) return null;
  const score = toNumber(value.score);
  const level = toNumber(value.level);
  const sequence = toNumber(value.sequence);
  const accuracy = toNumber(value.accuracy);
  const durationMs = toNumber(value.durationMs);
  const finishedAt = toNumber(value.finishedAt);
  if (
    score === null ||
    level === null ||
    sequence === null ||
    accuracy === null ||
    durationMs === null ||
    finishedAt === null
  ) {
    return null;
  }
  return { score, level, sequence, accuracy, durationMs, finishedAt };
}

function parseRecords(raw: string | null): PersonalRecords {
  if (raw === null) return EMPTY_RECORDS;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isObject(data)) return EMPTY_RECORDS;
    const sessions = Array.isArray(data.topSessions)
      ? data.topSessions
          .map(parseSession)
          .filter((entry): entry is SessionRecord => entry !== null)
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_TOP_SESSIONS)
      : [];
    return {
      bestScore: toNumber(data.bestScore) ?? 0,
      bestLevel: toNumber(data.bestLevel) ?? 0,
      longestSequence: toNumber(data.longestSequence) ?? 0,
      bestAccuracy: toNumber(data.bestAccuracy) ?? 0,
      topSessions: sessions,
    };
  } catch {
    return EMPTY_RECORDS;
  }
}

export function loadRecords(): PersonalRecords {
  return parseRecords(readItem(KEYS.records));
}

function beats(value: number, previous: number): boolean {
  return previous > 0 && value > previous;
}

/** Merges a finished session into the stored records and persists them. */
export function saveSession(summary: SessionSummary): RecordUpdate {
  const previous = loadRecords();

  const entry: SessionRecord = {
    score: summary.score,
    level: summary.maxLevel,
    sequence: summary.sequenceRecord,
    accuracy: summary.accuracy,
    durationMs: summary.durationMs,
    finishedAt: summary.finishedAt,
  };

  const topSessions =
    summary.score > 0
      ? [...previous.topSessions, entry].sort((a, b) => b.score - a.score).slice(0, MAX_TOP_SESSIONS)
      : previous.topSessions;

  const rankIndex = topSessions.findIndex(
    (item) => item.finishedAt === entry.finishedAt && item.score === entry.score,
  );

  const records: PersonalRecords = {
    bestScore: Math.max(previous.bestScore, summary.score),
    bestLevel: Math.max(previous.bestLevel, summary.maxLevel),
    longestSequence: Math.max(previous.longestSequence, summary.sequenceRecord),
    bestAccuracy: Math.max(previous.bestAccuracy, summary.accuracy),
    topSessions,
  };

  writeItem(KEYS.records, JSON.stringify(records));

  return {
    records,
    rank: rankIndex >= 0 ? rankIndex + 1 : null,
    newBestScore: beats(summary.score, previous.bestScore),
    newBestLevel: beats(summary.maxLevel, previous.bestLevel),
    newLongestSequence: beats(summary.sequenceRecord, previous.longestSequence),
    newBestAccuracy: beats(summary.accuracy, previous.bestAccuracy),
  };
}

export function loadSoundPreference(): boolean {
  return readItem(KEYS.sound) !== 'off';
}

export function saveSoundPreference(enabled: boolean): void {
  writeItem(KEYS.sound, enabled ? 'on' : 'off');
}
