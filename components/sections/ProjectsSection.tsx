"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="proyectos" className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Portafolio</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Resultados que<br />hablan por sí solos.
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-xs md:text-right leading-relaxed">
            Cada proyecto es una solución real para un negocio real. Hacé click en Ver Demo para verlos en vivo.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-primary-500/40 transition-all duration-400 hover:shadow-[0_0_40px_rgba(61,82,230,0.12)]"
            >
              {/* Screenshot */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                <Image
                  src={project.imageUrl}
                  alt={`Preview de ${project.name}`}
                  fill
                  className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
                  unoptimized
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Demo button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold transition-all hover:scale-105 shadow-2xl"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver demo en vivo
                    </Link>
                  )}
                </div>

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-xs rounded-full bg-primary-600/90 text-white font-semibold backdrop-blur-sm">
                      Destacado
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-primary-300 transition-colors">
                    {project.name}
                  </h3>
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
                      aria-label={`Ver demo de ${project.name}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
                <p className="text-white/40 text-sm leading-relaxed mb-3">{project.description}</p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-white/[0.04] text-white/40 border border-white/[0.06] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
