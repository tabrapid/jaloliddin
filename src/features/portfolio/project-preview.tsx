import Link from "next/link";

import { HoverSurface } from "@/components/motion/hover-surface";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Project } from "@/types/content";

import { MediaFrame } from "./media-frame";
import { ProjectMeta } from "./project-meta";
import { StatusBadge } from "./status-badge";
import { SystemIllustration } from "./system-illustration";

export interface ProjectPreviewLabels {
  status: string;
  role: string;
  audience: string;
  flagship: string;
  cta: string;
  illustrationLabel: string;
  illustrationNote: string;
  tiers: { clients: string; core: string; data: string };
}

/** Builds preview labels from the dictionary. */
export function projectPreviewLabels(dict: Dictionary, cta: string): ProjectPreviewLabels {
  return {
    status: dict.project.status,
    role: dict.project.role,
    audience: dict.project.audience,
    flagship: dict.home.flagship,
    cta,
    illustrationLabel: dict.project.illustrationLabel,
    illustrationNote: dict.project.illustrationNote,
    tiers: dict.project.diagram,
  };
}

export interface ProjectPreviewProps {
  project: Project;
  href: string;
  index: number;
  statusLabel: string;
  labels: ProjectPreviewLabels;
  variant?: "feature" | "row";
  headingLevel?: 2 | 3;
}

/**
 * Project teaser. The title link is stretched over the whole card so the
 * card is one click target with one accessible name (no duplicate links).
 */
export function ProjectPreview({ project, href, index, statusLabel, labels, variant = "feature", headingLevel = 3 }: ProjectPreviewProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const number = String(index).padStart(2, "0");

  if (variant === "row") {
    return (
      <HoverSurface lift={false} className="rounded-lg">
        <article className="relative grid grid-cols-4 items-start gap-x-6 gap-y-4 rounded-lg border border-line px-5 py-6 transition-colors duration-300 group-hover/hover:border-line-strong md:grid-cols-8 md:items-center lg:grid-cols-12 lg:px-8 lg:py-8">
          <span className="text-label col-span-1 pt-1 text-ink-3 md:pt-0">{number}</span>
          <div className="col-span-3 flex flex-col gap-2 md:col-span-4 lg:col-span-6">
            <Heading className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-ink lg:text-[2.25rem]">
              <Link href={href} className="rounded-xs after:absolute after:inset-0 after:rounded-lg after:content-['']">
                {project.title}
              </Link>
            </Heading>
            <p className="text-ink-2">{project.tagline}</p>
          </div>
          <div className="col-span-3 col-start-2 flex flex-wrap gap-2 md:col-span-2 md:col-start-auto lg:col-span-4">
            <StatusBadge status={project.status} label={statusLabel} />
            {project.topics.slice(0, 2).map((topic) => (
              <Badge key={topic} tone="neutral" className="hidden lg:inline-flex">
                {topic}
              </Badge>
            ))}
          </div>
          <span
            aria-hidden="true"
            className="col-span-1 hidden size-11 items-center justify-center justify-self-end rounded-pill border border-line-strong text-ink-2 transition-[transform,color,border-color] duration-300 ease-out-expo group-hover/hover:translate-x-1 group-hover/hover:border-accent group-hover/hover:text-ink md:inline-flex"
          >
            <ArrowUpRightIcon size={18} />
          </span>
        </article>
      </HoverSurface>
    );
  }

  return (
    <HoverSurface className="rounded-lg">
      <article className="relative grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <MediaFrame label={labels.illustrationLabel} note={labels.illustrationNote} ratio="16/10">
            {project.media.kind === "diagram" ? (
              <SystemIllustration project={project} tierLabels={labels.tiers} />
            ) : null}
          </MediaFrame>
        </div>
        <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-5 lg:pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label mr-2 text-ink-3">{number}</span>
            {project.featured ? <Badge tone="neutral">{labels.flagship}</Badge> : null}
            <StatusBadge status={project.status} label={statusLabel} />
          </div>
          <Heading className="text-display-md font-semibold text-ink">
            <Link href={href} className="rounded-xs after:absolute after:inset-0 after:rounded-lg after:content-['']">
              {project.title}
            </Link>
          </Heading>
          <p className="text-lead text-ink">{project.tagline}</p>
          <p className="text-ink-2">{project.summary}</p>
          <ProjectMeta
            items={[
              { label: labels.role, value: project.role },
              { label: labels.audience, value: project.audiences.join(" · ") },
            ]}
          />
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center gap-2 self-start font-medium text-ink",
              "underline decoration-line-strong underline-offset-[0.3em] transition-colors group-hover/hover:decoration-accent-ink",
            )}
          >
            {labels.cta}
            <ArrowRightIcon size={18} className="transition-transform duration-300 ease-out-expo group-hover/hover:translate-x-1" />
          </span>
        </div>
      </article>
    </HoverSurface>
  );
}
