import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { HowWeWorkSection } from "@/components/sections/HowWeWorkSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { MaintenanceSection } from "@/components/sections/MaintenanceSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { fallbackData } from "@/lib/fallback-data";
import type { HeroConfig, Project, Service, Plan, Testimonial, FAQItem } from "@/types";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

async function fetchCollection<T>(collection: string, params = ""): Promise<T[]> {
  if (!PB_URL) return [];
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/${collection}/records?${params}`,
      { next: { revalidate: 30 } } // Revalidate every 30 seconds
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

async function fetchOne<T>(collection: string, filter = ""): Promise<T | null> {
  if (!PB_URL) return null;
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/${collection}/records?filter=${encodeURIComponent(filter)}&perPage=1`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.items?.[0] || null;
  } catch {
    return null;
  }
}

export const revalidate = 30; // ISR: revalidate every 30 seconds

export default async function Home() {
  // Fetch all data in parallel from PocketBase, fallback to static data
  const [heroConfigPB, projectsPB, servicesPB, plansPB, testimonialsPB, faqPB] = await Promise.all([
    fetchOne<HeroConfig>("hero_config", "active=true"),
    fetchCollection<Project>("projects", "sort=order"),
    fetchCollection<Service>("services", "sort=order&filter=active=true"),
    fetchCollection<Plan>("plans", "sort=order"),
    fetchCollection<Testimonial>("testimonials", "sort=order&filter=active=true"),
    fetchCollection<FAQItem>("faq", "sort=order&filter=active=true"),
  ]);

  // Use PocketBase data if available, otherwise use fallback
  const heroConfig = heroConfigPB || fallbackData.heroConfig;
  const projects = projectsPB.length > 0 ? projectsPB : fallbackData.projects;
  const services = servicesPB.length > 0 ? servicesPB : fallbackData.services;
  const plans = plansPB.length > 0 ? plansPB : fallbackData.plans;
  const testimonials = testimonialsPB.length > 0 ? testimonialsPB : fallbackData.testimonials;
  const faq = faqPB.length > 0 ? faqPB : fallbackData.faq;

  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <HeroSection config={heroConfig} />
        <ProjectsSection projects={projects} />
        <ServicesSection services={services} />
        <HowWeWorkSection />
        <PlansSection plans={plans} />
        <MaintenanceSection />
        <TestimonialsSection testimonials={testimonials} />
        <FAQSection items={faq} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
