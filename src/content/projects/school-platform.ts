import type { ProjectRecord } from "@/types/content";

/** School platform — a concept. Keep the status "concept" until work exists. */
export const schoolPlatform: ProjectRecord = {
  slug: "school-platform",
  title: "School platform",
  order: 2,
  featured: false,
  status: "concept",
  tagline: {
    en: "Portfolios, online tests and administration for one school, in one place.",
    uz: "Bitta maktab uchun portfoliolar, onlayn testlar va boshqaruv — bir joyda.",
  },
  summary: {
    en: "A school platform concept that brings student and teacher portfolios, online tests and school administration together.",
    uz: "Oʻquvchi va oʻqituvchi portfoliolari, onlayn testlar va maktab boshqaruvini birlashtiradigan maktab platformasi konsepsiyasi.",
  },
  role: {
    en: "Creator · concept and system design",
    uz: "Muallif · konsepsiya va tizim dizayni",
  },
  problem: {
    en: "Student work, test results and administrative tasks often live in separate places: paper folders, messaging apps and spreadsheets. That makes it hard to follow a student’s progress or to show what they have achieved.",
    uz: "Oʻquvchilar ishlari, test natijalari va maʼmuriy vazifalar koʻpincha turli joylarda saqlanadi: qogʻoz papkalar, messenjerlar va jadvallar. Bu oʻquvchining rivojini kuzatish yoki yutuqlarini koʻrsatishni qiyinlashtiradi.",
  },
  audiences: [
    { en: "Students", uz: "Oʻquvchilar" },
    { en: "Teachers", uz: "Oʻqituvchilar" },
    { en: "School administrators", uz: "Maktab maʼmuriyati" },
  ],
  approach: {
    en: "Organise the platform around three areas that share one account and role system: portfolios for students and teachers, online tests, and tools for administration.",
    uz: "Platformani yagona hisob va rollar tizimiga tayanadigan uch yoʻnalish atrofida qurish: oʻquvchi va oʻqituvchilar portfoliosi, onlayn testlar va boshqaruv vositalari.",
  },
  scope: [
    { en: "Student and teacher portfolios.", uz: "Oʻquvchi va oʻqituvchi portfoliolari." },
    { en: "Online tests.", uz: "Onlayn testlar." },
    { en: "School administration.", uz: "Maktab boshqaruvi." },
  ],
  implemented: [],
  workflows: [
    {
      id: "portfolio",
      audience: { en: "Students", uz: "Oʻquvchilar" },
      title: { en: "Build a portfolio", uz: "Portfolio yaratish" },
      steps: [
        { en: "Add projects and achievements.", uz: "Loyiha va yutuqlarni qoʻshish." },
        { en: "Choose what is visible and to whom.", uz: "Nima va kimga koʻrinishini tanlash." },
      ],
    },
    {
      id: "test",
      audience: { en: "Teachers", uz: "Oʻqituvchilar" },
      title: { en: "Run an online test", uz: "Onlayn test oʻtkazish" },
      steps: [
        { en: "Prepare questions.", uz: "Savollarni tayyorlash." },
        { en: "Assign the test to a class.", uz: "Testni sinfga biriktirish." },
        { en: "Review the results.", uz: "Natijalarni koʻrib chiqish." },
      ],
    },
    {
      id: "admin",
      audience: { en: "Administrators", uz: "Maʼmuriyat" },
      title: { en: "Manage the school", uz: "Maktabni boshqarish" },
      steps: [
        { en: "Organise classes, teachers and students.", uz: "Sinflar, oʻqituvchilar va oʻquvchilarni tartiblash." },
        { en: "Manage roles and access.", uz: "Rollar va kirish huquqlarini boshqarish." },
      ],
    },
  ],
  architecture: {
    summary: {
      en: "One account and role system underpins every area, so a student, a teacher and an administrator each see the parts that are relevant to them.",
      uz: "Barcha yoʻnalishlar yagona hisob va rollar tizimiga tayanadi, shu sababli oʻquvchi, oʻqituvchi va maʼmuriyat har biri oʻziga tegishli qismlarni koʻradi.",
    },
    nodes: [
      {
        id: "portal",
        tier: "client",
        label: { en: "Student & teacher portal", uz: "Oʻquvchi va oʻqituvchi portali" },
        detail: { en: "Portfolios and tests", uz: "Portfoliolar va testlar" },
      },
      {
        id: "admin",
        tier: "client",
        label: { en: "Admin console", uz: "Boshqaruv paneli" },
        detail: { en: "Classes, people, roles", uz: "Sinflar, odamlar, rollar" },
      },
      {
        id: "portfolios",
        tier: "core",
        label: { en: "Portfolios", uz: "Portfoliolar" },
        detail: { en: "Work and achievements", uz: "Ishlar va yutuqlar" },
      },
      {
        id: "testing",
        tier: "core",
        label: { en: "Online tests", uz: "Onlayn testlar" },
        detail: { en: "Questions, attempts, results", uz: "Savollar, urinishlar, natijalar" },
      },
      {
        id: "accounts",
        tier: "data",
        label: { en: "Accounts & roles", uz: "Hisoblar va rollar" },
        detail: { en: "Who can see what", uz: "Kim nimani koʻra oladi" },
      },
    ],
    edges: [
      { from: "portal", to: "portfolios" },
      { from: "portal", to: "testing" },
      { from: "admin", to: "testing" },
      { from: "admin", to: "accounts" },
      { from: "portfolios", to: "accounts" },
      { from: "testing", to: "accounts" },
    ],
  },
  tradeoffs: [
    {
      title: { en: "Visibility of minors’ work", uz: "Voyaga yetmaganlar ishlarining koʻrinishi" },
      body: {
        en: "Portfolios are meant to be shown, but students are often minors. Defaults should be private, with sharing as a deliberate choice.",
        uz: "Portfoliolar koʻrsatish uchun moʻljallangan, ammo oʻquvchilar koʻpincha voyaga yetmagan. Standart holatda hammasi yopiq boʻlishi, ulashish esa ongli tanlov boʻlishi kerak.",
      },
    },
    {
      title: { en: "Test integrity vs. accessibility", uz: "Test halolligi va qulaylik" },
      body: {
        en: "Online tests need safeguards against cheating without becoming hostile or inaccessible to honest students.",
        uz: "Onlayn testlar koʻchirishdan himoyalangan boʻlishi kerak, lekin halol oʻquvchilar uchun noqulay yoki foydalanib boʻlmaydigan holga kelmasligi lozim.",
      },
    },
  ],
  outcomes: [],
  limitations: [
    {
      en: "This is a concept: the page describes intended scope only.",
      uz: "Bu konsepsiya: sahifa faqat rejalashtirilgan qamrovni tasvirlaydi.",
    },
  ],
  nextSteps: [],
  media: {
    kind: "diagram",
    illustration: "school-platform-system",
    caption: {
      en: "The three areas of the concept and the shared account system.",
      uz: "Konsepsiyaning uch yoʻnalishi va umumiy hisoblar tizimi.",
    },
  },
  links: {},
  topics: [
    { en: "Education", uz: "Taʼlim" },
    { en: "Assessment", uz: "Baholash" },
    { en: "Administration", uz: "Boshqaruv" },
  ],
};
