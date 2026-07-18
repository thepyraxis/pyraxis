import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — PYRAXIS",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 2026"
      sections={[
        {
          heading: "1. Overview",
          body: "At PYRAXIS, we value your privacy. This policy outlines how we handle information when you interact with our growth systems and website.",
        },
        {
          heading: "2. Information Collection",
          body: "We collect information you provide directly to us through WhatsApp, Email, or Discovery Call bookings. This includes your name, contact details, and business information required to design your growth strategy.",
        },
        {
          heading: "3. Usage of Data",
          body: "Your data is used solely to provide services, improve system performance, and communicate regarding your project. We do not sell your personal data to third parties.",
        },
        {
          heading: "4. Cookies & Analytics",
          body: "We use Google Analytics and Microsoft Clarity to understand how visitors interact with our site. This data is anonymized and used to improve user experience.",
        },
        {
          heading: "5. Contact",
          body: "For any privacy-related inquiries, contact us at thepyraxis@gmail.com.",
        },
      ]}
    />
  );
}
