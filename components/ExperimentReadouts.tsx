const READOUTS = [
  { label: 'Game', value: 'Visual memory', tone: 'border-pink bg-blush shadow-[#FFC9DD]' },
  { label: 'Difficulty', value: 'Grows with you', tone: 'border-sun bg-butter/80 shadow-[#FFE27A]' },
  { label: 'Play time', value: 'About 1–3 min', tone: 'border-lilac bg-[#F3ECFF] shadow-[#E0D2FF]' },
  { label: 'How to play', value: 'Copy the order', tone: 'border-ocean bg-[#E4F5FF] shadow-[#A9DBF7]' },
] as const;

export function ExperimentReadouts() {
  return (
    <dl className="grid w-full max-w-md grid-cols-2 gap-3">
      {READOUTS.map((item) => (
        <div
          key={item.label}
          className={`rounded-3xl border-2 px-4 py-3 shadow-[0_4px_0] ${item.tone}`}
        >
          <dt className="text-[12px] font-bold text-mute">{item.label}</dt>
          <dd className="mt-0.5 font-display text-[15px] font-medium text-cocoa">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
