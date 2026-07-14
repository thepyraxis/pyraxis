export const whyPyraxisHeadline = {
  eyebrow: "How We Build",
  lines: ["Built to last,", "not just to launch."],
  cta: "See It In Practice",
};

export type WhyPyraxisIcon = "target" | "bars" | "gear" | "handshake";

export interface WhyPyraxisPoint {
  id: string;
  icon: WhyPyraxisIcon;
  label: string;
  description: string;
}

export const whyPyraxisPoints: WhyPyraxisPoint[] = [
  { id: "root-cause", icon: "target", label: "Root Cause, Not Symptoms", description: "We fix why something breaks, not just the part that's visible." },
  { id: "systems-not-projects", icon: "bars", label: "Systems, Not Projects", description: "Every build is meant to keep running and improving, not just ship once." },
  { id: "less-manual-by-default", icon: "gear", label: "Less Manual, By Default", description: "If a step can be automated without losing control, we automate it." },
  { id: "simplicity-wins", icon: "handshake", label: "Simplicity Wins", description: "Fewer moving parts break less often — we cut steps before we add them." },
];
