import type { CSSProperties } from "react";

import { HeroFallback } from "@/components/graphics/hero-fallback";
import { Rosette, StarMark } from "@/components/graphics/ornament";
import { TextEntrance } from "@/components/motion/text-entrance";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { profile } from "@/content/profile";
import { LocaleLink } from "@/features/site/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

import { HeroGraphic } from "./hero-graphic";

/**
 * First viewport. Two layers share one grid:
 * - art (z-0): ornament rosette + signature J, right-aligned;
 * - type (z-10): name, statement, intro and calls to action.
 * The type layer ignores pointer events except on its blocks, so the art's
 * pause control stays reachable wherever it is not covered by text.
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const delay = (ms: number) => ({ "--entrance-delay": ms }) as CSSProperties;

  return (
    <section aria-labelledby="hero-title" className="atmosphere relative isolate overflow-hidden">
      <div className="relative mx-auto max-w-site px-gutter">
        <div
          className="absolute top-4 right-0 z-0 aspect-[5/6] w-[min(82vw,24rem)] sm:w-[min(64vw,26rem)] md:top-6 md:w-[min(50vw,32rem)] lg:top-6 lg:right-[calc(var(--space-gutter)*0.5)] lg:bottom-6 lg:aspect-auto lg:w-[min(40%,38rem)]"
          data-testid="hero-art"
        >
          <Rosette
            className="pointer-events-none absolute top-1/2 left-1/2 w-[130%] -translate-x-1/2 -translate-y-1/2 text-silver-dim opacity-[0.11] lg:w-[150%]"
            animated
          />
          <figure className="absolute inset-0">
            <HeroGraphic
              fallback={<HeroFallback />}
              label={dict.hero.figureLabel}
              controls={{ pause: dict.hero.pauseMotion, play: dict.hero.playMotion }}
              className="h-full w-full"
            />
            <figcaption className="text-label pointer-events-none absolute right-0 bottom-16 hidden text-ink-3 [writing-mode:vertical-rl] lg:block">
              {dict.hero.figureCaption}
            </figcaption>
          </figure>
        </div>

        <div className="pointer-events-none relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-between gap-10 pt-8 pb-12 lg:min-h-[min(calc(100svh-4.5rem),60rem)] lg:pt-12 lg:pb-16">
          <p className="text-label entrance-fade pointer-events-auto flex w-fit items-center gap-3 text-ink-2" style={delay(0)}>
            <StarMark size={14} className="text-accent-ink" />
            {dict.hero.eyebrow}
          </p>

          <div className="flex flex-col gap-8 pt-[min(30svh,13rem)] sm:pt-[min(34svh,16rem)] lg:max-w-[60%] lg:gap-10 lg:pt-0">
            <h1
              id="hero-title"
              className="text-display-xl pointer-events-auto w-fit font-bold text-ink [text-shadow:0_2px_48px_rgb(12_13_16/0.75)] lg:text-[min(11.4vw,12.5rem)]"
            >
              <TextEntrance text={profile.name} delay={40} />
            </h1>

            <p className="text-display-md pointer-events-auto max-w-[16ch] font-semibold text-ink">
              <TextEntrance text={profile.heroStatement[locale]} delay={140} step={55} />
            </p>
            <div className="pointer-events-auto flex max-w-[38rem] flex-col gap-7">
              <p className="entrance-settle text-lead text-ink-2" style={delay(260)}>
                {profile.heroIntro[locale]}
              </p>
              <div className="entrance flex flex-col gap-3 xs:flex-row xs:flex-wrap" style={delay(520)}>
                <Button asChild size="lg">
                  <LocaleLink locale={locale} href="/#work">
                    {dict.hero.primaryCta}
                    <ArrowRightIcon
                      size={18}
                      className="transition-transform duration-300 ease-out-expo group-hover/button:translate-x-0.5"
                    />
                  </LocaleLink>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <LocaleLink locale={locale} href="/contact">
                    {dict.hero.secondaryCta}
                  </LocaleLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
