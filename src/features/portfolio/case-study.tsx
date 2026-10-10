import { StarMark } from "@/components/graphics/ornament";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { TextEntrance } from "@/components/motion/text-entrance";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocaleLink } from "@/features/site/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Project } from "@/types/content";

import { ArchitectureDiagram } from "./architecture-diagram";
import { CaseStudySection } from "./case-study-section";
import { MediaFrame } from "./media-frame";
import { ProjectMeta } from "./project-meta";
import { StatusBadge } from "./status-badge";
import { SystemIllustration } from "./system-illustration";
import { Timeline } from "./timeline";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-ink-2">
          <StarMark size={12} className="mt-[0.45em] shrink-0 text-accent-ink" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export interface CaseStudyProps {
  project: Project;
  index: number;
  next?: Project;
  locale: Locale;
  dict: Dictionary;
}

/**
 * Reusable case-study template. Every section is driven by the project
 * record; optional sections (outcomes, next steps, links) only render when
 * they contain verified content.
 */
export function CaseStudy({ project, index, next, locale, dict }: CaseStudyProps) {
  const t = dict.project;
  const audiences = [...new Set(project.workflows.map((workflow) => workflow.audience))];
  const links = [
    project.links.repository ? { href: project.links.repository, label: t.repository } : null,
    project.links.live ? { href: project.links.live, label: t.live } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  const sections = [
    { id: "problem", title: t.problem, show: true },
    { id: "approach", title: t.approach, show: true },
    { id: "scope", title: t.scope, show: true },
    { id: "workflows", title: t.workflows, show: project.workflows.length > 0 },
    { id: "architecture", title: t.architecture, show: true },
    { id: "considerations", title: t.tradeoffs, show: project.tradeoffs.length > 0 },
    { id: "outcomes", title: t.outcomes, show: project.outcomes.length > 0 },
    { id: "limitations", title: t.limitations, show: project.limitations.length > 0 || project.nextSteps.length > 0 },
    { id: "links", title: t.links, show: links.length > 0 },
  ].filter((section) => section.show);
  const number = (id: string) => String(sections.findIndex((section) => section.id === id) + 1).padStart(2, "0");

  return (
    <article aria-labelledby="project-title">
      <header className="atmosphere relative border-b border-line">
        <Container className="flex flex-col gap-10 pt-14 pb-12 lg:pt-20">
          <nav aria-label={dict.a11y.breadcrumb}>
            <ol className="text-label flex flex-wrap items-center gap-2 text-ink-3">
              <li>
                <LocaleLink locale={locale} href="/work" className="rounded-xs hover:text-ink">
                  {dict.nav.work}
                </LocaleLink>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-accent-ink">
                {String(index).padStart(2, "0")} · {project.title}
              </li>
            </ol>
          </nav>
          <div className="grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8">
            <h1 id="project-title" className="text-display-xl col-span-4 font-bold text-ink md:col-span-8 lg:col-span-12">
              <TextEntrance text={project.title} />
            </h1>
            <p className="entrance-settle text-lead col-span-4 text-ink md:col-span-6 lg:col-span-6" style={{ ["--entrance-delay" as string]: 250 }}>
              {project.tagline}
            </p>
            <div className="col-span-4 flex flex-wrap content-start gap-2 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:justify-end">
              {project.featured ? <Badge>{dict.home.flagship}</Badge> : null}
              {project.topics.map((topic) => (
                <Badge key={topic} tone="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          <ProjectMeta
            columns={3}
            items={[
              {
                label: t.status,
                value: (
                  <span className="flex flex-col gap-2">
                    <StatusBadge status={project.status} label={t.statusLabels[project.status]} />
                    <span className="text-small text-ink-3">{t.statusDescriptions[project.status]}</span>
                  </span>
                ),
              },
              { label: t.role, value: project.role },
              { label: t.audience, value: project.audiences.join(" · ") },
              ...(project.year ? [{ label: t.year, value: project.year }] : []),
            ]}
          />
        </Container>
      </header>

      <Container className="py-12 lg:py-16">
        <Reveal>
          {project.media.kind === "diagram" ? (
            <MediaFrame label={t.illustrationLabel} note={t.illustrationNote} caption={project.media.caption} ratio="16/10">
              <SystemIllustration project={project} tierLabels={t.diagram} />
            </MediaFrame>
          ) : (
            <MediaFrame caption={project.media.caption} ratio="16/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- dimensions reserved by the frame */}
              <img src={project.media.src} alt={project.media.alt} width={project.media.width} height={project.media.height} className="h-full w-full object-cover" />
            </MediaFrame>
          )}
        </Reveal>

        <nav aria-label={t.contents} className="mt-12 flex flex-col gap-3 border-t border-line pt-6">
          <h2 className="text-label text-ink-3">{t.contents}</h2>
          <ol className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-line px-3.5 text-small text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                >
                  <span className="font-mono text-[0.6875rem] text-ink-3">{number(section.id)}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Container>

      <Container className="flex flex-col gap-20 pb-section lg:gap-28">
        <CaseStudySection id="problem" index={number("problem")} title={t.problem}>
          <div className="flex flex-col gap-8">
            <p className="text-lead text-ink">{project.problem}</p>
            <div className="flex flex-col gap-3">
              <h3 className="text-label text-ink-3">{t.audience}</h3>
              <ul className="flex flex-wrap gap-2">
                {project.audiences.map((audience) => (
                  <li key={audience}>
                    <Badge tone="neutral">{audience}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CaseStudySection>

        <CaseStudySection id="approach" index={number("approach")} title={t.approach}>
          <p className="text-lead text-ink">{project.approach}</p>
        </CaseStudySection>

        <CaseStudySection id="scope" index={number("scope")} title={t.scope} note={t.scopeNote}>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h3 className="text-label text-ink-3">{t.scope}</h3>
              <BulletList items={project.scope} />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-label text-ink-3">{t.implemented}</h3>
              {project.implemented.length > 0 ? (
                <BulletList items={project.implemented} />
              ) : (
                <p className="rounded-md border border-dashed border-line-strong p-4 text-small text-ink-3" data-testid="implemented-empty">
                  {t.implementedEmpty}
                </p>
              )}
            </div>
          </div>
        </CaseStudySection>

        {project.workflows.length > 0 ? (
          <CaseStudySection id="workflows" index={number("workflows")} title={t.workflows} note={t.workflowsNote}>
            <Tabs defaultValue={audiences[0]}>
              <TabsList aria-label={t.workflows}>
                {audiences.map((audience) => (
                  <TabsTrigger key={audience} value={audience}>
                    {audience}
                  </TabsTrigger>
                ))}
              </TabsList>
              {audiences.map((audience) => (
                <TabsContent key={audience} value={audience}>
                  <div className="grid gap-10 md:grid-cols-2">
                    {project.workflows
                      .filter((workflow) => workflow.audience === audience)
                      .map((workflow) => (
                        <div key={workflow.id} className="flex flex-col gap-5">
                          <h3 className="font-semibold text-ink">{workflow.title}</h3>
                          <Timeline items={workflow.steps.map((step, i) => ({ id: `${workflow.id}-${i}`, title: step }))} />
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CaseStudySection>
        ) : null}

        <CaseStudySection id="architecture" index={number("architecture")} title={t.architecture} note={t.architectureNote}>
          <div className="flex flex-col gap-6">
            <p className="text-ink-2">{project.architecture.summary}</p>
            <ArchitectureDiagram architecture={project.architecture} labels={t.diagram} />
          </div>
        </CaseStudySection>

        {project.tradeoffs.length > 0 ? (
          <CaseStudySection id="considerations" index={number("considerations")} title={t.tradeoffs} note={t.tradeoffsNote}>
            <Accordion type="multiple" className="border-t border-line">
              {project.tradeoffs.map((item, i) => (
                <AccordionItem key={item.title} value={`item-${i}`}>
                  <AccordionTrigger leading={String(i + 1).padStart(2, "0")}>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CaseStudySection>
        ) : null}

        {project.outcomes.length > 0 ? (
          <CaseStudySection id="outcomes" index={number("outcomes")} title={t.outcomes}>
            <BulletList items={project.outcomes} />
          </CaseStudySection>
        ) : null}

        {project.limitations.length > 0 || project.nextSteps.length > 0 ? (
          <CaseStudySection id="limitations" index={number("limitations")} title={t.limitations}>
            <div className="grid gap-10 md:grid-cols-2">
              {project.limitations.length > 0 ? <BulletList items={project.limitations} /> : null}
              {project.nextSteps.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <h3 className="text-label text-ink-3">{t.nextSteps}</h3>
                  <BulletList items={project.nextSteps} />
                </div>
              ) : null}
            </div>
          </CaseStudySection>
        ) : null}

        {links.length > 0 ? (
          <CaseStudySection id="links" index={number("links")} title={t.links}>
            <ul className="flex flex-wrap gap-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Button asChild variant="secondary">
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <ArrowUpRightIcon size={16} />
                      <span className="sr-only">({dict.a11y.opensInNewTab})</span>
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </CaseStudySection>
        ) : null}

        <footer className="flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="link">
            <LocaleLink locale={locale} href="/work">
              <ArrowLeftIcon size={18} />
              {t.backToWork}
            </LocaleLink>
          </Button>
          {next ? (
            <LocaleLink
              locale={locale}
              href={`/work/${next.slug}`}
              className="group flex flex-col items-start gap-1 rounded-md sm:items-end"
            >
              <span className="text-label text-ink-3">{t.nextProject}</span>
              <span className="flex items-center gap-2 text-heading font-semibold text-ink transition-colors group-hover:text-accent-glow">
                {next.title}
                <ArrowRightIcon size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </LocaleLink>
          ) : null}
        </footer>
      </Container>
    </article>
  );
}
