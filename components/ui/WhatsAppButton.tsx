"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "5402920245637";
const WHATSAPP_MESSAGE = "Hola! Me interesa conocer más sobre sus servicios de desarrollo web.";

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-glass max-w-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-semibold">¿Necesitás ayuda?</p>
              <button onClick={() => setShowTooltip(false)} className="text-foreground-subtle hover:text-white transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-foreground-muted mb-3">
              Hablá con nosotros por WhatsApp. Te respondemos en minutos.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chatear ahora
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowTooltip(s => !s)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-colors"
        style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.4)" }}
        aria-label="WhatsApp"
      >
        <motion.div
          animate={showTooltip ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          {showTooltip ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
