'use client';

import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { cn } from '@/lib/cn';
import { getSequenceLength } from '@/lib/game-engine';
import type { GamePhase } from '@/lib/types';
import { BootSequence } from './BootSequence';
import { ExperimentHeader } from './ExperimentHeader';
import { GameConsole } from './GameConsole';
import { HeroSection } from './HeroSection';
import { MemoryBoard } from './MemoryBoard';
import { NeuralBackground } from './NeuralBackground';
import { ResultsScreen } from './ResultsScreen';

const HEADER_STATUS: Record<GamePhase, string> = {
  idle: 'SYSTEM ONLINE',
  countdown: 'SESSION STARTING',
  showing: 'SESSION ACTIVE',
  input: 'SESSION ACTIVE',
  success: 'SESSION ACTIVE',
  gameOver: 'SESSION ACTIVE',
  results: 'SESSION CLOSED',
};

export function MemorySequence() {
  const game = useMemoryGame();
  const [booted, setBooted] = useState(false);
  const handleBootDone = useCallback(() => setBooted(true), []);

  const { state, summary } = game;
  const { phase } = state;
  const dimmed = phase === 'countdown';

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-phase={phase}
        className="relative flex min-h-dvh flex-col overflow-x-clip bg-void text-ice"
      >
        <NeuralBackground calm={phase !== 'idle'} />

        <AnimatePresence>
          {!booted && <BootSequence key="boot" onDone={handleBootDone} />}
        </AnimatePresence>

        <ExperimentHeader
          statusLabel={HEADER_STATUS[phase]}
          soundOn={game.soundOn}
          onToggleSound={game.toggleSound}
          dimmed={dimmed}
        />

        {booted && (
          <main className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 px-5 pb-10 pt-2 sm:px-8 lg:px-12">
            <AnimatePresence mode="wait">
              {phase === 'results' && summary ? (
                <motion.div key="results" className="m-auto w-full">
                  <ResultsScreen
                    summary={summary}
                    records={game.records}
                    update={game.recordUpdate}
                    sessionNumber={state.runId}
                    onReplay={game.startGame}
                    onReturn={game.returnToLab}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="stage"
                  className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <div
                    className={cn(
                      'relative order-1 transition-opacity duration-500',
                      dimmed && 'opacity-25',
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {phase === 'idle' ? (
                        <HeroSection key="hero" onStart={game.startGame} records={game.records} />
                      ) : (
                        <GameConsole key="console" state={state} showStage={game.showStage} />
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative order-2">
                    <MemoryBoard
                      phase={phase}
                      lit={game.lit}
                      pressedNode={game.pressedNode}
                      pressCount={game.pressCount}
                      errorNode={state.errorNode}
                      expectedNode={state.expectedNode}
                      userPath={state.currentInput}
                      countdown={game.countdown}
                      sequenceLength={phase === 'idle' ? null : getSequenceLength(state.level)}
                      onPress={game.pressNode}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        )}
      </div>
    </MotionConfig>
  );
}
