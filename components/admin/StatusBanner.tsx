"use client";
import { CheckCircle, AlertCircle, X } from "lucide-react";

type Status = "idle" | "success" | "error";

export function StatusBanner({ status, onClear }: { status: Status; onClear: () => void }) {
  if (status === "idle") return null;
  const isSuccess = status === "success";
  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm border ${isSuccess ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
      {isSuccess ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{isSuccess ? "Guardado exitosamente" : "Error al guardar. Intentá de nuevo."}</span>
      <button onClick={onClear} className="ml-auto"><X className="w-4 h-4" /></button>
    </div>
  );
}
