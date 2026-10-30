import type { CSSProperties } from "react";

type PlaceholderProps = {
  /** Libellé affiché, ex. « PHOTO MELKIA DÉTOURÉE » */
  label: string;
  /** Couleur de fond (token Tailwind sans préfixe, ex. "rose") */
  color?: "rose" | "moutarde" | "pervenche" | "corail" | "vert-sauge" | "orange" | "blanc";
  className?: string;
  style?: CSSProperties;
};

const bg: Record<NonNullable<PlaceholderProps["color"]>, string> = {
  rose: "bg-rose",
  moutarde: "bg-moutarde",
  pervenche: "bg-pervenche",
  corail: "bg-corail",
  "vert-sauge": "bg-vert-sauge",
  orange: "bg-orange",
  blanc: "bg-blanc",
};

/**
 * Emplacement réservé à un visuel réel (photo, logo).
 * Volontairement voyant pour ne jamais partir en production par erreur.
 */
export function Placeholder({ label, color = "rose", className = "", style }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Emplacement réservé : ${label}`}
      style={style}
      className={`${bg[color]} grid place-items-center border-2 border-dashed border-brun/50 p-3 text-center ${className}`}
    >
      <span className="font-display text-sm leading-tight font-bold text-brun uppercase">
        {label}
      </span>
    </div>
  );
}
