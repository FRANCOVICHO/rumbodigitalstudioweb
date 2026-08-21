"use client";

import { Mail, MessageCircle, Heart } from "lucide-react";

// Instagram icon inline para compatibilidad con todas las versiones de lucide-react
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 md:py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Rumbo Digital Studio
            </h3>
            <p className="text-sm text-foreground-muted">
              Transformamos ideas en experiencias digitales que impulsan tu negocio.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground-muted">
              Enlaces
            </h4>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              {["Proyectos", "Servicios", "Planes", "FAQ", "Contacto"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="text-sm text-foreground-muted hover:text-primary-400 transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground-muted">
              Seguinos
            </h4>
            <div className="flex gap-3 justify-center md:justify-start">
              <a
                href="https://instagram.com/rumbodigital"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-glass hover:bg-pink-500/10 border border-border hover:border-pink-500/50 transition-all group"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5 text-foreground-muted group-hover:text-pink-400 transition-colors" />
              </a>
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-glass hover:bg-green-500/10 border border-border hover:border-green-500/50 transition-all group"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-foreground-muted group-hover:text-green-400 transition-colors" />
              </a>
              <a
                href="mailto:hola@rumbodigital.com"
                className="p-3 rounded-xl bg-glass hover:bg-primary-500/10 border border-border hover:border-primary-500/50 transition-all group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-foreground-muted group-hover:text-primary-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground-muted">
          <p>
            © {year} Rumbo Digital Studio. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-red-400 fill-red-400 inline" /> en Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
