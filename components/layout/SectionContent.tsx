import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";
import Container from "./Container";

interface SectionContentProps {
  children: ReactNode;
  className?: string;
  /** Opt out of the px-header gutter — use when a parent already pads (e.g. GrowthEngines' sticky wrapper). */
  padded?: boolean;
}

/** Content wrapper for the common "centered, contained, z-10" section body pattern. */
export default function SectionContent({ children, className, padded = true }: SectionContentProps) {
  return (
    <Container padded={padded} className={cn("relative z-10", className)}>
      {children}
    </Container>
  );
}
