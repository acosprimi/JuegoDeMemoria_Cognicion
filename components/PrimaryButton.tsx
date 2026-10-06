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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className="group relative inline-flex min-h-[3.25rem] items-center justify-center rounded-full px-8 py-3.5 text-[13px] font-semibold tracking-[0.2em] text-ice"
    >
      {primary && (
        <span
          aria-hidden="true"
          className="btn-glow absolute -inset-1.5 rounded-full bg-signal/25 opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 rounded-full',
          primary ? 'bg-gradient-to-r from-signal via-azure to-pulse' : 'bg-hairline',
        )}
      />
      <span
        aria-hidden="true"
        className="absolute inset-px rounded-full bg-void transition-colors duration-300 group-hover:bg-panel"
      />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {icon && <ButtonIconGlyph icon={icon} />}
      </span>
    </motion.button>
  );
}
