"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Plan } from "@/types";

interface PlansSectionProps {
  plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
  return (
    <section id="planes" className="py-14 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Planes y Precios
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-foreground-muted max-w-2xl mx-auto">
            Soluciones para cada etapa de tu negocio
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative flex flex-col rounded-2xl border p-5 sm:p-6 md:p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-primary-600/10 border-primary-500 shadow-glow-lg"
                  : "bg-background-card border-border hover:border-primary-500/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-primary-600 text-white text-sm font-semibold shadow-glow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5 md:mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{plan.name}</h3>
                <p className="text-foreground-muted text-xs sm:text-sm mb-3">{plan.description}</p>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {plan.price === 0 ? (
                    <span className="text-primary-400">A consultar</span>
                  ) : (
                    <>
                      <span className="bg-gradient-primary bg-clip-text text-transparent">
                        {formatPrice(plan.price, plan.currency)}
                      </span>
                      <span className="text-lg font-normal text-foreground-muted ml-2">
                        / {plan.period}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm text-foreground-subtle">
                    <X className="w-4 h-4 text-foreground-subtle mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 ${
                  plan.highlighted
                    ? "bg-primary-600 hover:bg-primary-700 text-white shadow-glow"
                    : "bg-glass hover:bg-glass-strong border border-border text-white"
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
