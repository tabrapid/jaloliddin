import type { Project } from "@/types/content";

import { cn } from "@/lib/cn";

type Architecture = Project["architecture"];

export interface ArchitectureDiagramProps {
  architecture: Architecture;
  labels: { clients: string; core: string; data: string; connectsTo: string };
  className?: string;
}

const tiers = ["client", "core", "data"] as const;

/**
 * Dense, readable architecture view: three tiers as columns, each node with
 * its responsibility, and its outgoing connections listed beneath it.
 * Plain HTML, so it reflows on mobile and reads well with a screen reader.
 */
export function ArchitectureDiagram({ architecture, labels, className }: ArchitectureDiagramProps) {
  const labelFor = new Map(architecture.nodes.map((node) => [node.id, node.label]));
  const names = { client: labels.clients, core: labels.core, data: labels.data };

  return (
    <div className={cn("blueprint grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3", className)}>
      {tiers.map((tier, tierIndex) => (
        <div key={tier} className="flex flex-col gap-4 bg-canvas-deep/95 p-5">
          <h3 className="text-label flex items-center gap-2 text-ink-3">
            <span className="text-accent-ink">{String(tierIndex + 1).padStart(2, "0")}</span>
            {names[tier]}
          </h3>
          <ul className="flex flex-col gap-3">
            {architecture.nodes
              .filter((node) => node.tier === tier)
              .map((node) => {
                const targets = architecture.edges.filter((edge) => edge.from === node.id);
                return (
                  <li key={node.id} className="rounded-md border border-line-strong bg-raised p-4">
                    <p className="font-semibold text-ink">{node.label}</p>
                    <p className="mt-1 font-mono text-[0.8125rem] text-ink-3">{node.detail}</p>
                    {targets.length > 0 ? (
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={labels.connectsTo}>
                        {targets.map((edge) => (
                          <li
                            key={edge.to}
                            className="inline-flex items-center gap-1 rounded-pill border border-line px-2 py-0.5 font-mono text-[0.75rem] text-accent-glow"
                          >
                            <span aria-hidden="true">→</span> {labelFor.get(edge.to)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}
