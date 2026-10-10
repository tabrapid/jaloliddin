import { describe, expect, it } from "vitest";

import {
  createSortedSample,
  isSortedAscending,
  maxComparisons,
  pickMissingValue,
  pickPresentValue,
  traceBinarySearch,
} from "./algorithm";

describe("traceBinarySearch", () => {
  const array = [3, 8, 15, 21, 34, 42, 57, 63, 71, 88, 92, 99];

  it("finds every present value at its index", () => {
    array.forEach((value, index) => {
      const { result } = traceBinarySearch(array, value);
      expect(result).toMatchObject({ found: true, index });
    });
  });

  it("reports values that are absent, including below and above the range", () => {
    for (const value of [1, 4, 50, 98, 100]) {
      const trace = traceBinarySearch(array, value);
      expect(trace.result.found).toBe(false);
      const last = trace.steps.at(-1)!;
      expect(last.kind).toBe("not-found");
      expect(last.low).toBeGreaterThan(last.high);
    }
  });

  it("starts with the full range and narrows it on every comparison", () => {
    const trace = traceBinarySearch(array, 88);
    expect(trace.steps[0]).toEqual({ kind: "start", low: 0, high: 11 });
    for (const step of trace.steps) {
      if (step.kind !== "compare") continue;
      expect(step.mid).toBeGreaterThanOrEqual(step.low);
      expect(step.mid).toBeLessThanOrEqual(step.high);
      if (step.comparison === "less") expect(step.nextLow).toBe(step.mid + 1);
      if (step.comparison === "greater") expect(step.nextHigh).toBe(step.mid - 1);
      if (step.comparison !== "equal") {
        expect(step.nextHigh - step.nextLow).toBeLessThan(step.high - step.low);
      }
    }
  });

  it("never exceeds ⌊log2 n⌋ + 1 comparisons and agrees with a linear scan", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const sample = createSortedSample(seed, 1 + (seed % 40), 99);
      for (let target = 0; target <= 100; target++) {
        const { result } = traceBinarySearch(sample, target);
        const expected = sample.indexOf(target);
        expect(result.found ? result.index : -1).toBe(expected);
        expect(result.comparisons).toBeLessThanOrEqual(maxComparisons(sample.length));
      }
    }
  });

  it("handles an empty array", () => {
    const trace = traceBinarySearch([], 5);
    expect(trace.result).toEqual({ found: false, comparisons: 0 });
    expect(trace.steps.map((step) => step.kind)).toEqual(["start", "not-found"]);
  });

  it("rejects unsorted input", () => {
    expect(() => traceBinarySearch([3, 1, 2], 2)).toThrow(/sorted/);
  });
});

describe("helpers", () => {
  it("computes the worst case", () => {
    expect([0, 1, 2, 3, 7, 8, 12, 16].map(maxComparisons)).toEqual([0, 1, 2, 2, 3, 4, 4, 5]);
  });

  it("creates deterministic, sorted, distinct samples", () => {
    const a = createSortedSample(42, 12, 99);
    expect(a).toEqual(createSortedSample(42, 12, 99));
    expect(isSortedAscending(a)).toBe(true);
    expect(new Set(a).size).toBe(12);
    expect(a.every((value) => value >= 1 && value <= 99)).toBe(true);
  });

  it("picks present and missing values correctly", () => {
    const sample = createSortedSample(7, 12, 99);
    for (let seed = 0; seed < 50; seed++) {
      expect(sample).toContain(pickPresentValue(sample, seed));
      expect(sample).not.toContain(pickMissingValue(sample, seed));
    }
  });
});
