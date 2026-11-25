"use client";

import { useEffect, useState, useTransition } from "react";
import { listContactMessages } from "@/app/actions/admin-read";
import { updateMessageStatus } from "@/app/actions/admin-requests";
import {
  messageKindLabels,
  requestStatusLabels,
  type ContactMessage,
  requestStatuses,
  type RequestStatus,
} from "@/types";

async function fetchMessages(): Promise<ContactMessage[]> {
  return listContactMessages();
}

const statusColor: Record<RequestStatus, string> = {
  nouvelle: "bg-corail/20 text-corail",
  en_cours: "bg-moutarde/20 text-moutarde",
  traitee: "bg-vert-sauge/20 text-vert-sauge",
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function reload() {
    fetchMessages().then((m) => { setMessages(m); setLoading(false); });
  }
  useEffect(() => { reload(); }, []);

  function handleStatus(id: string, status: string) {
    startTransition(async () => { await updateMessageStatus(id, status); reload(); });
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold uppercase">Messages reçus</h1>

      {loading ? (
        <div className="py-12 text-center text-brun/40">Chargement…</div>
      ) : messages.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-brun/30 py-16 text-center text-brun/50">
          <p>Aucun message pour l&apos;instant.</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-card border-2 border-brun bg-blanc shadow-dure overflow-hidden">
              {/* Header */}
              <button
                type="button"
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-creme/30 transition-colors"
                onClick={() => setExpanded((v) => v === m.id ? null : m.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[m.status]}`}>
                      {requestStatusLabels[m.status]}
                    </span>
                    <span className="rounded-full bg-pervenche/15 px-2 py-0.5 text-xs font-medium text-pervenche">
                      {messageKindLabels[m.kind]}
                    </span>
                    <span className="text-xs text-brun/50">
                      {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-brun/60 line-clamp-1">{m.message}</p>
                </div>
                <span className="text-brun/40 mt-1">{expanded === m.id ? "▲" : "▼"}</span>
              </button>

              {/* Expanded detail */}
              {expanded === m.id && (
                <div className="border-t-2 border-brun/10 p-5 grid gap-4">
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div><dt className="font-semibold text-brun/50 uppercase text-xs">E-mail</dt><dd><a href={`mailto:${m.email}`} className="text-pervenche underline">{m.email}</a></dd></div>
                    {m.phone && <div><dt className="font-semibold text-brun/50 uppercase text-xs">Téléphone</dt><dd><a href={`tel:${m.phone}`}>{m.phone}</a></dd></div>}
                    {m.organization && <div><dt className="font-semibold text-brun/50 uppercase text-xs">Organisation</dt><dd>{m.organization}</dd></div>}
                    {m.topic && <div><dt className="font-semibold text-brun/50 uppercase text-xs">Sujet</dt><dd>{m.topic}</dd></div>}
                  </dl>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase text-brun/50">Message</p>
                    <p className="rounded-lg bg-creme/50 p-3 text-sm text-brun/80 whitespace-pre-wrap">{m.message}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-brun/50 mr-1">Statut :</span>
                    {requestStatuses.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatus(m.id, s)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold border-2 transition ${m.status === s ? statusColor[s] + " border-current" : "border-brun/20 hover:bg-creme"}`}
                      >
                        {requestStatusLabels[s]}
                      </button>
                    ))}
                    <a href={`mailto:${m.email}?subject=Re: votre message - KOM'MEL`} className="ml-auto btn btn-outline text-sm">
                      Répondre par e-mail
                    </a>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
