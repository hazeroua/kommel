"use client";

import { useActionState, useTransition } from "react";
import { useState } from "react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialVisible,
  reorderTestimonial,
} from "@/app/actions/admin-testimonials";
import { accentColors, accentLabels, type Testimonial } from "@/types";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";

type State = { error?: string; fieldErrors?: Record<string, string> };
const initial: State = {};

async function fetchTestimonials(): Promise<Testimonial[]> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Testimonial[];
}

function TestimonialForm({
  initial: initialValues,
  action,
  onDone,
  submitLabel = "Enregistrer",
}: {
  initial?: Partial<Testimonial>;
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
      {state.error && (
        <p className="rounded-card bg-corail/10 px-4 py-3 text-sm text-corail">{state.error}</p>
      )}
      <div>
        <label className="field-label" htmlFor="quote">Citation *</label>
        <textarea id="quote" name="quote" rows={3} required maxLength={1000} defaultValue={initialValues?.quote ?? ""} className="field-input resize-none" />
        {state.fieldErrors?.quote && <p className="field-error">{state.fieldErrors.quote}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="author">Auteur *</label>
          <input id="author" name="author" required defaultValue={initialValues?.author ?? ""} className="field-input" />
          {state.fieldErrors?.author && <p className="field-error">{state.fieldErrors.author}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="color">Couleur</label>
          <select id="color" name="color" defaultValue={initialValues?.color ?? "pervenche"} className="field-input">
            {accentColors.map((c) => (
              <option key={c} value={c}>{accentLabels[c]}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" name="visible" value="true" defaultChecked={initialValues?.visible ?? true} className="h-4 w-4 rounded" />
        <span>Visible sur le site</span>
      </label>
      <button type="submit" disabled={pending} className="btn btn-primary w-fit disabled:opacity-60">
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function reload() {
    fetchTestimonials().then((t) => { setTestimonials(t); setLoading(false); });
  }
  useEffect(() => { reload(); }, []);

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce témoignage ?")) return;
    startTransition(async () => { await deleteTestimonial(id); reload(); });
  }
  function handleToggle(id: string, current: boolean) {
    startTransition(async () => { await toggleTestimonialVisible(id, current); reload(); });
  }
  function handleReorder(id: string, dir: "up" | "down") {
    startTransition(async () => { await reorderTestimonial(id, dir); reload(); });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase">Témoignages</h1>
        <button onClick={() => { setShowForm((v) => !v); setEditing(null); }} className="btn btn-primary">
          {showForm ? "Annuler" : "+ Nouveau"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-card border-2 border-brun bg-blanc p-6 shadow-dure">
          <h2 className="mb-4 font-display font-bold uppercase">Nouveau témoignage</h2>
          <TestimonialForm
            action={createTestimonial}
            onDone={() => { setShowForm(false); reload(); }}
            submitLabel="Ajouter le témoignage"
          />
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-brun/40">Chargement…</div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-brun/30 py-16 text-center text-brun/50">
          <p>Aucun témoignage pour l&apos;instant.</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {testimonials.map((t, idx) => (
            <li key={t.id} className="rounded-card border-2 border-brun bg-blanc p-5 shadow-dure">
              {editing === t.id ? (
                <>
                  <h3 className="mb-4 font-bold">Modifier le témoignage</h3>
                  <TestimonialForm
                    initial={t}
                    action={updateTestimonial.bind(null, t.id)}
                    onDone={() => { setEditing(null); reload(); }}
                    submitLabel="Enregistrer les modifications"
                  />
                  <button onClick={() => setEditing(null)} className="mt-3 text-sm text-brun/50 underline">Annuler</button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="italic text-brun/80 line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                    <p className="mt-1 text-sm font-semibold">— {t.author}</p>
                    <div className="mt-2 flex gap-2">
                      <span className={`inline-block h-3 w-3 rounded-full bg-${t.color}`} aria-hidden />
                      <span className="text-xs text-brun/50">{accentLabels[t.color]}</span>
                      <span className={`text-xs ${t.visible ? "text-vert-sauge" : "text-brun/40"}`}>
                        {t.visible ? "● Visible" : "○ Masqué"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                    <div className="flex gap-1">
                      <button onClick={() => handleReorder(t.id, "up")} disabled={idx === 0} className="rounded border border-brun/30 px-2 py-1 text-xs disabled:opacity-30 hover:bg-creme">↑</button>
                      <button onClick={() => handleReorder(t.id, "down")} disabled={idx === testimonials.length - 1} className="rounded border border-brun/30 px-2 py-1 text-xs disabled:opacity-30 hover:bg-creme">↓</button>
                    </div>
                    <button onClick={() => setEditing(t.id)} className="text-sm font-medium text-pervenche underline">Modifier</button>
                    <button onClick={() => handleToggle(t.id, t.visible)} className="text-sm text-brun/50 underline">
                      {t.visible ? "Masquer" : "Afficher"}
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="text-sm text-corail underline">Supprimer</button>
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
