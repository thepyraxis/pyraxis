import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface ClusterProps {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}

const gapClass = { sm: "gap-sm", md: "gap-md", lg: "gap-lg" } as const;
const justifyClass = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" } as const;

/** Horizontal flex cluster (auto-wrapping) using fluid spacing tokens — for card grids, tag rows, button groups. */
export default function Cluster({ children, className, gap = "md", justify = "start", wrap = true }: ClusterProps) {
  return (
    <div className={cn("flex items-center", wrap && "flex-wrap", gapClass[gap], justifyClass[justify], className)}>
      {children}
    </div>
  );
}
