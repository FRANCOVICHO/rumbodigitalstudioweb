"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, X, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "5402920245637";
const WHATSAPP_MESSAGE = "Hola! Me interesa conocer más sobre sus servicios de desarrollo web.";

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-zinc-950 border border-white/[0.1] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-[220px]"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-bold text-white">Estamos en línea</p>
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-white/30 hover:text-white/70 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-white/40 mb-3 leading-relaxed">
              Respondemos en minutos por WhatsApp.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-green-500 hover:bg-green-400 text-white text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chatear ahora
              <ArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowTooltip(s => !s)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-green-500 hover:bg-green-400 text-white flex items-center justify-center shadow-[0_4px_24px_rgba(34,197,94,0.45)] transition-colors"
        aria-label="WhatsApp"
      >
        <AnimatePresence mode="wait">
          {showTooltip ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
