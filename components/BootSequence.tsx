import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { CuteMark } from './CuteMark';
import { HeartDoodle, SparkleDoodle, StarDoodle } from './Doodles';

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-cream px-6 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <div className="relative">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CuteMark className="size-20" />
        </motion.div>
        <StarDoodle className="twinkle absolute -left-8 top-1 size-5 text-sun" />
        <HeartDoodle className="floaty absolute -right-9 top-6 size-5 text-pink" />
        <SparkleDoodle className="twinkle absolute -right-3 -top-5 size-4 text-grape" />
      </div>
      <p className="font-display text-lg font-medium text-cocoa sm:text-xl">
        {online ? 'All set! ✿' : 'Getting cozy...'}
      </p>
      <span
        className="block h-3.5 w-52 overflow-hidden rounded-full border-2 border-pink bg-blush"
        aria-hidden="true"
      >
        <motion.span
          className="block h-full rounded-full bg-gradient-to-r from-pink via-rose to-grape"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: ONLINE_AT_MS / 1000, ease: 'easeOut' }}
        />
      </span>
    </motion.div>
  );
}
