"use client";

import { useActionState, useState, type FormEvent } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { newsletterSchema, type FormState } from "@/lib/validations/newsletter";

const initial: FormState = { status: "idle" };

/** Inscription newsletter — prévue pour un fond brun (footer). */
export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);
  const [clientErrors, setClientErrors] = useState<FormState["fieldErrors"]>();

  // Même schéma Zod qu'au serveur : erreurs immédiates, sans aller-retour
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);
    const parsed = newsletterSchema.safeParse({
      email: data.get("email"),
      firstName: data.get("firstName") || undefined,
      consent: data.get("consent") === "on",
      website: data.get("website") || undefined,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      if (!errs.website) {
        e.preventDefault();
        setClientErrors(errs);
        return;
      }
    }
    setClientErrors(undefined);
  }

  const errors = clientErrors ?? state.fieldErrors;

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-card bg-creme p-5 font-semibold text-brun">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="nl-email" className="sr-only">
            Adresse e-mail
          </label>
          <input
            id="nl-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ton@email.fr"
            required
            aria-invalid={errors?.email ? true : undefined}
            aria-describedby={errors?.email ? "nl-email-err" : undefined}
            className="h-12 w-full rounded-pill border-2 border-creme bg-creme px-5 text-brun placeholder:text-brun/60"
          />
        </div>
        <div>
          <label htmlFor="nl-firstname" className="sr-only">
            Prénom (facultatif)
          </label>
          <input
            id="nl-firstname"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Prénom (facultatif)"
            className="h-12 w-full rounded-pill border-2 border-creme bg-creme px-5 text-brun placeholder:text-brun/60 sm:w-48"
          />
        </div>
      </div>
      {errors?.email && (
        <p id="nl-email-err" className="text-sm font-semibold text-rose">
          {errors.email}
        </p>
      )}

      {/* Honeypot : invisible et ignoré par les lecteurs d'écran */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="nl-website">Ne pas remplir</label>
        <input id="nl-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="nl-consent"
          name="consent"
          type="checkbox"
          aria-invalid={errors?.consent ? true : undefined}
          aria-describedby={errors?.consent ? "nl-consent-err" : undefined}
          className="mt-1 size-5 shrink-0 accent-moutarde"
        />
        <label htmlFor="nl-consent" className="text-sm leading-snug text-creme/90">
          J&apos;accepte de recevoir la newsletter de KOM&apos;MEL. Je peux me désinscrire à tout
          moment.
        </label>
      </div>
      {errors?.consent && (
        <p id="nl-consent-err" className="text-sm font-semibold text-rose">
          {errors.consent}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-moutarde mt-1 self-start">
        {pending ? "Inscription…" : "S'inscrire"}
      </button>

      {state.status === "error" && state.message && !clientErrors && (
        <p role="alert" className="text-sm font-semibold text-rose">
          {state.message}
        </p>
      )}
    </form>
  );
}
