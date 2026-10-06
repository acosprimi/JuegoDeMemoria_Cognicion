import { createRng } from './seeded-random';

export interface NeuralNode {
  x: number;
  y: number;
  r: number;
  glow: boolean;
  glowDelay: number;
}

export type NeuralEdge = readonly [number, number];

export interface NeuralSignal {
  from: number;
  to: number;
  duration: number;
  delay: number;
}

export const NEURAL_VIEWBOX = { width: 1200, height: 720 } as const;

const COLUMNS = 8;
const ROWS = 5;
const SIGNAL_COUNT = 7;
const NEIGHBORS_PER_NODE = 2;

/** Jittered grid of nodes. Deterministic, so server and client agree. */
function buildNodes(): NeuralNode[] {
  const rng = createRng(20260611);
  const cellWidth = NEURAL_VIEWBOX.width / COLUMNS;
  const cellHeight = NEURAL_VIEWBOX.height / ROWS;

  return Array.from({ length: COLUMNS * ROWS }, (_, index) => {
    const column = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);
    const x = Math.round((column + 0.5) * cellWidth + (rng() - 0.5) * cellWidth * 0.7);
    const y = Math.round((row + 0.5) * cellHeight + (rng() - 0.5) * cellHeight * 0.7);
    const r = Math.round((1.4 + rng() * 1.6) * 10) / 10;
    const glow = rng() < 0.16;
    const glowDelay = Math.round(rng() * 80) / 10;
    return { x, y, r, glow, glowDelay };
  });
}

/** Connects every node to its nearest neighbors. */
function buildEdges(nodes: readonly NeuralNode[]): NeuralEdge[] {
  const seen = new Set<string>();
  const edges: NeuralEdge[] = [];

  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, distance: (other.x - node.x) ** 2 + (other.y - node.y) ** 2 }))
      .filter((candidate) => candidate.j !== i)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, NEIGHBORS_PER_NODE)
      .forEach(({ j }) => {
        const low = Math.min(i, j);
        const high = Math.max(i, j);
        const key = `${low}-${high}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([low, high]);
        }
      });
  });

  return edges;
}

function buildSignals(edges: readonly NeuralEdge[]): NeuralSignal[] {
  const stride = Math.max(1, Math.floor(edges.length / SIGNAL_COUNT));
  return edges
    .filter((_, index) => index % stride === 0)
    .slice(0, SIGNAL_COUNT)
    .map(([from, to], k) => ({
      from,
      to,
      duration: 5 + (k % 4) * 1.3,
      delay: k * 1.7,
    }));
}

export const NEURAL_NODES: readonly NeuralNode[] = buildNodes();
export const NEURAL_EDGES: readonly NeuralEdge[] = buildEdges(NEURAL_NODES);
export const NEURAL_SIGNALS: readonly NeuralSignal[] = buildSignals(NEURAL_EDGES);
