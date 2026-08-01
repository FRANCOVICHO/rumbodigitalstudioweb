"use client";

import { motion } from "framer-motion";
import { Star, MessageSquarePlus, Lock } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Reseñas de Clientes
            </span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Las opiniones de quienes ya trabajaron con nosotros
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="p-12 rounded-2xl bg-background-card border border-border space-y-6">
            {/* Stars empty */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-8 h-8 text-foreground-subtle" />
              ))}
            </div>

            <MessageSquarePlus className="w-16 h-16 text-primary-400 mx-auto" />

            <div>
              <h3 className="text-2xl font-bold mb-3">
                ¡Sé el primero en opinar!
              </h3>
              <p className="text-foreground-muted text-lg">
                Aún no hay reseñas. Las opiniones de nuestros clientes aparecerán aquí
                una vez que hayan completado su proyecto.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-foreground-subtle p-4 rounded-xl bg-glass border border-border">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Solo clientes con proyectos completados pueden dejar una reseña</span>
            </div>

            <a
              href="#contacto"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-glow hover:shadow-glow-lg hover:scale-105"
            >
              Empezar mi proyecto
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
