import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramGrid } from "@/components/sections/InstagramGrid";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="bg-moutarde px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 font-display text-sm font-extrabold uppercase tracking-widest text-brun/70">
              Notre conviction
            </p>
            <h2 className="text-title leading-[0.9]">Le sport change les trajectoires.</h2>
          </div>
          <p className="max-w-2xl text-lead text-brun/80">
            Chez KOM&apos;MEL, chaque entraînement devient un espace pour prendre sa place,
            oser, se dépasser et transmettre à son tour. Nous créons des rencontres qui rendent
            la confiance concrète et contagieuse.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 font-display text-sm font-extrabold uppercase tracking-widest text-corail">
                Ce que l&apos;on fait
              </p>
              <h2 className="text-title leading-[0.9]">Des actions qui mettent en mouvement.</h2>
            </div>
            <Link href="/actions" className="btn btn-secondary self-start sm:self-auto">
              Toutes nos actions →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["01", "Interventions", "Dans les établissements, on parle confiance, orientation et égalité." , "bg-corail"],
              ["02", "Rencontres sportives", "Des initiations et des échanges pour rendre le haut niveau accessible.", "bg-pervenche"],
              ["03", "Transmission", "Des modèles inspirants qui donnent envie de passer à l’action.", "bg-rose"],
            ].map(([number, title, text, color], index) => (
              <article key={number} className={`rounded-card border-2 border-brun p-6 shadow-dure-lg ${color} ${index === 1 ? "rotate-2" : index === 2 ? "-rotate-1" : ""}`}>
                <p className="font-display text-5xl font-extrabold text-brun/30">{number}</p>
                <h3 className="mt-5 text-subtitle">{title}</h3>
                <p className="mt-3 text-brun/80">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section className="overflow-hidden bg-pervenche px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-center font-display text-[clamp(2.5rem,8vw,7rem)] font-extrabold uppercase leading-none text-brun">
            Oser · Bouger · Transmettre · Oser · Bouger · Transmettre
          </p>
        </div>
      </section>

      <Testimonials />

      <InstagramGrid />

      <section className="px-5 pb-8 sm:px-8 sm:pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-bento bg-rose p-8 shadow-dure-lg sm:p-12 md:flex-row md:items-center">
          <div>
            <p className="mb-3 font-display text-sm font-extrabold uppercase tracking-widest text-brun/70">
              À plusieurs, on va plus loin
            </p>
            <h2 className="max-w-2xl text-title leading-[0.9]">Aidez-nous à révéler la prochaine force.</h2>
          </div>
          <Link href="/nous-soutenir" className="btn btn-primary shrink-0">
            Nous soutenir →
          </Link>
        </div>
      </section>
    </>
  );
}
