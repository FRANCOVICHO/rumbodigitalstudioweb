import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { HowWeWorkSection } from "@/components/sections/HowWeWorkSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { BudgetCalculator } from "@/components/sections/BudgetCalculator";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { fallbackData } from "@/lib/fallback-data";

export default function Home() {
  const { heroConfig, projects, services, plans, faq } = fallbackData;

  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <HeroSection config={heroConfig} />
        <ProjectsSection projects={projects} />
        <ServicesSection services={services} />
        <HowWeWorkSection />
        <PlansSection plans={plans} />
        <BudgetCalculator />
        <TestimonialsSection />
        <FAQSection items={faq} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
