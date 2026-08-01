"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Edit2, Trash2, ExternalLink, X, Check, Save } from "lucide-react";
import { StatusBanner } from "@/components/admin/StatusBanner";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;
const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors";

interface Project {
  id: string; name: string; description: string; category: string;
  technologies: string[]; imageUrl: string; demoUrl: string; featured: boolean; order: number;
}

const empty = { name: "", description: "", category: "landing", technologies: "", imageUrl: "", demoUrl: "", featured: false, order: 1 };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch(`${PB_URL}/api/collections/projects/records?sort=order`);
    const d = await res.json();
    setProjects(d.items || []);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, technologies: typeof form.technologies === "string" ? form.technologies.split(",").map((t: string) => t.trim()).filter(Boolean) : form.technologies };
      const url = editing ? `${PB_URL}/api/collections/projects/records/${editing.id}` : `${PB_URL}/api/collections/projects/records`;
      const res = await fetch(url, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setStatus("success"); load(); setShowForm(false); setEditing(null); setForm(empty); setTimeout(() => setStatus("idle"), 3000); }
      else setStatus("error");
    } catch { setStatus("error"); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await fetch(`${PB_URL}/api/collections/projects/records/${id}`, { method: "DELETE" });
    load();
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({ ...p, technologies: p.technologies?.join(", ") || "" });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Portfolio</h2>
          <p className="text-foreground-muted mt-1">{projects.length} proyectos</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ ...empty, order: projects.length + 1 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-glow">
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      <StatusBanner status={status} onClear={() => setStatus("idle")} />

      {projects.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-white/10 text-foreground-muted">No hay proyectos. Creá el primero.</div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all">
              {p.imageUrl && (
                <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{p.name}</span>
                  {p.featured && <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-400">Destacado</span>}
                  <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-foreground-muted">{p.category}</span>
                </div>
                <p className="text-xs text-foreground-muted truncate mt-0.5">{p.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 text-foreground-muted hover:text-white transition-all"><ExternalLink className="w-4 h-4" /></a>}
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary-500/20 text-foreground-muted hover:text-primary-400 transition-all"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => del(p.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-foreground-muted hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditing(null); } }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">{editing ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-xs font-medium text-foreground-muted mb-1">Nombre *</label><input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Mi Proyecto" /></div>
                <div><label className="block text-xs font-medium text-foreground-muted mb-1">Descripción *</label><textarea className={`${inp} resize-none`} rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción del proyecto..." /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-foreground-muted mb-1">Categoría</label>
                    <select className={inp} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="landing">Landing Page</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="corporate">Corporativo</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-medium text-foreground-muted mb-1">Orden</label><input type="number" className={inp} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} min={1} /></div>
                </div>
                <div><label className="block text-xs font-medium text-foreground-muted mb-1">Tecnologías (separadas por coma)</label><input className={inp} value={form.technologies} onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))} placeholder="Next.js, TypeScript, Tailwind CSS" /></div>
                <div><label className="block text-xs font-medium text-foreground-muted mb-1">URL de imagen</label><input className={inp} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://... o /screenshots/imagen.png" /></div>
                <div><label className="block text-xs font-medium text-foreground-muted mb-1">URL Demo</label><input className={inp} value={form.demoUrl} onChange={e => setForm(f => ({ ...f, demoUrl: e.target.value }))} placeholder="https://mi-demo.pages.dev" /></div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm(f => ({ ...f, featured: !f.featured }))} className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${form.featured ? "bg-primary-600 border-primary-600" : "bg-white/5 border-white/20"}`}>
                    {form.featured && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm">Proyecto destacado</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all">Cancelar</button>
                  <button onClick={save} disabled={saving || !form.name} className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                    {saving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <><Save className="w-4 h-4" />{editing ? "Guardar" : "Crear"}</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
