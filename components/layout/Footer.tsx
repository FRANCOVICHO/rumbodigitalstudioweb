"use client";

import { Mail, MessageCircle, Heart, ArrowUpRight } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

const footerLinks = [
  { label: "Proyectos", href: "#proyectos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Planes", href: "#planes" },
  { label: "Mantenimiento", href: "#mantenimiento" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/_rumbodigitalstudio", icon: InstagramIcon, color: "hover:text-pink-400 hover:border-pink-500/30" },
  { label: "WhatsApp", href: "https://wa.me/5402920245637", icon: MessageCircle, color: "hover:text-green-400 hover:border-green-500/30" },
  { label: "Email", href: "mailto:digitalstudiorumbo@gmail.com", icon: Mail, color: "hover:text-primary-400 hover:border-primary-500/30" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/[0.06]">
      {/* Main footer */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Rumbo <span className="text-primary-400">Digital</span> Studio
              </h3>
              <p className="text-sm text-white/35 leading-relaxed max-w-xs mx-auto md:mx-0">
                Diseñamos y desarrollamos sitios web que hacen crecer negocios reales.
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-2 justify-center md:justify-start">
              {socials.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className={`p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 transition-all duration-200 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">
              Navegación
            </h4>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-1 group justify-center md:justify-start"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">
              ¿Listo para empezar?
            </h4>
            <p className="text-sm text-white/35 mb-4 leading-relaxed">
              Hablemos de tu proyecto. La primera consulta es sin costo y sin compromiso.
            </p>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(61,82,230,0.3)] hover:shadow-[0_0_30px_rgba(61,82,230,0.5)]"
            >
              Contactar ahora
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20">
            © {year} Rumbo Digital Studio. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-white/20 flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-red-500/60 fill-red-500/60" /> en Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
