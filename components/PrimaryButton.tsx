import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ButtonIcon = 'arrow' | 'replay' | 'back';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
  icon?: ButtonIcon;
  autoFocus?: boolean;
}

function ButtonIconGlyph({ icon }: { icon: ButtonIcon }) {
  switch (icon) {
    case 'arrow':
      return (
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
          aria-hidden="true"
        />
      );
    case 'replay':
      return (
        <RotateCcw
          className="size-4 transition-transform duration-500 group-hover:-rotate-180"
          aria-hidden="true"
        />
      );
    case 'back':
      return (
        <ArrowLeft
          className="size-4 transition-transform duration-300 group-hover:-translate-x-1.5"
          aria-hidden="true"
        />
      );
  }
}

export function PrimaryButton({
  children,
  onClick,
  variant = 'primary',
  icon,
  autoFocus,
}: PrimaryButtonProps) {
  const primary = variant === 'primary';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      autoFocus={autoFocus}
      whileHover={{ y: -3, rotate: -1.5 }}
      whileTap={{ scale: 0.95, y: 3 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      className={cn(
        'group relative inline-flex min-h-[3.5rem] items-center justify-center rounded-full border-[3px] px-8 py-3 font-display text-lg font-semibold text-cocoa',
        primary
          ? 'btn-bounce border-[#E8639A] bg-gradient-to-b from-[#FFB3CF] to-[#FF8CB5] shadow-[0_6px_0_#E8639A]'
          : 'border-lilac bg-paper shadow-[0_6px_0_#CDB8FA]',
      )}
    >
      {primary && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 right-5 top-1.5 h-2 rounded-full bg-white/50"
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon && <ButtonIconGlyph icon={icon} />}
      </span>
    </motion.button>
  );
}
