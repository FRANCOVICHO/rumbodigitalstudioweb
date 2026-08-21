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
    <section id="servicios" className="py-14 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Nuestros Servicios
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-foreground-muted max-w-2xl mx-auto">
            Todo lo que necesitás para tener una presencia digital exitosa
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Zap;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="p-4 sm:p-6 rounded-2xl bg-background-card border border-border hover:border-primary-500/50 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ backgroundColor: `${service.color}20`, color: service.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-foreground-muted">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
