import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  /** Phrase d'accroche affichée sous le titre, en plus grand que le texte. */
  subtitle?: string;
  children: ReactNode;
  color?: "moutarde" | "pervenche" | "rose" | "corail";
};

export function PageIntro({ eyebrow, title, subtitle, children, color = "moutarde" }: PageIntroProps) {
  const backgrounds = { moutarde: "bg-moutarde", pervenche: "bg-pervenche", rose: "bg-rose", corail: "bg-corail" } as const;
  return (
    <section className={`${backgrounds[color]} px-5 pt-34 pb-20 sm:px-8 sm:pt-44 sm:pb-28`}>
      <div className="mx-auto max-w-7xl">
        <p className="mb-5 font-display text-sm font-extrabold uppercase tracking-widest text-brun/65">{eyebrow}</p>
        <h1 className="max-w-5xl text-hero leading-[0.86]">{title}</h1>
        {subtitle && (
          <p className="mt-6 max-w-3xl font-display text-subtitle font-bold leading-tight text-brun">{subtitle}</p>
        )}
        <div className="mt-8 max-w-2xl text-lead text-brun/80">{children}</div>
      </div>
    </section>
  );
}
