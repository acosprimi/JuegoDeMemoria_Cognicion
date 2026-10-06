import { motion } from 'motion/react';
import { calculateAccuracy, getSequenceLength } from '@/lib/game-engine';
import type { GameState, ShowStage } from '@/lib/types';
import { GameHUD } from './GameHUD';
import { GameStatus } from './GameStatus';

interface GameConsoleProps {
  state: GameState;
  showStage: ShowStage;
}

/** Left column while a session is running: status message plus the HUD. */
export function GameConsole({ state, showStage }: GameConsoleProps) {
  const sequenceLength = getSequenceLength(state.level);

  return (
    <motion.div
      className="flex w-full flex-col gap-6 lg:gap-12"
      initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <GameStatus
        phase={state.phase}
        showStage={showStage}
        level={state.level}
        sequenceLength={sequenceLength}
        progress={state.currentInput.length}
        expectedNode={state.expectedNode}
        mastered={state.outcome === 'mastered'}
        lastScore={state.lastBreakdown?.total ?? null}
        startTime={state.startTime}
        endTime={state.endTime}
      />
      <GameHUD
        level={state.level}
        score={state.score}
        sequenceLength={sequenceLength}
        accuracy={calculateAccuracy(state.correctInputs, state.totalInputs)}
      />
    </motion.div>
  );
}
