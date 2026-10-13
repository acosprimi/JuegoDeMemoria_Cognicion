import type { CSSProperties, ReactElement } from 'react';
import { cn } from '@/lib/cn';
import { createRng } from '@/lib/seeded-random';
import {
  CloudDoodle,
  FlowerDoodle,
  HeartDoodle,
  PawDoodle,
  SparkleDoodle,
  StarDoodle,
} from './Doodles';

interface SweetBackgroundProps {
  /** Softens the decorations during play so they never compete with the board. */
  calm: boolean;
}

type Kind = 'heart' | 'star' | 'flower' | 'sparkle' | 'paw';

interface Floaty {
  kind: Kind;
  color: string;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  twinkle: boolean;
}

const KINDS: Kind[] = ['heart', 'star', 'flower', 'sparkle', 'heart', 'flower', 'paw', 'star'];
const COLORS = ['#FFB7D2', '#FFE27A', '#DCCBFF', '#BFE4FA', '#CDF3E1', '#FFC9A8'];
const round1 = (value: number) => Math.round(value * 10) / 10;

function buildFloaties(): Floaty[] {
  const rng = createRng(2024);
  return Array.from({ length: 22 }, (_, i) => {
    const kind = KINDS[i % KINDS.length];
    return {
      kind,
      color: COLORS[Math.floor(rng() * COLORS.length)],
      left: round1(rng() * 100),
      top: round1(rng() * 100),
      size: round1(14 + rng() * 22),
      duration: round1(7 + rng() * 8),
      delay: -round1(rng() * 10),
      opacity: Math.round((0.5 + rng() * 0.4) * 100) / 100,
      twinkle: kind === 'sparkle' || kind === 'star',
    };
  });
}

const FLOATIES = buildFloaties();

const CLOUDS = [
  { top: 3, left: 40, width: 150, color: '#FFFFFF', duration: 70, delay: 0, opacity: 0.95 },
  { top: 46, left: -3, width: 110, color: '#FFFFFF', duration: 55, delay: -20, opacity: 0.9 },
  { top: 86, left: 36, width: 130, color: '#FFFFFF', duration: 64, delay: -35, opacity: 0.85 },
  { top: 10, left: 86, width: 140, color: '#FFFFFF', duration: 80, delay: -10, opacity: 0.9 },
];

function Decoration({ kind, color }: { kind: Kind; color: string }): ReactElement {
  const className = 'size-full';
  switch (kind) {
    case 'heart':
      return <HeartDoodle className={className} fill={color} />;
    case 'star':
      return <StarDoodle className={className} fill={color} />;
    case 'flower':
      return <FlowerDoodle className={className} fill={color} center="#FFF1A8" />;
    case 'paw':
      return <PawDoodle className={className} fill={color} />;
    default:
      return <SparkleDoodle className={className} fill={color} />;
  }
}

export function SweetBackground({ calm }: SweetBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF3F8 0%, #FFF8EC 45%, #FFF6DE 100%)' }}
    >
      <div
        className="ambient-glow absolute -left-[16%] -top-[26%] h-[70vmax] w-[70vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,183,210,0.45), transparent)' }}
      />
      <div
        className="ambient-glow-alt absolute -bottom-[30%] -right-[18%] h-[75vmax] w-[75vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(220,203,255,0.5), transparent)' }}
      />
      <div
        className="absolute left-[55%] top-[-18%] h-[50vmax] w-[50vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(201,234,255,0.5), transparent)' }}
      />
      <div
        className="absolute -left-[10%] bottom-[-22%] h-[48vmax] w-[48vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,241,168,0.55), transparent)' }}
      />

      <div className="bg-polka absolute inset-0" />

      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          calm ? 'opacity-50' : 'opacity-100',
        )}
      >
        {CLOUDS.map((cloud, index) => (
          <div
            key={index}
            className="cloud-drift absolute"
            style={
              {
                top: `${cloud.top}%`,
                left: `${cloud.left}%`,
                width: cloud.width,
                opacity: cloud.opacity,
                '--float-duration': `${cloud.duration}s`,
                '--float-delay': `${cloud.delay}s`,
              } as CSSProperties
            }
          >
            <CloudDoodle className="w-full drop-shadow-[0_6px_0_rgba(201,234,255,0.7)]" fill={cloud.color} />
          </div>
        ))}

        {FLOATIES.map((item, index) => (
          <div
            key={index}
            className={cn('absolute', item.twinkle ? 'twinkle' : 'floaty')}
            style={
              {
                left: `${item.left}%`,
                top: `${item.top}%`,
                width: item.size,
                height: item.size,
                opacity: item.opacity,
                '--float-duration': `${item.duration}s`,
                '--float-delay': `${item.delay}s`,
              } as CSSProperties
            }
          >
            <Decoration kind={item.kind} color={item.color} />
          </div>
        ))}
      </div>

      {/* Rolling pastel hills along the bottom. */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[16vh] w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d="M0 120C150 60 300 70 450 110C600 150 750 70 900 80C1050 90 1130 120 1200 100V200H0Z" fill="#FFE6EF" opacity="0.8" />
        <path d="M0 150C200 110 340 120 520 150C700 180 860 120 1020 125C1100 128 1160 140 1200 150V200H0Z" fill="#E9F7EE" opacity="0.9" />
      </svg>
    </div>
  );
}
