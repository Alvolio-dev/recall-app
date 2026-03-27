import { Nav } from "@/components/nav";
import { GridBackground } from "@/components/grid-background";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Demo } from "@/components/demo";
import { Pricing } from "@/components/pricing";
import { Digest } from "@/components/digest";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <GridBackground>
      <Nav />
      <Hero />
      <Features />
      <Demo />
      <Digest />
      <Pricing />
      <FinalCta />
      <Footer />
    </GridBackground>
  );
}
