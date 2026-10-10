"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MenuIcon } from "@/components/ui/icons";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

import { LanguageSwitcher } from "./language-switcher";
import { isActivePath, type NavLinkItem } from "./nav-links";

export interface MobileNavProps {
  locale: Locale;
  items: NavLinkItem[];
  homeHref: string;
  labels: {
    menu: string;
    closeMenu: string;
    menuTitle: string;
    home: string;
    language: string;
    switchTo: string;
  };
}

/** Full-screen navigation sheet for small screens (Radix Dialog). */
export function MobileNav({ locale, items, homeHref, labels }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const all = [{ href: homeHref, label: labels.home }, ...items];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line-strong px-4 text-[0.9375rem] text-ink transition-colors hover:border-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        data-testid="menu-trigger"
      >
        <MenuIcon size={18} />
        {labels.menu}
      </DialogTrigger>
      <DialogContent
        layout="sheet"
        closeLabel={labels.closeMenu}
        aria-describedby={undefined}
        header={<DialogTitle className="text-label text-ink-3">{labels.menuTitle}</DialogTitle>}
      >
        <nav aria-label={labels.menuTitle} className="flex flex-1 flex-col justify-between overflow-y-auto px-gutter pt-6 pb-10">
          <ol className="flex flex-col">
            {all.map((item, index) => {
              const active = item.href === homeHref ? pathname === homeHref : isActivePath(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <DialogClose asChild>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-16 items-baseline gap-4 py-3 text-[2.25rem] leading-none font-semibold tracking-[-0.035em] transition-colors",
                        active ? "text-ink" : "text-ink-2 hover:text-ink",
                      )}
                    >
                      <span className="text-label w-7 text-ink-3" aria-hidden="true">
                        {String(index).padStart(2, "0")}
                      </span>
                      {item.label}
                      {active ? <span aria-hidden="true" className="ml-auto size-2 self-center rounded-full bg-accent" /> : null}
                    </Link>
                  </DialogClose>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 flex flex-col gap-3" onClickCapture={() => setOpen(false)}>
            <span className="text-label text-ink-3">{labels.language}</span>
            <LanguageSwitcher
              current={locale}
              size="lg"
              labels={{ language: labels.language, switchTo: labels.switchTo }}
              className="self-start"
            />
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
