import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HeroDashboardMock } from "@/components/landing/HeroDashboardMock";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      <section className="px-10 py-20 flex flex-col md:flex-row items-center justify-between gap-20">
        <HeroSection />
        <HeroDashboardMock />
      </section>

      <FeaturesSection />
      <StepsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
