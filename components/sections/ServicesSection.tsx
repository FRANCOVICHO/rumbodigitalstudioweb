"use client";

import { motion } from "framer-motion";
import {
  Code, ShoppingCart, Rocket, Palette, Smartphone, Server,
  Search, Cloud, Wrench, Lightbulb, RefreshCw, Plug, Zap, LucideIcon,
} from "lucide-react";
import type { Service } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Code, ShoppingCart, Rocket, Palette, Smartphone, Server,
  Search, Cloud, Wrench, Lightbulb, RefreshCw, Plug, Zap,
};

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="servicios" className="py-20 md:py-32 bg-[#040408]">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Servicios</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Todo lo que tu negocio<br className="hidden sm:block" /> necesita en un solo lugar.
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Desde tu primera página hasta integraciones avanzadas — construimos exactamente lo que necesitás.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Zap;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.07 }}
                whileHover={{ y: -3 }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-300 cursor-default overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${service.color}18 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${service.color}18`, color: service.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text */}
                <h3 className="relative text-sm font-bold text-white/80 group-hover:text-white mb-1.5 transition-colors">
                  {service.name}
                </h3>
                <p className="relative text-xs text-white/35 group-hover:text-white/50 leading-relaxed transition-colors">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
