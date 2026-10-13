import type { CSSProperties, ReactNode } from 'react';

interface DoodleProps {
  className?: string;
  style?: CSSProperties;
  /** Fill colour. Defaults to currentColor. */
  fill?: string;
  /** Optional outline colour for a sticker look. */
  stroke?: string;
}

const OUTLINE = { strokeWidth: 1.4, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

function Svg({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function HeartDoodle({ className, style, fill = 'currentColor', stroke }: DoodleProps) {
  return (
    <Svg className={className} style={style}>
      <path
        d="M12 21C5 15.6 2.4 11.9 2.4 8.4C2.4 5.6 4.5 3.5 7.1 3.5C9.2 3.5 11 4.7 12 6.6C13 4.7 14.8 3.5 16.9 3.5C19.5 3.5 21.6 5.6 21.6 8.4C21.6 11.9 19 15.6 12 21Z"
        fill={fill}
        stroke={stroke}
        {...OUTLINE}
      />
    </Svg>
  );
}

export function StarDoodle({ className, style, fill = 'currentColor', stroke }: DoodleProps) {
  return (
    <Svg className={className} style={style}>
      <path
        d="M12 2.6L14.7 8.6L21.2 9.3L16.3 13.7L17.7 20.1L12 16.8L6.3 20.1L7.7 13.7L2.8 9.3L9.3 8.6Z"
        fill={fill}
        stroke={stroke ?? fill}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SparkleDoodle({ className, style, fill = 'currentColor' }: DoodleProps) {
  return (
    <Svg className={className} style={style}>
      <path
        d="M12 2C12.8 8 16 11.2 22 12C16 12.8 12.8 16 12 22C11.2 16 8 12.8 2 12C8 11.2 11.2 8 12 2Z"
        fill={fill}
      />
    </Svg>
  );
}

export function FlowerDoodle({
  className,
  style,
  fill = 'currentColor',
  center = '#FFE27A',
}: DoodleProps & { center?: string }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <Svg className={className} style={style}>
      {petals.map((angle) => (
        <circle
          key={angle}
          cx="12"
          cy="6.6"
          r="4.1"
          fill={fill}
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="3.3" fill={center} />
    </Svg>
  );
}

export function CloudDoodle({ className, style, fill = 'currentColor' }: DoodleProps) {
  return (
    <Svg className={className} style={style}>
      <path
        d="M6.6 19.2A4.4 4.4 0 0 1 6 10.5A6.2 6.2 0 0 1 17.7 9A5 5 0 0 1 17.6 19.2Z"
        fill={fill}
      />
    </Svg>
  );
}

export function PawDoodle({ className, style, fill = 'currentColor' }: DoodleProps) {
  return (
    <Svg className={className} style={style}>
      <ellipse cx="12" cy="16" rx="5" ry="4.2" fill={fill} />
      <ellipse cx="5.6" cy="11" rx="2" ry="2.6" fill={fill} />
      <ellipse cx="9.4" cy="6.6" rx="2" ry="2.7" fill={fill} />
      <ellipse cx="14.6" cy="6.6" rx="2" ry="2.7" fill={fill} />
      <ellipse cx="18.4" cy="11" rx="2" ry="2.6" fill={fill} />
    </Svg>
  );
}
