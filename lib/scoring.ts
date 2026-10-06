import type { ScoreBreakdown } from './types';

export interface ScoreInput {
  level: number;
  sequenceLength: number;
  /** Time the player took to reproduce the sequence. */
  inputDurationMs: number;
  /** Running accuracy of the session, 0..1. */
  accuracy: number;
}

const POINTS_PER_NODE = 100;
const POINTS_PER_LEVEL = 50;
const SPEED_POINTS_PER_NODE = 60;
const ACCURACY_POINTS_PER_NODE = 25;
/** Time budget per node for the full speed bonus to fade out. */
const SPEED_TARGET_MS_PER_NODE = 1000;

/**
 * BASE SCORE + LEVEL BONUS + SPEED BONUS + ACCURACY BONUS.
 * Every term is tunable from the constants above.
 */
export function calculateScore(input: ScoreInput): ScoreBreakdown {
  const { level, sequenceLength, inputDurationMs, accuracy } = input;

  const base = sequenceLength * POINTS_PER_NODE;
  const levelBonus = level * POINTS_PER_LEVEL;

  const targetMs = sequenceLength * SPEED_TARGET_MS_PER_NODE;
  const speedRatio = Math.min(1, Math.max(0, (targetMs - inputDurationMs) / targetMs));
  const speedBonus = Math.round(speedRatio * sequenceLength * SPEED_POINTS_PER_NODE);

  const clampedAccuracy = Math.min(1, Math.max(0, accuracy));
  const accuracyBonus = Math.round(clampedAccuracy * sequenceLength * ACCURACY_POINTS_PER_NODE);

  return {
    base,
    levelBonus,
    speedBonus,
    accuracyBonus,
    total: base + levelBonus + speedBonus + accuracyBonus,
  };
}
