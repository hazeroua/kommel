"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMagicLink } from "@/app/actions/admin-auth";

const initial = { error: undefined as string | undefined, success: false };

export default function ConnexionPage() {
  const originRef = useRef<HTMLInputElement>(null);

  // Injecte l'origine réelle (port inclus) côté client
  useEffect(() => {
    if (originRef.current) {
      originRef.current.value = window.location.origin;
    }
  }, []);

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initial, fd: FormData) => {
      const result = await sendMagicLink(_prev, fd);
      return { error: result.error, success: !!result.success };
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
          {state.success ? (
            <div className="text-center">
              <p className="text-2xl">✉️</p>
              <p className="mt-3 font-bold">Vérifiez votre boîte mail !</p>
              <p className="mt-2 text-sm text-brun/70">
                Si votre adresse est autorisée, vous avez reçu un lien de connexion. Pensez à
                vérifier les spams.
              </p>
            </div>
          ) : (
            <form action={formAction} className="grid gap-5">
              {/* Champ caché : origine réelle injectée côté client */}
              <input ref={originRef} type="hidden" name="origin" defaultValue="" />

              <div>
                <h1 className="font-display text-xl font-bold uppercase">Accès administration</h1>
                <p className="mt-1 text-sm text-brun/70">
                  Entrez votre adresse e-mail pour recevoir un lien de connexion.
                </p>
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="field-input"
                  placeholder="vous@exemple.fr"
                />
              </div>

              {state.error && (
                <p className="rounded-card bg-corail/10 px-4 py-3 text-sm text-corail">
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="btn btn-primary w-full disabled:opacity-60"
              >
                {pending ? "Envoi en cours…" : "Recevoir le lien"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-brun/50">
          Accès réservé aux membres autorisés de KOM&apos;MEL.
        </p>
      </div>
    </div>
  );
}
