import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { BrainMark } from './BrainMark';

interface BootSequenceProps {
  onDone: () => void;
}

const ONLINE_AT_MS = 620;
const DONE_AT_MS = 1050;

/** Sub-second intro. It never blocks: it fades out on its own. */
export function BootSequence({ onDone }: BootSequenceProps) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const onlineTimer = window.setTimeout(() => setOnline(true), ONLINE_AT_MS);
    const doneTimer = window.setTimeout(onDone, DONE_AT_MS);
    return () => {
      window.clearTimeout(onlineTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <motion.div
      role="status"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-void px-6 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <BrainMark className="size-12 text-signal" />
      <p className="font-mono text-[11px] tracking-[0.22em] text-ice/90 sm:text-xs">
        {online ? 'SYSTEM ONLINE' : 'INITIALIZING NEURAL MEMORY SYSTEM...'}
      </p>
      <span className="block h-px w-48 overflow-hidden bg-hairline" aria-hidden="true">
        <motion.span
          className="block h-full bg-signal"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: ONLINE_AT_MS / 1000, ease: 'easeOut' }}
        />
      </span>
    </motion.div>
  );
}
