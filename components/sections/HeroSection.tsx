"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { HeroConfig } from "@/types";

interface HeroSectionProps {
  config: HeroConfig;
}

const stats = [
  { value: "+50", label: "Proyectos entregados" },
  { value: "100%", label: "Clientes satisfechos" },
  { value: "<48h", label: "Respuesta garantizada" },
];

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(61,82,230,0.18),transparent)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary-600/[0.07] rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 pb-16 md:pt-36 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT — content */}
          <div className="space-y-6 text-center lg:text-left">

            {/* Badge */}
            {config.badgeText && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/30 text-xs font-semibold text-primary-300 tracking-wide uppercase">
                  <Sparkles className="w-3 h-3" />
                  {config.badgeText}
                </span>
              </motion.div>
            )}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.08] tracking-tight"
            >
              <span className="text-white">Tu negocio</span>
              <br />
              <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
                merece una web
              </span>
              <br />
              <span className="text-white">que venda.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/50 max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              Diseñamos y desarrollamos sitios web premium para emprendedores y empresas que quieren atraer más clientes, sin complicaciones técnicas.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href={config.ctaPrimaryHref}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(61,82,230,0.5)] hover:shadow-[0_0_36px_rgba(61,82,230,0.7)]"
              >
                Ver proyectos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] hover:border-white/[0.2] text-white/80 hover:text-white font-semibold text-sm transition-all duration-200"
              >
                Solicitar presupuesto
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-6 justify-center lg:justify-start pt-2"
            >
              {stats.map((s, i) => (
                <div key={i} className={`text-center lg:text-left ${i > 0 ? "pl-6 border-l border-white/[0.1]" : ""}`}>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-primary-600/20 rounded-3xl blur-3xl scale-75" />

            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full aspect-[4/3]">
              <Image
                src={config.heroImageUrl}
                alt="Rumbo Digital Studio — Proyectos web premium"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
