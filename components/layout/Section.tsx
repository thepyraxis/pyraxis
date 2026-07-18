import { cn } from "@/lib/utils/cn";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

type SectionProps = ComponentPropsWithoutRef<"section">;

/**
 * Shared section wrapper. Applies the fluid `section-y` vertical rhythm
 * token so every section scales spacing identically instead of repeating
 * `py-24`-style fixed values. Horizontal padding is intentionally NOT
 * applied here — that's `Container`'s job (via the shared `px-header`
 * token) — so a section can host full-bleed children alongside a
 * contained `<Container>`/`<SectionContent>` without double padding.
 */
const Section = forwardRef<HTMLElement, SectionProps>(function Section({ children, className, ...rest }, ref) {
  return (
    <section ref={ref} className={cn("relative py-section-y", className)} {...rest}>
      {children}
    </section>
  );
});

export default Section;
