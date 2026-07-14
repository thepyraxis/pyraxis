/**
 * Tiny classnames joiner — no dependency needed for this project's scope.
 * Falsy values are dropped, so conditional classes read cleanly:
 *   cn("btn", isActive && "btn--active", isDisabled && "btn--disabled")
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
