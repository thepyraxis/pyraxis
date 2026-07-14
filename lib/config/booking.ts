/**
 * Booking provider adapter.
 *
 * Every consumer (Hero, CTA, Footer) only ever sees a resolved
 * `ctaActions.primary.href` string — none of them know or care whether
 * "Book a Call" currently resolves to a WhatsApp deep link, a Calendly
 * link, a Cal.com link, or something custom. To swap providers later,
 * change `bookingProvider` (and `bookingUrl` if the new provider needs
 * one) in `lib/config/contact.ts` — nothing in this file or in any
 * component needs to change.
 */

export type BookingProvider = "whatsapp" | "calendly" | "cal.com" | "custom";

export interface BookingConfig {
  bookingProvider: BookingProvider;
  /** External scheduling link — required for every provider except "whatsapp". */
  bookingUrl: string;
  whatsappNumber: string;
  /** Pre-filled message used only when the provider is "whatsapp". */
  whatsappBookingMessage: string;
}

export function resolveBookingHref(config: BookingConfig): string {
  switch (config.bookingProvider) {
    case "calendly":
    case "cal.com":
    case "custom":
      // Falls back to the WhatsApp booking link if a URL hasn't been set
      // yet, so flipping the provider flag early never produces a dead
      // link — this is the seam described above.
      return config.bookingUrl || whatsappBookingHref(config);
    case "whatsapp":
    default:
      return whatsappBookingHref(config);
  }
}

function whatsappBookingHref(config: BookingConfig): string {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    config.whatsappBookingMessage
  )}`;
}
