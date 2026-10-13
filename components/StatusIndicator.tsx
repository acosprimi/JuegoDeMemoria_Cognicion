import { HeartDoodle } from './Doodles';

export function StatusIndicator({ label }: { label: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border-2 border-pink bg-paper/80 px-3.5 py-1.5 font-display text-[13px] font-medium text-cocoa shadow-[0_3px_0_#FFC9DD]">
      <span className="relative flex size-4" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-pink/60 motion-reduce:animate-none" />
        <HeartDoodle className="relative size-4 text-rose" />
      </span>
      {label}
    </p>
  );
}
