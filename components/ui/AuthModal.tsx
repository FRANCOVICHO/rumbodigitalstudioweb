"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";

interface AuthModalProps {
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { login, register } = useUser();

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors placeholder-foreground-subtle";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) { setError("El nombre es requerido"); setLoading(false); return; }
        await register(email, password, name, phone);
      }
      setSuccess(true);
      setTimeout(() => onClose(), 1000);
    } catch (err: unknown) {
      const pbError = err as { response?: { message?: string } };
      setError(pbError?.response?.message || "Error al procesar. Verificá tus datos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-glass"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {success ? "¡Listo!" : mode === "login" ? "Iniciá sesión" : "Crear cuenta"}
            </h2>
            <p className="text-sm text-foreground-muted mt-0.5">
              {success ? "Entraste correctamente" : mode === "login" ? "Accedé a tu cuenta" : "Registrate gratis"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-foreground-muted hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
            <p className="text-foreground-muted">Cerrando...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                    <input className={`${inp} pl-10`} placeholder="Nombre completo *" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                    <input className={`${inp} pl-10`} type="tel" placeholder="Teléfono (opcional)" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                <input className={`${inp} pl-10`} type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                <input className={`${inp} pl-10 pr-10`} type={showPass ? "text" : "password"} placeholder="Contraseña *" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  mode === "login" ? "Iniciar sesión" : "Crear cuenta"
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-foreground-muted">
              {mode === "login" ? (
                <>¿No tenés cuenta?{" "}
                  <button onClick={() => { setMode("register"); setError(""); }} className="text-primary-400 hover:underline font-medium">
                    Registrate gratis
                  </button>
                </>
              ) : (
                <>¿Ya tenés cuenta?{" "}
                  <button onClick={() => { setMode("login"); setError(""); }} className="text-primary-400 hover:underline font-medium">
                    Iniciá sesión
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
