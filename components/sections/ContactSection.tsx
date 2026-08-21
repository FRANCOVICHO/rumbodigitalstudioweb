"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, CheckCircle, ArrowRight } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;

const DEFAULTS = {
  email: "digitalstudiorumbo@gmail.com",
  phone: "+54 02920 245637",
  whatsapp_number: "5402920245637",
  instagram_url: "https://instagram.com/_rumbodigitalstudio",
};

function buildWhatsAppUrl(waNumber: string, name: string, email: string, service: string, message: string) {
  const text = `Hola! Soy ${name} (${email}).${service ? ` Me interesa: ${service}.` : ""} ${message}`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}

const contactLinks = [
  {
    icon: Mail,
    key: "email",
    hrefPrefix: "mailto:",
    colorClass: "text-primary-400",
    hoverBorderClass: "hover:border-primary-500/40",
  },
  {
    icon: Phone,
    key: "phone",
    hrefPrefix: "tel:",
    colorClass: "text-primary-400",
    hoverBorderClass: "hover:border-primary-500/40",
  },
];

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState(DEFAULTS);

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
    if (form.name.length < 2 || form.name.length > 100) e.name = "Mínimo 2 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (form.message.length < 10 || form.message.length > 1000) e.message = "Mínimo 10 caracteres";
    if (form.phone && !/^\+?[\d\s\-()]{7,20}$/.test(form.phone)) e.phone = "Formato inválido";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    const url = buildWhatsAppUrl(contactInfo.whatsapp_number, form.name, form.email, form.service, form.message);
    window.open(url, "_blank");
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  }

  const inputBase = "w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-500/60 focus:bg-white/[0.06] transition-all duration-200";

  return (
    <section id="contacto" className="py-20 md:py-32 bg-[#040408]">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-3">Contacto</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Contanos tu proyecto.<br className="hidden sm:block" /> Empecemos hoy.
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto">
            Respondemos en menos de 24 horas. Sin compromiso.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-5xl mx-auto">

          {/* LEFT — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Contacto directo</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Elegí el canal que prefieras. Estamos en todos.
              </p>
            </div>

            {/* Email */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-primary-500/30 hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-600/15 border border-primary-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Email</div>
                <div className="text-sm text-white/70 group-hover:text-white transition-colors truncate">{contactInfo.email}</div>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-primary-500/30 hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-600/15 border border-primary-500/20 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Teléfono</div>
                <div className="text-sm text-white/70 group-hover:text-white transition-colors">{contactInfo.phone}</div>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${contactInfo.whatsapp_number}?text=Hola%2C%20me%20interesa%20un%20presupuesto`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-green-500/30 hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">WhatsApp</div>
                <div className="text-sm text-white/70 group-hover:text-green-400 transition-colors">Chatear ahora</div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={contactInfo.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-pink-500/30 hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                <InstagramIcon className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Instagram</div>
                <div className="text-sm text-white/70 group-hover:text-pink-400 transition-colors">@_rumbodigitalstudio</div>
              </div>
            </a>
          </motion.div>

          {/* RIGHT — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center p-10 rounded-2xl bg-green-500/[0.06] border border-green-500/20 space-y-4"
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">¡Se abrió WhatsApp!</h3>
                  <p className="text-white/40 text-sm">Te respondemos pronto.</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-sm font-medium transition-all"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      className={inputBase}
                      placeholder="Nombre *"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 pl-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      className={inputBase}
                      type="email"
                      placeholder="Email *"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 pl-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      className={inputBase}
                      type="tel"
                      placeholder="Teléfono (opcional)"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1 pl-1">{errors.phone}</p>}
                  </div>
                  <select
                    className={`${inputBase} cursor-pointer`}
                    value={form.service}
                    onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                  >
                    <option value="" className="bg-zinc-900">Servicio de interés</option>
                    <option value="Landing Page" className="bg-zinc-900">Landing Page</option>
                    <option value="E-commerce" className="bg-zinc-900">E-commerce</option>
                    <option value="Desarrollo Web" className="bg-zinc-900">Desarrollo Web</option>
                    <option value="Diseño UI/UX" className="bg-zinc-900">Diseño UI/UX</option>
                    <option value="Mantenimiento" className="bg-zinc-900">Mantenimiento</option>
                    <option value="Otro" className="bg-zinc-900">Otro</option>
                  </select>
                </div>

                <div>
                  <textarea
                    className={`${inputBase} resize-none`}
                    rows={5}
                    placeholder="Contanos tu proyecto... *"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1 pl-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(61,82,230,0.4)] hover:shadow-[0_0_36px_rgba(61,82,230,0.6)]"
                >
                  <Send className="w-4 h-4" />
                  Enviar por WhatsApp
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-[11px] text-white/25 text-center pt-1">
                  Al hacer clic se abrirá WhatsApp con tu mensaje prellenado.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
