/**
 * Single source of truth for every contact action on the site.
 *
 * Hero, CTA, and Footer previously each carried their own copy of these
 * labels/URLs (Hero: "Book via WhatsApp"/"Book via Email" hardcoded in
 * HeroButtons.tsx; CTA: its own `ctaActions` in cta/content.ts; Footer:
 * a derived-but-separate `footerContact`). All three now import from
 * here — no component defines or duplicates a label, href, or button
 * string of its own.
 *
 * Hierarchy (same three tiers everywhere a component uses them):
 *   primary   — "Book a Call": highest-commitment action, provider-backed
 *               booking link (see lib/config/booking.ts adapter).
 *   secondary — "WhatsApp": lower-friction chat, same channel, no booking intent.
 *   tertiary  — "Email": most formal/lowest-urgency channel.
 *
 * Not every component renders every tier (Footer intentionally stays to
 * secondary/tertiary only, per its own "very low intensity" role) — but
 * whichever tiers a component does render, the label/href come from here.
 */
import { resolveBookingHref, type BookingProvider } from "./booking";

const WHATSAPP_NUMBER = "919837104413";
const EMAIL_ADDRESS = "thepyraxis@gmail.com";

// --- Booking provider adapter config -----------------------------------
// To switch providers, change ONLY these two lines. No component, and no
// other file, needs to change.
const bookingProvider: BookingProvider = "whatsapp";
const bookingUrl = ""; // set to the real Calendly/Cal.com/custom URL once one exists
// ------------------------------------------------------------------------

export const ctaActions = {
  primary: {
    label: "Book a Call",
    href: resolveBookingHref({
      bookingProvider,
      bookingUrl,
      whatsappNumber: WHATSAPP_NUMBER,
      whatsappBookingMessage: "Hi! I'd like to book a call to discuss a project.",
    }),
  },
  secondary: {
    label: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  tertiary: {
    label: "Email",
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}`,
  },
};

/**
 * Same shared WhatsApp number, different pre-filled message — used where
 * a component needs a contact link tied to specific context (e.g.
 * Portfolio's "request this case study" links) instead of the generic
 * booking message above. Keeps the phone number itself defined exactly
 * once, here, regardless of how many different messages reference it.
 */
export function whatsappInquiryHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
