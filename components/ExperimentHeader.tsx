import { cn } from '@/lib/cn';
import { CuteMark } from './CuteMark';
import { SoundToggle } from './SoundToggle';
import { StatusIndicator } from './StatusIndicator';

interface ExperimentHeaderProps {
  statusLabel: string;
  soundOn: boolean;
  onToggleSound: () => void;
  dimmed: boolean;
}

export function ExperimentHeader({
  statusLabel,
  soundOn,
  onToggleSound,
  dimmed,
}: ExperimentHeaderProps) {
  return (
    <header
      className={cn(
        'relative z-10 mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 transition-opacity duration-500 sm:px-8 lg:px-12',
        dimmed && 'opacity-30',
      )}
    >
      <div className="order-1 flex items-center gap-3">
        <CuteMark className="size-11 shrink-0" />
        <div>
          <p className="font-display text-xl font-semibold leading-none text-cocoa sm:text-2xl">
            Memory Sequence
          </p>
          <p className="mt-1 text-[12px] font-semibold text-mute sm:text-[13px]">
            a cozy little memory game
          </p>
        </div>
      </div>

      <div className="order-3 w-full sm:order-2 sm:ml-auto sm:w-auto">
        <StatusIndicator label={statusLabel} />
      </div>

      <div className="order-2 sm:order-3">
        <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
      </div>
    </header>
  );
}
