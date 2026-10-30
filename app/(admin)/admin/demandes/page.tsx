"use client";

import { useEffect, useState, useTransition } from "react";
import { updateInterventionStatus } from "@/app/actions/admin-requests";
import {
  actionTypeLabels,
  requestStatusLabels,
  structureTypeLabels,
  type InterventionRequest,
  requestStatuses,
  type RequestStatus,
} from "@/types";
import { createBrowserClient } from "@supabase/ssr";

async function fetchDemandes(): Promise<InterventionRequest[]> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase
    .from("intervention_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as InterventionRequest[];
}

const statusColor: Record<RequestStatus, string> = {
  nouvelle: "bg-corail/20 text-corail",
  en_cours: "bg-moutarde/20 text-moutarde",
  traitee: "bg-vert-sauge/20 text-vert-sauge",
};

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<InterventionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function reload() {
    fetchDemandes().then((d) => { setDemandes(d); setLoading(false); });
  }
  useEffect(() => { reload(); }, []);

  function handleStatus(id: string, status: string) {
    startTransition(async () => { await updateInterventionStatus(id, status); reload(); });
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold uppercase">Demandes d&apos;intervention</h1>

      {loading ? (
        <div className="py-12 text-center text-brun/40">Chargement…</div>
      ) : demandes.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-brun/30 py-16 text-center text-brun/50">
          <p>Aucune demande pour l&apos;instant.</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {demandes.map((d) => (
            <li key={d.id} className="rounded-card border-2 border-brun bg-blanc shadow-dure overflow-hidden">
              {/* Header */}
              <button
                type="button"
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-creme/30 transition-colors"
                onClick={() => setExpanded((v) => v === d.id ? null : d.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[d.status]}`}>
                      {requestStatusLabels[d.status]}
                    </span>
                    <span className="text-xs text-brun/50">
                      {new Date(d.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="font-semibold">{d.contact_name} — {d.structure_name}</p>
                  <p className="text-sm text-brun/60">{structureTypeLabels[d.structure_type]} · {actionTypeLabels[d.action_type]}</p>
                </div>
                <span className="text-brun/40 mt-1">{expanded === d.id ? "▲" : "▼"}</span>
              </button>

              {/* Expanded detail */}
              {expanded === d.id && (
                <div className="border-t-2 border-brun/10 p-5 grid gap-4">
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div><dt className="font-semibold text-brun/50 uppercase text-xs">E-mail</dt><dd><a href={`mailto:${d.email}`} className="text-pervenche underline">{d.email}</a></dd></div>
                    {d.phone && <div><dt className="font-semibold text-brun/50 uppercase text-xs">Téléphone</dt><dd><a href={`tel:${d.phone}`}>{d.phone}</a></dd></div>}
                    <div><dt className="font-semibold text-brun/50 uppercase text-xs">Tranche d&apos;âge</dt><dd>{d.youth_age}</dd></div>
                    {d.participants && <div><dt className="font-semibold text-brun/50 uppercase text-xs">Participants</dt><dd>{d.participants}</dd></div>}
                    {d.desired_dates && <div><dt className="font-semibold text-brun/50 uppercase text-xs">Dates souhaitées</dt><dd>{d.desired_dates}</dd></div>}
                  </dl>
                  {d.message && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase text-brun/50">Message</p>
                      <p className="rounded-lg bg-creme/50 p-3 text-sm text-brun/80 whitespace-pre-wrap">{d.message}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-brun/50 mr-1">Statut :</span>
                    {requestStatuses.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatus(d.id, s)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold border-2 transition ${d.status === s ? statusColor[s] + " border-current" : "border-brun/20 hover:bg-creme"}`}
                      >
                        {requestStatusLabels[s]}
                      </button>
                    ))}
                    <a href={`mailto:${d.email}?subject=Votre demande d'intervention - KOM'MEL`} className="ml-auto btn btn-outline text-sm">
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
