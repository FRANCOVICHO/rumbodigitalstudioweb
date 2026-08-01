"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, ChevronRight, RotateCcw, MessageCircle } from "lucide-react";

const PROJECT_TYPES = [
  { id: "landing", label: "Landing Page", base: 80000, icon: "🚀" },
  { id: "corporate", label: "Web Empresarial", base: 150000, icon: "🏢" },
  { id: "ecommerce", label: "Tienda Online", base: 250000, icon: "🛒" },
  { id: "custom", label: "Sistema a Medida", base: 400000, icon: "⚙️" },
];

const FEATURES = [
  { id: "admin", label: "Panel de Administración", price: 60000 },
  { id: "blog", label: "Blog integrado", price: 30000 },
  { id: "seo", label: "SEO avanzado", price: 25000 },
  { id: "analytics", label: "Analytics y métricas", price: 20000 },
  { id: "multilang", label: "Multi-idioma", price: 40000 },
  { id: "payments", label: "Sistema de pagos", price: 50000 },
  { id: "chat", label: "Chat en vivo", price: 35000 },
  { id: "pwa", label: "App móvil (PWA)", price: 45000 },
];

const PAGE_COUNTS = [
  { id: "1-3", label: "1-3 páginas", multiplier: 1 },
  { id: "4-8", label: "4-8 páginas", multiplier: 1.3 },
  { id: "9-15", label: "9-15 páginas", multiplier: 1.6 },
  { id: "15+", label: "15+ páginas", multiplier: 2 },
];

function formatARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export function BudgetCalculator() {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const selectedProject = PROJECT_TYPES.find(p => p.id === projectType);
  const selectedPages = PAGE_COUNTS.find(p => p.id === pageCount);
  const featuresTotal = FEATURES.filter(f => selectedFeatures.includes(f.id)).reduce((a, f) => a + f.price, 0);
  const basePrice = selectedProject ? selectedProject.base * (selectedPages?.multiplier || 1) + featuresTotal : 0;
  const minPrice = Math.round(basePrice * 0.9);
  const maxPrice = Math.round(basePrice * 1.2);

  function toggleFeature(id: string) {
    setSelectedFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  function reset() {
    setStep(0); setProjectType(null); setSelectedFeatures([]); setPageCount(null); setShowResult(false);
  }

  const WHATSAPP_MSG = `Hola! Usé la calculadora de presupuesto y me interesa un proyecto tipo "${selectedProject?.label}" con ${selectedPages?.label}. Presupuesto estimado: ${formatARS(minPrice)} - ${formatARS(maxPrice)}. ¿Podemos hablar?`;

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
              ¿Cuánto cuesta tu web?
            </span>
          </h2>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Obtené un estimado instantáneo y sin compromiso
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                  {["Tipo", "Funciones", "Tamaño"].map((label, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? "bg-green-500 text-white" : i === step ? "bg-primary-600 text-white" : "bg-white/10 text-foreground-subtle"}`}>
                        {i < step ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-sm flex-1 ${i === step ? "text-white font-medium" : "text-foreground-muted"}`}>{label}</span>
                      {i < 2 && <ChevronRight className="w-4 h-4 text-foreground-subtle shrink-0" />}
                    </div>
                  ))}
                </div>

                {/* Step 0: Project type */}
                {step === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">¿Qué tipo de proyecto necesitás?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {PROJECT_TYPES.map(pt => (
                        <button
                          key={pt.id}
                          onClick={() => { setProjectType(pt.id); setStep(1); }}
                          className="p-5 rounded-2xl border text-left transition-all hover:border-primary-500/50 hover:bg-primary-600/10 border-white/10 bg-white/5"
                        >
                          <span className="text-2xl mb-2 block">{pt.icon}</span>
                          <span className="font-semibold block">{pt.label}</span>
                          <span className="text-xs text-foreground-muted mt-1 block">desde {formatARS(pt.base)}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Features */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">¿Qué funciones necesitás?</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {FEATURES.map(f => {
                        const selected = selectedFeatures.includes(f.id);
                        return (
                          <button
                            key={f.id}
                            onClick={() => toggleFeature(f.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${selected ? "border-primary-500 bg-primary-600/20 text-white" : "border-white/10 bg-white/5 text-foreground-muted hover:border-white/20"}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{f.label}</span>
                              {selected && <Check className="w-4 h-4 text-primary-400 shrink-0" />}
                            </div>
                            <span className="text-xs text-foreground-subtle">+{formatARS(f.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => setStep(2)} className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all mt-4">
                      Continuar →
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Page count */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">¿Cuántas páginas necesitás?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {PAGE_COUNTS.map(pc => (
                        <button
                          key={pc.id}
                          onClick={() => { setPageCount(pc.id); setShowResult(true); }}
                          className="p-5 rounded-2xl border text-left transition-all hover:border-primary-500/50 hover:bg-primary-600/10 border-white/10 bg-white/5"
                        >
                          <span className="font-semibold block">{pc.label}</span>
                          <span className="text-xs text-foreground-muted mt-1 block">×{pc.multiplier} del precio base</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Result */
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-2xl bg-primary-600/10 border border-primary-500/30 text-center space-y-6">
                <div>
                  <p className="text-foreground-muted mb-2">Presupuesto estimado para tu proyecto</p>
                  <h3 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {formatARS(minPrice)} — {formatARS(maxPrice)}
                  </h3>
                  <p className="text-sm text-foreground-subtle mt-2">ARS · Precio final a convenir</p>
                </div>

                <div className="text-left space-y-2 p-4 rounded-xl bg-black/20">
                  <div className="flex justify-between text-sm"><span className="text-foreground-muted">Tipo:</span><span>{selectedProject?.label}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-foreground-muted">Tamaño:</span><span>{selectedPages?.label}</span></div>
                  {selectedFeatures.length > 0 && (
                    <div className="flex justify-between text-sm"><span className="text-foreground-muted">Funciones:</span><span>{selectedFeatures.length} adicionales</span></div>
                  )}
                </div>

                <p className="text-sm text-foreground-muted">
                  Este es un estimado orientativo. El precio final depende de los detalles específicos de tu proyecto.
                </p>

                <div className="flex gap-3">
                  <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all">
                    <RotateCcw className="w-4 h-4" /> Recalcular
                  </button>
                  <a
                    href={`https://wa.me/5402920245637?text=${encodeURIComponent(WHATSAPP_MSG)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Consultar ahora
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
