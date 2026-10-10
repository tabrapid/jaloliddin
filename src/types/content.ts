import type { Locale } from "@/i18n/config";

/** A value authored once per supported locale. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Honest project lifecycle labels. Only use a status you can back up:
 * - concept: idea and scope are defined; no implementation claims.
 * - in-development: actively being built; scope is not fully implemented.
 * - prototype: a working prototype exists; not production-ready.
 * - live: publicly available (requires a configured live link).
 */
export type ProjectStatus = "concept" | "in-development" | "prototype" | "live";

export interface ProjectWorkflow {
  id: string;
  /** Who the workflow serves, e.g. "Donors". */
  audience: Localized;
  title: Localized;
  steps: Localized[];
}

export interface ProjectTradeoff {
  title: Localized;
  body: Localized;
}

export interface ArchitectureNode {
  id: string;
  label: Localized;
  detail: Localized;
  /** Column in the conceptual diagram: clients → core → data/integrations. */
  tier: "client" | "core" | "data";
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: Localized;
}

export interface ProjectArchitecture {
  summary: Localized;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export type ProjectMedia =
  | {
      kind: "diagram";
      /** Key of a registered conceptual illustration component. */
      illustration: "bloodchain-system" | "school-platform-system";
      caption: Localized;
    }
  | {
      kind: "screenshot";
      src: string;
      width: number;
      height: number;
      alt: Localized;
      caption: Localized;
    };

export interface ProjectLinks {
  /** Only set when the repository is public and verified. */
  repository?: string;
  /** Only set when the project is actually deployed. */
  live?: string;
}

export interface ProjectRecord {
  slug: string;
  title: string;
  order: number;
  featured: boolean;
  status: ProjectStatus;
  /** Optional verified year; omit rather than guess. */
  year?: string;
  summary: Localized;
  tagline: Localized;
  role: Localized;
  problem: Localized;
  audiences: Localized[];
  approach: Localized;
  /** What the project is designed to cover. Not a claim of completion. */
  scope: Localized[];
  /** Functionality verified as implemented. Empty until confirmed. */
  implemented: Localized[];
  workflows: ProjectWorkflow[];
  architecture: ProjectArchitecture;
  tradeoffs: ProjectTradeoff[];
  /** Verified outcomes only (no invented metrics). */
  outcomes: Localized[];
  limitations: Localized[];
  nextSteps: Localized[];
  media: ProjectMedia;
  links: ProjectLinks;
  /** Short topic labels; describe domains, not unverified tech stacks. */
  topics: Localized[];
}

/** A project resolved for one locale — what components receive. */
export interface Project {
  slug: string;
  title: string;
  order: number;
  featured: boolean;
  status: ProjectStatus;
  year?: string;
  summary: string;
  tagline: string;
  role: string;
  problem: string;
  audiences: string[];
  approach: string;
  scope: string[];
  implemented: string[];
  workflows: { id: string; audience: string; title: string; steps: string[] }[];
  architecture: {
    summary: string;
    nodes: { id: string; label: string; detail: string; tier: ArchitectureNode["tier"] }[];
    edges: { from: string; to: string; label?: string }[];
  };
  tradeoffs: { title: string; body: string }[];
  outcomes: string[];
  limitations: string[];
  nextSteps: string[];
  media:
    | { kind: "diagram"; illustration: Extract<ProjectMedia, { kind: "diagram" }>["illustration"]; caption: string }
    | { kind: "screenshot"; src: string; width: number; height: number; alt: string; caption: string };
  links: ProjectLinks;
  topics: string[];
}

export interface Milestone {
  /** ISO date or year, only when verified. */
  date: string;
  title: Localized;
  detail?: Localized;
  href?: string;
}

export interface ArticleFrontmatter {
  title: string;
  summary: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  tags: string[];
  draft: boolean;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  locale: Locale;
  readingMinutes: number;
}

export interface Article extends ArticleMeta {
  html: string;
}
