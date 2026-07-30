// ─── Core domain types ────────────────────────────────────────────────────────

export type ThemeMode = "dark" | "light" | "matrix" | "party";
export type ProjectCategory = "all" | "ecommerce" | "corporate" | "landing" | "custom";
export type ViewMode = "grid" | "list";

// ─── PocketBase Collections ───────────────────────────────────────────────────

export interface SiteConfig {
  id: string;
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  metaDescription: string;
  metaKeywords: string[];
  googleAnalyticsId?: string;
}

export interface HeroConfig {
  id: string;
  title: string;
  subtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  badgeText?: string;
  heroImageUrl: string;
  active: boolean;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  technologies: string[];
  imageUrl: string;
  screenshots: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  created?: string;
  updated?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  price?: number;
  priceUnit?: string;
  features: string[];
  order: number;
  active: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  notIncluded: string[];
  highlighted: boolean;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number | null;
  avatarUrl?: string;
  projectId?: string;
  active: boolean;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  read: boolean;
  replied: boolean;
  created: string;
  ip?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  order: number;
  active: boolean;
  isCTA: boolean;
}

export interface ThemeConfig {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: "sm" | "md" | "lg" | "xl" | "full";
  shadowStyle: "soft" | "hard" | "glow";
  gradientFrom: string;
  gradientTo: string;
  activeTheme: ThemeMode;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  sessionId: string;
  created: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

// ─── Form types ───────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  website?: string; // honeypot
}

// ─── Fallback data ────────────────────────────────────────────────────────────

export interface FallbackData {
  heroConfig: HeroConfig;
  projects: Project[];
  services: Service[];
  plans: Plan[];
  testimonials: Testimonial[];
  faq: FAQItem[];
}
