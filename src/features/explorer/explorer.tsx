import { HeroFallback } from "@/components/graphics/hero-fallback";
import { GirihField, Rosette, StarMark } from "@/components/graphics/ornament";
import { Container } from "@/components/layout/container";
import { Divider } from "@/components/layout/divider";
import { Grid } from "@/components/layout/grid";
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { HoverSurface } from "@/components/motion/hover-surface";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Field, Input } from "@/components/ui/field";
import { ArrowRightIcon, CopyIcon, InfoIcon } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { HeroGraphic } from "@/features/home/hero-graphic";
import { ArrayStrip } from "@/features/lab/binary-search/array-strip";
import { createSortedSample, traceBinarySearch } from "@/features/lab/binary-search/algorithm";
import { ArchitectureDiagram } from "@/features/portfolio/architecture-diagram";
import { CaseStudySection } from "@/features/portfolio/case-study-section";
import { MediaFrame } from "@/features/portfolio/media-frame";
import { ProjectMeta } from "@/features/portfolio/project-meta";
import { ProjectPreview, projectPreviewLabels } from "@/features/portfolio/project-preview";
import { StatusBadge } from "@/features/portfolio/status-badge";
import { SystemIllustration } from "@/features/portfolio/system-illustration";
import { Timeline } from "@/features/portfolio/timeline";
import { ArticlePreview } from "@/features/writing/article-preview";
import { en } from "@/i18n/dictionaries/en";
import { getProjects } from "@/lib/projects";

import { DialogDemo, ReducedMotionDemo, TextEntranceDemo } from "./demos";
import { Specimen } from "./specimen";
import { ColorTokens } from "./token-panel";

const groups = [
  { id: "foundations", title: "Foundations", items: ["colors", "typography", "scales"] },
  { id: "layout", title: "Layout", items: ["container", "section", "stack", "grid", "divider"] },
  { id: "interface", title: "Interface", items: ["button", "badge", "field", "tabs", "accordion", "dialog", "tooltip", "copy-button"] },
  {
    id: "portfolio",
    title: "Portfolio",
    items: ["project-preview", "project-meta", "status-badge", "media-frame", "system-illustration", "architecture-diagram", "case-study-section", "timeline", "article-preview"],
  },
  { id: "motion", title: "Motion", items: ["reveal", "stagger", "text-entrance", "hover-surface", "reduced-motion"] },
  { id: "graphics", title: "Graphics", items: ["hero-fallback", "scene-wrapper", "ornament", "array-strip"] },
];

const typeScale = [
  ["text-display-xl", "Jaloliddin", "Hero name · clamp(3.75rem, 14.5vw, 15rem)"],
  ["text-display-lg", "Section title", "clamp(2.75rem, 7.4vw, 7rem)"],
  ["text-display-md", "Statement", "clamp(2.125rem, 4.6vw, 4.25rem)"],
  ["text-heading", "Card heading", "clamp(1.5rem, 2.3vw, 2.125rem)"],
  ["text-lead", "Lead paragraph for introductions.", "clamp(1.1875rem, 1.55vw, 1.4375rem)"],
  ["text-body", "Body text for reading, at a comfortable 1.65 line height.", "1.0625rem"],
  ["text-small", "Small supporting text.", "0.9375rem"],
  ["text-label", "Mono label · metadata", "0.75rem, uppercase, Red Hat Mono"],
] as const;

export function Explorer() {
  const projects = getProjects("en");
  const bloodchain = projects[0]!;
  const sample = createSortedSample(11, 12);
  const trace = traceBinarySearch(sample, sample[3]!);

  return (
    <div className="mx-auto grid max-w-site gap-10 px-gutter py-12 lg:grid-cols-[14rem_1fr] lg:gap-14">
      <nav aria-label="Explorer sections" className="lg:sticky lg:top-8 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto">
        <p className="text-label text-accent-ink">Component explorer</p>
        <p className="mt-2 text-small text-ink-3">Development only — not built into production.</p>
        <ul className="mt-6 flex flex-col gap-5">
          {groups.map((group) => (
            <li key={group.id}>
              <a href={`#${group.id}`} className="text-label text-ink-2 hover:text-ink">
                {group.title}
              </a>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 lg:flex-col">
                {group.items.map((item) => (
                  <li key={item}>
                    <a href={`#${item}`} className="font-mono text-[0.8125rem] text-ink-3 hover:text-ink">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main-content" className="flex min-w-0 flex-col gap-24">
        <header className="flex flex-col gap-4">
          <h1 className="text-display-lg font-semibold text-ink">Digital Workshop UI</h1>
          <p className="text-lead max-w-[48rem] text-ink-2">
            Every component used on the site, rendered with its real implementation. Badges mark what can be copied into
            any React project, what needs Next.js, and what is specific to this site’s content. See
            docs/component-reuse.md.
          </p>
        </header>

        {/* ── Foundations ─────────────────────────────────────────────── */}
        <section id="foundations" aria-labelledby="foundations-title" className="flex flex-col gap-12">
          <h2 id="foundations-title" className="text-display-md font-semibold text-ink">Foundations</h2>

          <Specimen
            id="colors"
            title="Color tokens"
            source="src/styles/globals.css (:root)"
            portability="portable"
            description="Primitive palette values feed semantic roles. Components only use semantic utilities (bg-canvas, text-ink, border-line, text-accent-ink…), so the palette can change in one place."
            code={`/* globals.css */
:root {
  --palette-blue-500: #3d74ff;   /* 1. primitive */
  --accent: var(--palette-blue-500); /* 2. semantic role */
}
@theme inline {
  --color-accent: var(--accent); /* 3. Tailwind utility: bg-accent */
}`}
            a11y={[
              "Measured WCAG ratios on canvas: ink 17.1:1, ink-2 12.9:1, ink-3 7.7:1, accent-ink 7.0:1, focus ring 10.2:1.",
              "Filled buttons use the action tokens: ivory on action 4.6:1, on action-hover 5.7:1. The brighter accent (3.6:1 with ivory) is reserved for graphics, glows and borders — never behind small text.",
            ]}
          >
            <ColorTokens />
          </Specimen>

          <Specimen
            id="typography"
            title="Typography"
            source="src/styles/fonts.ts · --text-* tokens"
            portability="portable"
            description="Two families: Schibsted Grotesk for display and reading, Red Hat Mono for labels and metadata. Both are self-hosted and include the Uzbek modifier letters ʻ and ʼ."
            code={`<h1 className="text-display-xl font-bold">Jaloliddin</h1>
<p className="text-lead text-ink-2">…</p>
<span className="text-label text-ink-3">Status</span>`}
          >
            <ul className="flex flex-col gap-6">
              {typeScale.map(([token, sample, spec]) => (
                <li key={token} className="flex flex-col gap-1 border-b border-line pb-5 last:border-0">
                  <span className="font-mono text-[0.75rem] text-accent-glow">
                    {token} · <span className="text-ink-3">{spec}</span>
                  </span>
                  <span className={`${token} ${token.startsWith("text-display") ? "font-semibold" : ""} text-ink`}>{sample}</span>
                </li>
              ))}
              <li className="text-lead text-ink">Oʻzbekiston · Gʻoyalar · Taʼlim — Uzbek Latin check</li>
            </ul>
          </Specimen>

          <Specimen
            id="scales"
            title="Spacing, radius, elevation, motion"
            source="src/styles/globals.css · src/components/motion/tokens.ts"
            portability="portable"
            description="Component spacing uses Tailwind’s 4px scale; sections use fluid tokens. Radii stay small for an editorial feel; elevation and glow are used sparingly."
            code={`<Section spacing="default" /> // py-section = clamp(5.5rem, 11vw, 10.5rem)
<div className="rounded-md shadow-raised" />
import { duration, easing, spring } from "@/components/motion/tokens";`}
          >
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col gap-3">
                <p className="text-label text-ink-3">Radius</p>
                {["xs", "sm", "md", "lg", "pill"].map((radius) => (
                  <div key={radius} className="flex items-center gap-3">
                    <span className={`block size-10 border border-line-strong bg-surface rounded-${radius}`} />
                    <code className="font-mono text-[0.75rem] text-ink-2">rounded-{radius}</code>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-label text-ink-3">Elevation</p>
                <div className="rounded-md border border-line bg-raised p-4 shadow-raised font-mono text-[0.75rem] text-ink-2">shadow-raised</div>
                <div className="rounded-md bg-raised p-4 shadow-glow font-mono text-[0.75rem] text-ink-2">shadow-glow</div>
              </div>
              <div className="flex flex-col gap-2 font-mono text-[0.75rem] text-ink-2">
                <p className="text-label text-ink-3">Motion</p>
                <span>--duration-fast 160ms</span>
                <span>--duration-base 280ms</span>
                <span>--duration-slow 560ms</span>
                <span>--duration-entrance 900ms</span>
                <span>--ease-out-expo cubic-bezier(.16,1,.3,1)</span>
                <span>spring.gentle stiffness 260 / damping 28</span>
              </div>
            </div>
          </Specimen>
        </section>

        {/* ── Layout ──────────────────────────────────────────────────── */}
        <section id="layout" aria-labelledby="layout-title" className="flex flex-col gap-12">
          <h2 id="layout-title" className="text-display-md font-semibold text-ink">Layout</h2>

          <Specimen
            id="container"
            title="Container"
            source="@/components/layout/container"
            portability="portable"
            description="Centres content at the site width with a fluid gutter."
            code={`<Container size="reading" as="article">…</Container>`}
            props={[
              { name: "size", type: '"default" | "narrow" | "reading" | "full"', default: '"default"', description: "Maximum width." },
              { name: "as", type: '"div" | "section" | "article" | …', default: '"div"', description: "Element to render." },
            ]}
          >
            <Container size="reading" className="rounded-md border border-dashed border-line-strong py-6 text-center font-mono text-[0.8125rem] text-ink-3">
              size=&quot;reading&quot; (max-w-3xl)
            </Container>
          </Specimen>

          <Specimen
            id="section"
            title="Section"
            source="@/components/layout/section"
            portability="portable"
            description="Vertical rhythm and tone for page sections. Name it with aria-labelledby."
            code={`<Section tone="blueprint" spacing="tight" divided aria-labelledby="lab-title">…</Section>`}
            props={[
              { name: "spacing", type: '"default" | "tight" | "none"', default: '"default"', description: "Vertical padding." },
              { name: "tone", type: '"plain" | "raised" | "blueprint" | "deep"', default: '"plain"', description: "Background treatment." },
              { name: "divided", type: "boolean", default: "false", description: "Top hairline." },
            ]}
            surface="deep"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {(["plain", "raised", "blueprint", "deep"] as const).map((tone) => (
                <Section key={tone} tone={tone} spacing="none" divided className="rounded-md border border-line p-6">
                  <span className="font-mono text-[0.8125rem] text-ink-2">tone=&quot;{tone}&quot;</span>
                </Section>
              ))}
            </div>
          </Specimen>

          <Specimen
            id="stack"
            title="Stack"
            source="@/components/layout/stack"
            portability="portable"
            description="One-dimensional layout with consistent gaps."
            code={`<Stack direction="row" gap="sm" wrap align="center">…</Stack>`}
            props={[
              { name: "gap", type: '"2xs" | "xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Gap size." },
              { name: "direction", type: '"column" | "row"', default: '"column"', description: "Main axis." },
              { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "Cross-axis alignment." },
              { name: "wrap", type: "boolean", default: "false", description: "Allow wrapping." },
            ]}
          >
            <Stack direction="row" gap="sm" wrap>
              {["01", "02", "03", "04"].map((n) => (
                <span key={n} className="rounded-md border border-line-strong px-4 py-3 font-mono text-[0.8125rem] text-ink-2">{n}</span>
              ))}
            </Stack>
          </Specimen>

          <Specimen
            id="grid"
            title="Grid"
            source="@/components/layout/grid"
            portability="portable"
            description="4 / 8 / 12 columns. Children place themselves with col-span and col-start, which keeps asymmetry on one grid."
            code={`<Grid gap="md">
  <div className="col-span-4 lg:col-span-3">Label</div>
  <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-5">Content</div>
</Grid>`}
          >
            <Grid gap="sm">
              <div className="col-span-4 rounded-sm border border-dashed border-line-strong p-3 font-mono text-[0.75rem] text-ink-3 lg:col-span-3">col-span-3</div>
              <div className="col-span-4 rounded-sm border border-accent/50 bg-accent-wash p-3 font-mono text-[0.75rem] text-ink-2 md:col-span-8 lg:col-span-7 lg:col-start-5">col-span-7 col-start-5</div>
            </Grid>
          </Specimen>

          <Specimen
            id="divider"
            title="Divider"
            source="@/components/layout/divider"
            portability="portable"
            description="Hairline, ornament or labelled separators."
            code={`<Divider />
<Divider variant="ornament" />
<Divider variant="label" label="Index" />`}
            props={[
              { name: "variant", type: '"line" | "ornament" | "label"', default: '"line"', description: "Style." },
              { name: "label", type: "string", description: "Text for the label variant." },
            ]}
            a11y={["The line variant is an <hr>. Decorative variants use role=\"separator\"."]}
          >
            <Stack gap="md">
              <Divider />
              <Divider variant="ornament" />
              <Divider variant="label" label="Index" />
            </Stack>
          </Specimen>
        </section>

        {/* ── Interface ───────────────────────────────────────────────── */}
        <section id="interface" aria-labelledby="interface-title" className="flex flex-col gap-12">
          <h2 id="interface-title" className="text-display-md font-semibold text-ink">Interface</h2>

          <Specimen
            id="button"
            title="Button"
            source="@/components/ui/button"
            portability="portable"
            description="Four variants and four sizes. With asChild, styles apply to a single child element such as a router Link, keeping the component router-agnostic."
            code={`<Button>Primary</Button>
<Button variant="secondary" size="lg">Secondary</Button>
<Button asChild variant="link">
  <Link href="/work">All work <ArrowRightIcon /></Link>
</Button>
<Button size="icon" aria-label="Copy"><CopyIcon /></Button>`}
            props={[
              { name: "variant", type: '"primary" | "secondary" | "ghost" | "link"', default: '"primary"', description: "Visual style." },
              { name: "size", type: '"sm" | "md" | "lg" | "icon"', default: '"md"', description: "Height and padding (min 44px at md)." },
              { name: "asChild", type: "boolean", default: "false", description: "Merge styles into the only child." },
            ]}
            a11y={[
              "Native <button type=\"button\"> by default; visible focus ring on keyboard focus.",
              "Prefer aria-disabled over disabled for controls that become unavailable while focused, so focus is not lost.",
              "Icon-only buttons need aria-label or visually hidden text.",
            ]}
          >
            <Stack gap="md">
              <Stack direction="row" gap="xs" wrap align="center">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">
                  Link <ArrowRightIcon size={18} />
                </Button>
              </Stack>
              <Stack direction="row" gap="xs" wrap align="center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" variant="secondary" aria-label="Copy">
                  <CopyIcon size={18} />
                </Button>
              </Stack>
              <Stack direction="row" gap="xs" wrap align="center">
                <Button disabled>disabled</Button>
                <Button variant="secondary" aria-disabled>
                  aria-disabled
                </Button>
              </Stack>
            </Stack>
          </Specimen>

          <Specimen
            id="badge"
            title="Badge"
            source="@/components/ui/badge"
            portability="portable"
            description="Small mono labels for status and topics."
            code={`<Badge tone="accent" dot>In development</Badge>
<Badge tone="outline">Concept</Badge>`}
            props={[
              { name: "tone", type: '"neutral" | "accent" | "outline" | "success"', default: '"neutral"', description: "Colour treatment." },
              { name: "dot", type: "boolean", default: "false", description: "Leading status dot." },
            ]}
            a11y={["Badges are text; never rely on colour alone (the label carries the meaning)."]}
          >
            <Stack direction="row" gap="xs" wrap>
              <Badge>Neutral</Badge>
              <Badge tone="accent" dot>Accent</Badge>
              <Badge tone="outline">Outline</Badge>
              <Badge tone="success" dot>Success</Badge>
            </Stack>
          </Specimen>

          <Specimen
            id="field"
            title="Field + Input"
            source="@/components/ui/field"
            portability="portable"
            description="Connects a label, hint and error to any control through a render function."
            code={`<Field label="Target value" hint="A whole number from 1 to 99." error={error}>
  {(control) => <Input {...control} value={value} onChange={…} />}
</Field>`}
            props={[
              { name: "label", type: "ReactNode", description: "Visible label (required)." },
              { name: "hint", type: "ReactNode", description: "Persistent help text, linked via aria-describedby." },
              { name: "error", type: "ReactNode", description: "Marks the control aria-invalid and announces the message." },
              { name: "children", type: "(control) => ReactNode", description: "Receives id, aria-describedby and aria-invalid." },
            ]}
            a11y={["Label is a real <label for>.", "Errors use role=\"alert\" and are linked with aria-describedby."]}
          >
            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Default" hint="Helpful hint text.">
                {(control) => <Input {...control} defaultValue="42" />}
              </Field>
              <Field label="With error" error="Enter a whole number from 1 to 99.">
                {(control) => <Input {...control} defaultValue="abc" />}
              </Field>
              <Field label="Disabled">
                {(control) => <Input {...control} defaultValue="7" disabled />}
              </Field>
            </div>
          </Specimen>

          <Specimen
            id="tabs"
            title="Tabs"
            source="@/components/ui/tabs (Radix)"
            portability="portable"
            description="Used for workflows grouped by audience on case-study pages."
            code={`<Tabs defaultValue="donors">
  <TabsList aria-label="Key workflows">
    <TabsTrigger value="donors">Donors</TabsTrigger>
    <TabsTrigger value="orgs">Organizations</TabsTrigger>
  </TabsList>
  <TabsContent value="donors">…</TabsContent>
  <TabsContent value="orgs">…</TabsContent>
</Tabs>`}
            a11y={["Arrow keys move between tabs; Home/End jump; inactive panels leave the tab order.", "Give TabsList an aria-label."]}
          >
            <Tabs defaultValue="a">
              <TabsList aria-label="Demo tabs">
                <TabsTrigger value="a">Donors</TabsTrigger>
                <TabsTrigger value="b">Organizations</TabsTrigger>
              </TabsList>
              <TabsContent value="a">
                <p className="text-ink-2">Panel for donors.</p>
              </TabsContent>
              <TabsContent value="b">
                <p className="text-ink-2">Panel for organizations.</p>
              </TabsContent>
            </Tabs>
          </Specimen>

          <Specimen
            id="accordion"
            title="Accordion"
            source="@/components/ui/accordion (Radix)"
            portability="portable"
            description="Used for design considerations on case-study pages."
            code={`<Accordion type="multiple">
  <AccordionItem value="one">
    <AccordionTrigger leading="01">Reach vs. alert fatigue</AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
</Accordion>`}
            props={[
              { name: "leading", type: "ReactNode", description: "Optional index before the title." },
              { name: "headingLevel", type: "2 | 3 | 4", default: "3", description: "Heading wrapping each trigger." },
            ]}
            a11y={["Triggers are buttons inside headings with aria-expanded and aria-controls."]}
          >
            <Accordion type="multiple" className="border-t border-line">
              <AccordionItem value="one">
                <AccordionTrigger leading="01">First consideration</AccordionTrigger>
                <AccordionContent>Expanded content uses the reading measure.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="two">
                <AccordionTrigger leading="02">Second consideration</AccordionTrigger>
                <AccordionContent>Multiple items can be open at once.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Specimen>

          <Specimen
            id="dialog"
            title="Dialog"
            source="@/components/ui/dialog (Radix)"
            portability="portable"
            description="Centered modal or full-screen sheet (the mobile navigation uses layout=&quot;sheet&quot;)."
            code={`<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent closeLabel="Close dialog" header={<DialogTitle>Title</DialogTitle>}>
    <DialogDescription>…</DialogDescription>
  </DialogContent>
</Dialog>`}
            props={[
              { name: "layout", type: '"center" | "sheet"', default: '"center"', description: "Modal shape." },
              { name: "closeLabel", type: "string", description: "Accessible name of the close button (required)." },
              { name: "header", type: "ReactNode", description: "Rendered next to the close button; put DialogTitle here." },
            ]}
            a11y={["Focus is trapped and restored to the trigger; Escape closes; background is inert.", "Always include a DialogTitle."]}
          >
            <DialogDemo />
          </Specimen>

          <Specimen
            id="tooltip"
            title="Tooltip"
            source="@/components/ui/tooltip (Radix)"
            portability="portable"
            description="Supplementary hints for controls that already have an accessible name (e.g. the hero pause button)."
            code={`<Tooltip content="Pause animation">
  <button aria-label="Pause animation">…</button>
</Tooltip>`}
            a11y={["Opens on hover and keyboard focus; dismiss with Escape.", "Never put essential information only in a tooltip — touch devices may not show it."]}
          >
            <Tooltip content="More information">
              <Button size="icon" variant="secondary" aria-label="More information">
                <InfoIcon size={18} />
              </Button>
            </Tooltip>
          </Specimen>

          <Specimen
            id="copy-button"
            title="CopyButton"
            source="@/components/ui/copy-button"
            portability="portable"
            description="Copies text with a clipboard fallback and announces success or failure politely."
            code={`<CopyButton value="hello@example.com" srContext="email"
  labels={{ copy: "Copy", copied: "Copied", error: "Copy failed" }} />`}
            a11y={["The result is announced through a live region next to the button."]}
          >
            <CopyButton value="Digital Workshop" labels={{ copy: "Copy", copied: "Copied", error: "Copy failed" }} srContext="example text" />
          </Specimen>
        </section>

        {/* ── Portfolio ───────────────────────────────────────────────── */}
        <section id="portfolio" aria-labelledby="portfolio-title" className="flex flex-col gap-12">
          <h2 id="portfolio-title" className="text-display-md font-semibold text-ink">Portfolio</h2>

          <Specimen
            id="project-preview"
            title="ProjectPreview"
            source="@/features/portfolio/project-preview"
            portability="next"
            description="Feature and row variants driven by a resolved Project record. The title link is stretched over the card."
            code={`<ProjectPreview project={project} href="/en/work/bloodchain" index={1}
  statusLabel={dict.project.statusLabels[project.status]}
  labels={projectPreviewLabels(dict, dict.home.readCaseStudy)} variant="row" />`}
            props={[
              { name: "variant", type: '"feature" | "row"', default: '"feature"', description: "Large editorial card or compact index row." },
              { name: "headingLevel", type: "2 | 3", default: "3", description: "Heading level for the title." },
            ]}
            a11y={["One link per card (stretched title), so screen readers hear one clear name."]}
          >
            <Stack gap="lg">
              <ProjectPreview project={bloodchain} href="#project-preview" index={1} statusLabel={en.project.statusLabels[bloodchain.status]} labels={projectPreviewLabels(en, en.home.readCaseStudy)} />
              <ProjectPreview project={projects[1]!} href="#project-preview" index={2} variant="row" statusLabel={en.project.statusLabels[projects[1]!.status]} labels={projectPreviewLabels(en, en.home.viewProject)} />
            </Stack>
          </Specimen>

          <Specimen
            id="project-meta"
            title="ProjectMeta"
            source="@/features/portfolio/project-meta"
            portability="portable"
            description="Definition list for metadata."
            code={`<ProjectMeta columns={3} items={[{ label: "Role", value: "Creator" }, …]} />`}
          >
            <ProjectMeta columns={3} items={[{ label: "Role", value: bloodchain.role }, { label: "Built for", value: bloodchain.audiences.join(" · ") }, { label: "Topics", value: bloodchain.topics.join(" · ") }]} />
          </Specimen>

          <Specimen
            id="status-badge"
            title="StatusBadge"
            source="@/features/portfolio/status-badge"
            portability="portable"
            description="Honest lifecycle labels. Use only statuses you can back up."
            code={`<StatusBadge status="concept" label="Concept" />`}
          >
            <Stack direction="row" gap="xs" wrap>
              {(["concept", "in-development", "prototype", "live"] as const).map((status) => (
                <StatusBadge key={status} status={status} label={en.project.statusLabels[status]} />
              ))}
            </Stack>
          </Specimen>

          <Specimen
            id="media-frame"
            title="MediaFrame"
            source="@/features/portfolio/media-frame"
            portability="portable"
            description="Framed figure with reserved aspect ratio and an honest label for illustrations."
            code={`<MediaFrame label="Conceptual illustration" note="Not a product screenshot." caption="…" ratio="16/10">
  <SystemIllustration … />
</MediaFrame>`}
            props={[
              { name: "label", type: "string", description: "Pinned label (e.g. Conceptual illustration)." },
              { name: "ratio", type: '"16/10" | "4/3" | "1/1" | "3/2"', default: '"16/10"', description: "Reserved aspect ratio, prevents layout shift." },
            ]}
          >
            <MediaFrame label="Example label" note="Example note." caption="Caption text." ratio="3/2">
              <div className="flex h-full items-center justify-center text-silver-dim opacity-40">
                <Rosette className="h-3/4" />
              </div>
            </MediaFrame>
          </Specimen>

          <Specimen
            id="system-illustration"
            title="SystemIllustration"
            source="@/features/portfolio/system-illustration"
            portability="portable"
            description="Conceptual diagram generated from a project's architecture data. Always place it in a labelled MediaFrame."
            code={`<SystemIllustration project={project} tierLabels={dict.project.diagram} />`}
          >
            <MediaFrame label="Conceptual illustration" ratio="16/10">
              <SystemIllustration project={projects[1]!} tierLabels={en.project.diagram} />
            </MediaFrame>
          </Specimen>

          <Specimen
            id="architecture-diagram"
            title="ArchitectureDiagram"
            source="@/features/portfolio/architecture-diagram"
            portability="portable"
            description="Dense, readable tier view with connections; plain HTML so it reflows."
            code={`<ArchitectureDiagram architecture={project.architecture} labels={dict.project.diagram} />`}
          >
            <ArchitectureDiagram architecture={bloodchain.architecture} labels={en.project.diagram} />
          </Specimen>

          <Specimen
            id="case-study-section"
            title="CaseStudySection"
            source="@/features/portfolio/case-study-section"
            portability="portable"
            description="Numbered chapter with a narrow title rail and wide content column."
            code={`<CaseStudySection id="approach" index="02" title="Approach" note="Optional note">…</CaseStudySection>`}
          >
            <CaseStudySection id="demo-section" index="02" title="Approach" note="A short framing note.">
              <p className="text-ink-2">{bloodchain.approach}</p>
            </CaseStudySection>
          </Specimen>

          <Specimen
            id="timeline"
            title="Timeline"
            source="@/features/portfolio/timeline"
            portability="portable"
            description="Ordered steps or dated milestones on a vertical rail. The home page hides milestones until verified ones exist."
            code={`<Timeline items={[{ id: "1", title: "Choose a time", marker: "Step" }]} />`}
          >
            <Timeline items={bloodchain.workflows[0]!.steps.map((step, i) => ({ id: String(i), title: step }))} />
          </Specimen>

          <Specimen
            id="article-preview"
            title="ArticlePreview"
            source="@/features/writing/article-preview"
            portability="next"
            description="Article teaser row. The data below is example data for this explorer only — the public Writing page shows an empty state until real articles exist."
            code={`<ArticlePreview href="/en/writing/slug" title="…" summary="…" date="2026-01-15"
  dateLabel="15 January 2026" readingTime="4 min read" tags={["algorithms"]} />`}
          >
            <ArticlePreview href="#article-preview" title="Example article title" summary="Example summary text (explorer only)." date="2026-01-15" dateLabel="January 15, 2026" readingTime="4 min read" tags={["example"]} />
          </Specimen>
        </section>

        {/* ── Motion ──────────────────────────────────────────────────── */}
        <section id="motion" aria-labelledby="motion-title" className="flex flex-col gap-12">
          <h2 id="motion-title" className="text-display-md font-semibold text-ink">Motion</h2>

          <Specimen
            id="reveal"
            title="Reveal"
            source="@/components/motion/reveal"
            portability="portable"
            description="In-view reveal that never hides content by default: only elements that start below the fold are hidden after hydration. Scroll this into view after a reload to see it run."
            code={`<Reveal as="article" delay={0.1}>…</Reveal>`}
            props={[
              { name: "as", type: '"div" | "section" | "article" | "li" | …', default: '"div"', description: "Element." },
              { name: "delay", type: "number (s)", default: "0", description: "Delay after entering the viewport." },
              { name: "offset", type: "number (px)", default: "28", description: "Initial vertical offset." },
            ]}
            a11y={["Skipped entirely under prefers-reduced-motion; content stays visible if JavaScript fails."]}
          >
            <Reveal className="rounded-md border border-line-strong p-6 text-ink-2">Revealed block</Reveal>
          </Specimen>

          <Specimen
            id="stagger"
            title="Stagger"
            source="@/components/motion/stagger"
            portability="portable"
            description="Reveals children in sequence."
            code={`<ol><Stagger itemAs="li" step={0.08}>{items}</Stagger></ol>`}
          >
            <ol className="grid gap-3 sm:grid-cols-3">
              <Stagger itemAs="li">
                {["One", "Two", "Three"].map((label) => (
                  <div key={label} className="rounded-md border border-line-strong p-5 text-ink-2">{label}</div>
                ))}
              </Stagger>
            </ol>
          </Specimen>

          <Specimen
            id="text-entrance"
            title="TextEntrance"
            source="@/components/motion/text-entrance"
            portability="portable"
            description="Brief CSS-only entrance, word by word. The text exists once in the DOM, so copy, search and screen readers get the plain sentence."
            code={`<h1><TextEntrance text="Jaloliddin" /></h1>          // settle (LCP-safe)
<p><TextEntrance text="Small label" variant="rise" /></p> // fade + rise, small text only`}
            props={[
              { name: "variant", type: '"settle" | "rise"', default: '"settle"', description: "Transform-only glide (large text) or fade-and-rise (small text)." },
              { name: "delay / step", type: "number (ms)", default: "0 / 55", description: "Start delay and stagger." },
            ]}
          >
            <TextEntranceDemo />
          </Specimen>

          <Specimen
            id="hover-surface"
            title="HoverSurface"
            source="@/components/motion/hover-surface"
            portability="portable"
            description="Soft accent light following a fine pointer, plus an optional spring lift."
            code={`<HoverSurface lift className="rounded-lg">…</HoverSurface>`}
          >
            <HoverSurface className="rounded-lg">
              <div className="rounded-lg border border-line-strong p-8 text-ink-2">Move the pointer over this surface.</div>
            </HoverSurface>
          </Specimen>

          <Specimen
            id="reduced-motion"
            title="Reduced-motion utilities"
            source="@/components/motion/{motion-provider, use-reduced-motion}"
            portability="portable"
            description="MotionProvider sets reducedMotion=&quot;user&quot; for every Motion animation; usePrefersReducedMotion is a hydration-safe hook; CSS entrances only run under prefers-reduced-motion: no-preference."
            code={`<MotionProvider>{children}</MotionProvider>
const reduced = usePrefersReducedMotion(); // false on the server, real value after hydration`}
          >
            <ReducedMotionDemo />
          </Specimen>
        </section>

        {/* ── Graphics ────────────────────────────────────────────────── */}
        <section id="graphics" aria-labelledby="graphics-title" className="flex flex-col gap-12">
          <h2 id="graphics-title" className="text-display-md font-semibold text-ink">Graphics</h2>

          <Specimen
            id="hero-fallback"
            title="HeroFallback"
            source="@/components/graphics/hero-fallback"
            portability="portable"
            description="Server-rendered SVG of the J, generated from the same geometry as the 3D scene. First paint, reduced-motion version and WebGL fallback."
            code={`<HeroFallback />`}
            surface="deep"
          >
            <div className="mx-auto aspect-[5/6] w-full max-w-sm">
              <HeroFallback />
            </div>
          </Specimen>

          <Specimen
            id="scene-wrapper"
            title="SceneWrapper (live)"
            source="@/components/graphics/scene-wrapper · hero-scene"
            portability="portable"
            description="Decides between the WebGL scene and the fallback, loads Three.js when idle, pauses offscreen and offers a pause control. Add ?graphics=fallback or ?graphics=webgl to the URL to force a mode."
            code={`const HeroScene = lazy(() => import("@/components/graphics/hero-scene"));
<SceneWrapper scene={HeroScene} fallback={<HeroFallback />}
  label="…" controls={{ pause: "Pause animation", play: "Play animation" }} />`}
            a11y={["The artwork is one role=\"img\" with a description; the pause button is a separate, labelled control."]}
            surface="deep"
          >
            <div className="mx-auto aspect-[5/6] w-full max-w-sm">
              <HeroGraphic fallback={<HeroFallback />} label={en.hero.figureLabel} controls={{ pause: en.hero.pauseMotion, play: en.hero.playMotion }} className="h-full w-full" />
            </div>
          </Specimen>

          <Specimen
            id="ornament"
            title="Ornament"
            source="@/components/graphics/ornament"
            portability="portable"
            description="Restrained girih / khatam geometry generated from polygon math: rosette, star mark and tileable field."
            code={`<Rosette className="text-silver-dim opacity-10" animated />
<StarMark size={14} className="text-accent-ink" />
<GirihField id="my-field" />`}
          >
            <div className="grid items-center gap-6 sm:grid-cols-3">
              <Rosette className="w-full text-silver-dim opacity-50" />
              <div className="flex justify-center"><StarMark size={48} className="text-accent-ink" /></div>
              <div className="h-40 text-silver-dim opacity-40"><GirihField id="explorer-girih" /></div>
            </div>
          </Specimen>

          <Specimen
            id="array-strip"
            title="ArrayStrip"
            source="@/features/lab/binary-search/array-strip"
            portability="portable"
            description="Presentational array with low / mid / high pointers for one binary-search step."
            code={`<ArrayStrip array={array} step={trace.steps[1]} labels={{ low: "low", mid: "mid", high: "high", index: "index" }} />`}
            surface="deep"
          >
            <ArrayStrip array={sample} step={trace.steps[1]!} labels={{ low: "low", mid: "mid", high: "high", index: "index" }} />
          </Specimen>
        </section>
      </main>
    </div>
  );
}
