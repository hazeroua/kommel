"use client";

import { useActionState, useTransition, useEffect, useState } from "react";
import {
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
  reorderInstagramPost,
} from "@/app/actions/admin-instagram";
import { createBrowserClient } from "@supabase/ssr";

type IgPost = {
  id: string;
  image_url: string;
  permalink: string;
  alt: string;
  sort_order: number;
};

type State = { error?: string; fieldErrors?: Record<string, string> };
const initial: State = {};

async function fetchPosts(): Promise<IgPost[]> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase
    .from("instagram_posts")
    .select("*")
    .order("sort_order");
  return (data ?? []) as IgPost[];
}

function IgForm({
  initialValues,
  action,
  onDone,
  submitLabel = "Enregistrer",
}: {
  initialValues?: Partial<IgPost>;
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
        <label className="field-label" htmlFor="image_url">
          URL de l&apos;image *
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          required
          defaultValue={initialValues?.image_url ?? ""}
          className="field-input"
          placeholder="https://…"
        />
        {state.fieldErrors?.image_url && (
          <p className="field-error">{state.fieldErrors.image_url}</p>
        )}
        <p className="mt-1 text-xs text-brun/50">Copier l&apos;URL publique depuis Supabase Storage ou autre hébergeur.</p>
      </div>
      <div>
        <label className="field-label" htmlFor="permalink">
          Lien Instagram (facultatif)
        </label>
        <input
          id="permalink"
          name="permalink"
          type="url"
          defaultValue={initialValues?.permalink ?? ""}
          className="field-input"
          placeholder="https://www.instagram.com/p/…"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="alt">
          Légende / texte alternatif (max 300 car.)
        </label>
        <textarea
          id="alt"
          name="alt"
          rows={2}
          maxLength={300}
          defaultValue={initialValues?.alt ?? ""}
          className="field-input resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-fit disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

export default function InstagramPage() {
  const [posts, setPosts] = useState<IgPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function reload() {
    fetchPosts().then((p) => {
      setPosts(p);
      setLoading(false);
    });
  }
  useEffect(() => {
    reload();
  }, []);

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce post ?")) return;
    startTransition(async () => {
      await deleteInstagramPost(id);
      reload();
    });
  }
  function handleReorder(id: string, dir: "up" | "down") {
    startTransition(async () => {
      await reorderInstagramPost(id, dir);
      reload();
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Instagram</h1>
          <p className="mt-1 text-sm text-brun/60">
            Les 6 premiers posts (par ordre) sont affichés sur l&apos;accueil.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm((v) => !v);
            setEditing(null);
          }}
          className="btn btn-primary"
        >
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-card border-2 border-brun bg-blanc p-6 shadow-dure">
          <h2 className="mb-4 font-display font-bold uppercase">Nouveau post</h2>
          <IgForm
            action={createInstagramPost}
            onDone={() => {
              setShowForm(false);
              reload();
            }}
            submitLabel="Ajouter"
          />
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-brun/40">Chargement…</div>
      ) : posts.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-brun/30 py-16 text-center text-brun/50">
          <p>Aucun post pour l&apos;instant.</p>
          <p className="mt-2 text-sm">
            Uploadez une image dans Supabase Storage → bucket <strong>public-images</strong>,
            copiez l&apos;URL publique, et collez-la ici.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, idx) => (
            <li key={p.id} className="overflow-hidden rounded-card border-2 border-brun bg-blanc shadow-dure">
              {editing === p.id ? (
                <div className="p-5">
                  <h3 className="mb-4 font-bold">Modifier</h3>
                  <IgForm
                    initialValues={p}
                    action={updateInstagramPost.bind(null, p.id)}
                    onDone={() => {
                      setEditing(null);
                      reload();
                    }}
                    submitLabel="Enregistrer"
                  />
                  <button
                    onClick={() => setEditing(null)}
                    className="mt-3 text-sm text-brun/50 underline"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt={p.alt || "Post Instagram"}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    {p.alt && (
                      <p className="mb-2 text-sm text-brun/70 line-clamp-2">{p.alt}</p>
                    )}
                    {p.permalink && (
                      <a
                        href={p.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-2 block truncate text-xs text-pervenche underline"
                      >
                        {p.permalink}
                      </a>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleReorder(p.id, "up")}
                          disabled={idx === 0}
                          className="rounded border border-brun/30 px-2 py-1 text-xs disabled:opacity-30 hover:bg-creme"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleReorder(p.id, "down")}
                          disabled={idx === posts.length - 1}
                          className="rounded border border-brun/30 px-2 py-1 text-xs disabled:opacity-30 hover:bg-creme"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(p.id)}
                          className="text-sm text-pervenche underline"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-sm text-corail underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
