"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="proyectos" className="py-24 bg-background-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Nuestros Proyectos
            </span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Mirá algunos de los sitios web que desarrollamos — hacé click en Ver Demo para verlos en vivo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-background-card border border-border rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 hover:shadow-glow"
            >
              {/* Screenshot preview */}
              <div className="relative aspect-video overflow-hidden bg-zinc-900">
                <Image
                  src={project.imageUrl}
                  alt={`Preview de ${project.name}`}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                {/* Overlay on hover with demo button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-glow hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver Demo en Vivo
                    </Link>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold group-hover:text-primary-400 transition-colors">
                      {project.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 capitalize">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-foreground-muted text-sm">{project.description}</p>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-full bg-white/5 text-foreground-muted border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Demo link button */}
                {project.demoUrl && (
                  <Link
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-semibold transition-colors group/link"
                  >
                    <span>Ver Demo</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {project.featured && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-primary-600/90 text-white font-semibold backdrop-blur-sm">
                    ⭐ Destacado
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
