/**
 * Contact channels. Set `value` to enable a channel; `null` keeps it hidden.
 * Only values that pass validation are rendered (see src/lib/contact.ts), so a
 * typo can never produce a broken public link.
 *
 * Accepted values:
 * - email:      "name@example.com"
 * - github:     "https://github.com/<username>"
 * - telegram:   "https://t.me/<username>"
 * - linkedin:   "https://www.linkedin.com/in/<handle>"
 * - x:          "https://x.com/<handle>"
 * - leetcode:   "https://leetcode.com/u/<username>"
 * - codeforces: "https://codeforces.com/profile/<handle>"
 */
export type ContactKind = "email" | "github" | "telegram" | "linkedin" | "x" | "leetcode" | "codeforces";

export interface ContactChannelConfig {
  kind: ContactKind;
  value: string | null;
}

export const contactChannels: ContactChannelConfig[] = [
  { kind: "email", value: null },
  { kind: "github", value: null },
  { kind: "telegram", value: null },
  { kind: "linkedin", value: null },
  { kind: "codeforces", value: null },
  { kind: "leetcode", value: null },
  { kind: "x", value: null },
];
