import type { Localized } from "@/types/content";

/**
 * Personal content. Everything here must be true and confirmed by Jaloliddin.
 * Missing facts belong in CONTENT_TODO.md, not in this file.
 */

export interface Capability {
  id: string;
  title: Localized;
  body: Localized;
  /** Where the capability is visible on this site. */
  context: Localized;
  /** Optional internal path backing the claim, e.g. "/work/bloodchain". */
  href?: string;
}

export interface AboutChapter {
  id: string;
  label: Localized;
  title: Localized;
  body: Localized;
}

export const profile = {
  name: "Jaloliddin",
  role: { en: "Student developer", uz: "Talaba dasturchi" } satisfies Localized,
  country: { en: "Uzbekistan", uz: "Oʻzbekiston" } satisfies Localized,

  heroStatement: {
    en: "Ideas, formed into systems.",
    uz: "Gʻoyalarni tizimga aylantiraman.",
  } satisfies Localized,

  heroIntro: {
    en: "I’m a student developer from Uzbekistan with a creative-school background. I study algorithms, design backend systems and build products meant to be useful, starting with Bloodchain, a platform for blood donation.",
    uz: "Men ijodiy maktabda tahsil olgan Oʻzbekistonlik talaba dasturchiman. Algoritmlarni oʻrganaman, backend tizimlarni loyihalayman va foydali boʻlishi kerak boʻlgan mahsulotlar yarataman. Ularning eng asosiysi — qon topshirish platformasi Bloodchain.",
  } satisfies Localized,

  aboutTeaser: {
    en: "My background is in a creative school, where I learned to look closely, edit hard and care about how things feel. Today I put that attention into software: competitive programming problems, backend architecture and products like Bloodchain. I’m also drawn to artificial intelligence, mathematics and physics, fields where a clear model explains a lot.",
    uz: "Men ijodiy maktabda tahsil olganman. U yerda diqqat bilan qarashni, ortiqchasini olib tashlashni va narsalar qanday his qilinishiga eʼtibor berishni oʻrgandim. Bugun shu eʼtiborni dasturiy taʼminotga qarataman: sport dasturlash masalalari, backend arxitekturasi va Bloodchain kabi mahsulotlar. Sunʼiy intellekt, matematika va fizika ham meni qiziqtiradi — bu sohalarda aniq model koʻp narsani tushuntirib beradi.",
  } satisfies Localized,

  interests: [
    { en: "Software engineering and building useful products", uz: "Dasturiy injiniring va foydali mahsulotlar yaratish" },
    { en: "Competitive programming and algorithms", uz: "Sport dasturlash va algoritmlar" },
    { en: "Backend systems and architecture", uz: "Backend tizimlar va arxitektura" },
    { en: "Artificial intelligence", uz: "Sunʼiy intellekt" },
    { en: "Mathematics and physics", uz: "Matematika va fizika" },
  ] satisfies Localized[],

  capabilities: [
    {
      id: "systems",
      title: { en: "Backend systems & architecture", uz: "Backend tizimlar va arxitektura" },
      body: {
        en: "Modelling workflows that involve several parties: donors, hospitals and blood centers in Bloodchain; students, teachers and administrators in the school platform concept.",
        uz: "Bir nechta tomon ishtirok etadigan jarayonlarni modellashtirish: Bloodchain’da donorlar, shifoxonalar va qon markazlari; maktab platformasi konsepsiyasida oʻquvchilar, oʻqituvchilar va maʼmuriyat.",
      },
      context: { en: "Bloodchain · School platform", uz: "Bloodchain · Maktab platformasi" },
      href: "/work/bloodchain",
    },
    {
      id: "algorithms",
      title: { en: "Algorithms & problem solving", uz: "Algoritmlar va masala yechish" },
      body: {
        en: "Competitive programming practice: reasoning about correctness, complexity and edge cases before writing code.",
        uz: "Sport dasturlash amaliyoti: kod yozishdan oldin toʻgʻrilik, murakkablik va chegaraviy holatlar haqida oʻylash.",
      },
      context: { en: "Lab · Binary search visualizer", uz: "Laboratoriya · Ikkilik qidiruv" },
      href: "/lab/binary-search",
    },
    {
      id: "design",
      title: { en: "Product & interface design", uz: "Mahsulot va interfeys dizayni" },
      body: {
        en: "A creative-school eye for hierarchy, composition and detail, applied to interfaces and to this site’s own component system.",
        uz: "Ijodiy maktabdan kelgan ierarxiya, kompozitsiya va detallarga eʼtibor — interfeyslarda va shu saytning komponentlar tizimida.",
      },
      context: { en: "This website", uz: "Shu sayt" },
    },
    {
      id: "learning",
      title: { en: "AI, mathematics & physics", uz: "Sunʼiy intellekt, matematika va fizika" },
      body: {
        en: "Areas I’m actively studying. I’m interested in models that explain the world, and in the mathematics that makes them work.",
        uz: "Faol oʻrganayotgan sohalarim. Dunyoni tushuntiradigan modellar va ularni ishlatadigan matematika meni qiziqtiradi.",
      },
      context: { en: "Learning direction", uz: "Oʻrganish yoʻnalishi" },
      href: "/about",
    },
  ] satisfies Capability[],

  aboutLead: {
    en: "I’m Jaloliddin, a student and developer from Uzbekistan. I came to software from a creative school, and I still think like one.",
    uz: "Men Jaloliddin — Oʻzbekistonlik talaba va dasturchiman. Dasturlashga ijodiy maktabdan kelganman va hamon shunday fikrlayman.",
  } satisfies Localized,

  aboutChapters: [
    {
      id: "origin",
      label: { en: "Where I started", uz: "Qayerdan boshlaganman" },
      title: { en: "A creative school taught me to see structure.", uz: "Ijodiy maktab tuzilishni koʻrishni oʻrgatdi." },
      body: {
        en: "Drawing, composition and critique trained me to notice what to emphasise, what to remove and how the parts relate to the whole. Those questions turned out to be just as useful in software.",
        uz: "Rasm chizish, kompozitsiya va tanqidiy muhokama nimaga urgʻu berish, nimani olib tashlash va qismlar butun bilan qanday bogʻlanishini sezishga oʻrgatdi. Bu savollar dasturlashda ham xuddi shunday foydali ekan.",
      },
    },
    {
      id: "build",
      label: { en: "What I build", uz: "Nima yarataman" },
      title: { en: "I care most about the parts you don’t see first.", uz: "Meni birinchi navbatda koʻrinmaydigan qismlar qiziqtiradi." },
      body: {
        en: "Data models, workflows and the architecture that keeps a system understandable as it grows. Bloodchain is where I’m putting this into practice: one platform serving donors, hospitals and blood centers.",
        uz: "Maʼlumotlar modeli, jarayonlar va tizim oʻsgan sari uni tushunarli saqlaydigan arxitektura. Buni Bloodchain’da amalda qoʻllayapman: donorlar, shifoxonalar va qon markazlariga xizmat qiladigan yagona platforma.",
      },
    },
    {
      id: "practice",
      label: { en: "How I practise", uz: "Qanday mashq qilaman" },
      title: { en: "Competitive programming keeps the fundamentals sharp.", uz: "Sport dasturlash asoslarni charxlab turadi." },
      body: {
        en: "It demands precise thinking about correctness, complexity and edge cases, habits that carry straight over into everyday engineering.",
        uz: "U toʻgʻrilik, murakkablik va chegaraviy holatlar haqida aniq fikrlashni talab qiladi. Bu odatlar kundalik muhandislik ishiga bevosita oʻtadi.",
      },
    },
    {
      id: "direction",
      label: { en: "Where I’m heading", uz: "Qayerga intilaman" },
      title: { en: "Toward AI, mathematics and physics.", uz: "Sunʼiy intellekt, matematika va fizika sari." },
      body: {
        en: "I’m drawn to fields where a good model explains a lot. I want to understand them deeply and build systems that use those ideas responsibly.",
        uz: "Meni yaxshi model koʻp narsani tushuntira oladigan sohalar qiziqtiradi. Ularni chuqur tushunishni va bu gʻoyalardan masʼuliyat bilan foydalanadigan tizimlar yaratishni xohlayman.",
      },
    },
  ] satisfies AboutChapter[],

  principles: [
    {
      title: { en: "Structure before surface", uz: "Avval tuzilish, keyin koʻrinish" },
      body: {
        en: "Understand the workflow and the data first. The interface follows from them.",
        uz: "Avval jarayon va maʼlumotlarni tushunish kerak. Interfeys ulardan kelib chiqadi.",
      },
    },
    {
      title: { en: "Honest scope", uz: "Halol qamrov" },
      body: {
        en: "Say clearly what exists, what is planned and what is still an open question.",
        uz: "Nima mavjud, nima rejalashtirilgan va nima hali ochiq savol ekanini aniq aytish.",
      },
    },
    {
      title: { en: "Make it explainable", uz: "Tushuntirib boʻladigan qilish" },
      body: {
        en: "If I can’t explain a system simply, I don’t understand it well enough yet.",
        uz: "Agar tizimni oddiy qilib tushuntira olmasam, demak uni hali yetarlicha tushunmayman.",
      },
    },
  ] satisfies { title: Localized; body: Localized }[],
};
