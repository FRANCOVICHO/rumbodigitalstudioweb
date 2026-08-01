"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle } from "lucide-react";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;

interface Message { id: string; name: string; email: string; phone?: string; service?: string; message: string; read: boolean; replied: boolean; created: string; }

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch(`${PB_URL}/api/collections/contact_messages/records?sort=-created`);
    const d = await res.json();
    setMessages(d.items || []);
    setLoading(false);
  }

  async function markRead(id: string) {
    await fetch(`${PB_URL}/api/collections/contact_messages/records/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    load();
  }

  async function del(id: string) {
    if (!confirm("¿Eliminar este mensaje?")) return;
    await fetch(`${PB_URL}/api/collections/contact_messages/records/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  }

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Mensajes</h2>
        <p className="text-foreground-muted mt-1">{messages.length} mensajes {unread > 0 && `· ${unread} sin leer`}</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-foreground-muted">Cargando...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-white/10">
          <Mail className="w-12 h-12 text-foreground-subtle mx-auto mb-3" />
          <p className="text-foreground-muted">No hay mensajes todavía</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id); }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selected?.id === msg.id ? "border-primary-500/50 bg-primary-600/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />}
                  </div>
                  <span className="text-xs text-foreground-subtle">{new Date(msg.created).toLocaleDateString("es-AR")}</span>
                </div>
                <p className="text-xs text-foreground-muted mt-1">{msg.email}</p>
                <p className="text-xs text-foreground-subtle mt-1 truncate">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 h-fit">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-sm text-primary-400 hover:underline">{selected.email}</a>
                </div>
                <button onClick={() => del(selected.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-foreground-muted hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
              {selected.phone && <div className="text-sm"><span className="text-foreground-muted">Teléfono: </span>{selected.phone}</div>}
              {selected.service && <div className="text-sm"><span className="text-foreground-muted">Servicio: </span>{selected.service}</div>}
              <div className="p-4 rounded-xl bg-black/30 text-sm text-foreground-muted leading-relaxed">{selected.message}</div>
              <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                <span>{new Date(selected.created).toLocaleString("es-AR")}</span>
                {selected.read && <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-3 h-3" /> Leído</span>}
              </div>
              <a href={`mailto:${selected.email}?subject=Re: Consulta desde Rumbo Digital Studio`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all">
                <Mail className="w-4 h-4" /> Responder por email
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 rounded-2xl border border-white/10 border-dashed text-foreground-subtle text-sm">
              Seleccioná un mensaje para verlo
            </div>
          )}
        </div>
      )}
    </div>
  );
}
