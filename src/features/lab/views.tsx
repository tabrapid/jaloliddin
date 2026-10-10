import type { ReactNode } from "react";

import type { Dictionary } from "@/i18n/dictionaries/en";
import { format } from "@/i18n/format";

import { maxComparisons } from "./binary-search/algorithm";
import { BinarySearchVisualizer } from "./binary-search/binary-search-visualizer";

const binarySearchSource = `function binarySearch(array, target) {
  let low = 0;
  let high = array.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (array[mid] === target) return mid;   // found
    if (array[mid] < target) low = mid + 1;  // go right
    else high = mid - 1;                     // go left
  }
  return -1;                                 // not found
}`;

function BinarySearchView({ dict }: { dict: Dictionary }) {
  const t = dict.binarySearch;
  return (
    <div className="flex flex-col gap-16">
      <BinarySearchVisualizer labels={t} />
      <section aria-labelledby="how-it-works" className="grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <h2 id="how-it-works" className="text-heading font-semibold text-ink">
            {t.howItWorks}
          </h2>
          <p className="text-ink-2">{format(t.complexity, { n: 12, max: maxComparisons(12) })}</p>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-line bg-canvas-deep p-5 font-mono text-[0.8125rem] leading-relaxed text-ink-2 lg:col-span-7 lg:col-start-6">
          <code>{binarySearchSource}</code>
        </pre>
      </section>
    </div>
  );
}

/** Maps experiment slugs to their page content. */
export const experimentViews: Record<string, (props: { dict: Dictionary }) => ReactNode> = {
  "binary-search": BinarySearchView,
};
