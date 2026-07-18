import dynamic from "next/dynamic";
import Header from "@/components/navigation/Header";
import Hero from "@/components/hero/Hero";
import Problem from "@/components/problem/Problem";
import GrowthSystem from "@/components/growth-system/GrowthSystem";
import MarqueeTicker from "@/components/marquee/MarqueeTicker";
import WhyPyraxis from "@/components/why-pyraxis/WhyPyraxis";

// Below-the-fold sections: not needed for the critical render path.
// Kept SSR on (default) since each renders real content Google/social
// crawlers and no-JS users should still see — only the JS payload is deferred.
const GrowthEngines = dynamic(() => import("@/components/growth-engines/GrowthEngines"));
const Portfolio = dynamic(() => import("@/components/portfolio/Portfolio"));
const FounderStory = dynamic(() => import("@/components/founder-story/FounderStory"));
const Process = dynamic(() => import("@/components/process/Process"));
const FutureProofSystems = dynamic(
  () => import("@/components/future-proof-systems/FutureProofSystems")
);
const CTA = dynamic(() => import("@/components/cta/CTA"));
const Footer = dynamic(() => import("@/components/footer/Footer"));

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <MarqueeTicker />
        <GrowthSystem />
        <GrowthEngines />
        <WhyPyraxis />
        <Portfolio />
        <FounderStory />
        <Process />
        <FutureProofSystems />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
