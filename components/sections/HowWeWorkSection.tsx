"use client";

import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, Code, CheckSquare, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Consulta inicial",
    description: "Entendemos tu negocio, tus objetivos y qué querés lograr con tu presencia digital.",
  },
  {
    step: "02",
    icon: Lightbulb,
    title: "Propuesta y diseño",
    description: "Presentamos una propuesta técnica y visual personalizada. Sin plantillas genéricas.",
  },
  {
    step: "03",
    icon: Code,
    title: "Desarrollo",
    description: "Construimos tu sitio con tecnología de primer nivel: rápido, seguro y optimizado.",
  },
  {
    step: "04",
    icon: CheckSquare,
    title: "Revisión y ajustes",
    description: "Probamos todo a fondo y hacemos los ajustes que necesites antes de salir al aire.",
  },
  {
    step: "05",
    icon: Rocket,
    title: "Lanzamiento",
    description: "Publicamos tu sitio y te acompañamos en los primeros pasos para que todo salga perfecto.",
  },
];

export function HowWeWorkSection() {
  return (
    <section id="como-trabajamos" className="py-20 md:py-32 bg-black relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 md:mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Proceso</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Simple, transparente,<br className="hidden sm:block" /> sin sorpresas.
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Un proceso probado que llevó decenas de proyectos del concepto a la realidad.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden lg:block absolute top-10 left-[calc(10%+20px)] right-[calc(10%+20px)] h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center lg:items-center"
                >
                  {/* Circle */}
                  <div className="relative z-10 mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center group-hover:border-primary-500/50 transition-all">
                      <Icon className="w-7 h-7 text-primary-400" />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-black">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed max-w-[160px]">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
