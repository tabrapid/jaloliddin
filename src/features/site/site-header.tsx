import Link from "next/link";

import { StarMark } from "@/components/graphics/ornament";
import { primaryNav } from "@/config/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizePath } from "@/i18n/paths";

import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = primaryNav.map((item) => ({ href: localizePath(locale, item.path), label: dict.nav[item.key] }));
  const homeHref = localizePath(locale);

  return (
    <header className="glass fixed inset-x-0 top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-6 px-gutter lg:h-18">
        <Link
          href={homeHref}
          className="group flex min-h-11 items-center gap-2.5 rounded-xs text-ink"
          aria-label={`Jaloliddin — ${dict.nav.home}`}
        >
          <StarMark size={18} className="text-accent-ink transition-transform duration-700 ease-out-expo group-hover:rotate-45" />
          <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">Jaloliddin</span>
          <span className="text-label hidden text-ink-3 xl:inline">/ Digital Workshop</span>
        </Link>

        <nav aria-label={dict.a11y.primaryNav} className="hidden lg:block">
          <NavLinks items={items} />
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher
            current={locale}
            labels={{ language: dict.nav.language, switchTo: dict.nav.switchTo }}
            className="hidden sm:inline-flex"
          />
          <div className="lg:hidden">
            <MobileNav
              locale={locale}
              items={items}
              homeHref={homeHref}
              labels={{
                menu: dict.nav.menu,
                closeMenu: dict.nav.closeMenu,
                menuTitle: dict.nav.menuTitle,
                home: dict.nav.home,
                language: dict.nav.language,
                switchTo: dict.nav.switchTo,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
