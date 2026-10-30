"use client";

import { useActionState, useTransition } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { updatePost, deletePost, uploadCoverImage } from "@/app/actions/admin-posts";
import { RichEditor } from "@/components/admin/RichEditor";
import type { Post } from "@/types";
import { use } from "react";
import { createBrowserClient } from "@supabase/ssr";

type State = { error?: string; fieldErrors?: Record<string, string> };
const initial: State = {};

async function fetchPost(id: string): Promise<Post | null> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  return data as Post | null;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadPending, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPost(id).then((p) => { setPost(p); setLoading(false); });
  }, [id]);

  const boundUpdate = updatePost.bind(null, id);
  const [state, formAction, pending] = useActionState(
    async (_prev: State, fd: FormData) => {
      const result = await boundUpdate(_prev, fd);
      if (!result?.error && !result?.fieldErrors) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
      return result ?? {};
    },
    initial,
  );

  function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    startUpload(async () => {
      const res = await uploadCoverImage(id, fd);
      if (res?.error) setUploadError(res.error);
      else {
        setUploadError(null);
        setPost((prev) => prev ? { ...prev, cover_url: res.url! } : prev);
      }
    });
  }

  async function handleDelete() {
    if (!confirm("Supprimer cet article définitivement ?")) return;
    await deletePost(id);
  }

  if (loading) {
    return <div className="py-16 text-center text-brun/40">Chargement…</div>;
  }
  if (!post) {
    return (
      <div className="py-16 text-center">
        <p className="text-xl font-bold">Article introuvable.</p>
        <Link href="/admin/posts" className="mt-3 inline-block text-corail underline">← Retour</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/posts" className="text-brun/50 hover:text-brun">←</Link>
        <h1 className="font-display text-2xl font-bold uppercase line-clamp-1">{post.title}</h1>
      </div>

      <form action={formAction} className="grid gap-6">
        {state.error && (
          <p className="rounded-card bg-corail/10 px-4 py-3 text-corail">{state.error}</p>
        )}
        {saved && (
          <p className="rounded-card bg-vert-sauge/10 px-4 py-3 text-vert-sauge font-medium">✓ Modifications enregistrées.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="title">Titre *</label>
            <input id="title" name="title" required className="field-input" defaultValue={post.title} />
            {state.fieldErrors?.title && <p className="field-error">{state.fieldErrors.title}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="slug">Slug (URL) *</label>
            <input id="slug" name="slug" required className="field-input font-mono text-sm" defaultValue={post.slug} />
            {state.fieldErrors?.slug && <p className="field-error">{state.fieldErrors.slug}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="kind">Type *</label>
            <select id="kind" name="kind" className="field-input" defaultValue={post.kind}>
              <option value="actualite">Actualité</option>
              <option value="evenement">Événement</option>
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="published_on">Date de publication *</label>
            <input id="published_on" name="published_on" type="date" required className="field-input" defaultValue={post.published_on} />
          </div>

          <div>
            <label className="field-label" htmlFor="status">Statut *</label>
            <select id="status" name="status" className="field-input" defaultValue={post.status}>
              <option value="brouillon">Brouillon</option>
              <option value="publie">Publié</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="excerpt">Extrait</label>
          <textarea id="excerpt" name="excerpt" rows={3} maxLength={500} className="field-input resize-none" defaultValue={post.excerpt ?? ""} />
        </div>

        <div>
          <label className="field-label mb-2 block">Contenu</label>
          <RichEditor name="content" initialContent={post.content} />
        </div>

        {/* Cover image */}
        <div className="rounded-card border-2 border-brun/20 p-4 grid gap-4">
          <p className="text-sm font-semibold text-brun/60 uppercase tracking-wide">Image de couverture</p>
          {post.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_url} alt={post.cover_alt || "Couverture"} className="h-40 w-full object-cover rounded-lg border-2 border-brun/20" />
          )}
          <div className="flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploadPending} className="btn btn-outline text-sm disabled:opacity-60">
              {uploadPending ? "Upload…" : post.cover_url ? "Remplacer l'image" : "Ajouter une image"}
            </button>
            {uploadError && <p className="text-sm text-corail">{uploadError}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="cover_alt">Texte alternatif</label>
              <input id="cover_alt" name="cover_alt" className="field-input" defaultValue={post.cover_alt ?? ""} />
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" name="image_rights_ok" value="true" defaultChecked={post.image_rights_ok} className="h-4 w-4 rounded" />
                <span>Je dispose des droits sur cette image</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
          {post.status === "publie" && (
            <Link href={`/actualites/${post.slug}`} target="_blank" className="btn btn-outline text-sm">
              ↗ Voir sur le site
            </Link>
          )}
          <button type="button" onClick={handleDelete} className="ml-auto text-sm text-corail underline hover:opacity-70">
            Supprimer l&apos;article
          </button>
        </div>
      </form>
    </div>
  );
}
