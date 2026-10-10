import { khatamPath } from "@/components/graphics/ornament";
import type { Project } from "@/types/content";

/**
 * Conceptual system illustration generated from a project's architecture
 * data. It reads top to bottom: client applications → the shared core (with
 * its modules in orbit) → records. Deliberately schematic so it can never be
 * mistaken for a product screenshot; frames using it are labelled.
 * The precise node-to-node connections live in <ArchitectureDiagram>.
 */

const W = 800;
const H = 500;
const CORE = { x: 400, y: 262, r: 50 };
const CLIENT_Y = 112;
const DATA_Y = 424;

type Node = Project["architecture"]["nodes"][number];

function spread(count: number, center: number, gap: number): number[] {
  return Array.from({ length: count }, (_, i) => center + (i - (count - 1) / 2) * gap);
}

const f = (n: number) => n.toFixed(1);

export interface SystemIllustrationProps {
  project: Pick<Project, "title" | "architecture">;
  /** Tier names drawn on the right-hand rail. */
  tierLabels: { clients: string; core: string; data: string };
}

export function SystemIllustration({ project, tierLabels }: SystemIllustrationProps) {
  const uid = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const nodes = project.architecture.nodes;
  const clients = nodes.filter((n) => n.tier === "client");
  const modules = nodes.filter((n) => n.tier === "core");
  const records = nodes.filter((n) => n.tier === "data");

  const clientX = spread(clients.length, CORE.x, clients.length > 2 ? 250 : 360);
  const recordX = spread(records.length, CORE.x, records.length > 2 ? 232 : 300);
  const moduleAngles = [Math.PI, 0, Math.PI * 0.86, Math.PI * 0.14];
  const modulePos = modules.map((_, i) => {
    const a = moduleAngles[i] ?? (i / modules.length) * Math.PI * 2;
    return { x: CORE.x + Math.cos(a) * 178, y: CORE.y + Math.sin(a) * 58 };
  });

  const inbound = clientX.map(
    (x) => `M${f(x)} ${CLIENT_Y + 36}C${f(x)} ${CLIENT_Y + 92} ${CORE.x} ${CORE.y - 112} ${CORE.x} ${CORE.y - CORE.r}`,
  );
  const outbound = recordX.map(
    (x) => `M${CORE.x} ${CORE.y + CORE.r}C${CORE.x} ${CORE.y + 104} ${f(x)} ${DATA_Y - 76} ${f(x)} ${DATA_Y - 22}`,
  );
  const flows = [...inbound, ...outbound];

  const label = (node: Node) => node.label;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`grid-${uid}`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="var(--silver-dim)" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
        <radialGradient id={`core-glow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#grid-${uid})`} />
      <circle cx={CORE.x} cy={CORE.y} r="210" fill={`url(#core-glow-${uid})`} opacity="0.45" />

      {/* Tier rail */}
      <g className="font-mono" fontSize="10.5" letterSpacing="1.4" fill="var(--ink-3)" textAnchor="end">
        <text x={W - 20} y={CLIENT_Y + 4}>{tierLabels.clients.toUpperCase()}</text>
        <text x={W - 20} y={CORE.y + 4}>{tierLabels.core.toUpperCase()}</text>
        <text x={W - 20} y={DATA_Y + 4}>{tierLabels.data.toUpperCase()}</text>
      </g>
      <g stroke="var(--line)" strokeDasharray="1 5">
        <line x1="40" x2={W - 110} y1={CORE.y} y2={CORE.y} />
      </g>

      {/* Orbit with modules */}
      <ellipse cx={CORE.x} cy={CORE.y} rx="178" ry="58" fill="none" stroke="var(--silver-dim)" strokeOpacity="0.3" strokeDasharray="2 6" />

      {/* Flows: clients → core → records */}
      <g fill="none" stroke="var(--accent-ink)" strokeOpacity="0.55" strokeWidth="1.3">
        {flows.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round">
        {flows.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1000}
            className="hero-pulse motion-decor"
            style={{ animationDelay: `${-i * 1.3}s`, animationDuration: "5s" }}
          />
        ))}
      </g>

      {/* Core: khatam star */}
      <g transform={`translate(${CORE.x} ${CORE.y})`}>
        <path d={khatamPath(CORE.r, 0, 0, 0.72)} fill="var(--canvas-deep)" stroke="var(--accent-glow)" strokeWidth="1.4" />
        <path d={khatamPath(28, 0, 0, 0.72, Math.PI / 8)} fill="none" stroke="var(--accent-ink)" strokeOpacity="0.7" />
        <circle r="4" fill="var(--ink)" />
      </g>

      {modules.map((node, i) => {
        const p = modulePos[i]!;
        return (
          <g key={node.id} transform={`translate(${f(p.x)} ${f(p.y)})`}>
            <circle r="8" fill="var(--canvas-deep)" stroke="var(--accent-glow)" strokeWidth="1.5" />
            <circle r="3" fill="var(--accent-glow)" />
            <text y="30" textAnchor="middle" fontSize="13.5" fill="var(--ink-2)" className="font-mono">
              {label(node)}
            </text>
          </g>
        );
      })}

      {clients.map((node, i) => (
        <g key={node.id} transform={`translate(${f(clientX[i]!)} ${CLIENT_Y})`}>
          <rect x="-118" y="-36" width="236" height="72" rx="8" fill="var(--raised)" stroke="var(--line-strong)" />
          <text y="-4" textAnchor="middle" fontSize="17" fontWeight="600" fill="var(--ink)" className="font-sans">
            {label(node)}
          </text>
          <text y="17" textAnchor="middle" fontSize="10" fill="var(--ink-3)" className="font-mono">
            {node.detail}
          </text>
        </g>
      ))}

      {records.map((node, i) => (
        <g key={node.id} transform={`translate(${f(recordX[i]!)} ${DATA_Y})`}>
          <rect x="-104" y="-22" width="208" height="44" rx="22" fill="var(--canvas-deep)" stroke="var(--silver-dim)" strokeOpacity="0.55" />
          <text y="5" textAnchor="middle" fontSize="13" fill="var(--ink-2)" className="font-mono">
            {label(node)}
          </text>
        </g>
      ))}
    </svg>
  );
}
