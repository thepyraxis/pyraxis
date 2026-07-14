// One shared mouse tracker for the hero's ambient particle canvases
// (back + front variants). Before, each canvas instance attached its own
// `window.addEventListener('mousemove', ...)` — same value, duplicated
// per canvas. Not the main lag source (that was shadowBlur), but there's
// no reason to pay for it twice. Plain mutable object, no React, no
// re-renders — same pattern the original HTML used for its one global
// mx/my.
let refCount = 0;
let handler: ((e: MouseEvent) => void) | null = null;

export const heroMouse = { x: -9999, y: -9999, initialized: false };

export function subscribeHeroMouse() {
  if (refCount === 0) {
    handler = (e: MouseEvent) => {
      heroMouse.x = e.clientX;
      heroMouse.y = e.clientY;
      heroMouse.initialized = true;
    };
    window.addEventListener("mousemove", handler, { passive: true });
  }
  refCount += 1;
  return () => {
    refCount -= 1;
    if (refCount === 0 && handler) {
      window.removeEventListener("mousemove", handler);
      handler = null;
    }
  };
}
