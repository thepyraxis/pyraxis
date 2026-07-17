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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the fullscreen mobile menu is open, and close
  // it automatically if the viewport grows past the mobile nav breakpoint
  // (e.g. rotating a tablet or resizing a desktop window mid-open).
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mql.matches) setMenuOpen(false);
    };
    mql.addEventListener("change", onChange);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      mql.removeEventListener("change", onChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 py-7 transition-[border-color] duration-300 ease-out",
        scrolled || menuOpen
          ? "border-b border-border bg-bg/85 backdrop-blur-[20px]"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-[clamp(1.5rem,5vw,3.75rem)]">
        <Link href="/" aria-label="PYRAXIS" className="relative z-[1] flex min-h-[48px] items-center" onClick={closeMenu}>
          <Image
            src="/pyraxis-wordmark.svg"
            alt="PYRAXIS"
            width={154}
            height={22}
            className="h-[22px] w-auto"
          />
        </Link>

        {/* Mobile/tablet: hamburger toggle for the fullscreen menu below.
            Desktop (lg+): the real inline nav takes over instead. */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative z-[1] flex h-12 w-12 items-center justify-center lg:hidden"
        >
          <span className="relative block h-[14px] w-6">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-ink-100 transition-transform duration-300 ease-out",
                menuOpen && "translate-y-[6.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 bottom-0 h-px w-full bg-ink-100 transition-transform duration-300 ease-out",
                menuOpen && "-translate-y-[6.5px] -rotate-45"
              )}
            />
          </span>
        </button>

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

      {/* Fullscreen animated mobile/tablet menu. Mounted always (not
          conditionally) so the closing transition can play instead of
          the panel just vanishing; visibility + interactivity are toggled
          via opacity/pointer-events/translate so it never affects layout
          or scroll while hidden. */}
      <div
        id="mobile-nav-menu"
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-0 flex flex-col bg-bg/98 backdrop-blur-[24px] transition-opacity duration-300 ease-out lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav
          aria-label="Mobile primary"
          className="flex flex-1 flex-col items-center justify-center gap-2 px-8"
        >
          {LINKS.map(({ label, href }, index) => (
            <a
              key={label}
              href={href}
              onClick={closeMenu}
              style={{ transitionDelay: menuOpen ? `${80 + index * 45}ms` : "0ms" }}
              className={cn(
                "min-h-[48px] py-3 font-display text-[clamp(28px,8vw,40px)] font-semibold text-ink-200 transition-all duration-300 ease-out hover:text-purple-300",
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              )}
            >
              {label}
            </a>
          ))}

          <a
            href="#cta"
            onClick={closeMenu}
            style={{ transitionDelay: menuOpen ? `${80 + LINKS.length * 45}ms` : "0ms" }}
            className={cn(
              "mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-[2px] border border-purple-500/60 px-6 py-4 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-purple-300 transition-all duration-300 ease-out hover:border-purple-400 hover:text-purple-200",
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
          >
            {ctaActions.primary.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
