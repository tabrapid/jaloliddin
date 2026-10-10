import { CopyButton } from "@/components/ui/copy-button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import type { ContactLink } from "@/lib/contact";

export interface ContactListProps {
  links: ContactLink[];
  dict: Dictionary;
  className?: string;
}

/** Configured contact channels as large rows; renders nothing when empty. */
export function ContactList({ links, dict, className }: ContactListProps) {
  if (links.length === 0) return null;
  return (
    <ul className={cn("flex flex-col border-t border-line", className)}>
      {links.map((link) => (
        <li key={link.kind} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line py-5">
          <span className="text-label w-28 shrink-0 text-ink-3">{dict.contactLabels[link.kind]}</span>
          <a
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group inline-flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xs text-[1.25rem] font-medium break-all text-ink transition-colors hover:text-accent-glow sm:text-[1.5rem]"
          >
            {link.display}
            {link.external ? (
              <>
                <ArrowUpRightIcon size={18} className="shrink-0 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">({dict.a11y.opensInNewTab})</span>
              </>
            ) : null}
          </a>
          {link.copyValue ? (
            <CopyButton
              value={link.copyValue}
              srContext={dict.contactLabels[link.kind]}
              labels={{ copy: dict.contactPage.copy, copied: dict.contactPage.copied, error: dict.contactPage.copyFailed }}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
