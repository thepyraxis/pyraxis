/**
 * Single place GSAP plugins get registered (ai/specs/portfolio.md Notes).
 * `registerPlugin` is idempotent, but scattering the call across every
 * component that happens to use ScrollTrigger invites duplicate imports
 * and makes it unclear where the "this app uses ScrollTrigger" decision
 * actually lives. Import `gsap`/`ScrollTrigger` from here, not directly
 * from the `gsap` package, in any client component that needs scrub/pin.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
