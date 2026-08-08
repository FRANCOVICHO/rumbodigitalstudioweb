"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroConfig } from "@/types";

interface HeroSectionProps {
  config: HeroConfig;
}

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-blob-slow" />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            {config.badgeText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="px-4 py-2 rounded-full bg-glass border border-border text-sm font-medium text-primary-400">
                  {config.badgeText}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {config.title}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto lg:mx-0"
            >
              {config.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link
                href={config.ctaPrimaryHref}
                className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-glow hover:shadow-glow-lg hover:scale-105 text-center"
              >
                {config.ctaPrimaryLabel}
              </Link>
              <Link
                href={config.ctaSecondaryHref}
                className="px-8 py-4 rounded-xl bg-glass hover:bg-glass-strong border border-border text-white font-semibold transition-all hover:scale-105 text-center"
              >
                {config.ctaSecondaryLabel}
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative w-full"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square max-w-lg mx-auto">
              <Image
                src={config.heroImageUrl}
                alt="Rumbo Digital Studio"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-foreground-muted"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
