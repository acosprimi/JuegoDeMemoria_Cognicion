export type GamePhase =
  | 'idle'
  | 'countdown'
  | 'showing'
  | 'input'
  | 'success'
  | 'gameOver'
  | 'results';

export type GameOutcome = 'failed' | 'mastered';
export type InputResult = 'correct' | 'complete' | 'wrong';
export type NodeStatus = 'idle' | 'sequence' | 'pressed' | 'error' | 'expected';
export type ShowStage = 'intro' | 'playing';

/** Node currently lit by the system, plus the node lit right before it. */
export interface LitNode {
  node: number;
  from: number | null;
}

export interface ScoreBreakdown {
  base: number;
  levelBonus: number;
  speedBonus: number;
  accuracyBonus: number;
  total: number;
}

export interface GameState {
  /** Increments on every new run; used to invalidate timers and saves. */
  runId: number;
  phase: GamePhase;
  outcome: GameOutcome | null;
  level: number;
  score: number;
  sequence: number[];
  currentInput: number[];
  totalInputs: number;
  correctInputs: number;
  correctSequences: number;
  mistakes: number;
  /** Longest sequence the player reproduced completely. */
  maxSequenceLength: number;
  startTime: number | null;
  endTime: number | null;
  inputStartedAt: number | null;
  lastBreakdown: ScoreBreakdown | null;
  errorNode: number | null;
  expectedNode: number | null;
}

export type GameAction =
  | { type: 'START' }
  | { type: 'BEGIN'; now: number; sequence: number[] }
  | { type: 'SHOW_COMPLETE'; now: number }
  | { type: 'PRESS'; node: number; now: number }
  | { type: 'ADVANCE'; sequence: number[] }
  | { type: 'FINISH' }
  | { type: 'RESET' };

export interface SessionSummary {
  score: number;
  /** Highest level reached (including the one where the player failed). */
  maxLevel: number;
  /** Longest sequence reproduced completely. */
  sequenceRecord: number;
  /** 0..1 */
  accuracy: number;
  durationMs: number;
  mastered: boolean;
  correctSequences: number;
  mistakes: number;
  finishedAt: number;
}

export interface SessionRecord {
  score: number;
  level: number;
  sequence: number;
  accuracy: number;
  durationMs: number;
  finishedAt: number;
}

export interface PersonalRecords {
  bestScore: number;
  bestLevel: number;
  longestSequence: number;
  bestAccuracy: number;
  topSessions: SessionRecord[];
}

export interface RecordUpdate {
  records: PersonalRecords;
  rank: number | null;
  newBestScore: boolean;
  newBestLevel: boolean;
  newLongestSequence: boolean;
  newBestAccuracy: boolean;
}

export interface PerformanceReport {
  title: string;
  note: string;
}
