import type { ProjectRecord } from "@/types/content";

/**
 * Bloodchain — flagship project.
 * Truthfulness rules: describe intended scope, never imply deployment,
 * clinical readiness, medical approval or app-store availability.
 * `implemented`, `outcomes` and `links` stay empty until verified.
 */
export const bloodchain: ProjectRecord = {
  slug: "bloodchain",
  title: "Bloodchain",
  order: 1,
  featured: true,
  status: "in-development",
  tagline: {
    en: "A blood donation platform for donors, hospitals and blood centers.",
    uz: "Donorlar, shifoxonalar va qon markazlari uchun qon topshirish platformasi.",
  },
  summary: {
    en: "Bloodchain connects donors with hospitals and blood centers. Appointments, emergency requests and donation history live in one system, with a mobile app for donors and portals for organizations.",
    uz: "Bloodchain donorlarni shifoxonalar va qon markazlari bilan bogʻlaydi. Navbatlar, shoshilinch soʻrovlar va donorlik tarixi yagona tizimda: donorlar uchun mobil ilova, tashkilotlar uchun portal.",
  },
  role: {
    en: "Creator · product and system design",
    uz: "Muallif · mahsulot va tizim dizayni",
  },
  problem: {
    en: "Blood donation depends on coordination. Donors need to know when and where to give, and hospitals and blood centers need to reach the right donors quickly, especially in an emergency. When that coordination runs through phone calls, paper records and scattered messages, it is slow and hard to track.",
    uz: "Qon topshirish muvofiqlashtirishga bogʻliq. Donorlar qachon va qayerda qon topshirishni bilishi kerak, shifoxona va qon markazlari esa, ayniqsa shoshilinch holatda, kerakli donorlarga tez yetib borishi lozim. Bu ish telefon qoʻngʻiroqlari, qogʻoz yozuvlar va tarqoq xabarlar orqali bajarilsa, sekin kechadi va kuzatish qiyin boʻladi.",
  },
  audiences: [
    { en: "Donors", uz: "Donorlar" },
    { en: "Hospitals", uz: "Shifoxonalar" },
    { en: "Blood centers", uz: "Qon markazlari" },
  ],
  approach: {
    en: "Bloodchain is designed as one platform with two sides: a mobile app for donors and web portals for organizations. Both share a single core that manages appointments, emergency requests and donation records, so every party works from the same information.",
    uz: "Bloodchain ikki tomonlama yagona platforma sifatida loyihalangan: donorlar uchun mobil ilova va tashkilotlar uchun veb-portallar. Ikkalasi navbatlar, shoshilinch soʻrovlar va donorlik yozuvlarini boshqaradigan umumiy yadroga tayanadi, shu sababli har bir tomon bir xil maʼlumot bilan ishlaydi.",
  },
  scope: [
    {
      en: "Donor mobile app: the donor-facing side for booking donations, responding to requests and viewing personal history.",
      uz: "Donorlar uchun mobil ilova: qon topshirishga yozilish, soʻrovlarga javob berish va shaxsiy tarixni koʻrish.",
    },
    {
      en: "Organization portals for hospitals and blood centers.",
      uz: "Shifoxonalar va qon markazlari uchun tashkilot portallari.",
    },
    {
      en: "Donation appointments: scheduling visits to a blood center.",
      uz: "Qon topshirish navbatlari: qon markaziga tashrifni rejalashtirish.",
    },
    {
      en: "Emergency requests: organizations signal urgent needs to suitable donors.",
      uz: "Shoshilinch soʻrovlar: tashkilotlar zarur ehtiyojni mos donorlarga bildiradi.",
    },
    {
      en: "Donation history: a record of past donations for each donor.",
      uz: "Donorlik tarixi: har bir donorning oldingi qon topshirishlari yozuvi.",
    },
  ],
  implemented: [],
  workflows: [
    {
      id: "book",
      audience: { en: "Donors", uz: "Donorlar" },
      title: { en: "Book a donation", uz: "Qon topshirishga yozilish" },
      steps: [
        { en: "Choose a blood center and an available time.", uz: "Qon markazi va boʻsh vaqtni tanlash." },
        { en: "Get a confirmation for the appointment.", uz: "Navbat tasdigʻini olish." },
        {
          en: "After the visit, the donation appears in the donor’s history.",
          uz: "Tashrifdan soʻng qon topshirish donorning tarixida paydo boʻladi.",
        },
      ],
    },
    {
      id: "respond",
      audience: { en: "Donors", uz: "Donorlar" },
      title: { en: "Respond to an emergency request", uz: "Shoshilinch soʻrovga javob berish" },
      steps: [
        { en: "A blood center publishes an urgent request.", uz: "Qon markazi shoshilinch soʻrov eʼlon qiladi." },
        { en: "Suitable donors see it in the app.", uz: "Mos donorlar uni ilovada koʻradi." },
        { en: "A donor responds and books a visit.", uz: "Donor javob beradi va tashrifga yoziladi." },
      ],
    },
    {
      id: "manage",
      audience: { en: "Hospitals & blood centers", uz: "Shifoxona va qon markazlari" },
      title: { en: "Manage appointments", uz: "Navbatlarni boshqarish" },
      steps: [
        { en: "Publish available donation slots.", uz: "Qon topshirish uchun boʻsh vaqtlarni eʼlon qilish." },
        { en: "Review upcoming appointments.", uz: "Yaqinlashayotgan navbatlarni koʻrib chiqish." },
        {
          en: "Mark donations as completed, which updates the donor’s history.",
          uz: "Qon topshirishni yakunlangan deb belgilash — bu donor tarixini yangilaydi.",
        },
      ],
    },
    {
      id: "request",
      audience: { en: "Hospitals & blood centers", uz: "Shifoxona va qon markazlari" },
      title: { en: "Raise an emergency request", uz: "Shoshilinch soʻrov yuborish" },
      steps: [
        {
          en: "Describe the need: blood type, urgency and location.",
          uz: "Ehtiyojni tavsiflash: qon guruhi, shoshilinchlik va joylashuv.",
        },
        { en: "Send it to matching donors.", uz: "Uni mos donorlarga yuborish." },
        { en: "Track responses as they arrive.", uz: "Kelayotgan javoblarni kuzatib borish." },
      ],
    },
  ],
  architecture: {
    summary: {
      en: "Two client applications share one core. The core owns the rules for appointments and emergency requests and is the single source of truth for donation records.",
      uz: "Ikki mijoz ilovasi bitta yadroga tayanadi. Yadro navbatlar va shoshilinch soʻrovlar qoidalarini boshqaradi hamda donorlik yozuvlari uchun yagona manba hisoblanadi.",
    },
    nodes: [
      {
        id: "donor-app",
        tier: "client",
        label: { en: "Donor app", uz: "Donor ilovasi" },
        detail: { en: "Mobile · booking, requests, history", uz: "Mobil · navbat, soʻrov, tarix" },
      },
      {
        id: "org-portal",
        tier: "client",
        label: { en: "Organization portal", uz: "Tashkilot portali" },
        detail: { en: "Web · hospitals and blood centers", uz: "Veb · shifoxona va qon markazlari" },
      },
      {
        id: "appointments",
        tier: "core",
        label: { en: "Appointments", uz: "Navbatlar" },
        detail: { en: "Slots, bookings, completion", uz: "Vaqtlar, yozilish, yakunlash" },
      },
      {
        id: "requests",
        tier: "core",
        label: { en: "Emergency requests", uz: "Shoshilinch soʻrovlar" },
        detail: { en: "Matching and responses", uz: "Moslashtirish va javoblar" },
      },
      {
        id: "records",
        tier: "data",
        label: { en: "Donation records", uz: "Donorlik yozuvlari" },
        detail: { en: "History per donor", uz: "Har bir donor tarixi" },
      },
      {
        id: "directory",
        tier: "data",
        label: { en: "Donors & organizations", uz: "Donorlar va tashkilotlar" },
        detail: { en: "Accounts and roles", uz: "Hisoblar va rollar" },
      },
    ],
    edges: [
      { from: "donor-app", to: "appointments" },
      { from: "donor-app", to: "requests" },
      { from: "org-portal", to: "appointments" },
      { from: "org-portal", to: "requests" },
      { from: "appointments", to: "records" },
      { from: "requests", to: "directory" },
      { from: "appointments", to: "directory" },
    ],
  },
  tradeoffs: [
    {
      title: { en: "Reach vs. alert fatigue", uz: "Qamrov va bildirishnomadan charchash" },
      body: {
        en: "Emergency requests must reach donors fast, but too many alerts teach people to ignore them. Requests should be targeted, for example by blood type and distance, rather than broadcast to everyone.",
        uz: "Shoshilinch soʻrovlar donorlarga tez yetishi kerak, lekin bildirishnomalar haddan tashqari koʻp boʻlsa, odamlar ularga eʼtibor bermay qoʻyadi. Soʻrovlar hammaga emas, masalan, qon guruhi va masofaga qarab yuborilishi kerak.",
      },
    },
    {
      title: { en: "Guidance, not medical decisions", uz: "Tibbiy qaror emas, yoʻl-yoʻriq" },
      body: {
        en: "Whether someone can donate is a medical question. The platform can inform and remind, but eligibility decisions belong to the blood center’s staff and screening process.",
        uz: "Kim qon topshira olishi — tibbiy masala. Platforma maʼlumot berishi va eslatishi mumkin, ammo bu boʻyicha qarorni qon markazi xodimlari va tibbiy koʻrik jarayoni qabul qiladi.",
      },
    },
    {
      title: { en: "Sensitive data, minimal collection", uz: "Nozik maʼlumot — minimal yigʻish" },
      body: {
        en: "Blood type and donation history are personal health information. The design should collect only what the workflows need and strictly limit who can see it.",
        uz: "Qon guruhi va donorlik tarixi — shaxsiy tibbiy maʼlumot. Tizim faqat jarayonlar uchun zarur maʼlumotni yigʻishi va unga kim kira olishini qatʼiy cheklashi kerak.",
      },
    },
    {
      title: { en: "Two products, one source of truth", uz: "Ikki mahsulot, yagona manba" },
      body: {
        en: "Donors and organizations see the same appointments and requests from different sides. A shared core keeps the two from drifting apart, at the cost of more careful API design up front.",
        uz: "Donorlar va tashkilotlar bir xil navbat va soʻrovlarni turli tomondan koʻradi. Umumiy yadro ikki tomonning bir-biridan uzoqlashib ketishiga yoʻl qoʻymaydi, ammo buning evaziga API’ni boshidanoq puxta loyihalash kerak.",
      },
    },
  ],
  outcomes: [],
  limitations: [
    {
      en: "This case study makes no claim of public availability, clinical use or medical approval.",
      uz: "Ushbu sahifa ommaviy foydalanish, klinik qoʻllash yoki tibbiy ruxsat haqida hech qanday daʼvo qilmaydi.",
    },
    {
      en: "Real-world use would require partnerships with blood centers and compliance with local health-data rules.",
      uz: "Amalda qoʻllash uchun qon markazlari bilan hamkorlik va mahalliy tibbiy maʼlumotlar qoidalariga rioya qilish talab etiladi.",
    },
    {
      en: "No product screenshots are shown yet. The illustration on this page is conceptual.",
      uz: "Hozircha mahsulot skrinshotlari koʻrsatilmagan. Bu sahifadagi tasvir konseptual.",
    },
  ],
  nextSteps: [],
  media: {
    kind: "diagram",
    illustration: "bloodchain-system",
    caption: {
      en: "How donors, organizations and the shared core are intended to connect.",
      uz: "Donorlar, tashkilotlar va umumiy yadro qanday bogʻlanishi koʻzda tutilgani.",
    },
  },
  links: {},
  topics: [
    { en: "Healthcare workflows", uz: "Tibbiyot jarayonlari" },
    { en: "Mobile + web", uz: "Mobil + veb" },
    { en: "Multi-party systems", uz: "Koʻp tomonlama tizimlar" },
  ],
};
