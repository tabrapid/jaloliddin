import { format } from "@/i18n/format";

import type { SearchStep } from "./algorithm";

/** The subset of dictionary strings needed to narrate a search. */
export interface ExplainStrings {
  stepStart: string;
  stepEqual: string;
  stepLess: string;
  stepGreater: string;
  stepNotFound: string;
}

/** Plain-language narration of one step, filled from localized templates. */
export function explainStep(step: SearchStep, target: number, strings: ExplainStrings): string {
  switch (step.kind) {
    case "start":
      return format(strings.stepStart, { low: step.low, high: step.high });
    case "not-found":
      return format(strings.stepNotFound, { low: step.low, high: step.high, target });
    case "compare": {
      const values = { mid: step.mid, value: step.value, target, newLow: step.nextLow, newHigh: step.nextHigh };
      if (step.comparison === "equal") return format(strings.stepEqual, values);
      if (step.comparison === "less") return format(strings.stepLess, values);
      return format(strings.stepGreater, values);
    }
  }
}

/** Comparisons made up to and including step `index`. */
export function comparisonsUpTo(steps: readonly SearchStep[], index: number): number {
  return steps.slice(0, index + 1).filter((step) => step.kind === "compare").length;
}
