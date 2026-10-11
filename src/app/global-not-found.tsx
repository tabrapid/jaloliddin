import type { Metadata } from "next";

import { NotFoundView } from "@/features/site/not-found-view";
import { en } from "@/i18n/dictionaries/en";
import { fontVariables } from "@/styles/fonts";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: `${en.notFound.title} — Jaloliddin`,
  description: en.notFound.description,
};

/** 404 for URLs outside the locale tree (rendered without the site layout). */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col bg-canvas text-ink">
        <main id="main-content" className="flex flex-1 flex-col">
          <NotFoundView dict={en} homeHref="/en" workHref="/en/work" />
        </main>
      </body>
    </html>
  );
}
