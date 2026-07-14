// One shared mouse tracker for ambient dust-field canvases across sections
// (Hero, Problem, ...). Before, each canvas instance attached its own
// `window.addEventListener('mousemove', ...)` — same value, duplicated
// per canvas. Not the main lag source (that was shadowBlur), but there's
// no reason to pay for it twice. Plain mutable object, no React, no
// re-renders — same pattern the original HTML used for its one global
// mx/my.
//
// Deliberately viewport-scoped (clientX/clientY), not tied to any one
// section — each consumer converts to its own local space via its own
// canvas rect. That's what lets Hero and Problem share a single listener
// while each keeps its particles confined to its own box.
let refCount = 0;
let handler: ((e: MouseEvent) => void) | null = null;

export const ambientPointer = { x: -9999, y: -9999, initialized: false };

export function subscribeAmbientPointer() {
  if (refCount === 0) {
    handler = (e: MouseEvent) => {
      ambientPointer.x = e.clientX;
      ambientPointer.y = e.clientY;
      ambientPointer.initialized = true;
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
