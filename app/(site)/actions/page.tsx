import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/sections/PageIntro";

const actions = [
  ["Interventions scolaires", "Témoignages et échanges autour du parcours et des valeurs du sport.", "Écoles, collèges, lycées", "bg-corail"],
  ["Animations avec les clubs", "Initiations et entraînements aux côtés des encadrants locaux.", "Clubs et associations", "bg-pervenche"],
  ["Interventions tout public", "Conférences, événements et actions solidaires au profit de l’association.", "Tout public", "bg-rose"],
];

/*
 * « Ce qui nous anime » : une phrase par membre de l'équipe.
 * Ajouter les témoignages au fur et à mesure qu'ils sont récoltés.
 */
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const engagements = [
  {
    name: "Melkia",
    role: "Présidente",
    quote:
      "Ado, j’étais souvent la seule fille à m’entraîner au dojo. Celles qui venaient n’assumaient pas toujours leur combativité, vue comme un « truc de garçon ». Je veux montrer que féminité et sport de combat ne sont pas antinomiques, et que ces jeunes se sentent à leur place, peu importe la voie qu’elles choisiront.",
    bg: "bg-moutarde",
  },
  // TODO : remplacer les textes provisoires par les témoignages récoltés
  { name: "Exaucée", role: "Communication", quote: LOREM, bg: "bg-pervenche" },
  { name: "Sandra", role: "Trésorière", quote: LOREM, bg: "bg-corail" },
  { name: "Océane", role: "Secrétaire", quote: LOREM, bg: "bg-blanc" },
  { name: "Pauline", role: "Événements", quote: LOREM, bg: "bg-vert-sauge" },
];

const photos = [
  { src: "/images/action-1.jpg", alt: "Melkia enseigne une prise de judo à une jeune fille" },
  { src: "/images/action-2.jpg", alt: "Une jeune judokate fait chuter Melkia en riant" },
  { src: "/images/action-3.jpg", alt: "Melkia accompagne une enfant pendant un exercice au sol" },
];

export default function ActionsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Nos actions"
        title="Sur le terrain."
        subtitle="Révéler la force des jeunes par le sport et l’éducation."
        color="pervenche"
      >
        Nous transformons les valeurs du haut niveau en expériences concrètes, adaptées à chaque public et à
        chaque territoire.
      </PageIntro>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {actions.map(([title, text, audience, bg], i) => (
            <article key={title} className={`rounded-bento border-2 border-brun p-7 shadow-dure-lg ${bg} ${i === 1 ? "md:mt-12" : ""}`}>
              <p className="font-display text-6xl font-extrabold text-brun/25">0{i + 1}</p>
              <h2 className="mt-8 text-subtitle">{title}</h2>
              <p className="mt-4 text-brun/80">{text}</p>
              <p className="mt-8 rounded-pill bg-blanc/70 px-4 py-2 text-sm font-bold uppercase">{audience}</p>
            </article>
          ))}
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {photos.map((p, i) => (
            <li key={p.src} className={i === 1 ? "sm:mt-10" : ""}>
              <Image
                src={p.src}
                alt={p.alt}
                width={500}
                height={750}
                sizes="(min-width: 640px) 33vw, 100vw"
                className={`aspect-[4/5] w-full rounded-card border-2 border-brun object-cover shadow-dure-lg ${i === 0 ? "-rotate-1" : i === 2 ? "rotate-1" : ""}`}
              />
            </li>
          ))}
        </ul>

        <div className="mt-16 rounded-bento bg-moutarde p-8 sm:p-12">
          <p className="mb-3 font-display text-sm font-extrabold uppercase tracking-widest">Bientôt</p>
          <h2 className="text-title leading-[0.9]">Une permanence d&apos;aide aux devoirs.</h2>
          <p className="mt-5 max-w-xl text-lead text-brun/75">
            KOM&apos;MEL prépare de nouveaux rendez-vous pour accompagner les jeunes dans leur quotidien.
          </p>
        </div>
      </section>

      <section className="bg-rose-pale px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-display text-sm font-extrabold uppercase tracking-widest text-corail">
            Ce qui nous anime
          </p>
          <h2 className="text-title leading-[0.9]">Pourquoi on s&apos;engage.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {engagements.map((e, i) => (
              <figure
                key={e.name}
                className={`rounded-card border-2 border-brun p-8 shadow-dure-lg ${e.bg} ${i === 0 ? "md:col-span-2 md:p-10" : ""}`}
              >
                <blockquote className={i === 0 ? "font-display text-subtitle leading-snug font-bold" : "text-lead font-semibold"}>
                  « {e.quote} »
                </blockquote>
                <figcaption className="mt-5 font-display font-extrabold uppercase">
                  {e.name} <span className="font-sans text-sm font-bold text-brun/70">· {e.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <div className="px-5 pt-16 text-center">
        <Link href="/contact?motif=intervention" className="btn btn-primary">
          Demander une intervention →
        </Link>
      </div>
    </>
  );
}
