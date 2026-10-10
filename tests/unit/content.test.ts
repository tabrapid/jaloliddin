import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { contactChannels } from "@/config/contact";
import { milestones } from "@/content/milestones";
import { profile } from "@/content/profile";
import { projectRecords } from "@/content/projects";
import { locales } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { uz } from "@/i18n/dictionaries/uz";
import { getProjects } from "@/lib/projects";

/** Collects every string leaf of a value with its path. */
function leaves(value: unknown, at = "$"): [string, string][] {
  if (typeof value === "string") return [[at, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => leaves(item, `${at}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => leaves(item, `${at}.${key}`));
  }
  return [];
}

function keyShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(keyShape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, keyShape(item)]));
  }
  return typeof value;
}

describe("dictionaries", () => {
  it("have identical keys in every locale", () => {
    expect(keyShape(uz)).toEqual(keyShape(en));
  });

  it("have no empty strings", () => {
    for (const [at, text] of [...leaves(en), ...leaves(uz)]) {
      expect(text.trim(), at).not.toBe("");
    }
  });

  it("keep the same placeholders across translations", () => {
    const enLeaves = new Map(leaves(en));
    for (const [at, text] of leaves(uz)) {
      const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(placeholders(text), at).toEqual(placeholders(enLeaves.get(at) ?? ""));
    }
  });
});

describe("projects", () => {
  it("have unique slugs and orders", () => {
    expect(new Set(projectRecords.map((p) => p.slug)).size).toBe(projectRecords.length);
    expect(new Set(projectRecords.map((p) => p.order)).size).toBe(projectRecords.length);
  });

  it("resolve completely in every locale", () => {
    for (const locale of locales) {
      for (const project of getProjects(locale)) {
        for (const [at, text] of leaves(project)) {
          expect(text.trim(), `${project.slug} ${locale} ${at}`).not.toBe("");
        }
      }
    }
  });

  it("only claim 'live' with a live link and only list verified links", () => {
    for (const project of projectRecords) {
      if (project.status === "live") expect(project.links.live, project.slug).toMatch(/^https:\/\//);
      for (const url of Object.values(project.links)) expect(url).toMatch(/^https:\/\//);
    }
  });

  it("reference only existing nodes in architecture edges", () => {
    for (const project of projectRecords) {
      const ids = new Set(project.architecture.nodes.map((n) => n.id));
      for (const edge of project.architecture.edges) {
        expect(ids.has(edge.from) && ids.has(edge.to), `${project.slug} ${edge.from}→${edge.to}`).toBe(true);
      }
    }
  });

  it("keep Bloodchain's exact name and honest status", () => {
    const bloodchain = projectRecords.find((p) => p.slug === "bloodchain");
    expect(bloodchain?.title).toBe("Bloodchain");
    expect(bloodchain?.status).not.toBe("live");
    expect(bloodchain?.links).toEqual({});
  });
});

describe("truthfulness guards", () => {
  const sources: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(ts|tsx|md)$/.test(name) && !name.endsWith(".test.ts")) sources.push(full);
    }
  };
  walk(path.join(process.cwd(), "src"));

  it("never misspell the flagship project", () => {
    for (const file of sources) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/Bloodchainga/);
    }
  });

  it("never render TODO markers from content or dictionaries", () => {
    const publicText = [...leaves(en), ...leaves(uz), ...leaves(profile), ...leaves(projectRecords), ...leaves(milestones)];
    for (const [at, text] of publicText) {
      expect(text, at).not.toMatch(/\bTODO\b|lorem ipsum|placeholder/i);
    }
  });

  it("make no unverified impact claims in project content", () => {
    for (const [at, text] of leaves(projectRecords)) {
      expect(text, at).not.toMatch(/\b\d[\d,.]*\+?\s*(users|donors|hospitals|downloads|customers)\b/i);
      expect(text, at).not.toMatch(/app store|google play|clinically (approved|tested)|\bFDA\b|\bcertified\b/i);
    }
  });

  it("ship with only real or empty contact channels", () => {
    for (const channel of contactChannels) {
      if (channel.value) expect(channel.value).not.toMatch(/example|TODO|your-/i);
    }
  });
});
