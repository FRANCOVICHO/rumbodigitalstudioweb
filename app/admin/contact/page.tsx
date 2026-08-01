"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBanner } from "@/components/admin/StatusBanner";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;
const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition-colors";

// We store contact info in a simple PocketBase collection called "site_config"
// Key-value pairs: key, value
const KEYS = ["email", "phone", "whatsapp_number", "instagram_url", "address"];

export default function AdminContactPage() {
  const [form, setForm] = useState({ email: "", phone: "", whatsapp_number: "", instagram_url: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Load from PocketBase site_config or use defaults
    fetch(`${PB_URL}/api/collections/site_config/records`)
      .then(r => r.json())
      .then(d => {
        const cfg: Record<string, string> = {};
        (d.items || []).forEach((item: { key: string; value: string }) => { cfg[item.key] = item.value; });
        setForm(f => ({ ...f, ...cfg }));
      })
      .catch(() => {}); // silently fail, use defaults
  }, []);

  async function save() {
    setSaving(true);
    setStatus("idle");
    try {
      // Upsert each key-value pair
      await Promise.all(
        Object.entries(form).map(async ([key, value]) => {
          // Check if exists
          const check = await fetch(`${PB_URL}/api/collections/site_config/records?filter=key="${key}"`);
          const existing = await check.json();
          const item = existing.items?.[0];
          if (item) {
            await fetch(`${PB_URL}/api/collections/site_config/records/${item.id}`, {
              method: "PATCH", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ value }),
            });
          } else {
            await fetch(`${PB_URL}/api/collections/site_config/records`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key, value }),
            });
          }
        })
      );
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold">Información de Contacto</h2>
        <p className="text-foreground-muted mt-1">Editá los datos de contacto que aparecen en el sitio</p>
      </div>

      <StatusBanner status={status} onClear={() => setStatus("idle")} />

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Email</label>
          <input className={inp} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="hola@rumbodigital.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Teléfono</label>
          <input className={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+54 02920 245637" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Número WhatsApp (solo números con código de país)</label>
          <input className={inp} value={form.whatsapp_number} onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} placeholder="5402920245637" />
          <p className="text-xs text-foreground-subtle mt-1">Sin el + ni espacios. Ej: 5491112345678</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Instagram URL</label>
          <input className={inp} value={form.instagram_url} onChange={e => setForm(f => ({ ...f, instagram_url: e.target.value }))} placeholder="https://instagram.com/_rumbodigitalstudio" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted mb-1">Dirección (opcional)</label>
          <input className={inp} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Buenos Aires, Argentina" />
        </div>
      </div>

      <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold transition-all shadow-glow">
        {saving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4" />}
        Guardar cambios
      </button>
    </div>
  );
}
