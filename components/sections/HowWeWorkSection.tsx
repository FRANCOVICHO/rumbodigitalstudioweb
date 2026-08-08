"use client";

import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, Code, TestTube, Rocket } from "lucide-react";

const steps = [
  { step: 1, icon: MessageSquare, title: "Consulta", description: "Analizamos tus necesidades y objetivos en detalle." },
  { step: 2, icon: Lightbulb, title: "Propuesta", description: "Diseñamos la solución técnica y visual ideal para vos." },
  { step: 3, icon: Code, title: "Desarrollo", description: "Desarrollamos tu sitio con las mejores tecnologías." },
  { step: 4, icon: TestTube, title: "Revisión", description: "Probamos cada detalle y ajustamos según tu feedback." },
  { step: 5, icon: Rocket, title: "Lanzamiento", description: "Publicamos tu sitio y lo optimizamos para el éxito." },
];

export function HowWeWorkSection() {
  return (
    <section id="como-trabajamos" className="py-24 bg-background-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              ¿Cómo Trabajamos?
            </span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Un proceso probado para llevar tu proyecto del concepto a la realidad
          </p>
        </motion.div>

        {/* Desktop: horizontal, Mobile: vertical */}
        <div className="relative">
          {/* Connector line — hidden on mobile */}
          <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-primary-600/20 via-primary-500 to-primary-600/20" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center col-span-1 last:col-span-2 sm:last:col-span-1"
                >
                  <div className="relative z-10 w-24 h-24 rounded-full bg-primary-600/20 border-2 border-primary-500 flex items-center justify-center mb-4 shadow-glow">
                    <Icon className="w-8 h-8 text-primary-400" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-foreground-muted">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
