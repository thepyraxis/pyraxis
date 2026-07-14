/**
 * Scene — Footer (Phase 15, ai/specs/footer.md).
 *
 * Contact links are not new copy — they're the same real, already-shipped
 * channels from `ctaActions`, the single shared contact config every
 * component consumes (lib/config/contact.ts), imported here rather than
 * re-typed (spec §Contact: "No duplicated constants").
 *
 * Uses `secondary`/`tertiary` (plain WhatsApp chat / Email), not `primary`
 * — the shared config's `primary` is the "Book a Call" action (a
 * provider-backed booking link — see lib/config/booking.ts). Footer's
 * contact row is the quiet, plain-channel version, matching its own
 * "Very Low intensity" role (ai/specs/footer.md) — it isn't a second CTA
 * push, so it shouldn't carry the booking-intent copy/link.
 */
import { ctaActions } from "@/lib/config/contact";

export const footerContact = {
  whatsapp: {
    label: "WhatsApp",
    href: ctaActions.secondary.href,
  },
  email: {
    label: "Email",
    href: ctaActions.tertiary.href,
  },
};

/** Spec §Component Specification #4 — exact year sourced at render time, not hardcoded. */
export function footerCopyright(year: number = new Date().getFullYear()): string {
  return `© ${year} PYRAXIS. All rights reserved.`;
}
