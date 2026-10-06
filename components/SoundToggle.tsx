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
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-hairline bg-panel/60 px-3.5 font-mono text-[11px] tracking-[0.16em] text-ice/90 backdrop-blur transition-colors hover:border-signal/50 hover:text-ice"
    >
      {enabled ? (
        <Volume2 className="size-4 text-signal" aria-hidden="true" />
      ) : (
        <VolumeX className="size-4 text-mute" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{enabled ? 'SOUND ON' : 'SOUND OFF'}</span>
    </button>
  );
}
