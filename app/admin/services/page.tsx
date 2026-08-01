"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { StatusBanner } from "@/components/admin/StatusBanner";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;
const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors";

interface Service { id: string; name: string; description: string; icon: string; color: string; features: string[]; order: number; active: boolean; }
const empty = { name: "", description: "", icon: "Code", color: "#4A90E2", features: "", order: 1, active: true };

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch(`${PB_URL}/api/collections/services/records?sort=order`);
    const d = await res.json();
    setItems(d.items || []);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, features: typeof form.features === "string" ? form.features.split("\n").map((s: string) => s.trim()).filter(Boolean) : form.features };
      const url = editing ? `${PB_URL}/api/collections/services/records/${editing.id}` : `${PB_URL}/api/collections/services/records`;
      const res = await fetch(url, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setStatus("success"); load(); setShowForm(false); setEditing(null); setForm(empty); setTimeout(() => setStatus("idle"), 3000); }
      else setStatus("error");
    } catch { setStatus("error"); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    await fetch(`${PB_URL}/api/collections/services/records/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-bold">Servicios</h2><p className="text-foreground-muted mt-1">{items.length} servicios</p></div>
        <button onClick={() => { setEditing(null); setForm({ ...empty, order: items.length + 1 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-glow"><Plus className="w-4 h-4" /> Agregar</button>
      </div>
      <StatusBanner status={status} onClear={() => setStatus("idle")} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(item => (
          <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${item.color}20`, color: item.color }}>{item.icon?.slice(0,2)}</div>
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(item); setForm({ ...item, features: Array.isArray(item.features) ? item.features.join("\n") : item.features || "" } as typeof empty); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-primary-500/20 text-foreground-muted hover:text-primary-400 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-foreground-muted hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-xs text-foreground-muted">{item.description}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditing(null); } }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">{editing ? "Editar Servicio" : "Nuevo Servicio"}</h3>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-xs text-foreground-muted mb-1">Nombre *</label><input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Desarrollo Web" /></div>
                <div><label className="block text-xs text-foreground-muted mb-1">Descripción *</label><textarea className={`${inp} resize-none`} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-foreground-muted mb-1">Icono (nombre Lucide)</label><input className={inp} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Code" /></div>
                  <div><label className="block text-xs text-foreground-muted mb-1">Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                      <input className={inp} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#4A90E2" />
                    </div>
                  </div>
                </div>
                <div><label className="block text-xs text-foreground-muted mb-1">Features (uno por línea)</label><textarea className={`${inp} resize-none`} rows={3} value={form.features as string} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder={"Next.js 14\nReact 18\nTypeScript"} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-foreground-muted mb-1">Orden</label><input type="number" className={inp} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} /></div>
                </div>
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
