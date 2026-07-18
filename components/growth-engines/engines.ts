export type IconId =
  | "website"
  | "ai-receptionist"
  | "smart-booking"
  | "follow-up-automation"
  | "repeat-purchase"
  | "smart-reviews"
  | "reputation-system";

export interface GrowthEngineData {
  id: string;
  title: string;
  description: string;
  icon: IconId;
  panelTitle: string;
  panelDescription: string;
  features: string[];
  stat: {
    value: string;
    label: string;
  };
}

export const growthEngines: GrowthEngineData[] = [
  {
    id: "website",
    title: "Website",
    description: "Your storefront, working around the clock.",
    icon: "website",
    panelTitle: "Website",
    panelDescription:
      "Your website works 24/7 to turn visitors into qualified leads instead of passive traffic. Every page is built to load fast, look sharp on any device, and guide people toward booking.",
    features: ["Fast loading", "Mobile optimized", "Lead capture"],
    stat: { value: "68%", label: "Higher Visitor Conversion" },
  },
  {
    id: "ai-receptionist",
    title: "AI Receptionist",
    description: "Answers every call and chat, instantly.",
    icon: "ai-receptionist",
    panelTitle: "AI Receptionist",
    panelDescription:
      "A trained AI voice and chat agent picks up every inquiry the moment it arrives. No missed calls, no hold music, no lost leads while your team is busy with customers in front of them.",
    features: ["24/7 availability", "Instant responses", "Human-like conversation"],
    stat: { value: "90%+", label: "Inquiries Answered" },
  },
  {
    id: "smart-booking",
    title: "Smart Booking",
    description: "Turns interest into a confirmed slot on your calendar.",
    icon: "smart-booking",
    panelTitle: "Smart Booking",
    panelDescription:
      "Real-time scheduling that syncs with your calendar and confirms appointments without a single phone tag. Customers pick a time, get reminded automatically, and show up.",
    features: ["Real-time availability", "Auto reminders", "Zero double-booking"],
    stat: { value: "70%", label: "Fewer No-Shows" },
  },
  {
    id: "follow-up-automation",
    title: "Follow-Up Automation",
    description: "Keeps every lead warm until they're ready to buy.",
    icon: "follow-up-automation",
    panelTitle: "Follow-Up Automation",
    panelDescription:
      "Automated sequences reach out at exactly the right moment, so deals that would normally go cold keep moving forward without anyone having to remember to send them.",
    features: ["Timed nurture sequences", "Personalized messaging", "Automatic re-engagement"],
    stat: { value: "60%+", label: "Increase In Pipeline" },
  },
  {
    id: "repeat-purchase",
    title: "Repeat Purchase",
    description: "Brings past customers back, on autopilot.",
    icon: "repeat-purchase",
    panelTitle: "Repeat Purchase",
    panelDescription:
      "Lifecycle campaigns re-engage past customers at the right intervals, turning a single sale into an ongoing relationship without any extra manual outreach from your team.",
    features: ["Lifecycle triggers", "Loyalty offers", "Automated win-back"],
    stat: { value: "35%+", label: "Higher Lifetime Value" },
  },
  {
    id: "smart-reviews",
    title: "Smart Reviews",
    description: "Requests reviews at the perfect moment, every time.",
    icon: "smart-reviews",
    panelTitle: "Smart Reviews",
    panelDescription:
      "Happy customers are prompted for a review right after the moment they're most satisfied, filling your public profiles with fresh, authentic feedback with no extra effort.",
    features: ["Perfectly timed requests", "One-tap review flow", "Negative feedback filtering"],
    stat: { value: "70%+", label: "Customers From Referrals" },
  },
  {
    id: "reputation-system",
    title: "Reputation System",
    description: "Protects and grows your brand's trust, everywhere.",
    icon: "reputation-system",
    panelTitle: "Reputation System",
    panelDescription:
      "A single dashboard tracks every review and mention across platforms, alerting you the moment something needs attention so your reputation stays consistent everywhere customers look. Ratings of 4-5 stars are routed to a public review; 1-3 star feedback goes straight to you privately, by email and WhatsApp, so issues get resolved before they ever go public.",
    features: ["Smart public/private routing", "Instant alerts", "Centralized dashboard"],
    stat: { value: "89%", label: "Higher Trust Score" },
  },
];
