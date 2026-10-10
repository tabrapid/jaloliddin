import { describe, expect, it } from "vitest";

import { contactChannels } from "@/config/contact";

import { getContactLinks, toContactLink } from "./contact";

describe("contact links", () => {
  it("renders nothing for unconfigured channels", () => {
    expect(toContactLink({ kind: "email", value: null })).toBeNull();
    expect(toContactLink({ kind: "github", value: "  " })).toBeNull();
  });

  it("accepts valid values", () => {
    expect(toContactLink({ kind: "email", value: "name@example.com" })).toMatchObject({
      href: "mailto:name@example.com",
      external: false,
      copyValue: "name@example.com",
    });
    expect(toContactLink({ kind: "github", value: "https://github.com/octocat" })).toMatchObject({
      href: "https://github.com/octocat",
      display: "github.com/octocat",
      external: true,
    });
    expect(toContactLink({ kind: "telegram", value: "https://t.me/example_user" })?.display).toBe("t.me/example_user");
    expect(toContactLink({ kind: "linkedin", value: "https://www.linkedin.com/in/someone" })?.display).toBe(
      "linkedin.com/in/someone",
    );
  });

  it("rejects malformed, insecure or mismatched destinations", () => {
    expect(toContactLink({ kind: "email", value: "not-an-email" })).toBeNull();
    expect(toContactLink({ kind: "github", value: "http://github.com/octocat" })).toBeNull();
    expect(toContactLink({ kind: "github", value: "https://gitlab.com/octocat" })).toBeNull();
    expect(toContactLink({ kind: "github", value: "https://github.com/a/b" })).toBeNull();
    expect(toContactLink({ kind: "telegram", value: "javascript:alert(1)" })).toBeNull();
    expect(toContactLink({ kind: "x", value: "github.com/user" })).toBeNull();
  });

  it("only returns valid configured channels", () => {
    const links = getContactLinks([
      { kind: "email", value: "hi@example.com" },
      { kind: "github", value: null },
      { kind: "telegram", value: "bad" },
    ]);
    expect(links.map((link) => link.kind)).toEqual(["email"]);
  });

  it("never renders a placeholder from the shipped configuration", () => {
    for (const link of getContactLinks(contactChannels)) {
      expect(link.href).not.toMatch(/example\.(com|org)|TODO|placeholder/i);
    }
  });
});
