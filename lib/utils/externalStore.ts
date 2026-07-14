/**
 * Minimal external store for high-frequency global state (mouse position,
 * scroll progress, particle instructions). Avoids re-rendering the React
 * tree on every mousemove/scroll/animation frame (ai/rules/coding.md #11,
 * ai/rules/performance.md) — components opt in via `useSyncExternalStore`
 * only where they actually need to re-render on change; the particle
 * engine itself reads `getSnapshot()` directly inside its own rAF loop.
 *
 * Deliberately not Zustand — this is simple single-value state per store,
 * not complex derived global state, so a dependency isn't justified yet
 * (ai/rules/coding.md #8). Revisit if instruction state grows nontrivial.
 */
export function createExternalStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  return {
    getSnapshot: (): T => state,
    setState: (next: T | ((prev: T) => T)): void => {
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void): (() => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
