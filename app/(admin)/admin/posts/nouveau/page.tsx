"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPost } from "@/app/actions/admin-posts";
import { RichEditor } from "@/components/admin/RichEditor";

type State = { error?: string; fieldErrors?: Record<string, string> };
const initial: State = {};

export default function NouvelArticlePage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: State, fd: FormData) => {
      const result = await createPost(_prev, fd);
      return result ?? {};
    },
    initial,
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/posts" className="text-brun/50 hover:text-brun">←</Link>
        <h1 className="font-display text-3xl font-bold uppercase">Nouvel article</h1>
      </div>

      <form action={formAction} className="grid gap-6">
        {state.error && (
          <p className="rounded-card bg-corail/10 px-4 py-3 text-corail">{state.error}</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="title">Titre *</label>
            <input id="title" name="title" required className="field-input" placeholder="Titre de l'article" />
            {state.fieldErrors?.title && <p className="field-error">{state.fieldErrors.title}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="slug">Slug (URL) *</label>
            <input id="slug" name="slug" required className="field-input font-mono text-sm" placeholder="mon-article" />
            {state.fieldErrors?.slug && <p className="field-error">{state.fieldErrors.slug}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="kind">Type *</label>
            <select id="kind" name="kind" className="field-input">
              <option value="actualite">Actualité</option>
              <option value="evenement">Événement</option>
            </select>
            {state.fieldErrors?.kind && <p className="field-error">{state.fieldErrors.kind}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="published_on">Date de publication *</label>
            <input id="published_on" name="published_on" type="date" defaultValue={today} required className="field-input" />
            {state.fieldErrors?.published_on && <p className="field-error">{state.fieldErrors.published_on}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="status">Statut *</label>
            <select id="status" name="status" className="field-input">
              <option value="brouillon">Brouillon</option>
              <option value="publie">Publié</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="excerpt">Extrait (max 500 caractères)</label>
          <textarea id="excerpt" name="excerpt" rows={3} maxLength={500} className="field-input resize-none" placeholder="Court résumé affiché dans la liste des actualités…" />
          {state.fieldErrors?.excerpt && <p className="field-error">{state.fieldErrors.excerpt}</p>}
        </div>

        <div>
          <label className="field-label mb-2 block">Contenu</label>
          <RichEditor name="content" />
          {state.fieldErrors?.content && <p className="field-error">{state.fieldErrors.content}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 rounded-card border-2 border-brun/20 p-4">
          <p className="sm:col-span-2 text-sm font-semibold text-brun/60 uppercase tracking-wide">Image de couverture — après création</p>
          <p className="sm:col-span-2 text-sm text-brun/50">L&apos;image peut être uploadée depuis la page de modification de l&apos;article.</p>
          <div>
            <label className="field-label" htmlFor="cover_alt">Texte alternatif de l&apos;image</label>
            <input id="cover_alt" name="cover_alt" className="field-input" placeholder="Description de l'image pour l'accessibilité" />
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" name="image_rights_ok" value="true" className="h-4 w-4 rounded" />
              <span>Je dispose des droits sur cette image</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
            {pending ? "Enregistrement…" : "Créer l'article"}
          </button>
          <Link href="/admin/posts" className="btn btn-outline">Annuler</Link>
        </div>
      </form>
    </div>
  );
}
