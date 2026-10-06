export function StatusIndicator({ label }: { label: string }) {
  return (
    <p className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-ice/85">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-signal" />
      </span>
      {label}
    </p>
  );
}
