export const futureProofHeadline = {
  eyebrow: "After Launch",
  heading: "Every launch is a starting line.",
  headingAccent: "The system keeps compounding from there.",
  subline: "Here's what happens automatically once you're live:",
  cta: "Start The Conversation",
};

export type FutureProofIcon = "data" | "brain" | "heart" | "converge" | "growth";

export interface FutureProofPillar {
  id: string;
  icon: FutureProofIcon;
  title: string;
  description: string;
}

/** A cause-and-effect chain, not a feature list — each pillar is the
 *  direct reason the next one happens. Read left to right: Customer Data
 *  → Smarter Decisions → Better Experience → Repeat Customers →
 *  Compounding Growth. */
export const futureProofPillars: FutureProofPillar[] = [
  { id: "customer-data", icon: "data", title: "Customer Data", description: "Every visit, booking, and message becomes information you can act on." },
  { id: "smarter-decisions", icon: "brain", title: "Smarter Decisions", description: "Real usage patterns shape what changes next, not guesswork." },
  { id: "better-experience", icon: "heart", title: "Better Experience", description: "Customers get faster answers and fewer dropped follow-ups." },
  { id: "repeat-customers", icon: "converge", title: "Repeat Customers", description: "A better experience is the reason people come back." },
  { id: "compounding-growth", icon: "growth", title: "Compounding Growth", description: "Each cycle adds momentum the last one didn't have." },
];
