"use client";

import { motion } from "framer-motion";
import { Shield, Zap, RefreshCw, HeadphonesIcon, Check, ArrowRight } from "lucide-react";
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
    description: "Ideal para mantener tu sitio funcionando sin preocupaciones técnicas.",
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
    ],
  },
  {
    id: "avanzado",
    name: "Plan Avanzado",
    price: 24900,
    period: "mes",
    currency: "ARS",
    description: "Para negocios que actualizan constantemente y quieren olvidarse de lo técnico.",
    highlighted: true,
    badge: "Más elegido",
    ctaLabel: "Quiero este plan",
    features: [
      "Todo lo del Plan Básico",
      "Cambios de contenido ilimitados",
      "Nuevas secciones simples",
      "Prioridad en soporte",
      "Optimización continua",
      "Ajustes de diseño",
      "Revisión mensual",
      "Recomendaciones de conversión",
      "Atención rápida por WhatsApp",
    ],
  },
];

const benefits = [
  { icon: Shield, title: "Sitio siempre seguro", desc: "SSL, backups diarios y monitoreo 24/7." },
  { icon: Zap, title: "Respuesta rápida", desc: "Cambios y correcciones sin esperas." },
  { icon: RefreshCw, title: "Siempre actualizado", desc: "Tu contenido al día, sin que tengas que hacer nada." },
  { icon: HeadphonesIcon, title: "Soporte humano", desc: "Hablás con personas reales por WhatsApp." },
];

export function MaintenanceSection(): JSX.Element {
  return (
    <section id="mantenimiento" className="relative py-20 md:py-32 bg-black overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary-600/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Mantenimiento</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Tu web, siempre<br className="hidden sm:block" /> en su mejor versión.
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Publicar tu sitio es el inicio, no el final. Nos encargamos de todo para que vos te enfoqués en tu negocio.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14 md:mb-20">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-primary-600/15 border border-primary-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-4 h-4 text-primary-400" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{b.title}</h4>
                <p className="text-[11px] text-white/35 leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto mb-14">
          {MAINTENANCE_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className={`relative rounded-2xl p-5 sm:p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-primary-600/[0.12] border border-primary-500/50 shadow-[0_0_50px_rgba(61,82,230,0.15)]"
                  : "bg-white/[0.03] border border-white/[0.07]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 rounded-full bg-primary-600 text-white text-[11px] font-bold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="text-base font-bold text-white mb-1 pt-1">{plan.name}</h3>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">{plan.description}</p>

              <div className="mb-5 pb-5 border-b border-white/[0.06]">
                <span className="text-3xl font-bold text-white">{formatPrice(plan.price, plan.currency)}</span>
                <span className="text-xs text-white/35 ml-1.5">/mes</span>
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                    <Check className="w-3.5 h-3.5 text-primary-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/5402920245637?text=Hola%2C+quiero+info+sobre+el+${encodeURIComponent(plan.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(61,82,230,0.35)]"
                    : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white/80 hover:text-white"
                }`}
              >
                {plan.ctaLabel}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-primary-500/20 bg-primary-600/[0.08] p-8 sm:p-10 text-center max-w-2xl mx-auto"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_-20%,rgba(61,82,230,0.2),transparent)] pointer-events-none" />
          <h3 className="relative text-xl sm:text-2xl font-bold text-white mb-2">
            ¿Publicaste un sitio y quedó abandonado?
          </h3>
          <p className="relative text-white/50 text-sm mb-6">
            Nosotros lo mantenemos activo, seguro y en crecimiento mes a mes.
          </p>
          <a
            href="https://wa.me/5402920245637?text=Hola%2C+quiero+info+sobre+mantenimiento+web"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(61,82,230,0.4)]"
          >
            Consultar por WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
