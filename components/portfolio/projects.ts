export type ProjectPreviewIcon = "gear" | "brain" | "converge";

export interface ProjectData {
  id: string;
  name: string;
  /** Kept from the original data — displayed as the card's service-type
   *  line (unchanged), distinct from the new `industry` tag below. */
  category: string;
  /**
   * Short industry label — the "who this is for" rung of the storytelling
   * rhythm (Name → Industry → Before → Built → Result). Optional: left
   * undefined until a client-confirmed label exists for this project.
   * ProjectCard hides the badge entirely rather than showing placeholder
   * text — never infer a value here.
   */
  industry?: string;
  /** One scannable line: what was broken before PYRAXIS. Optional — left
   *  undefined until real, confirmed client copy exists. ProjectCard
   *  falls back to a neutral "Available on Request" status rather than
   *  placeholder text when this (or `solution`) is missing. */
  problem?: string;
  /** One scannable line: what PYRAXIS built to fix it. Same optional /
   *  no-placeholder rule as `problem` above. */
  solution?: string;
  statValue: string;
  statLabel: string;
  accent: string;
  /**
   * What kind of system this project is, for the placeholder preview's
   * icon (ProjectCard.tsx) when no screenshot exists yet — a factual
   * categorization, not a fabricated visual.
   */
  previewIcon: ProjectPreviewIcon;
  /**
   * Path to a real screenshot/preview asset in /public, once one exists
   * for this project. Left undefined for every project today — no real
   * screenshots are available yet — which renders the honest, premium
   * "Project Preview" placeholder in ProjectCard.tsx instead of a fake
   * dashboard mockup. Add the path here (only) when a real asset is
   * dropped into /public; no other file needs to change.
   */
  previewSrc?: string;
}

export const projects: ProjectData[] = [
  {
    id: "luxe-dental-clinic",
    name: "Luxe Dental Clinic",
    category: "Web Design & Automation",
    statValue: "+42%",
    statLabel: "More Bookings",
    accent: "#8b5cf6",
    previewIcon: "gear",
  },
  {
    id: "servicepro-ai-agent",
    name: "ServicePro AI Agent",
    category: "AI Automation & Lead Engagement",
    statValue: "0",
    statLabel: "Missed Leads",
    accent: "#8b5cf6",
    previewIcon: "brain",
  },
  {
    id: "stayvista-retreats",
    name: "StayVista Retreats",
    category: "Booking System & Automation",
    statValue: "+58%",
    statLabel: "Direct Bookings",
    accent: "#8b5cf6",
    previewIcon: "converge",
  },
];
