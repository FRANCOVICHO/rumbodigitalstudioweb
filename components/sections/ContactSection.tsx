"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Instagram, Send, CheckCircle, AlertCircle } from "lucide-react";

const CONTACT_INFO = {
  email: "hola@rumbodigital.com",
  phone: "+54 11 1234-5678",
  whatsappUrl: "https://wa.me/5491112345678?text=Hola%2C%20me%20interesa%20un%20presupuesto",
  instagramUrl: "https://instagram.com/rumbodigital",
};

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.length < 2 || form.name.length > 100) e.name = "El nombre debe tener entre 2 y 100 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresá un email válido";
    if (form.message.length < 10 || form.message.length > 1000) e.message = "El mensaje debe tener entre 10 y 1000 caracteres";
    if (form.phone && !/^\+?[\d\s\-()]{7,20}$/.test(form.phone)) e.phone = "Formato de teléfono inválido";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: "" }),
      });
      if (res.status === 201 || res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", service: "", message: "" });
      } else if (res.status === 429) {
        setStatus("error");
        setErrors({ general: "Demasiados mensajes enviados. Intenta en unos minutos." });
      } else {
        setStatus("error");
        setErrors({ general: "Ocurrió un error. Por favor intentá de nuevo." });
      }
    } catch {
      setStatus("error");
      setErrors({ general: "Error de conexión. Por favor intentá de nuevo." });
    }
  }

  const inputClass = "w-full bg-background-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors placeholder-foreground-subtle";

  return (
    <section id="contacto" className="py-24 bg-background-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Hablemos
            </span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Contanos tu idea y te damos un presupuesto sin compromiso
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">Contacto Directo</h3>
              <p className="text-foreground-muted">
                Respondemos todos los mensajes en menos de 24 horas hábiles.
              </p>
            </div>

            <div className="space-y-4">
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-primary-500/50 transition-all group">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="group-hover:text-primary-400 transition-colors">{CONTACT_INFO.email}</span>
              </a>
              <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-primary-500/50 transition-all group">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="group-hover:text-primary-400 transition-colors">{CONTACT_INFO.phone}</span>
              </a>
              <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-green-500/50 transition-all group">
                <MessageCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="group-hover:text-green-400 transition-colors">WhatsApp</span>
              </a>
              <a href={CONTACT_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-pink-500/50 transition-all group">
                <Instagram className="w-5 h-5 text-pink-400 shrink-0" />
                <span className="group-hover:text-pink-400 transition-colors">@rumbodigital</span>
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 rounded-2xl bg-green-500/10 border border-green-500/30">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Mensaje enviado!</h3>
                <p className="text-foreground-muted mb-6">Nos ponemos en contacto en menos de 24 horas.</p>
                <button onClick={() => setStatus("idle")} className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Honeypot */}
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                {errors.general && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errors.general}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input className={inputClass} placeholder="Nombre *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input className={inputClass} type="email" placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input className={inputClass} type="tel" placeholder="Teléfono (opcional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <select className={inputClass} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                    <option value="">Servicio de interés</option>
                    <option value="landing">Landing Page</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="web">Desarrollo Web</option>
                    <option value="diseño">Diseño UI/UX</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={5}
                    placeholder="Contanos tu proyecto... *"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 px-8 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg"
                >
                  {status === "loading" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
