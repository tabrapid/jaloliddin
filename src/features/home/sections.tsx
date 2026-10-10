import { StarMark } from "@/components/graphics/ornament";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { milestones } from "@/content/milestones";
import { profile } from "@/content/profile";
import { ArrayStrip } from "@/features/lab/binary-search/array-strip";
import { createSortedSample, traceBinarySearch } from "@/features/lab/binary-search/algorithm";
import { explainStep } from "@/features/lab/binary-search/explain";
import { ProjectPreview, projectPreviewLabels as previewLabels } from "@/features/portfolio/project-preview";
import { Timeline } from "@/features/portfolio/timeline";
import { ContactList } from "@/features/site/contact-list";
import { LocaleLink } from "@/features/site/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizePath } from "@/i18n/paths";
import { getContactLinks } from "@/lib/contact";
import type { Project } from "@/types/content";

import { SectionHeading } from "./section-heading";

interface SectionProps {
  locale: Locale;
  dict: Dictionary;
}

export function SelectedWork({ locale, dict, projects }: SectionProps & { projects: Project[] }) {
  const [flagship, ...rest] = projects;
  return (
    <Section id="work" aria-labelledby="work-title" className="scroll-mt-16">
      <Container className="flex flex-col gap-16 lg:gap-24">
        <SectionHeading
          id="work-title"
          index="01"
          label={dict.home.workLabel}
          title={dict.home.workTitle}
        />
        {flagship ? (
          <Reveal>
            <ProjectPreview
              project={flagship}
              href={localizePath(locale, `/work/${flagship.slug}`)}
              index={1}
              statusLabel={dict.project.statusLabels[flagship.status]}
              labels={previewLabels(dict, dict.home.readCaseStudy)}
            />
          </Reveal>
        ) : null}
        {rest.length > 0 ? (
          <div className="flex flex-col gap-4">
            <Stagger>
              {rest.map((project, i) => (
                <ProjectPreview
                  key={project.slug}
                  variant="row"
                  project={project}
                  href={localizePath(locale, `/work/${project.slug}`)}
                  index={i + 2}
                  statusLabel={dict.project.statusLabels[project.status]}
                  labels={previewLabels(dict, dict.home.viewProject)}
                />
              ))}
            </Stagger>
            <Button asChild variant="link" className="mt-6 self-start">
              <LocaleLink locale={locale} href="/work">
                {dict.home.allWork}
                <ArrowRightIcon size={18} />
              </LocaleLink>
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

export function AboutIntro({ locale, dict }: SectionProps) {
  return (
    <Section aria-labelledby="about-title" tone="raised" divided>
      <Container className="grid grid-cols-4 gap-x-6 gap-y-10 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8">
        <p className="text-label col-span-4 flex items-center gap-3 text-ink-3 md:col-span-8 lg:col-span-3 lg:pt-3">
          <span className="text-accent-ink">02</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          {dict.home.aboutLabel}
        </p>
        <Reveal className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-8">
          <h2 id="about-title" className="text-display-md font-semibold text-ink">
            {dict.home.aboutTitle}
          </h2>
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="text-lead max-w-[42rem] text-ink-2">{profile.aboutTeaser[locale]}</p>
            <Button asChild variant="secondary" size="lg" className="self-start md:self-end">
              <LocaleLink locale={locale} href="/about">
                {dict.home.aboutCta}
                <ArrowRightIcon size={18} />
              </LocaleLink>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export function Capabilities({ locale, dict }: SectionProps) {
  return (
    <Section aria-labelledby="capabilities-title" tone="blueprint" divided>
      <Container className="flex flex-col gap-14 lg:gap-20">
        <SectionHeading id="capabilities-title" index="03" label={dict.home.capabilitiesLabel} title={dict.home.capabilitiesTitle} />
        <ol className="grid grid-cols-1 border-t border-line-strong md:grid-cols-2">
          <Stagger itemAs="li" itemClassName="border-b border-line md:odd:border-r md:[&:nth-child(odd)]:pr-10 md:[&:nth-child(even)]:pl-10">
            {profile.capabilities.map((capability, index) => (
              <article key={capability.id} className="flex h-full flex-col gap-5 py-9">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-label text-accent-ink">{String(index + 1).padStart(2, "0")}</span>
                  <StarMark size={12} className="text-ink-3" />
                </div>
                <h3 className="text-heading font-semibold text-ink">{capability.title[locale]}</h3>
                <p className="max-w-[34rem] text-ink-2">{capability.body[locale]}</p>
                <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 font-mono text-[0.8125rem] text-ink-3">
                  <span className="text-label">{dict.home.capabilityContext}</span>
                  {capability.href ? (
                    <LocaleLink
                      locale={locale}
                      href={capability.href}
                      className="rounded-xs text-ink-2 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-accent-ink"
                    >
                      {capability.context[locale]}
                    </LocaleLink>
                  ) : (
                    <span className="text-ink-2">{capability.context[locale]}</span>
                  )}
                </p>
              </article>
            ))}
          </Stagger>
        </ol>
      </Container>
    </Section>
  );
}

export function LabPreview({ locale, dict }: SectionProps) {
  const array = createSortedSample(11, 12);
  const trace = traceBinarySearch(array, array[1]!);
  const step = trace.steps[2] ?? trace.steps[0]!;

  return (
    <Section aria-labelledby="lab-title" divided>
      <Container className="grid grid-cols-4 items-center gap-x-6 gap-y-12 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="col-span-4 flex flex-col gap-7 md:col-span-8 lg:col-span-5">
          <p className="text-label flex items-center gap-3 text-ink-3">
            <span className="text-accent-ink">04</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            {dict.home.labLabel}
          </p>
          <h2 id="lab-title" className="text-display-md font-semibold text-ink">
            {dict.home.labTitle}
          </h2>
          <p className="text-lead text-ink-2">{dict.home.labBody}</p>
          <Button asChild size="lg" className="self-start">
            <LocaleLink locale={locale} href="/lab/binary-search">
              {dict.home.labCta}
              <ArrowRightIcon size={18} />
            </LocaleLink>
          </Button>
        </div>
        <Reveal className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <div className="relative overflow-hidden rounded-lg border border-line bg-canvas-deep p-5 shadow-raised sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <span className="text-label text-ink-3">{dict.binarySearch.title}</span>
              <span className="text-label text-accent-ink">
                {step.kind === "compare" ? `mid = ${step.mid}` : ""}
              </span>
            </div>
            <ArrayStrip
              array={array}
              step={step}
              compact
              labels={{
                low: dict.binarySearch.pointerLow,
                mid: dict.binarySearch.pointerMid,
                high: dict.binarySearch.pointerHigh,
                index: dict.binarySearch.index,
              }}
            />
            <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5">
              <p className="font-mono text-[0.8125rem] text-accent-glow">target = {trace.target}</p>
              <p className="text-small text-ink-2">{explainStep(step, trace.target, dict.binarySearch)}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export function Milestones({ locale, dict }: SectionProps) {
  if (milestones.length === 0) return null;
  return (
    <Section aria-labelledby="milestones-title" divided>
      <Container className="flex flex-col gap-12">
        <SectionHeading id="milestones-title" index="05" label={dict.home.milestonesLabel} title={dict.home.milestonesTitle} />
        <Timeline
          className="lg:ml-[25%]"
          items={milestones.map((item, index) => ({
            id: `${item.date}-${index}`,
            marker: item.date,
            title: item.title[locale],
            body: item.detail?.[locale],
          }))}
        />
      </Container>
    </Section>
  );
}

export function ContactBand({ locale, dict }: SectionProps) {
  const links = getContactLinks();
  return (
    <Section aria-labelledby="contact-title" tone="deep" divided className="overflow-hidden">
      <Container className="relative flex flex-col gap-12">
        <p className="text-label flex items-center gap-3 text-ink-3">
          <span className="text-accent-ink">{milestones.length > 0 ? "06" : "05"}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          {dict.home.contactLabel}
        </p>
        <h2 id="contact-title" className="text-display-lg max-w-[18ch] font-semibold text-ink">
          {dict.home.contactTitle}
        </h2>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <p className="text-lead text-ink-2">{dict.contactPage.lead}</p>
            <Button asChild variant="secondary" size="lg" className="self-start">
              <LocaleLink locale={locale} href="/contact">
                {dict.home.contactCta}
                <ArrowRightIcon size={18} />
              </LocaleLink>
            </Button>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {links.length > 0 ? (
              <ContactList links={links} dict={dict} />
            ) : (
              <p className="border-t border-line pt-6 text-ink-3">{dict.contactPage.emptyBody}</p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
