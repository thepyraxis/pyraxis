import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — PYRAXIS",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="June 2026"
      sections={[
        {
          heading: "1. Engagement",
          body: "By booking a discovery call or engaging with PYRAXIS services, you agree to provide accurate information regarding your business needs.",
        },
        {
          heading: "2. Intellectual Property",
          body: "Unless otherwise agreed in writing, all custom designs and automation workflows built by PYRAXIS remain the intellectual property of PYRAXIS until full payment is received, at which point ownership of the specific implementation transfers to the client.",
        },
        {
          heading: "3. Service Scope",
          body: "PYRAXIS provides digital growth systems, automation, and AI integrations. The specific scope of work for each project will be defined in a dedicated Strategy & Plan document.",
        },
        {
          heading: "4. Limitation of Liability",
          body: "PYRAXIS is not liable for indirect or consequential damages resulting from the use of automated systems or third-party platforms (such as WhatsApp, Google, or AI providers).",
        },
        {
          heading: "5. Termination",
          body: "Either party may terminate the engagement if the other party breaches these terms. Outstanding payments for work completed will remain due.",
        },
      ]}
    />
  );
}
