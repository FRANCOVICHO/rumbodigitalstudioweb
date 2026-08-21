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
    <section id="como-trabajamos" className="py-14 md:py-24 bg-background-secondary">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              ¿Cómo Trabajamos?
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-foreground-muted max-w-2xl mx-auto">
            Un proceso probado para llevar tu proyecto del concepto a la realidad
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-primary-600/20 via-primary-500 to-primary-600/20" />

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className={`flex flex-col items-center text-center ${
                    i === 3 ? "col-start-1 sm:col-start-auto" : ""
                  } ${i >= 3 ? "col-span-1" : ""}`}
                >
                  <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-primary-600/20 border-2 border-primary-500 flex items-center justify-center mb-2 md:mb-4 shadow-glow">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary-400" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-7 md:h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-foreground-muted hidden sm:block">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
