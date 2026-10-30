import Link from "next/link";

/*
 * Le logo officiel doit être déposé dans public/brand/ (SVG de préférence).
 * Il s'utilise tel quel, toujours sur fond clair.
 * Quand le fichier est là, remplacer le bloc ci-dessous par :
 *   <Image src="/brand/logo.svg" alt="KOM'MEL" width={…} height={…} priority />
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="KOM'MEL, retour à l'accueil"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="grid h-12 place-items-center rounded-pill border-2 border-dashed border-brun/50 bg-blanc px-4 font-display text-sm leading-none font-bold uppercase"
      >
        Logo KOM&apos;MEL
      </span>
    </Link>
  );
}
