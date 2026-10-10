import { contactChannels, type ContactChannelConfig, type ContactKind } from "@/config/contact";

export interface ContactLink {
  kind: ContactKind;
  href: string;
  /** Human-readable value, e.g. "github.com/jaloliddin". */
  display: string;
  external: boolean;
  /** Raw value suitable for copying (email address). */
  copyValue?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const profileHosts: Record<Exclude<ContactKind, "email">, { hosts: string[]; path: RegExp }> = {
  github: { hosts: ["github.com"], path: /^\/[A-Za-z0-9-]{1,39}\/?$/ },
  telegram: { hosts: ["t.me"], path: /^\/[A-Za-z0-9_]{4,32}\/?$/ },
  linkedin: { hosts: ["linkedin.com", "www.linkedin.com"], path: /^\/in\/[A-Za-z0-9-_%]{2,100}\/?$/ },
  x: { hosts: ["x.com", "twitter.com"], path: /^\/[A-Za-z0-9_]{1,15}\/?$/ },
  leetcode: { hosts: ["leetcode.com"], path: /^\/(u\/)?[A-Za-z0-9-_]{1,40}\/?$/ },
  codeforces: { hosts: ["codeforces.com"], path: /^\/profile\/[A-Za-z0-9-_.]{1,40}\/?$/ },
};

/** Validates one channel. Returns null for empty or malformed values. */
export function toContactLink(channel: ContactChannelConfig): ContactLink | null {
  const value = channel.value?.trim();
  if (!value) return null;

  if (channel.kind === "email") {
    if (!EMAIL_PATTERN.test(value)) return null;
    return { kind: "email", href: `mailto:${value}`, display: value, external: false, copyValue: value };
  }

  const rule = profileHosts[channel.kind];
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !rule.hosts.includes(url.hostname) || !rule.path.test(url.pathname)) {
    return null;
  }
  const display = `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/$/, "")}`;
  return { kind: channel.kind, href: url.toString(), display, external: true };
}

export function getContactLinks(channels: ContactChannelConfig[] = contactChannels): ContactLink[] {
  return channels.map(toContactLink).filter((link): link is ContactLink => link !== null);
}
