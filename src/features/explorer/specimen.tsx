import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/cn";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface SpecimenProps {
  id: string;
  title: string;
  /** Import path shown under the title. */
  source: string;
  /** "portable" = plain React; "next" = depends on Next.js; "site" = uses site content. */
  portability: "portable" | "next" | "site";
  description: string;
  children: ReactNode;
  code: string;
  props?: PropRow[];
  a11y?: string[];
  /** Preview background. */
  surface?: "canvas" | "deep" | "blueprint";
}

const portabilityLabel = { portable: "Portable React", next: "Needs Next.js", site: "Site-specific" };

/** One documented component: live preview, usage snippet, props and a11y notes. */
export function Specimen({ id, title, source, portability, description, children, code, props, a11y, surface = "canvas" }: SpecimenProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8 border-t border-line pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 id={`${id}-title`} className="text-heading font-semibold text-ink">
          {title}
        </h3>
        <Badge tone={portability === "portable" ? "success" : portability === "next" ? "accent" : "outline"}>
          {portabilityLabel[portability]}
        </Badge>
      </div>
      <p className="mt-1 font-mono text-[0.8125rem] text-ink-3">{source}</p>
      <p className="mt-4 max-w-[60ch] text-ink-2">{description}</p>

      <div
        className={cn(
          "mt-6 rounded-lg border border-line p-6 sm:p-8",
          surface === "deep" ? "bg-canvas-deep" : surface === "blueprint" ? "blueprint bg-canvas-deep" : "bg-canvas",
        )}
      >
        {children}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-line bg-canvas-deep">
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="text-label text-ink-3">Usage</span>
          <CopyButton value={code} variant="ghost" labels={{ copy: "Copy", copied: "Copied", error: "Copy failed" }} srContext={`${title} snippet`} />
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed text-ink-2">
          <code>{code}</code>
        </pre>
      </div>

      {props && props.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[36rem] border-collapse text-left text-small">
            <caption className="sr-only">{title} props</caption>
            <thead className="text-label text-ink-3">
              <tr className="border-b border-line">
                <th scope="col" className="px-4 py-3 font-medium">Prop</th>
                <th scope="col" className="px-4 py-3 font-medium">Type</th>
                <th scope="col" className="px-4 py-3 font-medium">Default</th>
                <th scope="col" className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map((row) => (
                <tr key={row.name} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-accent-glow">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-ink-2">{row.type}</td>
                  <td className="px-4 py-3 font-mono text-ink-3">{row.default ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-2">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {a11y && a11y.length > 0 ? (
        <div className="mt-4 rounded-lg border border-line p-4">
          <h4 className="text-label text-ink-3">Accessibility</h4>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-small text-ink-2 marker:text-accent-ink">
            {a11y.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
