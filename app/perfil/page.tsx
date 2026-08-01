"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors";

export default function PerfilPage() {
  const { user, loading, updateProfile } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user, loading, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    try {
      await updateProfile(form);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-foreground-muted hover:text-white transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-2xl font-bold text-white">
                {user.name?.slice(0, 2).toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name || "Mi Perfil"}</h1>
                <p className="text-foreground-muted text-sm">{user.email}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
              <h2 className="font-semibold">Información personal</h2>

              {status === "success" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" /> Perfil actualizado
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" /> Error al guardar
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground-muted mb-1">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                    <input className={`${inp} pl-10`} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground-muted mb-1">Email (no editable)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                    <input className={`${inp} pl-10 opacity-50 cursor-not-allowed`} value={user.email} disabled />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground-muted mb-1">Teléfono de contacto</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                    <input className={`${inp} pl-10`} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+54 11 1234-5678" />
                  </div>
                </div>

                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold transition-all">
                  {saving ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : <Save className="w-4 h-4" />}
                  Guardar cambios
                </button>
              </form>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-primary-600/10 border border-primary-500/20 text-sm text-foreground-muted">
              <p>👋 Al registrarte, podemos guardarte el historial de consultas y contactarte más rápido cuando avancemos con tu proyecto.</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
