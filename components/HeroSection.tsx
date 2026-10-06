import { motion, type Variants } from 'motion/react';
import type { PersonalRecords } from '@/lib/types';
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
      <motion.h1
        variants={ITEM}
        className="text-balance text-[clamp(2.1rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-ice"
      >
        CAN YOU REMEMBER THE SEQUENCE?
      </motion.h1>

      <motion.p variants={ITEM} className="max-w-md text-base leading-relaxed text-ice/85 sm:text-lg">
        Test your working memory. Observe carefully. Reproduce precisely.
      </motion.p>

      <motion.p variants={ITEM} className="-mt-2 max-w-md text-sm leading-relaxed text-mute">
        A short cognitive experiment designed to challenge visual working memory.
      </motion.p>

      <motion.div variants={ITEM} className="pt-2">
        <PrimaryButton onClick={onStart} icon="arrow">
          START EXPERIMENT
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
