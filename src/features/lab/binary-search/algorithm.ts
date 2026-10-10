/**
 * Binary search as an explicit trace of steps, independent of any UI.
 * Each step is a snapshot the visualizer can render and explain.
 */

/** How the value at `mid` compares with the target. */
export type Comparison = "equal" | "less" | "greater";

export type SearchStep =
  | { kind: "start"; low: number; high: number }
  | {
      kind: "compare";
      /** Range under consideration before this comparison. */
      low: number;
      high: number;
      mid: number;
      value: number;
      comparison: Comparison;
      /** Range after applying the decision (equal to low/high when found). */
      nextLow: number;
      nextHigh: number;
    }
  | { kind: "not-found"; low: number; high: number };

export type SearchResult = { found: true; index: number; comparisons: number } | { found: false; comparisons: number };

export interface SearchTrace {
  array: readonly number[];
  target: number;
  steps: SearchStep[];
  result: SearchResult;
}

export function isSortedAscending(array: readonly number[]): boolean {
  for (let i = 1; i < array.length; i++) {
    if (array[i - 1]! > array[i]!) return false;
  }
  return true;
}

/** Runs binary search over an ascending array and records every step. */
export function traceBinarySearch(array: readonly number[], target: number): SearchTrace {
  if (!isSortedAscending(array)) {
    throw new Error("traceBinarySearch requires an array sorted in ascending order");
  }

  let low = 0;
  let high = array.length - 1;
  let comparisons = 0;
  const steps: SearchStep[] = [{ kind: "start", low, high }];

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const value = array[mid]!;
    comparisons++;

    if (value === target) {
      steps.push({ kind: "compare", low, high, mid, value, comparison: "equal", nextLow: low, nextHigh: high });
      return { array, target, steps, result: { found: true, index: mid, comparisons } };
    }

    if (value < target) {
      steps.push({ kind: "compare", low, high, mid, value, comparison: "less", nextLow: mid + 1, nextHigh: high });
      low = mid + 1;
    } else {
      steps.push({ kind: "compare", low, high, mid, value, comparison: "greater", nextLow: low, nextHigh: mid - 1 });
      high = mid - 1;
    }
  }

  steps.push({ kind: "not-found", low, high });
  return { array, target, steps, result: { found: false, comparisons } };
}

/** Worst-case number of comparisons: ⌊log₂ n⌋ + 1 (0 for an empty array). */
export function maxComparisons(length: number): number {
  return length <= 0 ? 0 : Math.floor(Math.log2(length)) + 1;
}

/** Small deterministic PRNG (mulberry32) so arrays are reproducible per seed. */
function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A sorted array of distinct integers in [1, max]. The same seed always
 * yields the same array, which keeps server and client renders identical.
 */
export function createSortedSample(seed: number, length = 15, max = 99): number[] {
  if (length > max) throw new Error("length cannot exceed max for distinct values");
  const random = mulberry32(seed);
  const values = new Set<number>();
  while (values.size < length) values.add(1 + Math.floor(random() * max));
  return [...values].sort((a, b) => a - b);
}

/** Picks a value from the array (deterministic per seed). */
export function pickPresentValue(array: readonly number[], seed: number): number {
  if (array.length === 0) throw new Error("array is empty");
  const random = mulberry32(seed ^ 0x9e3779b9);
  return array[Math.floor(random() * array.length)]!;
}

/** Picks an integer within the array's span that is not in the array, if any. */
export function pickMissingValue(array: readonly number[], seed: number): number {
  const present = new Set(array);
  const min = array.length ? array[0]! : 0;
  const max = array.length ? array[array.length - 1]! : 10;
  const candidates: number[] = [];
  for (let value = min; value <= max; value++) if (!present.has(value)) candidates.push(value);
  if (candidates.length === 0) return max + 1;
  const random = mulberry32(seed ^ 0x85ebca6b);
  return candidates[Math.floor(random() * candidates.length)]!;
}
