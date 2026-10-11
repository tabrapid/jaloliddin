import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/motion/motion-provider";
import { fontVariables } from "@/styles/fonts";

import "@/styles/globals.css";

// Development-only route: the page renders nothing outside `next dev`.
export const metadata: Metadata = {
  title: "Component explorer — Digital Workshop",
  robots: { index: false, follow: false },
};

export default function ExplorerLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-canvas text-ink">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
