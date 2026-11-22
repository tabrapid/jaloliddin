import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { MediaFrame } from "@/features/portfolio/media-frame";
import { SystemIllustration } from "@/features/portfolio/system-illustration";
import { LocaleLink } from "@/features/site/locale-link";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale, locales } from "@/i18n/config";
import { getProject } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

const festivalReport = "https://festivalnauki.ru/news/189916/";
const festivalAttendance = "https://festivalnauki.ru/news/189923/";
const festivalProgram = "https://festivalnauki.uz/";

const copy = {
  en: {
    eyebrow: "Nauka 0+ · 2026",
    title: "First place in the medical track",
    subtitle: "Bloodchain · Healthcare technology",
    intro:
      "Bloodchain is a healthcare technology project focused on making blood donation workflows more connected and accessible. At the 2026 Nauka 0+ International Science Festival, the project received a First Degree Diploma in the medical track.",
    event: "Scientists of the Future in Tashkent",
    eventBody: "The competition brought together school students’ research and engineering projects during BRICS+ Open Science Week, held across Uzbekistan from 2 to 8 November 2026. The Tashkent final featured projects from Uzbekistan and Kazakhstan across eight categories. Scientists and university lecturers from both Uzbekistan and Russia served on the scientific jury.",
    scale: "Competition and festival in numbers",
    stats: [
      ["70", "projects selected for the final"],
      ["100+", "students who presented in the final, according to the festival report"],
      ["52", "winning participants across 34 projects"],
      ["35,000+", "participants across the broader science week"],
    ],
    stagesTitle: "From application to award",
    stages: [
      ["By 25 October", "Remote selection", "Applications closed on 25 October. Bloodchain, entry 232 from Arnasay district in Jizzakh Region, passed the remote round and was listed among the projects invited to Tashkent."],
      ["2–6 November", "Regional semifinals", "The festival programme scheduled science days and semifinals at specialised schools in 13 regions, with project exhibitions and science activities."],
      ["7 November", "In-person poster defence", "Finalists presented their work at the Tashkent branch of Lomonosov Moscow State University, 22 Amir Temur Street. They stood by their project posters and answered the jury’s questions. The programme scheduled jury assessment from 11:00 to 13:00."],
      ["8 November", "Awards ceremony", "The winners were recognised at the Tashkent Polytechnic Museum, 13 Amir Temur Street. The scientific jury’s official results list Bloodchain in first place in Medicine, Biotechnology and Health Technologies."],
    ],
    nextRound: "The official calendar schedules a remote superfinal for 15 December 2026.",
    certificate: "Remote-round certificate for Jaloliddin Abdug‘aniyev’s Bloodchain project",
    sources: "Official sources",
    sourceLabels: ["Competition calendar", "Festival programme", "Finalist list and final schedule", "Final report", "Scientific jury results", "Science week attendance"],
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
    event: "Toshkentdagi «Kelajak olimlari» tanlovi",
    eventBody: "Tanlov 2026-yil 2–8-noyabr kunlari O‘zbekiston bo‘ylab o‘tkazilgan BRICS+ Ochiq fan haftaligi doirasida maktab o‘quvchilarining ilmiy tadqiqot va muhandislik loyihalarini bir joyga jamladi. Toshkent finalida O‘zbekiston va Qozog‘istondan sakkiz yo‘nalish bo‘yicha loyihalar qatnashdi. Ilmiy hakamlar hay’ati tarkibida O‘zbekiston va Rossiya olimlari hamda oliygoh o‘qituvchilari bor edi.",
    scale: "Tanlov va festival raqamlarda",
    stats: [
      ["70", "finalga saralangan loyiha"],
      ["100+", "festival hisobotiga ko‘ra, finalda loyiha taqdim etgan o‘quvchi"],
      ["52", "34 ta loyiha bilan g‘olib bo‘lgan ishtirokchi"],
      ["35 000+", "butun Ochiq fan haftaligi tadbirlarida qatnashgan kishi"],
    ],
    stagesTitle: "Arizadan mukofotgacha",
    stages: [
      ["25-oktabrgacha", "Masofaviy saralash", "Arizalar 25-oktabrgacha qabul qilindi. Jizzax viloyatining Arnasoy tumanidan topshirilgan 232-raqamli Bloodchain loyihasi masofaviy bosqichdan o‘tib, Toshkentga taklif qilingan loyihalar ro‘yxatiga kirdi."],
      ["2–6-noyabr", "Hududiy yarim finallar", "Festival dasturiga ko‘ra, 13 hududdagi ixtisoslashtirilgan maktablarda fan kunlari va yarim finallar tashkil etildi. Dasturga loyihalar ko‘rgazmalari va ilmiy tadbirlar kiritilgan edi."],
      ["7-noyabr", "Finalda poster orqali himoya", "Finalchilar loyihalarini M. V. Lomonosov nomidagi Moskva davlat universitetining Toshkent filialida, Amir Temur ko‘chasi 22-uyda taqdim etdilar. Ular o‘z stendlari yonida hakamlarning savollariga javob berishdi. Dasturda hakamlar baholashi uchun 11:00 dan 13:00 gacha vaqt ajratilgan."],
      ["8-noyabr", "Taqdirlash marosimi", "G‘oliblar Amir Temur ko‘chasi 13-uydagi Toshkent politexnika muzeyida taqdirlandi. Ilmiy hakamlar hay’atining rasmiy natijalarida Bloodchain «Tibbiyot, biotexnologiya va sog‘liqni saqlash texnologiyalari» yo‘nalishida 1-o‘rinni egallagan."],
    ],
    nextRound: "Rasmiy taqvimda masofaviy superfinal 2026-yil 15-dekabrga belgilangan.",
    certificate: "Jaloliddin Abdug‘aniyevning Bloodchain loyihasi uchun masofaviy bosqich sertifikati",
    sources: "Rasmiy manbalar",
    sourceLabels: ["Tanlov taqvimi", "Festival dasturi", "Finalchilar ro‘yxati va final dasturi", "Final hisoboti", "Ilmiy hakamlar hay’ati natijalari", "Fan haftaligi qatnashuvi"],
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
  const sourceUrls = [
    "https://ub.festivalnauki.uz/en",
    festivalProgram,
    `https://ub.festivalnauki.uz/2026/invite?lang=${lang}`,
    festivalReport,
    `https://ub.festivalnauki.uz/2026/winners?lang=${lang}`,
    festivalAttendance,
  ];
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

      <section className="mt-14" aria-labelledby="competition">
        <h2 id="competition" className="text-2xl font-semibold">{text.event}</h2>
        <p className="mt-4 max-w-3xl leading-8 text-ink-2">{text.eventBody}</p>
        <h3 className="mt-8 text-lg font-semibold">{text.scale}</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {text.stats.map(([number, label]) => (
            <li key={number} className="rounded-lg border border-line bg-surface p-5">
              <span className="block text-3xl font-semibold text-ink">{number}</span>
              <span className="mt-2 block text-ink-2">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-12" aria-labelledby="competition-stages">
        <h2 id="competition-stages" className="text-2xl font-semibold">{text.stagesTitle}</h2>
        <div className="mt-6 grid items-start gap-8 md:grid-cols-[1.5fr_1fr]">
          <ol className="space-y-6 border-l border-line pl-5">
            {text.stages.map(([date, stage, detail]) => (
              <li key={date}>
                <p className="text-sm text-ink-2">{date}</p>
                <h3 className="mt-1 text-lg font-semibold">{stage}</h3>
                <p className="mt-2 leading-7 text-ink-2">{detail}</p>
              </li>
            ))}
          </ol>
          <figure className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-line">
            <Image
              src="/images/awards/nauka-0-2026/remote-round-certificate.webp"
              alt={text.certificate}
              width={1004}
              height={1400}
              sizes="(min-width: 768px) 384px, 90vw"
              className="h-auto w-full"
            />
            <figcaption className="bg-surface px-4 py-3 text-sm text-ink-2">{text.certificate}</figcaption>
          </figure>
        </div>
        <p className="mt-6 leading-7 text-ink-2">{text.nextRound}</p>
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
      <section className="mt-12 border-t border-line pt-12" aria-labelledby="competition-sources">
        <h2 id="competition-sources" className="text-2xl font-semibold">{text.sources}</h2>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-ink-2">
          {text.sourceLabels.map((label, index) => (
            <li key={label}><a className="underline underline-offset-4 hover:text-ink" href={sourceUrls[index]}>{label}</a></li>
          ))}
        </ul>
      </section>
    </article>
  );
}
