"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquarePlus, Lock, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    if (testimonials.length > 0) setCurrent(c => (c + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    intervalRef.current = setInterval(next, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, next, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <section id="testimonios" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Reseñas de Clientes</span>
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">Las opiniones de quienes ya trabajaron con nosotros</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
            <div className="p-12 rounded-2xl bg-background-card border border-border space-y-6">
              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-8 h-8 text-foreground-subtle" />)}
              </div>
              <MessageSquarePlus className="w-16 h-16 text-primary-400 mx-auto" />
              <div>
                <h3 className="text-2xl font-bold mb-3">¡Sé el primero en opinar!</h3>
                <p className="text-foreground-muted text-lg">Aún no hay reseñas. Las opiniones de nuestros clientes aparecerán aquí una vez que hayan completado su proyecto.</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-foreground-subtle p-4 rounded-xl bg-glass border border-border">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Solo clientes con proyectos completados pueden dejar una reseña</span>
              </div>
              <a href="#contacto" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-glow hover:shadow-glow-lg hover:scale-105">
                Empezar mi proyecto
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const t = testimonials[current];

  return (
    <section id="testimonios" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Lo Que Dicen Nuestros Clientes</span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">La satisfacción de nuestros clientes es nuestra mejor carta de presentación</p>
        </motion.div>

        <div className="max-w-3xl mx-auto" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-background-card border border-border">
            <Quote className="absolute top-8 left-8 w-10 h-10 text-primary-500/30" />
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="space-y-6">
                {t.rating && t.rating > 0 && (
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < t.rating! ? "text-yellow-400 fill-yellow-400" : "text-foreground-subtle"}`} />
                    ))}
                  </div>
                )}
                <p className="text-lg md:text-xl text-foreground-muted italic leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div>
                  <p className="font-bold text-lg">{t.name}</p>
                  <p className="text-foreground-muted text-sm">{t.role} — {t.company}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={() => { setCurrent(c => (c - 1 + testimonials.length) % testimonials.length); setIsPaused(true); setTimeout(() => setIsPaused(false), 3000); }} className="p-2 rounded-full bg-glass border border-border hover:border-primary-500/50 text-foreground-muted hover:text-white transition-all" aria-label="Anterior">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => { setCurrent(i); setIsPaused(true); setTimeout(() => setIsPaused(false), 3000); }} className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary-500 w-8" : "bg-foreground-subtle hover:bg-foreground-muted w-2.5"}`} aria-label={`Ir al testimonio ${i + 1}`} />
                ))}
              </div>
              <button onClick={() => { next(); setIsPaused(true); setTimeout(() => setIsPaused(false), 3000); }} className="p-2 rounded-full bg-glass border border-border hover:border-primary-500/50 text-foreground-muted hover:text-white transition-all" aria-label="Siguiente">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
