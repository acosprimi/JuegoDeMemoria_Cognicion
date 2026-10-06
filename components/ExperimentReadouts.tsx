const READOUTS = [
  { label: 'EXPERIMENT', value: 'VISUAL MEMORY' },
  { label: 'DIFFICULTY', value: 'ADAPTIVE' },
  { label: 'SESSION', value: '~ 1–3 MIN' },
  { label: 'MODE', value: 'SEQUENTIAL RECALL' },
] as const;

export function ExperimentReadouts() {
  return (
    <dl className="grid w-full max-w-md grid-cols-2 gap-x-8 gap-y-5">
      {READOUTS.map((item) => (
        <div key={item.label} className="border-t border-hairline pt-3">
          <dt className="text-[10px] tracking-[0.22em] text-mute sm:text-[11px]">{item.label}</dt>
          <dd className="mt-1 font-mono text-[13px] tracking-wide text-ice">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
