"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, CheckCircle } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

const DEFAULTS = {
  email: "rumboweb31@gmail.com",
  phone: "+54 02920 245637",
  whatsapp_number: "5402920245637",
  instagram_url: "https://instagram.com/_rumbodigitalstudio",
};

function buildWhatsAppUrl(waNumber: string, name: string, email: string, service: string, message: string) {
  const text = `Hola! Soy ${name} (${email}).${service ? ` Me interesa: ${service}.` : ""} ${message}`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState(DEFAULTS);

  // Load contact info from PocketBase site_config
  useEffect(() => {
    if (!PB_URL) return;
    fetch(`${PB_URL}/api/collections/site_config/records`)
      .then(r => r.json())
      .then(d => {
        const cfg: Record<string, string> = {};
        (d.items || []).forEach((item: { key: string; value: string }) => { cfg[item.key] = item.value; });
        setContactInfo(prev => ({ ...prev, ...cfg }));
      })
      .catch(() => {});
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.length < 2 || form.name.length > 100) e.name = "El nombre debe tener entre 2 y 100 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresá un email válido";
    if (form.message.length < 10 || form.message.length > 1000) e.message = "El mensaje debe tener entre 10 y 1000 caracteres";
    if (form.phone && !/^\+?[\d\s\-()]{7,20}$/.test(form.phone)) e.phone = "Formato de teléfono inválido";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    // Open WhatsApp with pre-filled message
    const url = buildWhatsAppUrl(contactInfo.whatsapp_number, form.name, form.email, form.service, form.message);
    window.open(url, "_blank");
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
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
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-primary-500/50 transition-all group">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="group-hover:text-primary-400 transition-colors">{contactInfo.email}</span>
              </a>
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-primary-500/50 transition-all group">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="group-hover:text-primary-400 transition-colors">{contactInfo.phone}</span>
              </a>
              <a href={`https://wa.me/${contactInfo.whatsapp_number}?text=Hola%2C%20me%20interesa%20un%20presupuesto`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-green-500/50 transition-all group">
                <MessageCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="group-hover:text-green-400 transition-colors">WhatsApp</span>
              </a>
              <a href={contactInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-background-card border border-border hover:border-pink-500/50 transition-all group">
                <InstagramIcon className="w-5 h-5 text-pink-400 shrink-0" />
                <span className="group-hover:text-pink-400 transition-colors">@_rumbodigitalstudio</span>
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 rounded-2xl bg-green-500/10 border border-green-500/30">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Se abrió WhatsApp!</h3>
                <p className="text-foreground-muted mb-6">Tu mensaje fue enviado a nuestro WhatsApp. Te respondemos pronto.</p>
                <button onClick={() => setSubmitted(false)} className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                    <option value="Landing Page">Landing Page</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Desarrollo Web">Desarrollo Web</option>
                    <option value="Diseño UI/UX">Diseño UI/UX</option>
                    <option value="Otro">Otro</option>
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
                  className="w-full py-4 px-8 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  Enviar por WhatsApp
                </button>
                <p className="text-xs text-foreground-subtle text-center">
                  Al hacer clic se abrirá WhatsApp con tu mensaje prellenado
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
