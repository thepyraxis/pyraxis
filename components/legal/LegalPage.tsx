import Link from "next/link";
import type { ReactNode } from "react";

interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

/**
 * Shared layout for /privacy and /terms. Static, no particle engine, no
 * GSAP — legal pages should load instantly and read like plain text.
 * Uses the same dark bg / ink / purple palette and font tokens as the
 * rest of the site so it doesn't feel like a foreign page.
 */
export default function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#020205] px-header py-section-y">
      <div className="mx-auto w-full max-w-[800px]">
        <Link
          href="/"
          className="mb-10 inline-block text-[12px] font-bold uppercase tracking-[0.2em] text-purple-400 transition-colors hover:text-purple-300"
        >
          ← Back to Home
        </Link>

        <h1 className="font-display text-h1 font-semibold italic text-ink-100">
          {title}
        </h1>

        <div className="mt-10 space-y-6 text-base leading-[1.8] text-ink-400">
          <p>Last updated: {lastUpdated}</p>

          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-3 mt-8 font-sans text-[18px] font-semibold uppercase tracking-[0.1em] text-ink-100">
                {section.heading}
              </h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
