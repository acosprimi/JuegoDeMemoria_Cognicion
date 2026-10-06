import type { CSSProperties } from 'react';
import {
  NEURAL_EDGES,
  NEURAL_NODES,
  NEURAL_SIGNALS,
  NEURAL_VIEWBOX,
} from '@/lib/neural-data';

/** Static network drawn from simple data. Pulses and glows are CSS-only. */
export function NeuralNetwork() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${NEURAL_VIEWBOX.width} ${NEURAL_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="neural-glow-gradient">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g stroke="rgba(56,189,248,0.11)" strokeWidth="1">
        {NEURAL_EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NEURAL_NODES[a].x}
            y1={NEURAL_NODES[a].y}
            x2={NEURAL_NODES[b].x}
            y2={NEURAL_NODES[b].y}
          />
        ))}
      </g>

      <g fill="none" stroke="rgba(103,232,249,0.85)" strokeWidth="1.5" strokeLinecap="round">
        {NEURAL_SIGNALS.map((signal) => (
          <line
            key={`${signal.from}-${signal.to}`}
            className="neural-signal"
            pathLength={100}
            x1={NEURAL_NODES[signal.from].x}
            y1={NEURAL_NODES[signal.from].y}
            x2={NEURAL_NODES[signal.to].x}
            y2={NEURAL_NODES[signal.to].y}
            style={
              {
                '--signal-duration': `${signal.duration}s`,
                '--signal-delay': `${signal.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </g>

      <g>
        {NEURAL_NODES.map((node, index) => (
          <g key={index}>
            {node.glow && (
              <circle
                className="neural-glow"
                cx={node.x}
                cy={node.y}
                r={node.r * 7}
                fill="url(#neural-glow-gradient)"
                style={{ animationDelay: `${node.glowDelay}s` }}
              />
            )}
            <circle cx={node.x} cy={node.y} r={node.r} fill="rgba(125,211,252,0.4)" />
          </g>
        ))}
      </g>
    </svg>
  );
}
