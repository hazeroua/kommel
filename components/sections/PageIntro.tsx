import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, children, color = "moutarde" }: { eyebrow: string; title: string; children: ReactNode; color?: "moutarde" | "pervenche" | "rose" | "corail" }) {
  const backgrounds = { moutarde: "bg-moutarde", pervenche: "bg-pervenche", rose: "bg-rose", corail: "bg-corail" } as const;
  return (
    <section className={`${backgrounds[color]} px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28`}>
      <div className="mx-auto max-w-7xl">
        <p className="mb-5 font-display text-sm font-extrabold uppercase tracking-widest text-brun/65">{eyebrow}</p>
        <h1 className="max-w-5xl text-hero leading-[0.86]">{title}</h1>
        <div className="mt-8 max-w-2xl text-lead text-brun/80">{children}</div>
      </div>
    </section>
  );
}
