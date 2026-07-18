import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
}

const gapClass = { sm: "gap-sm", md: "gap-md", lg: "gap-lg" } as const;
const alignClass = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" } as const;

/** Vertical flex stack using fluid spacing tokens instead of fixed `gap-24`-style values. */
export default function Stack({ children, className, gap = "md", align = "stretch" }: StackProps) {
  return <div className={cn("flex flex-col", gapClass[gap], alignClass[align], className)}>{children}</div>;
}
