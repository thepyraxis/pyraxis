import { growthEngines } from "@/components/growth-engines/engines";
import type { IconId } from "@/components/growth-engines/engines";

/**
 * One source of truth (per implementation brief): Growth System's 7
 * journey stages are the exact 7 Infrastructure Modules, not a
 * re-typed copy of them — title/benefit/stat are read straight from
 * `growth-engines/engines.ts`. Only the 8th, terminal "Business Growth"
 * node is unique to this section (it has no module of its own — it's
 * the outcome all 7 modules produce together).
 */
export type GrowthIcon = IconId | "business-growth";

export interface GrowthNodeData {
  id: string;
  icon: GrowthIcon;
  label: string;
  benefit: string;
  stat: { value: string; label: string };
}

export const growthNodes: GrowthNodeData[] = [
  ...growthEngines.map(
    (engine): GrowthNodeData => ({
      id: engine.id,
      icon: engine.icon,
      label: engine.title,
      benefit: engine.description,
      stat: engine.stat,
    }),
  ),
  {
    id: "business-growth",
    icon: "business-growth",
    label: "Business Growth",
    benefit: "Every module feeds the next, compounding into predictable growth.",
    stat: { value: "100%", label: "Connected By Design" },
  },
];
