"use client";

import { useActionState } from "react";
import { signInWithPassword } from "@/app/actions/admin-auth";

const initial = { error: undefined as string | undefined, email: "" };

export default function ConnexionPage() {
  const [state, action, pending] = useActionState(
    async (_prev: typeof initial, fd: FormData) => {
      const result = await signInWithPassword(_prev, fd);
      // React vide le formulaire après l'envoi : on remet l'e-mail saisi
      return { error: result?.error, email: String(fd.get("email") ?? "") };
    },
    initial,
  );

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center font-display text-2xl font-bold uppercase tracking-tight">
          KOM&apos;MEL
          <span className="ml-2 text-corail">·</span>
        </p>

        <div className="rounded-card border-2 border-brun bg-blanc p-8 shadow-dure">
          <form action={action} className="grid gap-5">
            <div>
              <h1 className="font-display text-xl font-bold uppercase">Accès administration</h1>
              <p className="mt-1 text-sm text-brun/70">Connectez-vous avec votre mot de passe.</p>
            </div>

            <div>
              <label htmlFor="email" className="field-label">Adresse e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={state.email}
                className="field-input"
                placeholder="vous@exemple.fr"
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="field-input"
                placeholder="••••••••"
              />
            </div>

            {state.error && (
              <p role="alert" className="rounded-card bg-corail/10 px-4 py-3 text-sm text-corail">
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
              {pending ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-brun/50">
          Accès réservé aux membres autorisés de KOM&apos;MEL.
        </p>
      </div>
    </div>
  );
}
