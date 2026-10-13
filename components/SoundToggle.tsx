import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label="Sound effects"
      className={`wobble-hover inline-flex min-h-10 items-center gap-2 rounded-full border-2 px-3.5 font-display text-[13px] font-medium text-cocoa shadow-[0_3px_0] transition-colors ${
        enabled
          ? 'border-sun bg-butter shadow-[#FFE27A]'
          : 'border-lilac bg-paper/80 shadow-[#E9DEFF]'
      }`}
    >
      {enabled ? (
        <Volume2 className="size-4 text-[#E8A21F]" aria-hidden="true" />
      ) : (
        <VolumeX className="size-4 text-grape" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{enabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
