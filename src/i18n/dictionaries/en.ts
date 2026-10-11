/**
 * English interface dictionary — the source of truth for the dictionary shape.
 * Personal content (story, projects) lives in src/content, not here.
 * Placeholders use {name} syntax and are filled with `format()`.
 */
export const en = {
  meta: {
    siteName: "Jaloliddin — Digital Workshop",
    titleTemplate: "%s — Jaloliddin",
    description:
      "Jaloliddin is a student developer from Uzbekistan who builds useful software, from algorithms to backend systems. Flagship project: Bloodchain, a blood donation platform.",
    ogAlt: "Jaloliddin — Digital Workshop",
  },
  a11y: {
    skipToContent: "Skip to content",
    primaryNav: "Primary",
    footerNav: "Footer",
    breadcrumb: "Breadcrumb",
    opensInNewTab: "opens in a new tab",
  },
  nav: {
    home: "Home",
    work: "Work",
    about: "About",
    lab: "Lab",
    writing: "Writing",
    contact: "Contact",
    menu: "Menu",
    closeMenu: "Close menu",
    menuTitle: "Site navigation",
    language: "Language",
    switchTo: "Switch language to {language}",
  },
  hero: {
    eyebrow: "Student developer · Uzbekistan",
    primaryCta: "See selected work",
    secondaryCta: "Get in touch",
    figureCaption: "Fig. 01 — Ideas, formed into a system",
    figureLabel:
      "A sculptural letter J built from luminous lines whose cross-section is an eight-pointed star, a motif from Uzbek geometric ornament.",
    pauseMotion: "Pause animation",
    playMotion: "Play animation",
    scrollHint: "Scroll",
  },
  home: {
    workLabel: "Selected work",
    workTitle: "Projects where the structure matters as much as the surface.",
    allWork: "All work",
    flagship: "Flagship",
    readCaseStudy: "Read the case study",
    viewProject: "View project",
    aboutLabel: "About",
    aboutTitle: "I started with composition and form. Now I bring the same care to systems.",
    aboutCta: "More about me",
    capabilitiesLabel: "Capabilities",
    capabilitiesTitle: "What I work on — and where it shows up.",
    capabilityContext: "Where it shows up",
    labLabel: "Lab",
    labTitle: "Small experiments that make ideas visible.",
    labBody:
      "The Lab is where I build interactive explanations. The first one walks through binary search step by step, with low, mid and high in plain view.",
    labCta: "Open the experiment",
    milestonesLabel: "Milestones",
    milestonesTitle: "Verified milestones",
    contactLabel: "Contact",
    contactTitle: "Have a problem worth building for? Let’s talk.",
    contactCta: "Contact page",
  },
  project: {
    status: "Status",
    role: "Role",
    year: "Year",
    audience: "Built for",
    topics: "Topics",
    problem: "The problem",
    approach: "Approach",
    scope: "Intended scope",
    scopeNote:
      "Scope describes what the project is designed to cover. It is not a claim that every part is finished.",
    implemented: "Verified so far",
    implementedEmpty:
      "This case study describes the intended scope. Implemented functionality will be listed here once it is verified.",
    workflows: "Key workflows",
    workflowsNote: "Workflows as designed. They describe intended behaviour, not a shipped product.",
    architecture: "Architecture",
    architectureNote:
      "A conceptual view of how the parts are meant to fit together. It shows responsibilities, not a confirmed technology stack.",
    tradeoffs: "Design considerations",
    tradeoffsNote: "Questions the design has to answer well.",
    outcomes: "Verified outcomes",
    limitations: "Limitations",
    nextSteps: "Next steps",
    links: "Links",
    repository: "Source code",
    live: "Live site",
    illustrationLabel: "Conceptual illustration",
    illustrationNote: "Not a product screenshot.",
    backToWork: "All work",
    nextProject: "Next project",
    contents: "On this page",
    statusLabels: {
      concept: "Concept",
      "in-development": "In development",
      prototype: "Prototype",
      live: "Live",
    },
    statusDescriptions: {
      concept: "Idea and scope are defined. No implementation claims.",
      "in-development": "Being built. The intended scope is not yet fully implemented.",
      prototype: "A working prototype exists. Not production-ready.",
      live: "Publicly available.",
    },
    diagram: {
      clients: "Clients",
      core: "Core",
      data: "Records",
      connectsTo: "Connects to",
    },
  },
  workPage: {
    title: "Work",
    description:
      "Projects and concepts by Jaloliddin, including Bloodchain, a blood donation platform. Each one carries an honest status label.",
    lead: "Projects and concepts, each with an honest status label.",
    body: "A project’s scope describes what it is designed to do. Where something is finished and verified, the case study says so explicitly.",
    legend: "Status labels",
    index: "Index",
  },
  aboutPage: {
    title: "About",
    description:
      "Jaloliddin is a student developer from Uzbekistan with a creative-school background, interested in algorithms, backend systems, AI, mathematics and physics.",
    interestsTitle: "Interests",
    principlesTitle: "How I like to work",
    nowTitle: "Learning direction",
    workCta: "See the work",
    contactCta: "Get in touch",
  },
  labPage: {
    title: "Lab",
    description:
      "Interactive experiments by Jaloliddin that make algorithms visible, starting with a step-by-step binary search visualizer.",
    lead: "Interactive experiments that make algorithms and ideas visible.",
    body: "Each experiment is small and focused, and works as well with a keyboard as with a mouse or touch.",
    open: "Open experiment",
    available: "Available",
    backToLab: "All experiments",
  },
  binarySearch: {
    title: "Binary search, step by step",
    topic: "Algorithms · O(log n)",
    description:
      "An interactive binary search visualizer: choose a target, then step through or play the search to see how low, mid and high move.",
    intro:
      "Binary search finds a value in a sorted array by repeatedly halving the range where it could be. Pick a target, then step through the search or let it play.",
    arrayLabel: "Sorted array",
    targetLabel: "Target value",
    targetHint: "A whole number from {min} to {max}.",
    targetError: "Enter a whole number from {min} to {max}.",
    pickPresent: "Value in the array",
    pickMissing: "Missing value",
    newArray: "New array",
    controls: "Search controls",
    play: "Play",
    pause: "Pause",
    next: "Next step",
    previous: "Previous step",
    reset: "Reset",
    stepCounter: "Step {current} of {total}",
    comparisons: "Comparisons",
    range: "Range",
    rangeValue: "indices {low}–{high}",
    rangeEmpty: "empty",
    outcome: "Outcome",
    searching: "Searching",
    found: "Found",
    notFound: "Not found",
    pointerLow: "low",
    pointerMid: "mid",
    pointerHigh: "high",
    index: "index",
    stepStart:
      "The whole array is in play: low = {low}, high = {high}. Press “Next step” to make the first comparison.",
    stepEqual:
      "mid = {mid}. The value at index {mid} is {value}, which equals the target {target}. Found it.",
    stepLess:
      "mid = {mid}. {value} is less than {target}, so the target can only be to the right. Move low to {newLow}.",
    stepGreater:
      "mid = {mid}. {value} is greater than {target}, so the target can only be to the left. Move high to {newHigh}.",
    stepNotFound:
      "low ({low}) is now greater than high ({high}). The range is empty, so {target} is not in the array.",
    summaryFound: "Found {target} at index {index} after {count} comparisons.",
    summaryNotFound: "{target} is not in the array. The search used {count} comparisons.",
    complexity:
      "Each comparison halves the remaining range, so searching {n} items takes at most {max} comparisons (⌊log₂ n⌋ + 1).",
    howItWorks: "How it works",
    legendActive: "In range",
    legendEliminated: "Eliminated",
    legendMid: "Compared",
  },
  writingPage: {
    title: "Writing",
    description: "Notes by Jaloliddin on algorithms, systems and ongoing projects.",
    lead: "Notes on what I’m learning and building.",
    emptyTitle: "No articles yet",
    emptyBody:
      "When I publish notes on algorithms, systems or the projects I’m building, they will appear here.",
    emptyCta: "Explore the Lab meanwhile",
    readingTime: "{minutes} min read",
    published: "Published",
    backToWriting: "All writing",
  },
  contactPage: {
    title: "Contact",
    description: "How to reach Jaloliddin, a student developer from Uzbekistan.",
    lead: "Open to conversations about software, algorithms and learning opportunities.",
    body: "Pick whichever channel suits you. Every link below goes directly to a profile or address I manage.",
    emptyTitle: "Contact details are coming soon",
    emptyBody: "Direct contact links will be published on this page.",
    channels: "Channels",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed",
  },
  contactLabels: {
    email: "Email",
    github: "GitHub",
    telegram: "Telegram",
    linkedin: "LinkedIn",
    x: "X",
    leetcode: "LeetCode",
    codeforces: "Codeforces",
  },
  notFound: {
    title: "Page not found",
    description: "The page you were looking for does not exist.",
    code: "404",
    body: "This page doesn’t exist, or it moved while the workshop was being rearranged.",
    home: "Back to home",
    work: "See the work",
  },
  footer: {
    tagline: "Digital Workshop — ideas, formed into systems.",
    builtWith: "Built with Next.js, Three.js and care.",
    backToTop: "Back to top",
    rights: "© {year} Jaloliddin",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;
