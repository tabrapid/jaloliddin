import Link from "next/link";

import { Rosette } from "@/components/graphics/ornament";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function NotFoundView({ dict, homeHref, workHref }: { dict: Dictionary; homeHref: string; workHref: string }) {
  return (
    <section aria-labelledby="not-found-title" className="atmosphere relative isolate flex flex-1 items-center overflow-hidden">
      <Rosette className="pointer-events-none absolute top-1/2 right-[-20%] -z-10 w-[min(120vw,64rem)] -translate-y-1/2 text-silver-dim opacity-[0.12] md:right-[-8%]" />
      <div className="mx-auto flex w-full max-w-site flex-col gap-8 px-gutter py-section-tight">
        <p className="text-label text-accent-ink">{dict.notFound.code}</p>
        <h1 id="not-found-title" className="text-display-lg max-w-[14ch] font-semibold text-ink">
          {dict.notFound.title}
        </h1>
        <p className="text-lead max-w-[36rem] text-ink-2">{dict.notFound.body}</p>
        <div className="flex flex-col gap-3 xs:flex-row">
          <Button asChild size="lg">
            <Link href={homeHref}>
              <ArrowLeftIcon size={18} />
              {dict.notFound.home}
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href={workHref}>
              {dict.notFound.work}
              <ArrowRightIcon size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
