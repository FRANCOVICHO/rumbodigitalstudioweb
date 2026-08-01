"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, MessageSquare, Eye, Star, ExternalLink } from "lucide-react";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;

interface Stats {
  projects: number;
  messages: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, messages: 0, testimonials: 0 });
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; email: string; created: string; read: boolean }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [p, m, t] = await Promise.all([
          fetch(`${PB_URL}/api/collections/projects/records?perPage=1`).then(r => r.json()),
          fetch(`${PB_URL}/api/collections/contact_messages/records?sort=-created&perPage=5`).then(r => r.json()),
          fetch(`${PB_URL}/api/collections/testimonials/records?perPage=1`).then(r => r.json()),
        ]);
        setStats({ projects: p.totalItems || 0, messages: m.totalItems || 0, testimonials: t.totalItems || 0 });
        setRecentMessages(m.items || []);
      } catch {}
    }
    load();
  }, []);

  const cards = [
    { label: "Proyectos", value: stats.projects, icon: FolderOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Mensajes", value: stats.messages, icon: MessageSquare, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Testimonios", value: stats.testimonials, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Visitas", value: "—", icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10" },
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
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm text-foreground-muted">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Acceso rápido</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Editar Hero", href: "/admin/hero" },
            { label: "Agregar Proyecto", href: "/admin/projects" },
            { label: "Editar Planes", href: "/admin/plans" },
            { label: "Ver Mensajes", href: "/admin/messages" },
            { label: "Editar FAQ", href: "/admin/faq" },
            { label: "Apariencia", href: "/admin/appearance" },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-primary-600/10 transition-all group text-sm font-medium"
            >
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
                <span className="text-xs text-foreground-subtle">
                  {new Date(msg.created).toLocaleDateString("es-AR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
