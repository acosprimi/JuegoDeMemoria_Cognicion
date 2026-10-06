import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  playClick,
  playError,
  playGameOver,
  playLevelUp,
  playNode,
  playStart,
  setAudioMuted,
  unlockAudio,
} from '@/lib/audio';
import {
  buildSummary,
  generateSequence,
  getLevelTiming,
  getSequenceLength,
  gameReducer,
  initialGameState,
  validateInput,
} from '@/lib/game-engine';
import {
  EMPTY_RECORDS,
  loadRecords,
  loadSoundPreference,
  saveSession,
  saveSoundPreference,
} from '@/lib/storage';
import type {
  LitNode,
  PersonalRecords,
  RecordUpdate,
  SessionSummary,
  ShowStage,
} from '@/lib/types';

const COUNTDOWN_STEP_MS = 800;
const BEGIN_HOLD_MS = 650;
const PRESS_FLASH_MS = 260;
const SUCCESS_HOLD_MS = 1300;
const MASTERED_HOLD_MS = 2600;
const GAME_OVER_HOLD_MS = 2000;

/**
 * Orchestrates the game: owns the reducer, every timer and all side effects
 * (audio, storage). Components stay purely presentational.
 *
 * Timer rule: each effect creates its own timers and clears them in its
 * cleanup, so timers can never be duplicated or outlive their phase.
 */
export function useMemoryGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [countdown, setCountdown] = useState(3);
  const [lit, setLit] = useState<LitNode | null>(null);
  const [showStage, setShowStage] = useState<ShowStage>('intro');
  const [pressedNode, setPressedNode] = useState<number | null>(null);
  const [pressCount, setPressCount] = useState(0);
  const [records, setRecords] = useState<PersonalRecords>(EMPTY_RECORDS);
  const [recordUpdate, setRecordUpdate] = useState<RecordUpdate | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const stateRef = useRef(state);
  const pressTimerRef = useRef<number | null>(null);
  const savedRunRef = useRef(-1);

  // Keep the ref in sync. Declared first so later effects always read fresh state.
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load persisted data after mount (never during SSR).
  useEffect(() => {
    setRecords(loadRecords());
    const enabled = loadSoundPreference();
    setSoundOn(enabled);
    setAudioMuted(!enabled);
  }, []);

  useEffect(
    () => () => {
      if (pressTimerRef.current !== null) window.clearTimeout(pressTimerRef.current);
    },
    [],
  );

  // COUNTDOWN: 3 -> 2 -> 1 -> BEGIN -> first sequence.
  useEffect(() => {
    if (state.phase !== 'countdown') return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };

    at(COUNTDOWN_STEP_MS, () => {
      setCountdown(2);
      playClick();
    });
    at(COUNTDOWN_STEP_MS * 2, () => {
      setCountdown(1);
      playClick();
    });
    at(COUNTDOWN_STEP_MS * 3, () => {
      setCountdown(0);
      playStart();
    });
    at(COUNTDOWN_STEP_MS * 3 + BEGIN_HOLD_MS, () => {
      dispatch({
        type: 'BEGIN',
        now: Date.now(),
        sequence: generateSequence(getSequenceLength(1)),
      });
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [state.phase, state.runId]);

  // SHOWING: light the nodes one by one, then hand control to the player.
  useEffect(() => {
    if (state.phase !== 'showing') return;
    const sequence = state.sequence;
    const timing = getLevelTiming(state.level);
    const stepMs = timing.litMs + timing.gapMs;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };

    sequence.forEach((node, i) => {
      const onAt = timing.leadInMs + i * stepMs;
      at(onAt, () => {
        setShowStage('playing');
        setLit({ node, from: i > 0 ? sequence[i - 1] : null });
        playNode(node);
      });
      at(onAt + timing.litMs, () => setLit(null));
    });

    const doneAt =
      timing.leadInMs + (sequence.length - 1) * stepMs + timing.litMs + timing.settleMs;
    at(doneAt, () => dispatch({ type: 'SHOW_COMPLETE', now: Date.now() }));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      setLit(null);
      setShowStage('intro');
    };
  }, [state.phase, state.sequence, state.level]);

  // SUCCESS: confirm, then move on automatically (or finish at max level).
  useEffect(() => {
    if (state.phase !== 'success') return;
    const mastered = state.outcome === 'mastered';
    const nextLength = getSequenceLength(state.level + 1);
    playLevelUp();

    const timer = window.setTimeout(
      () => {
        if (mastered) {
          dispatch({ type: 'FINISH' });
        } else {
          dispatch({ type: 'ADVANCE', sequence: generateSequence(nextLength) });
        }
      },
      mastered ? MASTERED_HOLD_MS : SUCCESS_HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.phase, state.outcome, state.level]);

  // GAME OVER: let the player see the mistake and the expected node.
  useEffect(() => {
    if (state.phase !== 'gameOver') return;
    const soundTimer = window.setTimeout(playGameOver, 520);
    const finishTimer = window.setTimeout(() => dispatch({ type: 'FINISH' }), GAME_OVER_HOLD_MS);
    return () => {
      window.clearTimeout(soundTimer);
      window.clearTimeout(finishTimer);
    };
  }, [state.phase]);

  // Persist the session exactly once per run, the moment it ends.
  useEffect(() => {
    const current = stateRef.current;
    const ended =
      current.phase === 'gameOver' ||
      (current.phase === 'success' && current.outcome === 'mastered');
    if (!ended || savedRunRef.current === current.runId) return;
    savedRunRef.current = current.runId;

    const update = saveSession(buildSummary(current, Date.now()));
    setRecords(update.records);
    setRecordUpdate(update);
  }, [state.phase, state.outcome, state.runId]);

  const flashNode = useCallback((node: number) => {
    setPressedNode(node);
    setPressCount((count) => count + 1);
    if (pressTimerRef.current !== null) window.clearTimeout(pressTimerRef.current);
    pressTimerRef.current = window.setTimeout(() => {
      setPressedNode(null);
      pressTimerRef.current = null;
    }, PRESS_FLASH_MS);
  }, []);

  const pressNode = useCallback(
    (node: number) => {
      const current = stateRef.current;

      // Idle: the board works as a harmless preview.
      if (current.phase === 'idle') {
        flashNode(node);
        playNode(node);
        return;
      }
      if (current.phase !== 'input') return;

      const result = validateInput(current.sequence, current.currentInput.length, node);
      flashNode(node);
      if (result === 'wrong') {
        playError();
      } else {
        playNode(node);
      }
      dispatch({ type: 'PRESS', node, now: Date.now() });
    },
    [flashNode],
  );

  // Keyboard: keys 1-9 map to the nodes while it is the player's turn.
  useEffect(() => {
    if (state.phase !== 'input') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (!/^[1-9]$/.test(event.key)) return;
      pressNode(Number(event.key) - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.phase, pressNode]);

  const startGame = useCallback(() => {
    unlockAudio();
    playClick();
    setCountdown(3);
    setRecordUpdate(null);
    dispatch({ type: 'START' });
  }, []);

  const returnToLab = useCallback(() => {
    playClick();
    dispatch({ type: 'RESET' });
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    setAudioMuted(!next);
    saveSoundPreference(next);
    if (next) {
      unlockAudio();
      playClick();
    }
  }, [soundOn]);

  const summary = useMemo<SessionSummary | null>(
    () => (state.phase === 'results' ? buildSummary(state, state.endTime ?? 0) : null),
    [state],
  );

  return {
    state,
    summary,
    countdown,
    lit,
    showStage,
    pressedNode,
    pressCount,
    records,
    recordUpdate,
    soundOn,
    startGame,
    pressNode,
    returnToLab,
    toggleSound,
  };
}
