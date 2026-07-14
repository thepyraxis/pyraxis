"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { ctaActions } from "@/lib/config/contact";

// Exported so Footer (ai/specs/footer.md §Component Specification #2) can
// reuse this exact array instead of maintaining a second literal copy —
// "one idea, one location." No other change to Header in this pass.
export const LINKS = [
  { label: "Services", href: "#growth-engines" },
  { label: "System", href: "#growth-system" },
  { label: "Work", href: "#portfolio" },
  { label: "About", href: "#why-pyraxis" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#cta" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 py-7 transition-[border-color] duration-300 ease-out",
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-[20px]"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-[clamp(1.5rem,5vw,3.75rem)]">
        <Link href="/" aria-label="PYRAXIS">
          <Image
            src="/pyraxis-wordmark.svg"
            alt="PYRAXIS"
            width={154}
            height={22}
            className="h-[22px] w-auto"
          />
        </Link>

        {/* Mobile-only conversion path — nav stays desktop-only below, so
            this is the one addition for P2 (no hamburger/drawer/mobile
            nav): the primary CTA duplicated here, hidden at `lg` where
            the identical button inside `nav` below takes over, keeping
            desktop's exact original markup/spacing untouched. */}
        <a
          href="#cta"
          className="inline-flex items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 lg:hidden"
        >
          {ctaActions.primary.label}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-11 lg:flex">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="group relative text-xs font-semibold uppercase tracking-[0.18em] text-ink-300 transition-colors hover:text-ink-100 focus-visible:text-ink-100"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-purple-400 transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}

          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-[2px] border border-purple-500/60 px-5 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-colors duration-300 ease-out hover:border-purple-400 hover:text-purple-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          >
            {ctaActions.primary.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
