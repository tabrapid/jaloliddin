import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { hasLocale, locales } from "@/i18n/config";
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
    result: "First Degree Diploma · Medical track",
    back: "Explore Bloodchain",
    galleryTitle: "The moment",
    galleryNote:
      "Award documents and event photographs. Images will appear here once the original photo files are added to the repository.",
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
    result: "I darajali diplom · Tibbiyot yo‘nalishi",
    back: "Bloodchain loyihasini ko‘rish",
    galleryTitle: "Unutilmas lahza",
    galleryNote:
      "Diplomlar va festival fotosuratlari. Asl rasm fayllari repository’ga qo‘shilgach, ular shu yerda ko‘rinadi.",
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

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <header className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card p-7 sm:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-amber-400/15 blur-3xl" />
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{text.eyebrow}</p>
        <p className="mt-7 inline-flex rounded-full border border-amber-400/40 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-300">
          {text.result}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{text.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{text.subtitle}</p>
        <p className="mt-8 max-w-3xl text-base leading-8 text-muted-foreground">{text.intro}</p>
      </header>

      <section className="mt-16 grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{text.event}</p>
          <h2 className="mt-3 text-2xl font-semibold">{text.project}</h2>
        </div>
        <p className="text-base leading-8 text-muted-foreground">{text.eventBody}</p>
      </section>

      <section className="mt-12 grid gap-10 border-t border-border/60 pt-12 md:grid-cols-[0.7fr_1.3fr]">
        <h2 className="text-2xl font-semibold">{text.project}</h2>
        <div>
          <p className="text-base leading-8 text-muted-foreground">{text.projectBody}</p>
          <Link className="mt-6 inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted" href={lang === "uz" ? "/uz/work/bloodchain" : "/en/work/bloodchain"}>
            {text.back} ↗
          </Link>
        </div>
      </section>

      <section className="mt-16 border-t border-border/60 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">{text.galleryTitle}</h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{text.galleryNote}</p>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image src="/images/awards/nauka-0-2026/award-medals.jpg" alt="Diplomas and medals from the Nauka 0+ festival" width={1536} height={1153} className="h-auto w-full object-cover" />
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-border/60 bg-muted sm:row-span-2">
            <Image src="/images/awards/nauka-0-2026/award-ceremony.jpg" alt="Award ceremony at the Nauka 0+ festival" width={1152} height={1536} className="h-auto w-full object-cover" />
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image src="/images/awards/nauka-0-2026/festival-stage.jpg" alt="Participants on the festival stage" width={1536} height={1152} className="h-auto w-full object-cover" />
          </figure>
        </div>
      </section>
    </main>
  );
}
