import { getBrochureHref } from "@/lib/brochure";

/** Bouton de téléchargement de la brochure ; message d'attente si le PDF n'est pas encore en ligne. */
export function BrochureLink({ className = "btn btn-secondary" }: { className?: string }) {
  const href = getBrochureHref();
  if (!href) {
    return (
      <span className="inline-block rounded-pill border-2 border-dashed border-current px-5 py-3 font-bold opacity-80">
        Brochure PDF bientôt disponible
      </span>
    );
  }
  return (
    <a href={href} download className={className}>
      Télécharger la brochure (PDF) ↓
    </a>
  );
}
