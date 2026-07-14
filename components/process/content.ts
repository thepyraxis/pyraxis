export const processHeadline = {
  eyebrow: "Implementation Roadmap",
  heading: "Built in stages.",
  headingAccent: "Shipped with proof.",
  subline:
    "Every engagement moves through the same five stages. Each one ends with a concrete deliverable — not a status update.",
  cta: "See What Ships At Each Stage",
};

export type ProcessIcon = "search" | "strategy" | "cubes" | "rocket" | "chart";

export interface ProcessStage {
  id: string;
  icon: ProcessIcon;
  label: string;
  /** Rough timeframe this stage occupies in the rollout — grounds the
   *  sequence as a real implementation schedule, not an abstract flow. */
  timeframe: string;
  /** The concrete thing that exists once this stage is done — rendered
   *  as a small "shipped" chip, distinct from the longer description. */
  outcome: string;
  description: string;
}

export const processStages: ProcessStage[] = [
  {
    id: "discovery",
    icon: "search",
    label: "Discovery",
    timeframe: "Week 1",
    outcome: "Growth plan scoped",
    description:
      "We audit your current systems and pipeline to find the highest-leverage gaps before any strategy gets written.",
  },
  {
    id: "strategy",
    icon: "strategy",
    label: "Strategy & Architecture",
    timeframe: "Week 1–2",
    outcome: "Blueprint signed off",
    description:
      "We architect the exact stack — website, automations, channels — mapped to your goals, timeline, and budget.",
  },
  {
    id: "build",
    icon: "cubes",
    label: "Build & Launch",
    timeframe: "Week 2–4",
    outcome: "Live system, fully tested",
    description: "We build, QA, and ship your infrastructure end to end. Nothing goes live untested.",
  },
  {
    id: "optimize",
    icon: "rocket",
    label: "Optimize & Scale",
    timeframe: "Week 4–8",
    outcome: "Tuned on real data",
    description: "We monitor live performance and tune every conversion point against real user data, not guesses.",
  },
  {
    id: "measure",
    icon: "chart",
    label: "Measure & Grow",
    timeframe: "Ongoing",
    outcome: "Compounding results",
    description: "Monthly reporting and iteration keep the system compounding long after the initial launch.",
  },
];
