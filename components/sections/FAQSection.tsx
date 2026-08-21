"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FAQItem } from "@/types";

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(index: number) {
    setOpenIndex(prev => prev === index ? null : index);
  }

  return (
    <section id="faq" className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Preguntas frecuentes.
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto">
            Si no encontrás lo que buscás, <a href="#contacto" className="text-primary-400 hover:text-primary-300 transition-colors">escribinos directamente.</a>
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto space-y-2">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "bg-primary-600/[0.08] border-primary-500/30"
                    : "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.13]"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white leading-snug">
                    {item.question}
                  </span>
                  <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-primary-600/30 text-primary-400" : "bg-white/[0.05] text-white/40"}`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                      <p className="px-5 pb-5 text-sm text-white/45 leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
