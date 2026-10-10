import { describe, expect, it } from "vitest";

import { hasLocale } from "./config";
import { format } from "./format";
import { localeAlternates, localizePath, splitLocale, switchLocalePath } from "./paths";

describe("locale paths", () => {
  it("prefixes paths with the locale", () => {
    expect(localizePath("en")).toBe("/en");
    expect(localizePath("uz", "/")).toBe("/uz");
    expect(localizePath("uz", "/work/bloodchain")).toBe("/uz/work/bloodchain");
    expect(localizePath("en", "work/")).toBe("/en/work");
    expect(localizePath("en", "/#work")).toBe("/en#work");
  });

  it("splits a pathname into locale and path", () => {
    expect(splitLocale("/uz/work/bloodchain")).toEqual({ locale: "uz", path: "/work/bloodchain" });
    expect(splitLocale("/en")).toEqual({ locale: "en", path: "/" });
    expect(splitLocale("/fr/work")).toEqual({ locale: null, path: "/fr/work" });
  });

  it("switches language while preserving the current page", () => {
    expect(switchLocalePath("/en/work/bloodchain", "uz")).toBe("/uz/work/bloodchain");
    expect(switchLocalePath("/uz", "en")).toBe("/en");
    expect(switchLocalePath("/en/lab/binary-search/", "uz")).toBe("/uz/lab/binary-search");
  });

  it("builds hreflang alternates with x-default", () => {
    expect(localeAlternates("/about")).toEqual({ en: "/en/about", uz: "/uz/about", "x-default": "/en/about" });
  });

  it("validates locales", () => {
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("uz")).toBe(true);
    expect(hasLocale("ru")).toBe(false);
    expect(hasLocale(undefined)).toBe(false);
  });
});

describe("format", () => {
  it("fills placeholders and leaves unknown ones", () => {
    expect(format("Step {current} of {total}", { current: 2, total: 5 })).toBe("Step 2 of 5");
    expect(format("Hello {name}")).toBe("Hello {name}");
  });
});
