export type TheoryAlgorithm = {
  name: string;
  /** Plain-English explanation with an everyday analogy. */
  layman: string;
  /** Ordered steps describing how the algorithm runs. */
  how: string[];
  /** Java implementation as a plain string. */
  code: string;
  time: string;
  space: string;
  useWhen: string;
};

export type WorkedExample = {
  title: string;
  problem: string;
  input: string;
  steps: { title: string; detail: string; state?: string }[];
  result: string;
};

export type TheoryTopic = {
  /** Must match a lesson category name exactly, e.g. "Array / String". */
  category: string;
  tagline: string;
  /** In-depth explanation, 3-4 paragraphs. */
  overview: string[];
  layman: { analogy: string; plainEnglish: string[] };
  whenToUse: string[];
  keyIdeas: { term: string; meaning: string }[];
  algorithms: TheoryAlgorithm[];
  examples: WorkedExample[];
  pitfalls: string[];
  /** Other category names worth studying next. */
  related: string[];
};
