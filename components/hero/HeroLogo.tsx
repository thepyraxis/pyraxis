import HeroLogoCanvas from "./HeroLogoCanvas";

/**
 * Logo mark only. The original site has exactly ONE particle canvas
 * (#particlesCanvas), spanning the whole hero — now rendered once at the
 * Hero.tsx level (.layer-particles), not duplicated per-panel here.
 * `.layer-hero-image` carries no background/parallax of its own in the
 * original CSS, so the logo stays static — no parallax wrapper.
 *
 * `hero-logo-mark` (app/globals.css) is the slow breathing glow — the one
 * thing in the whole Hero allowed continuous motion beyond a subtle drift,
 * per the motion hierarchy: headline/buttons hold still, logo breathes,
 * particles drift, background barely moves.
 */
type HeroLogoProps = {
  /** No longer gated behind ambient particle contact — defaults to true so
   *  the mark is visible immediately, matching the static reference. */
  startReveal?: boolean;
};

export default function HeroLogo({ startReveal = true }: HeroLogoProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <HeroLogoCanvas
        logoSrc="/logo.svg"
        startReveal={startReveal}
        className="hero-logo-mark absolute left-1/2 top-1/2 aspect-[5986/3384] w-[160%] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
