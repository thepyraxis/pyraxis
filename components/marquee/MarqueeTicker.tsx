import { marqueeItems } from "./content";

/**
 * Scrolling service ticker — ported from the original HTML site's
 * `.marquee-section`. Pure CSS animation (translateX loop over duplicated
 * content, see `marquee-scroll` keyframe in app/globals.css), no canvas,
 * no GSAP, no client component needed. Sits between Growth System and
 * Growth Engines, same position as the original.
 */
export default function MarqueeTicker() {
  // Duplicated once for a seamless loop (matches the original's own
  // duplicate-items technique — animate to -50% and the seam is invisible).
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-border/70 py-8"
    >
      <div
        className="flex w-max items-center gap-16"
        style={{ animation: "marquee-scroll 30s linear infinite" }}
      >
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-3 whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-500"
          >
            <span className="text-purple-400">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
