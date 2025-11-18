import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HeroDashboardMock } from "@/components/landing/HeroDashboardMock";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/footer";
import { PricingSection } from "@/components/landing/PricingSection";
import Login from "../Login";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="px-10 py-20 flex flex-col md:flex-row items-center justify-between gap-20">
        <HeroSection />
        <HeroDashboardMock />
      </section>

      {/* FEATURES SECTION */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* STEPS SECTION */}
      <section>
        <StepsSection />
      </section>

      {/* PRICING SECTION */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* WHY US / CTA SECTION */}
      <section>
        <CTASection />
      </section>

      {/* FOOTER (CONTACT) */}
      <footer id="contact">
        <Footer />
      </footer>
    </div>
  );
}
