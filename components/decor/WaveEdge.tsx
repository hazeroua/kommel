type WaveEdgeProps = {
  /** Classe de couleur de remplissage, ex. "fill-brun" */
  fillClassName: string;
  /** "top" : la vague coiffe la section suivante ; "bottom" : elle termine la section */
  position?: "top" | "bottom";
  className?: string;
};

/** Séparateur ondulé pleine largeur, à la place d'une ligne droite. */
export function WaveEdge({ fillClassName, position = "top", className = "" }: WaveEdgeProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-16 ${position === "bottom" ? "rotate-180" : ""} ${className}`}
    >
      <path
        className={fillClassName}
        d="M0 46C120 18 216 10 336 26s210 50 336 48 222-44 348-50 246 26 300 36 96 6 120 0V80H0Z"
      />
    </svg>
  );
}
