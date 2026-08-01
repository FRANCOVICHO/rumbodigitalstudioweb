"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, AlertCircle, CheckCircle } from "lucide-react";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;
const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors";

export default function AdminHeroPage() {
  const [form, setForm] = useState({ title: "", subtitle: "", ctaPrimaryLabel: "", ctaPrimaryHref: "", ctaSecondaryLabel: "", ctaSecondaryHref: "", badgeText: "" });
  const [id, setId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    fetch(`${PB_URL}/api/collections/hero_config/records?filter=active=true`)
      .then(r => r.json())
      .then(d => {
        const item = d.items?.[0];
        if (item) {
          setId(item.id);
          setForm({ title: item.title || "", subtitle: item.subtitle || "", ctaPrimaryLabel: item.ctaPrimaryLabel || "", ctaPrimaryHref: item.ctaPrimaryHref || "", ctaSecondaryLabel: item.ctaSecondaryLabel || "", ctaSecondaryHref: item.ctaSecondaryHref || "", badgeText: item.badgeText || "" });
        }
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const url = id
        ? `${PB_URL}/api/collections/hero_config/records/${id}`
        : `${PB_URL}/api/collections/hero_config/records`;
      const res = await fetch(url, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, active: true }),
      });
      if (res.ok) { setStatus("success"); setTimeout(() => setStatus("idle"), 3000); }
      else setStatus("error");
    } catch { setStatus("error"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold">Sección Hero</h2>
        <p className="text-foreground-muted mt-1">Editá el contenido principal de la página</p>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" /> Guardado exitosamente
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" /> Error al guardar
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Badge (texto pequeño arriba del título)</label>
          <input className={inputClass} value={form.badgeText} onChange={e => setForm(f => ({ ...f, badgeText: e.target.value }))} placeholder="🚀 Diseño + Desarrollo" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Título principal *</label>
          <textarea className={`${inputClass} resize-none`} rows={2} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Transformamos Ideas en Experiencias Digitales" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Subtítulo *</label>
          <textarea className={`${inputClass} resize-none`} rows={3} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Agencia de desarrollo web..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Botón 1 — Texto</label>
            <input className={inputClass} value={form.ctaPrimaryLabel} onChange={e => setForm(f => ({ ...f, ctaPrimaryLabel: e.target.value }))} placeholder="Ver Proyectos" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Botón 1 — Link</label>
            <input className={inputClass} value={form.ctaPrimaryHref} onChange={e => setForm(f => ({ ...f, ctaPrimaryHref: e.target.value }))} placeholder="#proyectos" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Botón 2 — Texto</label>
            <input className={inputClass} value={form.ctaSecondaryLabel} onChange={e => setForm(f => ({ ...f, ctaSecondaryLabel: e.target.value }))} placeholder="Solicitar presupuesto" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1">Botón 2 — Link</label>
            <input className={inputClass} value={form.ctaSecondaryHref} onChange={e => setForm(f => ({ ...f, ctaSecondaryHref: e.target.value }))} placeholder="#contacto" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold transition-all shadow-glow">
        {saving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4" />}
        Guardar cambios
      </button>
    </div>
  );
}
