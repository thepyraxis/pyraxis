import { cn } from "@/lib/utils/cn";
import { ctaActions } from "@/lib/config/contact";

/**
 * Contact actions sourced from the shared config (lib/config/contact.ts) —
 * previously hardcoded here as "Book via WhatsApp"/"Book via Email" with
 * their own literal hrefs, duplicating what CTA/Footer also carried.
 * Now uses the exact same `secondary`/`tertiary` label/href pair CTA and
 * Footer use — no separate copy, no separate URL, no redesign (same two
 * buttons, same layout/classes as before, just shared-config-driven).
 */
export default function HeroButtons() {
  return (
    <div data-reveal>
      <div className="mt-10 flex flex-wrap items-center gap-8">
        <a
          href={ctaActions.secondary.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group inline-flex items-center rounded-[2px] px-10 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white",
            "bg-gradient-to-br from-purple-vivid to-purple-700",
            "shadow-[0_8px_32px_rgba(123,47,224,0.35)] transition-all duration-300 ease-out",
            "hover:-translate-y-[3px] hover:shadow-[0_22px_72px_rgba(123,47,224,0.65)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          )}
        >
          {ctaActions.secondary.label}
        </a>

        <a
          href={ctaActions.tertiary.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group inline-flex items-center rounded-[2px] border border-purple-500/60 px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-300",
            "transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          )}
        >
          {ctaActions.tertiary.label}
        </a>
      </div>

    </div>
  );
}
