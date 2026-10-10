# Reusing components in another React project

The explorer (`pnpm dev` → <http://localhost:3000/explorer>) labels every component as
**Portable React**, **Needs Next.js** or **Site-specific**. Not everything is portable; this
page says exactly what each part requires.

## 1. Foundations (required for everything)

Copy `src/styles/globals.css`. It holds the Tailwind v4 import, tokens, base styles,
utilities and keyframes. Then:

- Install Tailwind v4: `tailwindcss@^4 @tailwindcss/postcss@^4` with a PostCSS config like
  `postcss.config.mjs`.
- Provide the fonts. Either reuse the woff2 files in `src/styles/fonts/` (OFL licences
  included) with your framework’s font loader, or plain `@font-face` rules that set
  `--font-schibsted` and `--font-redhat-mono` on `:root`.
- Copy `src/lib/cn.ts` (a three-line class joiner).

## 2. Portability by folder

| Folder / component | Requires | Notes |
| --- | --- | --- |
| `components/layout/*` (Container, Section, Stack, Grid, Divider) | React | Server-compatible, no hooks. |
| `components/ui/button`, `badge`, `field`, `icons`, `visually-hidden` | React, `@radix-ui/react-slot` (Button) | `Field` uses `useId`. |
| `components/ui/tabs`, `accordion`, `dialog`, `tooltip` | React 18+/19, matching `@radix-ui/react-*` packages | Client components (`"use client"` is harmless outside Next). |
| `components/ui/copy-button` | React | Uses the Clipboard API with a fallback. |
| `components/motion/*` | `motion` (12.x) | Wrap the app in `MotionProvider` once (needed for `m` components with `LazyMotion strict`). `TextEntrance` is CSS-only and needs the `.entrance` keyframes from globals.css. |
| `components/graphics/j-geometry`, `ornament`, `hero-fallback` | React only | Pure math + SVG. |
| `components/graphics/scene-wrapper`, `capabilities` | React | Generic: pass any `React.lazy` scene that accepts `SceneComponentProps`. |
| `components/graphics/hero-scene` | `three` 0.182 (or later; newer versions log a Clock deprecation via R3F), `@react-three/fiber` 9.x | Client-only. Load with `React.lazy`, never during SSR. |
| `features/portfolio/media-frame`, `project-meta`, `timeline`, `case-study-section`, `status-badge`, `system-illustration`, `architecture-diagram` | React (+ the `Project` type) | Presentational. They depend on `@/types/content` shapes, not on Next. |
| `features/lab/binary-search/algorithm`, `step-player`, `explain` | None (TypeScript) | Framework-free logic with tests. |
| `features/lab/binary-search/binary-search-visualizer`, `array-strip` | React | Expects the `binarySearch` dictionary shape for labels. |
| `features/portfolio/project-preview`, `case-study`, `features/writing/article-preview`, `features/site/*` | **Next.js** (`next/link`, `next/navigation`) | Replace `Link` / `usePathname` with your router’s equivalents. |
| `features/writing/articles` | Node `fs`, `yaml`, `marked`, server-only | Server-side loader; adapt paths for your framework. |
| `src/app/**`, `proxy.ts`, metadata routes, `next/font`, `next/og` | **Next.js 16** | Framework-specific by design. |

## 3. Path alias

Imports use `@/…` → `src/…`. Configure the same alias (tsconfig `paths` plus your bundler)
or rewrite imports when copying.

## 4. Minimal example (Vite + React)

```tsx
import "./globals.css";
import { MotionProvider } from "./components/motion/motion-provider";
import { Button } from "./components/ui/button";
import { Reveal } from "./components/motion/reveal";

export function App() {
  return (
    <MotionProvider>
      <Reveal>
        <Button asChild>
          <a href="/work">See work</a>
        </Button>
      </Reveal>
    </MotionProvider>
  );
}
```

## 5. Constraints to remember

- Components assume the dark token set. A light theme needs a second set of semantic values,
  not component edits.
- Keep `aria-*` props and required labels (`closeLabel`, Field `label`, icon button names)
  when you adapt components; accessibility is part of their contract.
- The explorer, metadata routes and OG images are not meant to be copied; they are examples of
  Next.js integration.
