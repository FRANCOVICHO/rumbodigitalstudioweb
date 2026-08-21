"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, next, testimonials.length]);

  /* ── Empty state ─────────────────────────────── */
  if (testimonials.length === 0) {
    return (
      <section id="testimonios" className="py-20 md:py-32 bg-[#040408]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Testimonios</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Lo que dicen quienes<br /> trabajaron con nosotros.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center space-y-5">
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400/40" />
                ))}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">¡Sé el primero en opinar!</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Las reseñas de nuestros clientes aparecerán acá una vez que completen su proyecto.
                </p>
              </div>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(61,82,230,0.4)]"
              >
                Empezar mi proyecto
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const t = testimonials[current];

  return (
    <section id="testimonios" className="py-20 md:py-32 bg-[#040408]">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Testimonios</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Lo que dicen quienes<br className="hidden sm:block" /> trabajaron con nosotros.
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          className="max-w-2xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative p-8 sm:p-10 rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
            {/* Large quote mark */}
            <div className="absolute top-6 right-8 text-[80px] leading-none font-serif text-primary-500/10 select-none">
              &ldquo;
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 space-y-5"
              >
                {/* Stars */}
                {t.rating && t.rating > 0 && (
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < t.rating! ? "text-yellow-400 fill-yellow-400" : "text-white/15"}`} />
                    ))}
                  </div>
                )}

                {/* Quote */}
                <p className="text-base sm:text-lg text-white/70 leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-9 h-9 rounded-full bg-primary-600/30 border border-primary-500/30 flex items-center justify-center text-primary-300 font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-white/35">{t.role} — {t.company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-5">
              {/* Dots */}
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary-400 w-6" : "bg-white/20 w-1.5 hover:bg-white/35"}`}
                    aria-label={`Testimonio ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setCurrent(c => (c - 1 + testimonials.length) % testimonials.length); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000); }}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white/50 hover:text-white transition-all"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { next(); setIsPaused(true); setTimeout(() => setIsPaused(false), 4000); }}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white/50 hover:text-white transition-all"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
