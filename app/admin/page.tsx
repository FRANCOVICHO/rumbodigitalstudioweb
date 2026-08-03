"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, MessageSquare, Eye, Star, ExternalLink, Plus, CreditCard, Check } from "lucide-react";
import Image from "next/image";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;

interface Stats { projects: number; messages: number; testimonials: number; }
interface Project { id: string; name: string; description: string; imageUrl: string; demoUrl?: string; category: string; }
interface Plan { id: string; name: string; price: number; currency: string; highlighted: boolean; badge?: string; features?: string[]; }

const DEFAULT_PROJECTS: Project[] = [
  { id: "d1", name: "Local Bar & Restaurant", description: "Sitio web para negocio local con menú y reservas", imageUrl: "/screenshots/LOCAL.png", demoUrl: "https://paginaweblocalejemplo.pages.dev/", category: "corporate" },
  { id: "d2", name: "Barber Shop Premium", description: "Landing para barbería con sistema de turnos online", imageUrl: "/screenshots/BARBER.png", demoUrl: "https://barberejemplopagina.pages.dev/", category: "landing" },
  { id: "d3", name: "Gym & Fitness Landing", description: "Landing para gimnasio con planes y testimonios", imageUrl: "/screenshots/GYM.png", demoUrl: "https://landingpageejemplo.pages.dev/", category: "landing" },
];

const DEFAULT_PLANS: Plan[] = [
  { id: "p1", name: "Básico", price: 150000, currency: "ARS", highlighted: false, features: ["Hasta 5 páginas", "Diseño responsive", "SEO básico", "1 mes de soporte"] },
  { id: "p2", name: "Profesional", price: 300000, currency: "ARS", highlighted: true, badge: "Más elegido", features: ["Hasta 15 páginas", "Panel de administración", "SEO avanzado", "3 meses de soporte"] },
  { id: "p3", name: "Enterprise", price: 0, currency: "ARS", highlighted: false, features: ["Páginas ilimitadas", "E-commerce completo", "6 meses de soporte", "Hosting incluido"] },
];

function formatPrice(price: number, currency: string) {
  if (price === 0) return "A consultar";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: currency === "ARS" ? "ARS" : "USD", maximumFractionDigits: 0 }).format(price);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, messages: 0, testimonials: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; email: string; created: string; read: boolean }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [p, m, t, pl] = await Promise.all([
          fetch(`${PB_URL}/api/collections/projects/records?sort=order&perPage=10`).then(r => r.json()),
          fetch(`${PB_URL}/api/collections/contact_messages/records?sort=-created&perPage=5`).then(r => r.json()),
          fetch(`${PB_URL}/api/collections/testimonials/records?perPage=1`).then(r => r.json()),
          fetch(`${PB_URL}/api/collections/plans/records?sort=order`).then(r => r.json()),
        ]);
        setStats({ projects: p.totalItems || 0, messages: m.totalItems || 0, testimonials: t.totalItems || 0 });
        setProjects(p.items?.length > 0 ? p.items : DEFAULT_PROJECTS);
        setPlans(pl.items?.length > 0 ? pl.items : DEFAULT_PLANS);
        setRecentMessages(m.items || []);
      } catch {
        setProjects(DEFAULT_PROJECTS);
        setPlans(DEFAULT_PLANS);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Proyectos", value: stats.projects, icon: FolderOpen, color: "text-blue-400", bg: "bg-blue-500/10", href: "/admin/projects" },
    { label: "Mensajes", value: stats.messages, icon: MessageSquare, color: "text-green-400", bg: "bg-green-500/10", href: "/admin/messages" },
    { label: "Testimonios", value: stats.testimonials, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10", href: "/admin/testimonials" },
    { label: "Visitas", value: "—", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10", href: "#" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-foreground-muted mt-1">Resumen general del sitio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.a
              key={card.label}
              href={card.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm text-foreground-muted">{card.label}</div>
            </motion.a>
          );
        })}
      </div>

      {/* Plans preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-400" /> Planes
          </h3>
          <a href="/admin/plans" className="text-sm text-primary-400 hover:underline">Editar planes</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-5 rounded-2xl border transition-all ${plan.highlighted ? "border-primary-500/60 bg-primary-600/15" : "border-white/10 bg-white/5"}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs rounded-full bg-primary-600 text-white font-semibold">{plan.badge}</span>
                </div>
              )}
              <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
              <div className={`text-2xl font-bold mb-3 ${plan.highlighted ? "text-primary-400" : ""}`}>
                {plan.price === 0 ? "A consultar" : formatPrice(plan.price, plan.currency)}
              </div>
              {plan.features && (
                <ul className="space-y-1">
                  {(plan.features as string[]).slice(0, 4).map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-foreground-muted">
                      <Check className="w-3 h-3 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Projects preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Portfolio de Proyectos</h3>
          <a href="/admin/projects" className="flex items-center gap-1.5 text-sm text-primary-400 hover:underline">
            <Plus className="w-4 h-4" /> Agregar proyecto
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary-500/30 transition-all group"
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-900">
                {project.imageUrl ? (
                  <Image src={project.imageUrl} alt={project.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-subtle">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{project.name}</h4>
                    <p className="text-xs text-foreground-muted mt-0.5 truncate">{project.description}</p>
                  </div>
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 text-foreground-muted hover:text-white transition-all shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <span className="mt-2 inline-block px-2 py-0.5 text-xs rounded-full bg-primary-500/10 text-primary-400">{project.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Acceso rápido</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Editar Hero", href: "/admin/hero" },
            { label: "Editar Planes", href: "/admin/plans" },
            { label: "Editar Servicios", href: "/admin/services" },
            { label: "Ver Mensajes", href: "/admin/messages" },
            { label: "Editar FAQ", href: "/admin/faq" },
            { label: "Apariencia", href: "/admin/appearance" },
          ].map(link => (
            <a key={link.href} href={link.href} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-primary-600/10 transition-all group text-sm font-medium">
              {link.label}
              <ExternalLink className="w-3 h-3 text-foreground-subtle group-hover:text-primary-400 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      {recentMessages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Mensajes recientes</h3>
            <a href="/admin/messages" className="text-sm text-primary-400 hover:underline">Ver todos</a>
          </div>
          <div className="space-y-2">
            {recentMessages.map(msg => (
              <div key={msg.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                  </div>
                  <span className="text-xs text-foreground-muted">{msg.email}</span>
                </div>
                <span className="text-xs text-foreground-subtle">{new Date(msg.created).toLocaleDateString("es-AR")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
