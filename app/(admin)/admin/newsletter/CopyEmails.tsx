"use client";

import { useState } from "react";

/** Copie toutes les adresses, séparées par des virgules (à coller dans le champ « Cci » d'un mail). */
export function CopyEmails({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(emails.join(", "));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="btn btn-secondary btn-sm"
      disabled={emails.length === 0}
    >
      {copied ? "Copié ✓" : "Copier les adresses"}
    </button>
  );
}
