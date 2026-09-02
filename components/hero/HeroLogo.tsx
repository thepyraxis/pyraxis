/**
 * Logo mark only. Per request: hero image animation removed — was a
 * canvas (`HeroLogoCanvas`) redrawing the logo via `requestAnimationFrame`
 * every single frame forever (plus hover-driven "erosion" dust particles),
 * purely to render what is visually a static image. That rAF loop, stacked
 * with HeroAmbientParticles'/CustomCursor's own loops, was a real source of
 * hero frame drops/hangs (see HeroLogoCanvas.tsx history). Now a plain
 * static `<img>` — no canvas, no rAF, no per-frame CPU cost, no animation.
 */
export default function HeroLogo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="PYRAXIS"
        className="absolute left-1/2 top-1/2 aspect-[5986/3384] w-[160%] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
