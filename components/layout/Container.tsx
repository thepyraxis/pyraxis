import { cn } from "@/lib/utils/cn";
import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Opt out of the default max-w-container clamp (e.g. full-bleed rows). */
  fluid?: boolean;
  /** Opt out of the px-header gutter — use when a parent (e.g. a sticky
   * pinned wrapper) already applies it, to avoid double padding. */
  padded?: boolean;
}

/**
 * Shared page container. Single source of truth for horizontal max-width +
 * gutter across every section — replaces scattered `max-w-[1240px]` /
 * `max-w-container` + ad hoc padding combos.
 */
export default function Container({
  as: Tag = "div",
  children,
  className,
  fluid = false,
  padded = true,
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full", padded && "px-header", !fluid && "max-w-container", className)}>
      {children}
    </Tag>
  );
}
