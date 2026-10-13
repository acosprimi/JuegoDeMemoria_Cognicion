import { calculateScore } from './scoring';
import type {
  GameAction,
  GameState,
  InputResult,
  PerformanceReport,
  SessionSummary,
} from './types';

export const GAME_CONFIG = {
  nodeCount: 9,
  maxLevel: 12,
  firstSequenceLength: 3,
} as const;

/** Level 1 -> 3 nodes, level 2 -> 4 nodes, and so on. */
export function getSequenceLength(level: number): number {
  return GAME_CONFIG.firstSequenceLength + level - 1;
}

export interface LevelTiming {
  /** How long each node stays lit. */
  litMs: number;
  /** Pause between nodes. */
  gapMs: number;
  /** Pause before the first node, used to announce the level. */
  leadInMs: number;
  /** Pause after the last node before the player can answer. */
  settleMs: number;
}

/** Speed ramps up gently and is clamped so it never becomes unfair. */
export function getLevelTiming(level: number): LevelTiming {
  const step = Math.max(0, level - 1);
  return {
    litMs: Math.max(420, 640 - step * 20),
    gapMs: Math.max(170, 260 - step * 8),
    leadInMs: level === 1 ? 1700 : 1000,
    settleMs: 450,
  };
}

/** Random sequence that never repeats the same node twice in a row. */
export function generateSequence(length: number, random: () => number = Math.random): number[] {
  const { nodeCount } = GAME_CONFIG;
  const sequence: number[] = [];
  for (let i = 0; i < length; i += 1) {
    let next = Math.floor(random() * nodeCount) % nodeCount;
    if (i > 0 && next === sequence[i - 1]) {
      next = (next + 1 + (Math.floor(random() * (nodeCount - 1)) % (nodeCount - 1))) % nodeCount;
    }
    sequence.push(next);
  }
  return sequence;
}

export function validateInput(
  sequence: readonly number[],
  inputIndex: number,
  node: number,
): InputResult {
  const expected = sequence[inputIndex];
  if (expected === undefined || node !== expected) return 'wrong';
  return inputIndex === sequence.length - 1 ? 'complete' : 'correct';
}

/** Returns null while there is no data yet. Result is 0..1. */
export function calculateAccuracy(correctInputs: number, totalInputs: number): number | null {
  if (totalInputs <= 0) return null;
  return correctInputs / totalInputs;
}

/** Returns null when the player has already cleared the last level. */
export function getNextLevel(level: number): number | null {
  return level >= GAME_CONFIG.maxLevel ? null : level + 1;
}

export function createInitialState(runId = 0): GameState {
  return {
    runId,
    phase: 'idle',
    outcome: null,
    level: 1,
    score: 0,
    sequence: [],
    currentInput: [],
    totalInputs: 0,
    correctInputs: 0,
    correctSequences: 0,
    mistakes: 0,
    maxSequenceLength: 0,
    startTime: null,
    endTime: null,
    inputStartedAt: null,
    lastBreakdown: null,
    errorNode: null,
    expectedNode: null,
  };
}

export const initialGameState: GameState = createInitialState(0);

function applyPress(state: GameState, node: number, now: number): GameState {
  if (state.phase !== 'input') return state;

  const inputIndex = state.currentInput.length;
  const result = validateInput(state.sequence, inputIndex, node);
  const totalInputs = state.totalInputs + 1;

  if (result === 'wrong') {
    return {
      ...state,
      phase: 'gameOver',
      outcome: 'failed',
      totalInputs,
      mistakes: state.mistakes + 1,
      errorNode: node,
      expectedNode: state.sequence[inputIndex] ?? null,
      endTime: now,
    };
  }

  const correctInputs = state.correctInputs + 1;
  const currentInput = [...state.currentInput, node];

  if (result === 'correct') {
    return { ...state, currentInput, totalInputs, correctInputs };
  }

  const breakdown = calculateScore({
    level: state.level,
    sequenceLength: state.sequence.length,
    inputDurationMs: state.inputStartedAt === null ? 0 : Math.max(0, now - state.inputStartedAt),
    accuracy: calculateAccuracy(correctInputs, totalInputs) ?? 1,
  });
  const mastered = getNextLevel(state.level) === null;

  return {
    ...state,
    phase: 'success',
    outcome: mastered ? 'mastered' : null,
    currentInput,
    totalInputs,
    correctInputs,
    correctSequences: state.correctSequences + 1,
    maxSequenceLength: Math.max(state.maxSequenceLength, state.sequence.length),
    score: state.score + breakdown.total,
    lastBreakdown: breakdown,
    endTime: mastered ? now : null,
  };
}

/**
 * Pure state machine. Every transition is guarded by the current phase, so
 * late timers or rapid double clicks can never produce an impossible state.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      if (state.phase !== 'idle' && state.phase !== 'results') return state;
      return { ...createInitialState(state.runId + 1), phase: 'countdown' };

    case 'BEGIN':
      if (state.phase !== 'countdown') return state;
      return {
        ...state,
        phase: 'showing',
        level: 1,
        sequence: action.sequence,
        currentInput: [],
        startTime: action.now,
      };

    case 'SHOW_COMPLETE':
      if (state.phase !== 'showing') return state;
      return { ...state, phase: 'input', currentInput: [], inputStartedAt: action.now };

    case 'PRESS':
      return applyPress(state, action.node, action.now);

    case 'ADVANCE': {
      if (state.phase !== 'success' || state.outcome !== null) return state;
      const next = getNextLevel(state.level);
      if (next === null) return state;
      return {
        ...state,
        phase: 'showing',
        level: next,
        sequence: action.sequence,
        currentInput: [],
        inputStartedAt: null,
      };
    }

    case 'FINISH': {
      const canFinish =
        state.phase === 'gameOver' || (state.phase === 'success' && state.outcome === 'mastered');
      return canFinish ? { ...state, phase: 'results' } : state;
    }

    case 'RESET':
      return createInitialState(state.runId + 1);

    default:
      return state;
  }
}

/** `fallbackNow` is only used if the session has no end time yet. */
export function buildSummary(state: GameState, fallbackNow: number): SessionSummary {
  const end = state.endTime ?? fallbackNow;
  const start = state.startTime ?? end;
  return {
    score: state.score,
    maxLevel: state.level,
    sequenceRecord: state.maxSequenceLength,
    accuracy: calculateAccuracy(state.correctInputs, state.totalInputs) ?? 0,
    durationMs: Math.max(0, end - start),
    mastered: state.outcome === 'mastered',
    correctSequences: state.correctSequences,
    mistakes: state.mistakes,
    finishedAt: end,
  };
}

/** Educational feedback only. Based on the longest sequence recalled. */
export function getPerformance(summary: SessionSummary): PerformanceReport {
  if (summary.mastered) {
    return {
      title: 'Memory Master!',
      note: 'All twelve levels cleared without a single oopsie.',
    };
  }
  if (summary.sequenceRecord >= 9) {
    return {
      title: 'Super Sparkly Memory',
      note: 'You kept a very long sequence in just the right order.',
    };
  }
  if (summary.sequenceRecord >= 6) {
    return {
      title: 'Cozy Memory Star',
      note: 'You remembered a long chain of friends in order.',
    };
  }
  return {
    title: 'Sweet Little Memory',
    note: 'You remembered a short sequence. Play again to stretch it a little longer!',
  };
}
