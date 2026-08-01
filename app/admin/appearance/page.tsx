"use client";

import { useState } from "react";
import { Sun, Moon, Terminal, Sparkles } from "lucide-react";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeMode } from "@/types";

export default function AdminAppearancePage() {
  const { theme, setTheme } = useTheme();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const themes: { mode: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { mode: "dark", label: "Oscuro", icon: <Moon className="w-5 h-5" />, desc: "Fondo negro, acentos azules" },
    { mode: "light", label: "Claro", icon: <Sun className="w-5 h-5" />, desc: "Fondo blanco, acentos azules" },
    { mode: "matrix", label: "Matrix", icon: <Terminal className="w-5 h-5" />, desc: "Verde sobre negro" },
    { mode: "party", label: "Party", icon: <Sparkles className="w-5 h-5" />, desc: "Colores vibrantes" },
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
        <h3 className="text-sm font-semibold text-foreground-muted mb-3 uppercase tracking-wider">Tema del sitio</h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map(t => (
            <button
              key={t.mode}
              onClick={() => handleTheme(t.mode)}
              className={`p-4 rounded-xl border text-left transition-all ${theme === t.mode ? "border-primary-500 bg-primary-600/20" : "border-white/10 bg-white/5 hover:border-white/20"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${theme === t.mode ? "bg-primary-600/30 text-primary-400" : "bg-white/10 text-foreground-muted"}`}>
                  {t.icon}
                </div>
                <span className="font-semibold">{t.label}</span>
                {theme === t.mode && <span className="ml-auto text-xs text-primary-400">Activo</span>}
              </div>
              <p className="text-xs text-foreground-muted">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="text-sm font-semibold mb-4">Vista previa del tema</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Primario", color: "var(--color-primary, #3d52e6)" },
            { label: "Secundario", color: "var(--color-secondary, #6386fa)" },
            { label: "Acento", color: "var(--color-bg, #000000)" },
          ].map(c => (
            <div key={c.label} className="text-center">
              <div className="w-full h-10 rounded-lg mb-1 border border-white/10" style={{ backgroundColor: c.color }} />
              <span className="text-xs text-foreground-muted">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
        <p>💡 Los cambios de tema se aplican instantáneamente en el panel. Para afectar el sitio público, el tema se guarda en localStorage del visitante.</p>
      </div>
    </div>
  );
}
