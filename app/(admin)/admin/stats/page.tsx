"use client";

import { useActionState, useTransition, useEffect, useState } from "react";
import { createStat, updateStat, deleteStat, reorderStat } from "@/app/actions/admin-stats";
import { accentColors, accentLabels, type Stat } from "@/types";
import { createBrowserClient } from "@supabase/ssr";

type State = { error?: string; fieldErrors?: Record<string, string> };
const initial: State = {};

async function fetchStats(): Promise<Stat[]> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("key_stats").select("*").order("sort_order");
  return (data ?? []) as Stat[];
}

function StatForm({
  initialValues,
  action,
  onDone,
  submitLabel = "Enregistrer",
}: {
  initialValues?: Partial<Stat>;
  action: (_prev: State, fd: FormData) => Promise<State>;
  onDone?: () => void;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: State, fd: FormData) => {
      const result = await action(_prev, fd);
      if (!result?.error && !result?.fieldErrors) onDone?.();
      return result ?? {};
    },
    initial,
  );
  return (
    <form action={formAction} className="grid gap-4">
      {state.error && <p className="rounded-card bg-corail/10 px-4 py-3 text-sm text-corail">{state.error}</p>}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="field-label" htmlFor="prefix">Préfixe</label>
          <input id="prefix" name="prefix" className="field-input" defaultValue={initialValues?.prefix ?? ""} placeholder="+" />
        </div>
        <div>
          <label className="field-label" htmlFor="value">Valeur *</label>
          <input id="value" name="value" type="number" required className="field-input" defaultValue={initialValues?.value ?? ""} />
          {state.fieldErrors?.value && <p className="field-error">{state.fieldErrors.value}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="suffix">Suffixe</label>
          <input id="suffix" name="suffix" className="field-input" defaultValue={initialValues?.suffix ?? ""} placeholder="%" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="label">Libellé *</label>
          <input id="label" name="label" required className="field-input" defaultValue={initialValues?.label ?? ""} placeholder="Ateliers animés" />
          {state.fieldErrors?.label && <p className="field-error">{state.fieldErrors.label}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="color">Couleur</label>
          <select id="color" name="color" className="field-input" defaultValue={initialValues?.color ?? "corail"}>
            {accentColors.map((c) => <option key={c} value={c}>{accentLabels[c]}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary w-fit disabled:opacity-60">
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function reload() {
    fetchStats().then((s) => { setStats(s); setLoading(false); });
  }
  useEffect(() => { reload(); }, []);

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce chiffre ?")) return;
    startTransition(async () => { await deleteStat(id); reload(); });
  }
  function handleReorder(id: string, dir: "up" | "down") {
    startTransition(async () => { await reorderStat(id, dir); reload(); });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase">Chiffres clés</h1>
        <button onClick={() => { setShowForm((v) => !v); setEditing(null); }} className="btn btn-primary">
          {showForm ? "Annuler" : "+ Nouveau"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-card border-2 border-brun bg-blanc p-6 shadow-dure">
          <h2 className="mb-4 font-display font-bold uppercase">Nouveau chiffre</h2>
          <StatForm action={createStat} onDone={() => { setShowForm(false); reload(); }} submitLabel="Ajouter" />
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-brun/40">Chargement…</div>
      ) : stats.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-brun/30 py-16 text-center text-brun/50">
          <p>Aucun chiffre pour l&apos;instant.</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {stats.map((s, idx) => (
            <li key={s.id} className="rounded-card border-2 border-brun bg-blanc p-5 shadow-dure">
              {editing === s.id ? (
                <>
                  <h3 className="mb-4 font-bold">Modifier le chiffre</h3>
                  <StatForm
                    initialValues={s}
                    action={updateStat.bind(null, s.id)}
                    onDone={() => { setEditing(null); reload(); }}
                    submitLabel="Enregistrer"
                  />
                  <button onClick={() => setEditing(null)} className="mt-3 text-sm text-brun/50 underline">Annuler</button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-display text-2xl font-bold" style={{ color: `var(--color-${s.color})` }}>
                      {s.prefix}{s.value}{s.suffix}
                    </p>
                    <p className="text-sm text-brun/70">{s.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <button onClick={() => handleReorder(s.id, "up")} disabled={idx === 0} className="rounded border border-brun/30 px-2 py-1 text-xs disabled:opacity-30 hover:bg-creme">↑</button>
                      <button onClick={() => handleReorder(s.id, "down")} disabled={idx === stats.length - 1} className="rounded border border-brun/30 px-2 py-1 text-xs disabled:opacity-30 hover:bg-creme">↓</button>
                    </div>
                    <button onClick={() => setEditing(s.id)} className="text-sm font-medium text-pervenche underline">Modifier</button>
                    <button onClick={() => handleDelete(s.id)} className="text-sm text-corail underline">Supprimer</button>
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
