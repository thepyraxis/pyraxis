import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CustomCursor from "@/components/common/CustomCursor";
import { GlobalProviders } from "@/providers/GlobalProviders";

const cormorant = localFont({
  src: [
    { path: "../public/fonts/cormorant-garamond/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/cormorant-garamond/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/cormorant-garamond/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/cormorant-garamond/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/cormorant-garamond/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/cormorant-garamond/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const syne = localFont({
  src: [
    { path: "../public/fonts/syne/syne-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/syne/syne-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/syne/syne-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/syne/syne-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thepyraxis.vercel.app"),
  title: "PYRAXIS — Digital Growth Systems",
  description:
    "Websites, automation, and AI systems that work 24/7 to bring leads, book customers, and drive growth.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "PYRAXIS — Digital Growth Systems",
    description:
      "Websites, automation, and AI systems that work 24/7 to bring leads, book customers, and drive growth.",
    images: [{ url: "/og-image.webp", width: 1536, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PYRAXIS — Digital Growth Systems",
    description:
      "Websites, automation, and AI systems that work 24/7 to bring leads, book customers, and drive growth.",
    images: ["/og-image.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Phase 16 perf pass: this used to also load Syne a second time from
  // Google Fonts in a <head> here (a render-blocking cross-origin
  // request) purely so the wordmark's "Λ" (U+039B) glyph — outside the
  // self-hosted Latin-only subset above — would render in an exact Syne
  // match instead of a fallback. Removed per ai/rules/performance.md (no
  // external font requests) and ai/checkpoints/phase16.md's own
  // acceptance criterion. Degrades safely, not silently: tailwind.
  // config.ts's font stack already lists a bare "Syne" family name after
  // the local var as a real-installed-font fallback for exactly this
  // glyph, THEN generic sans-serif — so browsers without Syne installed
  // (nearly everyone) now render "Λ" in the system sans-serif instead of
  // Syne's exact stylization. Cosmetic-only, one decorative character,
  // traded for one fewer render-blocking third-party request.
  return (
    <html lang="en" className={`${cormorant.variable} ${syne.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-purple-vivid focus:px-4 focus:py-2 focus:font-sans focus:text-[12px] focus:font-semibold focus:uppercase focus:tracking-[0.15em] focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-purple-300"
        >
          Skip to content
        </a>
        <GlobalProviders>
          <CustomCursor />
          {children}
        </GlobalProviders>
      </body>
    </html>
  );
}
