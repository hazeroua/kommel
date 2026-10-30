"use client";

import { useState } from "react";

type Testimonial = { quote: string; author: string; color: "corail" | "pervenche" | "moutarde" | "rose" | "vert-sauge" };

const colorMap: Record<Testimonial["color"], { bg: string; border: string; dot: string }> = {
  corail: { bg: "bg-corail/15", border: "border-corail", dot: "bg-corail" },
  pervenche: { bg: "bg-pervenche/15", border: "border-pervenche", dot: "bg-pervenche" },
  moutarde: { bg: "bg-moutarde/15", border: "border-moutarde", dot: "bg-moutarde" },
  rose: { bg: "bg-rose/15", border: "border-rose", dot: "bg-rose" },
  "vert-sauge": { bg: "bg-vert-sauge/15", border: "border-vert-sauge", dot: "bg-vert-sauge" },
};

const defaultTestimonials: Testimonial[] = [
  { quote: "Melkia a su captiver nos élèves dès les premiers instants. Son discours sur la confiance en soi a résonné bien au-delà de la salle de judo.", author: "Directrice d'un collège REP+ de Seine-Saint-Denis", color: "corail" },
  { quote: "Les enfants ont adoré ! Ils ont découvert le judo et les valeurs du sport de haut niveau de manière très accessible et inspirante.", author: "Animatrice centre de loisirs, Paris 19ème", color: "pervenche" },
  { quote: "Une intervention qui a marqué toute notre équipe. Melkia parle vrai et ça se ressent.", author: "Entraîneur, Judo Club de Montreuil", color: "moutarde" },
];

type TestimonialsProps = { testimonials?: Testimonial[] };

export function Testimonials({ testimonials = defaultTestimonials }: TestimonialsProps) {
  const [active, setActive] = useState(0);
  const t = testimonials[active];
  const c = colorMap[t?.color ?? "corail"] ?? colorMap.corail;

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center font-display text-title font-extrabold uppercase text-brun">Ils témoignent</h2>
        <div key={active} className={`${c.bg} ${c.border} relative rounded-bento border-2 p-8 shadow-dure-lg sm:p-12`}>
          <span aria-hidden="true" className="absolute -top-5 left-8 font-display text-[5rem] font-black leading-none text-brun/10">&ldquo;</span>
          <blockquote>
            <p className="relative z-10 font-display text-subtitle font-bold leading-tight text-brun">&laquo;&nbsp;{t?.quote}&nbsp;&raquo;</p>
            <footer className="mt-6 font-semibold text-brun/70"><cite className="not-italic">&mdash; {t?.author}</cite></footer>
          </blockquote>
        </div>
        {testimonials.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3" role="tablist" aria-label="Témoignages">
            {testimonials.map((tm, i) => {
              const dc = colorMap[tm.color] ?? colorMap.corail;
              return (
                <button key={i} role="tab" aria-selected={i === active} aria-label={`Témoignage ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-3 rounded-pill border-2 border-brun transition-all duration-300 ${i === active ? `${dc.dot} w-8` : "w-3 bg-brun/20"}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
