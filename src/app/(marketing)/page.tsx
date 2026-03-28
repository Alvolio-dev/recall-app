import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { GridBackground } from "@/components/grid-background";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Demo } from "@/components/demo";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

const Testimonials = dynamic(() => import("@/components/testimonials").then(m => ({ default: m.Testimonials })));
const GlobeSection = dynamic(() => import("@/components/globe-section").then(m => ({ default: m.GlobeSection })));
const Digest = dynamic(() => import("@/components/digest").then(m => ({ default: m.Digest })));
const Pricing = dynamic(() => import("@/components/pricing").then(m => ({ default: m.Pricing })));

export default function Home() {
  return (
    <GridBackground>
      <Nav />
      <Hero />
      <Features />
      <Demo />
      <Testimonials />
      <GlobeSection />
      <Digest />
      <Pricing />
      <FinalCta />
      <Footer />
    </GridBackground>
  );
}
