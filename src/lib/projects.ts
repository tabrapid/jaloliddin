import { projectRecords } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import type { Project, ProjectRecord } from "@/types/content";

import { localize, localizeAll } from "./localize";

export function resolveProject(record: ProjectRecord, locale: Locale): Project {
  const l = <T,>(value: Record<Locale, T>) => localize(value, locale);
  return {
    slug: record.slug,
    title: record.title,
    order: record.order,
    featured: record.featured,
    status: record.status,
    year: record.year,
    summary: l(record.summary),
    tagline: l(record.tagline),
    role: l(record.role),
    problem: l(record.problem),
    audiences: localizeAll(record.audiences, locale),
    approach: l(record.approach),
    scope: localizeAll(record.scope, locale),
    implemented: localizeAll(record.implemented, locale),
    workflows: record.workflows.map((workflow) => ({
      id: workflow.id,
      audience: l(workflow.audience),
      title: l(workflow.title),
      steps: localizeAll(workflow.steps, locale),
    })),
    architecture: {
      summary: l(record.architecture.summary),
      nodes: record.architecture.nodes.map((node) => ({
        id: node.id,
        tier: node.tier,
        label: l(node.label),
        detail: l(node.detail),
      })),
      edges: record.architecture.edges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        label: edge.label ? l(edge.label) : undefined,
      })),
    },
    tradeoffs: record.tradeoffs.map((item) => ({ title: l(item.title), body: l(item.body) })),
    outcomes: localizeAll(record.outcomes, locale),
    limitations: localizeAll(record.limitations, locale),
    nextSteps: localizeAll(record.nextSteps, locale),
    media:
      record.media.kind === "diagram"
        ? { kind: "diagram", illustration: record.media.illustration, caption: l(record.media.caption) }
        : {
            kind: "screenshot",
            src: record.media.src,
            width: record.media.width,
            height: record.media.height,
            alt: l(record.media.alt),
            caption: l(record.media.caption),
          },
    links: record.links,
    topics: localizeAll(record.topics, locale),
  };
}

const sortedRecords = [...projectRecords].sort((a, b) => a.order - b.order);

export function getProjects(locale: Locale): Project[] {
  return sortedRecords.map((record) => resolveProject(record, locale));
}

export function getProject(slug: string, locale: Locale): Project | undefined {
  const record = sortedRecords.find((item) => item.slug === slug);
  return record ? resolveProject(record, locale) : undefined;
}

export function getProjectSlugs(): string[] {
  return sortedRecords.map((record) => record.slug);
}

/** The project after `slug` in display order, wrapping around. */
export function getNextProject(slug: string, locale: Locale): Project | undefined {
  if (sortedRecords.length < 2) return undefined;
  const index = sortedRecords.findIndex((item) => item.slug === slug);
  const next = sortedRecords[(index + 1) % sortedRecords.length];
  return next ? resolveProject(next, locale) : undefined;
}
