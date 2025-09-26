import CTABanner from "../_components/cta-banner";
import FAQ from "../_components/faq";
import Features from "../_components/features";
import Footer from "../_components/footer";
import Hero from "../_components/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FAQ />
      <CTABanner />
      <Footer />
    </>
  );
}
