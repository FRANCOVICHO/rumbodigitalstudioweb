"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Save, Star } from "lucide-react";
import { StatusBanner } from "@/components/admin/StatusBanner";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;
const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors";

interface Testimonial { id: string; name: string; role: string; company: string; content: string; rating: number; active: boolean; order: number; }
const empty = { name: "", role: "", company: "", content: "", rating: 5, active: true, order: 1 };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch(`${PB_URL}/api/collections/testimonials/records?sort=order`);
    const d = await res.json();
    setItems(d.items || []);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editing ? `${PB_URL}/api/collections/testimonials/records/${editing.id}` : `${PB_URL}/api/collections/testimonials/records`;
      const res = await fetch(url, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setStatus("success"); load(); setShowForm(false); setEditing(null); setForm(empty); setTimeout(() => setStatus("idle"), 3000); }
      else setStatus("error");
    } catch { setStatus("error"); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await fetch(`${PB_URL}/api/collections/testimonials/records/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-bold">Testimonios</h2><p className="text-foreground-muted mt-1">{items.length} testimonios</p></div>
        <button onClick={() => { setEditing(null); setForm({ ...empty, order: items.length + 1 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-glow"><Plus className="w-4 h-4" /> Agregar</button>
      </div>
      <StatusBanner status={status} onClear={() => setStatus("idle")} />
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{item.name}</span>
                  {!item.active && <span className="text-xs text-foreground-subtle bg-white/10 px-2 py-0.5 rounded-full">Inactivo</span>}
                </div>
                <span className="text-xs text-foreground-muted">{item.role} — {item.company}</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: item.rating || 0 }).map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                <button onClick={() => { setEditing(item); setForm({ name: item.name, role: item.role, company: item.company, content: item.content, rating: item.rating, active: item.active, order: item.order }); setShowForm(true); }} className="ml-2 p-1.5 rounded-lg hover:bg-primary-500/20 text-foreground-muted hover:text-primary-400 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-foreground-muted hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-sm text-foreground-muted italic">&ldquo;{item.content}&rdquo;</p>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-12 text-foreground-muted rounded-2xl border border-white/10">No hay testimonios todavía.</div>}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditing(null); } }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">{editing ? "Editar Testimonio" : "Nuevo Testimonio"}</h3>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-foreground-muted mb-1">Nombre *</label><input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                  <div><label className="block text-xs text-foreground-muted mb-1">Cargo</label><input className={inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Dueño" /></div>
                </div>
                <div><label className="block text-xs text-foreground-muted mb-1">Empresa</label><input className={inp} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
                <div><label className="block text-xs text-foreground-muted mb-1">Comentario *</label><textarea className={`${inp} resize-none`} rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
                <div>
                  <label className="block text-xs text-foreground-muted mb-2">Calificación</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))} className="p-1">
                        <Star className={`w-6 h-6 transition-colors ${n <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-foreground-subtle"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all">Cancelar</button>
                  <button onClick={save} disabled={saving || !form.name || !form.content} className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
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
