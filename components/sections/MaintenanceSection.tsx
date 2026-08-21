"use client";

// components/sections/MaintenanceSection.tsx
// Task 2.1: TypeScript interfaces for MaintenanceSection
// Task 2.2: Data constants for MaintenanceSection
// Task 3.2: Animated section header with title, subtitle and decorative icons

import { motion } from "framer-motion";
import { Server, Cloud, Shield, Settings, Activity, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export interface MaintenancePlan {
  id: string;
  name: string;
  price: number;
  period: string;
  currency: string;
  description: string;
  highlighted: boolean;
  badge: string | null;
  ctaLabel: string;
  features: string[];
}

export interface WhatsAppMessage {
  sender: "client" | "studio";
  text: string;
}

export interface StatItem {
  id: string;
  label: string;
}

export const MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    id: "basico",
    name: "Plan Básico",
    price: 7900,
    period: "mes",
    currency: "ARS",
    description:
      "Ideal para quienes solo quieren mantener su sitio funcionando sin preocupaciones.",
    highlighted: false,
    badge: null,
    ctaLabel: "Contratar",
    features: [
      "Hosting incluido",
      "Dominio incluido",
      "Certificado SSL",
      "Copias de seguridad automáticas",
      "Monitoreo del sitio",
      "Corrección de errores",
      "Soporte por WhatsApp",
      "Hasta 2 cambios pequeños por mes",
      "Tiempo de respuesta estándar",
    ],
  },
  {
    id: "avanzado",
    name: "Plan Avanzado",
    price: 24900,
    period: "mes",
    currency: "ARS",
    description:
      "Ideal para negocios que actualizan constantemente su página y quieren olvidarse completamente de la parte técnica.",
    highlighted: true,
    badge: "⭐ Más elegido",
    ctaLabel: "Quiero este plan",
    features: [
      "Hosting incluido",
      "Dominio incluido",
      "Certificado SSL",
      "Copias de seguridad automáticas",
      "Monitoreo del sitio",
      "Corrección de errores",
      "Soporte por WhatsApp",
      "Cambios de contenido prácticamente ilimitados",
      "Nuevas secciones simples",
      "Prioridad en soporte",
      "Optimización continua",
      "Ajustes de diseño",
      "Revisión mensual del sitio",
      "Recomendaciones para mejorar conversión",
      "Atención rápida por WhatsApp",
    ],
  },
];

export const COMPARATOR_WITHOUT: string[] = [
  "Si querés cambiar un horario tenés que pedir un presupuesto",
  "Si cambia un precio hay que solicitar una modificación",
  "Si aparece un error nadie lo controla",
  "Tu página queda desactualizada",
];

export const COMPARATOR_WITH: string[] = [
  "Nos escribís por WhatsApp",
  "Nosotros realizamos el cambio",
  "Tu sitio siempre actualizado",
  "Soporte continuo",
];

export const STATS: StatItem[] = [
  { id: "respuesta", label: "⚡ Respuesta rápida" },
  { id: "soporte", label: "🛠 Soporte continuo" },
  { id: "seguridad", label: "🔒 Sitio seguro" },
  { id: "monitoreo", label: "🌐 Monitoreo permanente" },
];

export const WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    sender: "client",
    text: "Hola, mañana lanzamos una promoción del 20%. ¿Podés agregar un banner en la página?",
  },
  {
    sender: "studio",
    text: "¡Listo! Ya está publicado. Mucha suerte con la promoción.",
  },
];

export function MaintenanceSection(): JSX.Element {
  return (
    <section
      id="mantenimiento"
      className="relative py-14 md:py-24 bg-background overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-blob-slow" />

      {/* Main content wrapper */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="flex justify-center gap-4 mb-4">
            <Server className="w-5 h-5 text-primary-400" aria-hidden="true" />
            <Cloud className="w-5 h-5 text-primary-400" aria-hidden="true" />
            <Shield className="w-5 h-5 text-primary-400" aria-hidden="true" />
            <Settings className="w-5 h-5 text-primary-400" aria-hidden="true" />
            <Activity className="w-5 h-5 text-primary-400" aria-hidden="true" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Mantenimiento mensual
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-foreground-muted max-w-2xl mx-auto">
            Tu página web no termina cuando la publicamos. Con nuestros planes mantenemos tu sitio seguro, actualizado y listo para acompañar el crecimiento de tu negocio.
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="mb-16">
          <div
            data-testid="plans-grid"
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto"
          >
            {MAINTENANCE_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-5 sm:p-6 md:p-8 bg-background-card border border-border${
                  plan.highlighted ? " border-primary-500 shadow-glow-lg" : ""
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-sm px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                {/* Plan name */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                  <span className="text-lg font-normal text-foreground-muted ml-2">
                    /mes
                  </span>
                </div>

                {/* Description */}
                <p className="text-foreground-muted text-sm mb-6">{plan.description}</p>

                {/* Features list */}
                <ul className="space-y-2 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check
                        className="w-4 h-4 text-primary-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <a
                  href={`https://wa.me/5402920245637?text=Hola%2C+quiero+info+sobre+el+${encodeURIComponent(plan.name)}`}
                  className={
                    plan.highlighted
                      ? "block w-full text-center py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-glow transition-colors"
                      : "block w-full text-center py-3 px-6 rounded-xl bg-glass border border-border text-white hover:bg-glass-strong transition-colors"
                  }
                >
                  {plan.ctaLabel}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparator block */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            ¿Qué pasa{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              con y sin
            </span>{" "}
            mantenimiento?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Left column — Sin mantenimiento */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-2xl p-6 bg-background-card border border-border h-full">
                <h4 className="text-lg font-semibold mb-4 text-foreground-muted">
                  Sin mantenimiento
                </h4>
                <ul className="space-y-3">
                  {COMPARATOR_WITHOUT.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground-muted">
                      <span aria-hidden="true">❌</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right column — Con mantenimiento */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-2xl p-6 bg-background-card border border-primary-500/30 h-full">
                <h4 className="text-lg font-semibold mb-4 text-primary-400">
                  Con mantenimiento
                </h4>
                <ul className="space-y-3">
                  {COMPARATOR_WITH.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <span aria-hidden="true">✅</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* WhatsApp Demo block */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            ¿Cómo funciona?
          </h3>
          <div className="max-w-lg mx-auto">
            <div className="space-y-4">
              {WHATSAPP_MESSAGES.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3 }}
                  viewport={{ once: true }}
                  className={`flex ${
                    message.sender === "client" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    data-testid="whatsapp-bubble"
                    role="article"
                    aria-label={
                      message.sender === "client"
                        ? `Mensaje del cliente: ${message.text}`
                        : `Mensaje del studio: ${message.text}`
                    }
                    className={
                      message.sender === "client"
                        ? "self-start max-w-xs rounded-2xl px-4 py-3 bg-background-card border border-border text-sm"
                        : "self-end max-w-xs rounded-2xl px-4 py-3 bg-primary-600/20 border border-primary-500/30 text-sm"
                    }
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-foreground-muted text-sm mt-8">
              Así de simple. Vos te ocupás de tu negocio, nosotros nos ocupamos de tu página.
            </p>
          </div>
        </div>

        {/* Stats Grid block */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                data-testid="stat-card"
                className="rounded-2xl p-6 bg-background-card border border-border backdrop-blur text-center"
              >
                <p className="text-lg font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Final block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center py-12 px-6 sm:py-16 sm:px-8 rounded-3xl bg-background-card border border-border max-w-3xl mx-auto"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Tu negocio cambia todos los días.
          </h3>
          <p className="text-xl text-foreground-muted mb-8">
            Tu página web también debería poder hacerlo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-stretch">
            <a
              href="https://wa.me/5402920245637?text=Hola%2C+quiero+olvidarme+de+la+parte+t%C3%A9cnica"
              className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-glow transition-colors font-semibold"
            >
              Quiero olvidarme de la parte técnica
            </a>
            <a
              href="#contacto"
              className="px-8 py-4 rounded-xl bg-glass border border-border text-white hover:bg-glass-strong transition-colors"
            >
              Consultar planes
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
