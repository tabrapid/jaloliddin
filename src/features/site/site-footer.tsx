import Link from "next/link";

import { GirihField, StarMark } from "@/components/graphics/ornament";
import { ArrowUpIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { primaryNav } from "@/config/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { format } from "@/i18n/format";
import { localizePath } from "@/i18n/paths";
import { getContactLinks } from "@/lib/contact";

import { LanguageSwitcher } from "./language-switcher";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const contacts = getContactLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-canvas-deep">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 text-silver-dim opacity-[0.07] [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <GirihField id="footer-girih" />
      </div>

      <div className="relative mx-auto grid max-w-site grid-cols-4 gap-x-6 gap-y-12 px-gutter pt-20 pb-10 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-5">
          <Link href={localizePath(locale)} className="flex items-center gap-3 self-start rounded-xs text-ink">
            <StarMark size={22} className="text-accent-ink" />
            <span className="text-[1.75rem] font-semibold tracking-[-0.03em]">Jaloliddin</span>
          </Link>
          <p className="max-w-sm text-ink-3">{dict.footer.tagline}</p>
        </div>

        <nav aria-label={dict.a11y.footerNav} className="col-span-2 md:col-span-3 lg:col-span-2 lg:col-start-7">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={localizePath(locale, item.path)}
                  className="inline-flex min-h-10 items-center rounded-xs text-ink-2 transition-colors hover:text-ink"
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {contacts.length > 0 ? (
          <ul className="col-span-2 flex flex-col gap-1 md:col-span-3 lg:col-span-2">
            {contacts.map((link) => (
              <li key={link.kind}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group inline-flex min-h-10 items-center gap-1.5 rounded-xs text-ink-2 transition-colors hover:text-ink"
                >
                  {dict.contactLabels[link.kind]}
                  {link.external ? (
                    <>
                      <ArrowUpRightIcon size={14} className="text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      <span className="sr-only">({dict.a11y.opensInNewTab})</span>
                    </>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="col-span-4 flex flex-col items-start gap-3 md:col-span-2 lg:col-span-2 lg:items-end">
          <LanguageSwitcher current={locale} labels={{ language: dict.nav.language, switchTo: dict.nav.switchTo }} />
        </div>

        <div className="col-span-4 flex flex-col gap-4 border-t border-line pt-8 text-small text-ink-3 md:col-span-8 md:flex-row md:items-center md:justify-between lg:col-span-12">
          <p>
            {format(dict.footer.rights, { year })} · {dict.footer.builtWith}
          </p>
          <a href="#top" className="group inline-flex min-h-11 items-center gap-2 self-start rounded-xs text-ink-2 hover:text-ink md:self-auto">
            {dict.footer.backToTop}
            <ArrowUpIcon size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
