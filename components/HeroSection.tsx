import { motion, type Variants } from 'motion/react';
import type { PersonalRecords } from '@/lib/types';
import { HeartDoodle, SparkleDoodle } from './Doodles';
import { ExperimentReadouts } from './ExperimentReadouts';
import { PersonalBest } from './PersonalBest';
import { PrimaryButton } from './PrimaryButton';

interface HeroSectionProps {
  onStart: () => void;
  records: PersonalRecords;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export function HeroSection({ onStart, records }: HeroSectionProps) {
  return (
    <motion.div
      className="flex flex-col items-start gap-6"
      variants={CONTAINER}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)', transition: { duration: 0.28 } }}
    >
      <motion.p
        variants={ITEM}
        className="inline-flex items-center gap-2 rounded-full border-2 border-lilac bg-paper/80 px-4 py-1.5 font-display text-sm font-medium text-grape shadow-[0_3px_0_#E9DEFF]"
      >
        <SparkleDoodle className="size-4 text-sun" />
        a tiny memory game
        <HeartDoodle className="size-4 text-rose" />
      </motion.p>

      <motion.h1
        variants={ITEM}
        className="text-balance font-display text-[clamp(2.4rem,5vw,3.9rem)] font-semibold leading-[1.05] text-cocoa"
      >
        Can you remember{' '}
        <span className="relative inline-block text-rose">
          the sequence?
          <svg
            viewBox="0 0 200 12"
            className="absolute -bottom-2 left-0 h-3 w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M3 7Q25 1 50 7T100 7T150 7T197 6"
              fill="none"
              stroke="#FFD54D"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </motion.h1>

      <motion.p variants={ITEM} className="max-w-md text-lg font-semibold leading-relaxed text-cocoa/90 sm:text-xl">
        Watch your little friends light up, then tap them in the very same order.
      </motion.p>

      <motion.p variants={ITEM} className="-mt-2 max-w-md text-[15px] font-semibold leading-relaxed text-mute">
        A gentle way to practice your visual working memory.
      </motion.p>

      <motion.div variants={ITEM} className="pt-2">
        <PrimaryButton onClick={onStart} icon="arrow">
          Let&apos;s play!
        </PrimaryButton>
      </motion.div>

      <motion.div variants={ITEM} className="w-full pt-4">
        <ExperimentReadouts />
      </motion.div>

      <motion.div variants={ITEM} className="w-full">
        <PersonalBest records={records} variant="compact" />
      </motion.div>
    </motion.div>
  );
}
