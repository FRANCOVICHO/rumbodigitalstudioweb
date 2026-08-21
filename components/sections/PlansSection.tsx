"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Plan } from "@/types";

interface PlansSectionProps {
  plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
  return (
    <section id="planes" className="py-20 md:py-32 bg-[#040408]">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Precios</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Invertí en tu negocio<br className="hidden sm:block" /> con precios claros.
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Sin letra chica. Sin costos ocultos. El precio que ves es el precio que pagás.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-start max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-primary-600/[0.12] border border-primary-500/50 shadow-[0_0_60px_rgba(61,82,230,0.18)]"
                  : "bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.13]"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-primary-600 text-white text-[11px] font-bold tracking-wide shadow-[0_0_20px_rgba(61,82,230,0.5)]">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5 pt-1">
                <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-white/[0.06]">
                {plan.price === 0 ? (
                  <div className="text-2xl font-bold text-primary-400">A consultar</div>
                ) : (
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-white">
                      {formatPrice(plan.price, plan.currency)}
                    </div>
                    <div className="text-xs text-white/35 pb-1">/ {plan.period}</div>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-xs text-white/70">
                    <Check className="w-3.5 h-3.5 text-primary-400 mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
                {plan.notIncluded.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-xs text-white/25">
                    <X className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`group flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_20px_rgba(61,82,230,0.4)] hover:shadow-[0_0_30px_rgba(61,82,230,0.6)]"
                    : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2] text-white/80 hover:text-white"
                }`}
              >
                {plan.ctaLabel}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-white/25 mt-8"
        >
          ¿Tenés un proyecto especial? <a href="#contacto" className="text-primary-400 hover:text-primary-300 transition-colors">Hablemos y armamos algo a medida.</a>
        </motion.p>
      </div>
    </section>
  );
}
