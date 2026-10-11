import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * Lab experiments. To add one: create a folder in src/features/lab/<slug>/
 * with pure logic + a client UI, add its strings to the dictionaries, register
 * it here and add its view to src/features/lab/views.tsx.
 */
export interface Experiment {
  slug: string;
  /** Short technical tag, e.g. "Algorithms · O(log n)". */
  topic: (dict: Dictionary) => string;
  title: (dict: Dictionary) => string;
  summary: (dict: Dictionary) => string;
  description: (dict: Dictionary) => string;
}

export const experiments: Experiment[] = [
  {
    slug: "binary-search",
    topic: (dict) => dict.binarySearch.topic,
    title: (dict) => dict.binarySearch.title,
    summary: (dict) => dict.binarySearch.intro,
    description: (dict) => dict.binarySearch.description,
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.slug === slug);
}
