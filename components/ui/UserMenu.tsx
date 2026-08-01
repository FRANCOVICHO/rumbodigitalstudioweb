"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { AuthModal } from "./AuthModal";

export function UserMenu() {
  const { user, loading, logout } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;

  if (!user) {
    return (
      <>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => { setModalMode("login"); setShowModal(true); }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-foreground-muted hover:text-white hover:bg-glass border border-border hover:border-primary-500/50 transition-all"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setModalMode("register"); setShowModal(true); }}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 border border-primary-500/30 transition-all"
          >
            Registrarse
          </button>
        </div>

        <AnimatePresence>
          {showModal && <AuthModal onClose={() => setShowModal(false)} initialMode={modalMode} />}
        </AnimatePresence>
      </>
    );
  }

  const initials = user.name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(s => !s)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white">
          {initials}
        </div>
        <span className="hidden md:block text-sm font-medium truncate max-w-24">{user.name || user.email}</span>
        <ChevronDown className={`w-4 h-4 text-foreground-muted transition-transform hidden md:block ${showDropdown ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-52 bg-zinc-950 border border-white/10 rounded-2xl shadow-glass z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-white/10">
                <p className="font-medium text-sm truncate">{user.name || "Usuario"}</p>
                <p className="text-xs text-foreground-muted truncate">{user.email}</p>
              </div>
              <div className="p-2">
                <a href="/perfil" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground-muted hover:text-white hover:bg-white/10 transition-all">
                  <User className="w-4 h-4" /> Mi perfil
                </a>
                <a href="/mis-proyectos" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground-muted hover:text-white hover:bg-white/10 transition-all">
                  <Settings className="w-4 h-4" /> Mis proyectos
                </a>
                <button
                  onClick={() => { logout(); setShowDropdown(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
