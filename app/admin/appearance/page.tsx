"use client";

import { useState } from "react";
import { Sun, Moon, Terminal, Sparkles, Check } from "lucide-react";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeMode } from "@/types";

export default function AdminAppearancePage() {
  const { theme, setTheme } = useTheme();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const themes: { mode: ThemeMode; label: string; icon: React.ReactNode; desc: string; preview: string }[] = [
    { mode: "dark", label: "Oscuro", icon: <Moon className="w-5 h-5" />, desc: "Fondo negro, acentos azules", preview: "bg-zinc-950 border-zinc-700" },
    { mode: "light", label: "Claro", icon: <Sun className="w-5 h-5" />, desc: "Fondo blanco, acentos azules", preview: "bg-white border-zinc-200" },
    { mode: "matrix", label: "Matrix", icon: <Terminal className="w-5 h-5" />, desc: "Verde sobre negro", preview: "bg-green-950 border-green-700" },
    { mode: "party", label: "Party", icon: <Sparkles className="w-5 h-5" />, desc: "Colores vibrantes y festivos", preview: "bg-purple-950 border-pink-500" },
  ];

  function handleTheme(mode: ThemeMode) {
    setTheme(mode);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold">Apariencia</h2>
        <p className="text-foreground-muted mt-1">Cambiá el tema visual del sitio</p>
      </div>

      <StatusBanner status={status} onClear={() => setStatus("idle")} />

      <div>
        <h3 className="text-sm font-semibold text-foreground-muted mb-4 uppercase tracking-wider">Tema del sitio</h3>
        <div className="grid grid-cols-2 gap-4">
          {themes.map(t => (
            <button
              key={t.mode}
              onClick={() => handleTheme(t.mode)}
              className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                theme === t.mode
                  ? "border-primary-500 bg-primary-600/20 shadow-glow"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              {/* Theme preview */}
              <div className={`w-full h-10 rounded-lg border mb-3 ${t.preview} flex items-center justify-center`}>
                <span className={`text-xs font-mono ${t.mode === "light" ? "text-zinc-800" : "text-white/70"}`}>
                  Aa
                </span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${theme === t.mode ? "bg-primary-600/40 text-primary-300" : "bg-white/10 text-foreground-muted"}`}>
                    {t.icon}
                  </div>
                  <span className="font-semibold text-sm">{t.label}</span>
                </div>
                {theme === t.mode && (
                  <span className="flex items-center gap-1 text-xs text-primary-400 font-medium">
                    <Check className="w-3 h-3" /> Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground-muted">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
        <p>💡 El tema se guarda en el navegador del visitante. Cada persona puede tener su propio tema. Para cambiar el tema por defecto del sitio, modificá la clase en <code className="bg-blue-900/50 px-1 rounded">app/layout.tsx</code>.</p>
      </div>
    </div>
  );
}
