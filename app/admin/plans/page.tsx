"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Save, Check } from "lucide-react";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { formatPrice } from "@/lib/utils";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;
const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors";

interface Plan { id: string; name: string; price: number; currency: string; period: string; description: string; features: string[]; notIncluded: string[]; highlighted: boolean; badge: string; ctaLabel: string; ctaHref: string; order: number; }

const empty = { name: "", price: 0, currency: "ARS", period: "proyecto", description: "", features: "", notIncluded: "", highlighted: false, badge: "", ctaLabel: "Contactar", ctaHref: "#contacto", order: 1 };

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch(`${PB_URL}/api/collections/plans/records?sort=order`);
    const d = await res.json();
    setPlans(d.items || []);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, features: typeof form.features === "string" ? form.features.split("\n").map((s: string) => s.trim()).filter(Boolean) : form.features, notIncluded: typeof form.notIncluded === "string" ? form.notIncluded.split("\n").map((s: string) => s.trim()).filter(Boolean) : form.notIncluded };
      const url = editing ? `${PB_URL}/api/collections/plans/records/${editing.id}` : `${PB_URL}/api/collections/plans/records`;
      const res = await fetch(url, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setStatus("success"); load(); setShowForm(false); setEditing(null); setForm(empty); setTimeout(() => setStatus("idle"), 3000); }
      else setStatus("error");
    } catch { setStatus("error"); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm("¿Eliminar este plan?")) return;
    await fetch(`${PB_URL}/api/collections/plans/records/${id}`, { method: "DELETE" });
    load();
  }

  function openEdit(p: Plan) {
    setEditing(p);
    setForm({ ...p, features: Array.isArray(p.features) ? p.features.join("\n") : p.features || "", notIncluded: Array.isArray(p.notIncluded) ? p.notIncluded.join("\n") : p.notIncluded || "" } as typeof empty);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-bold">Planes</h2><p className="text-foreground-muted mt-1">{plans.length} planes</p></div>
        <button onClick={() => { setEditing(null); setForm({ ...empty, order: plans.length + 1 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-glow"><Plus className="w-4 h-4" /> Agregar</button>
      </div>
      <StatusBanner status={status} onClear={() => setStatus("idle")} />
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(p => (
          <div key={p.id} className={`p-5 rounded-2xl border space-y-3 ${p.highlighted ? "border-primary-500/50 bg-primary-600/10" : "border-white/10 bg-white/5"}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{p.name}</h3>
                {p.badge && <span className="text-xs text-primary-400">{p.badge}</span>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-foreground-muted hover:text-white transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => del(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-foreground-muted hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="text-2xl font-bold">{p.price === 0 ? "A consultar" : formatPrice(p.price, p.currency)}</div>
            <p className="text-xs text-foreground-muted">{p.description}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) { setShowForm(false); setEditing(null); } }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">{editing ? "Editar Plan" : "Nuevo Plan"}</h3>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-foreground-muted mb-1">Nombre *</label><input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Básico" /></div>
                  <div><label className="block text-xs text-foreground-muted mb-1">Precio (0 = consultar)</label><input type="number" className={inp} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-foreground-muted mb-1">Moneda</label>
                    <select className={inp} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                      <option value="ARS">ARS</option><option value="USD">USD</option>
                    </select>
                  </div>
                  <div><label className="block text-xs text-foreground-muted mb-1">Período</label><input className={inp} value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="proyecto / mes" /></div>
                </div>
                <div><label className="block text-xs text-foreground-muted mb-1">Descripción</label><input className={inp} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div><label className="block text-xs text-foreground-muted mb-1">Badge (ej: "Más elegido")</label><input className={inp} value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} /></div>
                <div><label className="block text-xs text-foreground-muted mb-1">Features incluidos (uno por línea)</label><textarea className={`${inp} resize-none`} rows={4} value={form.features as string} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder={"5 páginas\nDiseño responsive\nSEO básico"} /></div>
                <div><label className="block text-xs text-foreground-muted mb-1">No incluidos (uno por línea)</label><textarea className={`${inp} resize-none`} rows={3} value={form.notIncluded as string} onChange={e => setForm(f => ({ ...f, notIncluded: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-foreground-muted mb-1">Texto botón CTA</label><input className={inp} value={form.ctaLabel} onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))} /></div>
                  <div><label className="block text-xs text-foreground-muted mb-1">Link botón CTA</label><input className={inp} value={form.ctaHref} onChange={e => setForm(f => ({ ...f, ctaHref: e.target.value }))} /></div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm(f => ({ ...f, highlighted: !f.highlighted }))} className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${form.highlighted ? "bg-primary-600 border-primary-600" : "bg-white/5 border-white/20"}`}>
                    {form.highlighted && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm">Plan destacado</span>
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
