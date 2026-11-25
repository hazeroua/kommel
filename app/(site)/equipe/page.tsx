import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "L'équipe",
  description: "Les membres du bureau de l'association KOM'MEL.",
};

/*
 * Membres du bureau. Pour ajouter une photo : déposer l'image dans public/images/equipe/
 * et remplacer la pastille d'initiale par un <Image>.
 */
const equipe = [
  { name: "Melkia", role: "Présidente", text: "Fondatrice de KOM'MEL, judokate de l'équipe de France.", bg: "bg-corail" },
  { name: "Exaucée", role: "Communication", text: "Réseaux sociaux, visuels et prise de parole.", bg: "bg-pervenche" },
  { name: "Sandra", role: "Trésorière", text: "Budget, dons et partenariats financiers.", bg: "bg-moutarde" },
  { name: "Océane", role: "Secrétaire", text: "Organisation, documents et suivi des demandes.", bg: "bg-rose" },
  { name: "Pauline", role: "Événements", text: "Interventions, initiations et journées solidaires.", bg: "bg-vert-sauge" },
];

export default function EquipePage() {
  return (
    <>
      <PageIntro eyebrow="L'équipe" title="Cinq énergies, un même cap." color="rose">
        Derrière KOM&apos;MEL, une équipe engagée qui fait vivre l&apos;association au quotidien.
      </PageIntro>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <ul className="flex flex-wrap justify-center gap-6">
          {equipe.map((m, i) => (
            <li
              key={m.name}
              className={`w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-card border-2 border-brun p-7 shadow-dure-lg transition-transform duration-300 ease-(--ease-elastique) hover:-translate-y-1 hover:rotate-0 ${m.bg} ${i % 2 ? "rotate-1" : "-rotate-1"}`}
            >
              <div className="flex items-center gap-5">
                <span
                  aria-hidden="true"
                  className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-brun bg-blanc font-display text-4xl font-extrabold"
                >
                  {m.name[0]}
                </span>
                <div>
                  <p className="font-display text-3xl leading-none font-extrabold">{m.name}</p>
                  <p className="mt-2 inline-block rounded-pill bg-blanc/75 px-3 py-1 text-sm font-bold uppercase">{m.role}</p>
                </div>
              </div>
              <p className="mt-5 text-brun/85">{m.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col items-start gap-6 rounded-bento bg-moutarde p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="text-subtitle">Envie de nous rejoindre ?</h2>
            <p className="mt-2 text-brun/75">Aide aux devoirs, ateliers, événements : il y a une mission pour toi.</p>
          </div>
          <Link href="/devenir-benevole" className="btn btn-primary shrink-0">
            Devenir bénévole →
          </Link>
        </div>
      </section>
    </>
  );
}
