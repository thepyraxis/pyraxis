import { marqueeItems } from "./content";

/**
 * Scrolling service ticker — ported from the original HTML site's
 * `.marquee-section`. Pure CSS animation (translateX loop, see
 * `marquee-scroll` keyframe in app/globals.css). Sits directly under Hero.
 *
 * LOOP MATH — read before touching spacing here:
 * Two identical groups of N items sit side by side; the animation moves
 * the track by exactly one group's width (`translateX(-50%)`), so when it
 * snaps back to 0% the visible content is pixel-identical to the start.
 * That only works if EVERY item — including the last item of each group —
 * carries its own trailing gap (`mr-16`). A plain flex `gap` on the
 * group/track instead only inserts N-1 gaps for N children (gaps sit
 * *between* items), which — even split across two `gap`-separated group
 * divs — still totals 2N-1 gaps for the 2N items, not 2N. That makes
 * `-50%` land half a gap short of one true group-period, so the
 * loop boundary looks compressed relative to every other gap. Per-item
 * trailing margin (applied unconditionally, last item included) is what
 * makes it exactly 2N gaps for 2N items and the math exact.
 */
function MarqueeGroup({ items }: { items: string[] }) {
  return (
    <div className="flex items-center" aria-hidden="true">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="mr-16 flex shrink-0 items-center gap-3 whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-500"
        >
          <span className="text-purple-400">✦</span>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function MarqueeTicker() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-border/70 py-8"
    >
      <div
        className="flex w-max items-center"
        style={{ animation: "marquee-scroll 30s linear infinite" }}
      >
        <MarqueeGroup items={marqueeItems} />
        <MarqueeGroup items={marqueeItems} />
      </div>
    </div>
  );
}
