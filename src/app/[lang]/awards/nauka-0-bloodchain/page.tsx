import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MediaFrame } from "@/features/portfolio/media-frame";
import { SystemIllustration } from "@/features/portfolio/system-illustration";
import { LocaleLink } from "@/features/site/locale-link";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale, locales } from "@/i18n/config";
import { getProject } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

const copy = {
  en: {
    eyebrow: "Nauka 0+ · 2026",
    title: "First place in the medical track",
    subtitle: "Bloodchain · Healthcare technology",
    intro:
      "Bloodchain is a healthcare technology project focused on making blood donation workflows more connected and accessible. At the 2026 Nauka 0+ International Science Festival, the project received a First Degree Diploma in the medical track.",
    event: "The achievement",
    eventBody:
      "The award recognizes the Bloodchain project at the Nauka 0+ International Science Festival, held as part of the BRICS+ Open Science Week in Uzbekistan in November 2026.",
    project: "A project with a human purpose",
    projectBody:
      "Bloodchain is being designed to connect donors, healthcare institutions, and blood services through clearer donation workflows, donor discovery, and emergency coordination. The project is being developed with the needs and realities of Uzbekistan in mind.",
    workflows: "How a donation would be coordinated",
    statusLabel: "Project status",
    result: "First Degree Diploma · Medical track",
    back: "Explore Bloodchain",
  },
  uz: {
    eyebrow: "НАУКА 0+ · 2026",
    title: "Tibbiyot yo‘nalishida birinchi o‘rin",
    subtitle: "Bloodchain · Tibbiyot texnologiyalari",
    intro:
      "Bloodchain — qon donorligi jarayonlarini o‘zaro bog‘lash va ulardan foydalanishni qulaylashtirishga qaratilgan tibbiy texnologiya loyihasi. 2026-yilgi НАУКА 0+ xalqaro fan festivalida loyiha tibbiyot yo‘nalishida I darajali diplom bilan taqdirlandi.",
    event: "Yutuq haqida",
    eventBody:
      "Ushbu mukofot Bloodchain loyihasi uchun O‘zbekistonda 2026-yil noyabr oyida BRICS+ Ochiq fan haftaligi doirasida o‘tkazilgan НАУКА 0+ xalqaro fan festivalida berildi.",
    project: "Insonlar uchun yaratilayotgan loyiha",
    projectBody:
      "Bloodchain donorlar, tibbiyot muassasalari va qon xizmatlarini donorlik jarayonlari, donorlarni topish hamda favqulodda vaziyatlarda muvofiqlashtirish orqali bog‘lashni maqsad qiladi. Loyiha O‘zbekiston sharoitlari va ehtiyojlarini hisobga olgan holda ishlab chiqilmoqda.",
    workflows: "Qon topshirish qanday tashkil etiladi",
    statusLabel: "Loyiha holati",
    result: "I darajali diplom · Tibbiyot yo‘nalishi",
    back: "Bloodchain loyihasini ko‘rish",
  },
} as const;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/awards/nauka-0-bloodchain">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const text = copy[lang];
  return pageMetadata({
    locale: lang,
    path: "/awards/nauka-0-bloodchain",
    title: text.title,
    description: text.intro,
    siteName: "Jaloliddin",
    type: "article",
  });
}

export default async function NaukaAwardPage({
  params,
}: PageProps<"/[lang]/awards/nauka-0-bloodchain">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const text = copy[lang];
  const dict = await getDictionary(lang);
  const project = getProject("bloodchain", lang);
  if (!project) notFound();
  const donorWorkflows = project.workflows.filter(({ id }) => id === "book" || id === "respond");

  return (
    <article className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <LocaleLink locale={lang} href="/writing" className="mb-6 inline-block text-ink-2 hover:underline">
        ← {dict.writingPage.backToWriting}
      </LocaleLink>
      <header className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-7 sm:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-amber-400/15 blur-3xl" />
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-2">{text.eyebrow}</p>
        <p className="mt-7 inline-flex rounded-full border border-amber-400/40 px-3 py-1.5 text-xs font-medium text-amber-300">
          {text.result}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{text.title}</h1>
        <p className="mt-4 text-lg text-ink-2">{text.subtitle}</p>
        <p className="mt-8 max-w-3xl text-base leading-8 text-ink-2">{text.intro}</p>
      </header>

      <section className="mt-16 grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <h2 className="text-2xl font-semibold">{text.event}</h2>
        </div>
        <p className="text-base leading-8 text-ink-2">{text.eventBody}</p>
      </section>

      <section className="mt-12 grid gap-10 border-t border-line pt-12 md:grid-cols-[0.7fr_1.3fr]">
        <h2 className="text-2xl font-semibold">{text.project}</h2>
        <div>
          <p className="text-base leading-8 text-ink-2">{text.projectBody}</p>
          <p className="mt-4 text-base leading-8 text-ink-2">{project.problem}</p>
          <dl className="mt-4 flex flex-wrap gap-x-2 text-sm text-ink-2">
            <dt className="font-semibold text-ink">{text.statusLabel}</dt>
            <dd>{dict.project.statusLabels[project.status]}</dd>
          </dl>
          <LocaleLink locale={lang} className="mt-6 inline-flex rounded-full border border-line-strong px-5 py-3 text-sm font-medium transition hover:bg-surface" href="/work/bloodchain">
            {text.back} ↗
          </LocaleLink>
        </div>
      </section>

      {project.media.kind === "diagram" && (
        <div className="mt-10">
          <MediaFrame label={dict.project.illustrationLabel} caption={project.media.caption} ratio="16/10">
            <SystemIllustration project={project} tierLabels={dict.project.diagram} />
          </MediaFrame>
        </div>
      )}

      <section className="mt-12 border-t border-line pt-12" aria-labelledby="donation-workflows">
        <h2 id="donation-workflows" className="text-2xl font-semibold">{text.workflows}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {donorWorkflows.map(({ id, title, steps }) => (
            <div key={id} className="rounded-lg border border-line bg-surface p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-2">
                {steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
