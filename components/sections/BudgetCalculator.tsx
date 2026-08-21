tod"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, ChevronRight, RotateCcw, MessageCircle } from "lucide-react";

const PROJECT_TYPES = [
  {
    id: "landing",
    label: "Landing Page",
    icon: "🚀",
    desc: "Página web simple de una sola pantalla, ideal para presentar un negocio, producto o servicio y captar clientes.",
    complexity: 1,
  },
  {
    id: "corporate",
    label: "Web Empresarial",
    icon: "🏢",
    desc: "Sitio web completo con múltiples secciones, ideal para empresas que quieren mostrar su negocio profesionalmente.",
    complexity: 2,
  },
  {
    id: "ecommerce",
    label: "Tienda Online",
    icon: "🛒",
    desc: "Plataforma de ventas con catálogo de productos, carrito de compras, pagos online y gestión de pedidos.",
    complexity: 3,
  },
  {
    id: "custom",
    label: "Sistema a Medida",
    icon: "⚙️",
    desc: "Desarrollo personalizado para necesidades específicas: sistemas de gestión, apps web, automatizaciones o integraciones complejas.",
    complexity: 4,
  },
];

const FEATURES = [
  { id: "admin", label: "Panel de Administración", desc: "Editá el contenido de tu sitio sin tocar código", complexity: 1 },
  { id: "blog", label: "Blog o Noticias", desc: "Publicá artículos y novedades de tu negocio", complexity: 1 },
  { id: "seo", label: "SEO Avanzado", desc: "Optimización profunda para aparecer en Google", complexity: 1 },
  { id: "payments", label: "Sistema de Pagos", desc: "Integración con Mercado Pago u otras pasarelas", complexity: 2 },
  { id: "multilang", label: "Multi-idioma", desc: "El sitio en español, inglés u otros idiomas", complexity: 2 },
  { id: "analytics", label: "Analytics y Reportes", desc: "Dashboard con métricas de visitas y conversiones", complexity: 1 },
  { id: "chat", label: "Chat en Vivo", desc: "Chat para atender consultas en tiempo real", complexity: 1 },
  { id: "pwa", label: "App Móvil (PWA)", desc: "El sitio funciona como app instalable en el celular", complexity: 2 },
  { id: "automation", label: "Automatizaciones", desc: "Emails automáticos, notificaciones y flujos de trabajo", complexity: 2 },
  { id: "ia", label: "Integración con IA", desc: "Asistente virtual, recomendaciones o búsqueda inteligente", complexity: 3 },
];

const PAGE_COUNTS = [
  { id: "1-3", label: "1 a 3 páginas", desc: "Home, Servicios, Contacto", complexity: 1 },
  { id: "4-8", label: "4 a 8 páginas", desc: "Agregando About, Blog, Galería, etc.", complexity: 2 },
  { id: "9-15", label: "9 a 15 páginas", desc: "Sitio completo con múltiples secciones", complexity: 3 },
  { id: "15+", label: "Más de 15 páginas", desc: "Sitio grande o plataforma compleja", complexity: 4 },
];

const TIMELINES = [
  { id: "urgent", label: "Lo antes posible", desc: "Entrega prioritaria", multiplier: 1.3 },
  { id: "normal", label: "1 a 2 meses", desc: "Tiempo estándar sin apuros", multiplier: 1 },
  { id: "relaxed", label: "Más de 2 meses", desc: "Sin urgencia, trabajo planificado", multiplier: 0.9 },
];

const COMPLEXITY_LABEL = ["", "Básico", "Intermedio", "Avanzado", "Premium"];
const COMPLEXITY_DESC = [
  "",
  "Proyecto simple, rápido de desarrollar",
  "Proyecto de complejidad media",
  "Proyecto complejo con múltiples funciones",
  "Proyecto premium con alta complejidad",
];

export function BudgetCalculator() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiEstimate, setAiEstimate] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const selectedProject = PROJECT_TYPES.find(p => p.id === projectType);
  const selectedPages = PAGE_COUNTS.find(p => p.id === pageCount);
  const selectedTimeline = TIMELINES.find(t => t.id === timeline);
  const selectedFeatureObjs = FEATURES.filter(f => selectedFeatures.includes(f.id));

  // Calculate complexity score
  const baseComplexity = selectedProject?.complexity || 0;
  const pageComplexity = selectedPages?.complexity || 0;
  const featureComplexity = selectedFeatureObjs.reduce((a, f) => a + f.complexity, 0);
  const timeMultiplier = selectedTimeline?.multiplier || 1;
  const totalComplexity = Math.min(4, Math.round((baseComplexity + pageComplexity / 2 + featureComplexity / 3) * timeMultiplier / 1.5));

  function toggleFeature(id: string) {
    setSelectedFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  function reset() {
    setStep(0); setProjectType(null); setSelectedFeatures([]); setPageCount(null); setTimeline(null);
    setShowResult(false); setImageBase64(null); setImagePreview(null); setAiEstimate(null);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function getAiEstimate(tl: string) {
    setAiLoading(true);
    setAiEstimate(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: selectedProject?.label,
          features: selectedFeatureObjs.map(f => f.label),
          pageCount: selectedPages?.label,
          timeline: TIMELINES.find(t => t.id === tl)?.label,
          imageBase64: imageBase64 || null,
        }),
      });
      const data = await res.json();
      setAiEstimate(data.estimate || "No se pudo obtener el estimado.");
    } catch {
      setAiEstimate("Error al conectar con la IA. Contactanos directamente.");
    } finally {
      setAiLoading(false);
    }
  }

  const WHATSAPP_MSG = `Hola! Usé la calculadora de presupuesto en Rumbo Digital Studio. Necesito un "${selectedProject?.label}" con ${selectedPages?.label}${selectedFeatureObjs.length > 0 ? `, con funciones como: ${selectedFeatureObjs.map(f => f.label).join(", ")}` : ""}. Complejidad estimada: ${COMPLEXITY_LABEL[totalComplexity]}. ¿Me podés dar más información?`;

  return (
    <section id="calculadora" className="py-24 bg-background-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Calculadora de presupuesto
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              ¿Qué proyecto necesitás?
            </span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Respondé algunas preguntas y te damos un estimado de complejidad. Luego hablamos del precio real.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-8">
                  {["Tipo", "Funciones", "Tamaño", "Plazo"].map((label, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${i < step ? "bg-green-500 text-white" : i === step ? "bg-primary-600 text-white" : "bg-white/10 text-foreground-subtle"}`}>
                        {i < step ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-sm truncate ${i === step ? "text-white font-medium" : "text-foreground-muted"}`}>{label}</span>
                      {i < 3 && <ChevronRight className="w-4 h-4 text-foreground-subtle shrink-0" />}
                    </div>
                  ))}
                </div>

                {/* Step 0: Project type */}
                {step === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-xl font-bold mb-6">¿Qué tipo de proyecto necesitás?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {PROJECT_TYPES.map(pt => (
                        <button
                          key={pt.id}
                          onClick={() => { setProjectType(pt.id); setStep(1); }}
                          className="p-5 rounded-2xl border text-left transition-all hover:border-primary-500/70 hover:bg-primary-600/10 border-white/10 bg-white/5 group"
                        >
                          <span className="text-3xl mb-3 block">{pt.icon}</span>
                          <span className="font-bold text-base block mb-2 group-hover:text-primary-400 transition-colors">{pt.label}</span>
                          <span className="text-xs text-foreground-muted leading-relaxed">{pt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Features */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-xl font-bold mb-2">¿Qué funciones necesitás?</h3>
                    <p className="text-foreground-muted text-sm mb-6">Seleccioná todo lo que quieras incluir (podés elegir varias)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {FEATURES.map(f => {
                        const selected = selectedFeatures.includes(f.id);
                        return (
                          <button
                            key={f.id}
                            onClick={() => toggleFeature(f.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${selected ? "border-primary-500 bg-primary-600/20" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className={`text-sm font-semibold block ${selected ? "text-white" : "text-foreground-muted"}`}>{f.label}</span>
                                <span className="text-xs text-foreground-subtle mt-0.5 block">{f.desc}</span>
                              </div>
                              {selected && <Check className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => setStep(2)} className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">
                      Continuar →
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Page count */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-xl font-bold mb-6">¿Cuántas páginas o secciones necesitás?</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {PAGE_COUNTS.map(pc => (
                        <button
                          key={pc.id}
                          onClick={() => { setPageCount(pc.id); setStep(3); }}
                          className="p-5 rounded-2xl border text-left transition-all hover:border-primary-500/70 hover:bg-primary-600/10 border-white/10 bg-white/5 group"
                        >
                          <span className="font-bold block mb-1 group-hover:text-primary-400 transition-colors">{pc.label}</span>
                          <span className="text-xs text-foreground-muted">{pc.desc}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Timeline */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-xl font-bold mb-2">¿En cuánto tiempo lo necesitás?</h3>
                    <p className="text-foreground-muted text-sm mb-6">Esto afecta el costo y la planificación del proyecto</p>

                    {/* Optional image upload */}
                    <div className="mb-6 p-4 rounded-xl border border-dashed border-white/20 bg-white/3">
                      <p className="text-sm font-medium mb-2">📸 ¿Tenés una imagen de referencia? <span className="text-foreground-subtle">(opcional)</span></p>
                      <p className="text-xs text-foreground-muted mb-3">Subí una foto de tu negocio, un diseño que te gustó o cualquier referencia visual para que la IA sea más precisa</p>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition-all">
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          {imagePreview ? "Cambiar imagen" : "Subir imagen"}
                        </label>
                        {imagePreview && (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {TIMELINES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setTimeline(t.id); setShowResult(true); getAiEstimate(t.id); }}
                          className="w-full p-5 rounded-2xl border text-left transition-all hover:border-primary-500/70 hover:bg-primary-600/10 border-white/10 bg-white/5 group flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold block group-hover:text-primary-400 transition-colors">{t.label}</span>
                            <span className="text-xs text-foreground-muted">{t.desc}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-foreground-subtle group-hover:text-primary-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Result */
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-8 rounded-2xl bg-primary-600/10 border border-primary-500/30 text-center">
                  <p className="text-foreground-muted mb-2">Tu proyecto es de complejidad</p>
                  <h3 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {COMPLEXITY_LABEL[Math.max(1, totalComplexity)] || "Avanzado"}
                  </h3>
                  <p className="text-foreground-muted">{COMPLEXITY_DESC[Math.max(1, totalComplexity)]}</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="font-semibold text-sm text-foreground-muted uppercase tracking-wider">Resumen</h4>
                  <div className="flex justify-between text-sm"><span className="text-foreground-muted">Tipo:</span><span className="font-medium">{selectedProject?.label}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-foreground-muted">Tamaño:</span><span className="font-medium">{selectedPages?.label}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-foreground-muted">Plazo:</span><span className="font-medium">{selectedTimeline?.label}</span></div>
                  {selectedFeatureObjs.length > 0 && (
                    <div className="flex justify-between text-sm"><span className="text-foreground-muted">Funciones extra:</span><span className="font-medium">{selectedFeatureObjs.length} seleccionadas</span></div>
                  )}
                </div>

                {/* AI Estimate */}
                <div className="p-6 rounded-2xl border border-primary-500/30 bg-primary-600/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🤖</span>
                    <h4 className="font-semibold">Estimado con IA</h4>
                  </div>
                  {aiLoading ? (
                    <div className="flex items-center gap-3 text-foreground-muted text-sm">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full shrink-0"
                      />
                      Analizando tu proyecto con IA...
                    </div>
                  ) : aiEstimate ? (
                    <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-wrap">{aiEstimate}</p>
                  ) : (
                    <p className="text-sm text-foreground-subtle italic">Calculando estimado...</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
                  <p>💬 Este es un estimado orientativo. El precio final lo acordamos según los detalles de tu proyecto.</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-all text-sm">
                    <RotateCcw className="w-4 h-4" /> Recalcular
                  </button>
                  <a
                    href={`https://wa.me/5402920245637?text=${encodeURIComponent(WHATSAPP_MSG)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> Consultar precio real
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
