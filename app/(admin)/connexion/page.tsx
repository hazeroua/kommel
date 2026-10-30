"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendMagicLink, signInWithPassword } from "@/app/actions/admin-auth";

const initialMagic = { error: undefined as string | undefined, success: false };
const initialPassword = { error: undefined as string | undefined, success: false };

export default function ConnexionPage() {
  const originRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"password" | "magic">("password");

  useEffect(() => {
    if (originRef.current) {
      originRef.current.value = window.location.origin;
    }
  }, []);

  const [magicState, magicAction, magicPending] = useActionState(
    async (_prev: typeof initialMagic, fd: FormData) => {
      const result = await sendMagicLink(_prev, fd);
      return { error: result.error, success: !!result.success };
    },
    initialMagic,
  );

  const [pwState, pwAction, pwPending] = useActionState(
    async (_prev: typeof initialPassword, fd: FormData) => {
      const result = await signInWithPassword(_prev, fd);
      return { error: result.error, success: !!result.success };
    },
    initialPassword,
  );

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center font-display text-2xl font-bold uppercase tracking-tight">
          KOM&apos;MEL
          <span className="ml-2 text-corail">·</span>
        </p>

        <div className="rounded-card border-2 border-brun bg-blanc p-8 shadow-dure">
          {mode === "password" ? (
            pwState.success ? (
              <div className="text-center">
                <p className="text-2xl">✅</p>
                <p className="mt-3 font-bold">Connexion réussie !</p>
                <p className="mt-2 text-sm text-brun/70">Redirection en cours…</p>
              </div>
            ) : (
              <form action={pwAction} className="grid gap-5">
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

                {pwState.error && (
                  <p className="rounded-card bg-corail/10 px-4 py-3 text-sm text-corail">
                    {pwState.error}
                  </p>
                )}

                <button type="submit" disabled={pwPending} className="btn btn-primary w-full disabled:opacity-60">
                  {pwPending ? "Connexion…" : "Se connecter"}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("magic")}
                  className="text-center text-xs text-brun/50 hover:text-brun underline"
                >
                  Recevoir un lien par e-mail à la place
                </button>
              </form>
            )
          ) : (
            magicState.success ? (
              <div className="text-center">
                <p className="text-2xl">✉️</p>
                <p className="mt-3 font-bold">Vérifiez votre boîte mail !</p>
                <p className="mt-2 text-sm text-brun/70">
                  Si votre adresse est autorisée, vous avez reçu un lien de connexion. Pensez à vérifier les spams.
                </p>
                <button type="button" onClick={() => setMode("password")} className="mt-4 text-xs text-brun/50 hover:text-brun underline">
                  ← Retour
                </button>
              </div>
            ) : (
              <form action={magicAction} className="grid gap-5">
                <input ref={originRef} type="hidden" name="origin" defaultValue="" />

                <div>
                  <h1 className="font-display text-xl font-bold uppercase">Lien magique</h1>
                  <p className="mt-1 text-sm text-brun/70">Recevez un lien de connexion par e-mail.</p>
                </div>

                <div>
                  <label htmlFor="email-magic" className="field-label">Adresse e-mail</label>
                  <input
                    id="email-magic"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="field-input"
                    placeholder="vous@exemple.fr"
                  />
                </div>

                {magicState.error && (
                  <p className="rounded-card bg-corail/10 px-4 py-3 text-sm text-corail">
                    {magicState.error}
                  </p>
                )}

                <button type="submit" disabled={magicPending} className="btn btn-primary w-full disabled:opacity-60">
                  {magicPending ? "Envoi…" : "Recevoir le lien"}
                </button>

                <button type="button" onClick={() => setMode("password")} className="text-center text-xs text-brun/50 hover:text-brun underline">
                  ← Retour connexion par mot de passe
                </button>
              </form>
            )
          )}
        </div>

        <p className="mt-6 text-center text-xs text-brun/50">
          Accès réservé aux membres autorisés de KOM&apos;MEL.
        </p>
      </div>
    </div>
  );
}
