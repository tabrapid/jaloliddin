import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Stagger } from "@/components/motion/stagger";
import { ProjectPreview, projectPreviewLabels } from "@/features/portfolio/project-preview";
import { StatusBadge } from "@/features/portfolio/status-badge";
import { PageHeader } from "@/features/site/page-header";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizePath } from "@/i18n/paths";
import { getProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import type { ProjectStatus } from "@/types/content";

const statusOrder: ProjectStatus[] = ["concept", "in-development", "prototype", "live"];

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ locale: lang, path: "/work", title: dict.workPage.title, description: dict.workPage.description, siteName: dict.meta.siteName });
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const projects = getProjects(lang);

  return (
    <>
      <PageHeader label={dict.workPage.title} title={dict.workPage.lead} lead={dict.workPage.body} />
      <Section spacing="tight">
        <Container className="grid grid-cols-4 gap-x-6 gap-y-12 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-9">
            <h2 className="text-label flex items-center justify-between text-ink-3">
              <span>{dict.workPage.index}</span>
              <span>{String(projects.length).padStart(2, "0")}</span>
            </h2>
            <ol className="flex flex-col gap-4">
              <Stagger itemAs="li">
                {projects.map((project, index) => (
                  <ProjectPreview
                    key={project.slug}
                    variant="row"
                    headingLevel={3}
                    project={project}
                    href={localizePath(lang, `/work/${project.slug}`)}
                    index={index + 1}
                    statusLabel={dict.project.statusLabels[project.status]}
                    labels={projectPreviewLabels(dict, dict.home.readCaseStudy)}
                  />
                ))}
              </Stagger>
            </ol>
          </div>
          <aside aria-labelledby="status-legend" className="col-span-4 md:col-span-8 lg:col-span-3">
            <div className="flex flex-col gap-5 rounded-lg border border-line p-5 lg:sticky lg:top-28">
              <h2 id="status-legend" className="text-label text-ink-3">
                {dict.workPage.legend}
              </h2>
              <dl className="flex flex-col gap-5">
                {statusOrder.map((status) => (
                  <div key={status} className="flex flex-col gap-2">
                    <dt>
                      <StatusBadge status={status} label={dict.project.statusLabels[status]} />
                    </dt>
                    <dd className="text-small text-ink-3">{dict.project.statusDescriptions[status]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}
