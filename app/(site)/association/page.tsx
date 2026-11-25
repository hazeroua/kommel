import Image from "next/image";
import Link from "next/link";
import { BrochureLink } from "@/components/sections/BrochureLink";
import { PageIntro } from "@/components/sections/PageIntro";

/*
 * Chiffres du constat : chaque valeur doit garder sa source.
 * Pour en ajouter un, copier une ligne et renseigner `source` + `href`.
 */
const constat = [
  {
    value: "34 %",
    text: "des filles arrêtent le sport régulier entre 14 et 18 ans, contre 18 % des garçons.",
    source: "INJEP, Analyses & synthèses n° 92, avril 2026",
    href: "https://injep.fr/publications/",
    bg: "bg-corail",
  },
  {
    value: "15,5 %",
    text: "seulement de filles parmi les élèves de terminale en spécialité NSI (informatique), 14,2 % en sciences de l'ingénieur.",
    source: "DEPP, Note d'information n° 26.06, février 2026",
    href: "https://www.education.gouv.fr/etudes-et-statistiques",
    bg: "bg-pervenche",
  },
  {
    value: "33,7 %",
    text: "des filles suivent la spécialité mathématiques en terminale, contre 58,8 % des garçons.",
    source: "DEPP, Note d'information n° 26.06, février 2026",
    href: "https://www.education.gouv.fr/etudes-et-statistiques",
    bg: "bg-moutarde",
  },
] as const;

const parcours = [
  { year: "2013", title: "Premiers pas sur le tatami", text: "Débuts au judo à Saint-Denis." },
  { year: "2019", title: "Sport-études", text: "Entrée en sport-études à Brétigny." },
  { year: "2022", title: "L'INSEP", text: "Entrée à l'INSEP, le centre d'entraînement des équipes de France." },
  { year: "2023", title: "Championne du monde junior", text: "Premier titre mondial junior et entrée dans les études supérieures." },
  { year: "2024", title: "Un doublé historique", text: "Deuxième titre mondial junior, une première pour le judo féminin français. Création de KOM'MEL." },
  { year: "2026", title: "Vice-championne d'Europe", text: "Une nouvelle médaille, et toujours la même envie de transmettre." },
];


export default function AssociationPage() {
  return (
    <>
      <PageIntro eyebrow="L'association" title="Comme elle. Comme toi. Comme nous." color="moutarde">
        KOM&apos;MEL est une association étudiante et citoyenne fondée par Melkia Auchecorne. Nous accompagnons
        les jeunes, et les jeunes filles en particulier, vers l&apos;émancipation par le sport et l&apos;éducation.
      </PageIntro>

      {/* Constat */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-4 font-display text-sm font-extrabold uppercase tracking-widest text-corail">
          Pourquoi KOM&apos;MEL existe
        </p>
        <h2 className="max-w-3xl text-title leading-[0.9]">Une jeunesse en manque de repères, des filles qui décrochent.</h2>
        <p className="mt-6 max-w-2xl text-lead text-brun/75">
          À l&apos;adolescence, beaucoup de filles arrêtent le sport ou n&apos;osent pas aller vers des filières
          dites « masculines ». Un décrochage encore plus marqué dans les familles les plus modestes, d&apos;après
          l&apos;INJEP.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {constat.map((item) => (
            <article key={item.value + item.text} className={`flex flex-col rounded-card border-2 border-brun p-7 shadow-dure-lg ${item.bg}`}>
              <p className="font-display text-display leading-none font-extrabold whitespace-nowrap">{item.value}</p>
              <p className="mt-5 flex-1 font-semibold text-brun/90">{item.text}</p>
              <p className="mt-6 text-xs text-brun/75">
                Source :{" "}
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline">
                  {item.source}
                </a>
              </p>
            </article>
          ))}
        </div>

        <figure className="mt-12 grid gap-6 rounded-bento border-2 border-brun bg-blanc p-8 shadow-dure-lg sm:p-12 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
          <span
            aria-hidden="true"
            className="font-display text-[7rem] leading-[0.6] font-extrabold text-corail md:text-[10rem]"
          >
            “
          </span>
          <div>
            <blockquote className="font-display text-subtitle leading-snug font-bold">
              L&apos;idée, c&apos;est d&apos;être un modèle ou un exemple pour les jeunes, avec un accent sur les
              filles […]. Je ne veux pas leur dire d&apos;être excellents, seulement de s&apos;investir dans ce
              qu&apos;ils aiment.
            </blockquote>
            <figcaption className="mt-5 text-sm text-brun/70">
              Melkia Auchecorne, interview <cite>Ouest-France</cite> (Mondiaux de judo)
            </figcaption>
          </div>
        </figure>
      </section>

      {/* Point de départ + parcours */}
      <section className="bg-rose-pale px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Image
              src="/images/melkia-portrait.jpg"
              alt="Portrait de Melkia Auchecorne en kimono de l'équipe de France"
              width={900}
              height={1599}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] w-full rotate-2 rounded-card border-2 border-brun object-cover object-top shadow-dure-lg"
            />
            <p className="mt-10 mb-4 font-display text-sm font-extrabold uppercase tracking-widest text-corail">
              Notre point de départ
            </p>
            <h2 className="text-title leading-[0.9]">Le haut niveau donne des outils pour toute la vie.</h2>
            <p className="mt-6 text-lead text-brun/75">
              Double championne du monde junior et judokate de l&apos;équipe de France formée à l&apos;INSEP, Melkia
              transmet ce que le haut niveau lui a appris : discipline, persévérance, force mentale et solidarité.
            </p>
          </div>

          <div>
            <h2 className="text-title leading-[0.9]">Le parcours de Melkia</h2>
            <ol className="relative mt-10 space-y-8 border-l-4 border-dashed border-brun/30 pl-8">
              {parcours.map((step) => (
                <li key={step.year} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-1 -left-[2.65rem] h-5 w-5 rounded-full border-2 border-brun bg-moutarde"
                  />
                  <p className="font-display text-3xl font-extrabold text-corail">{step.year}</p>
                  <h3 className="mt-1 text-subtitle">{step.title}</h3>
                  <p className="mt-2 text-brun/75">{step.text}</p>
                </li>
              ))}
            </ol>
            <figure className="mt-12 rounded-card bg-brun p-7 text-creme">
              <blockquote className="text-lead italic">
                « Mon parcours est une exception, mais il est aussi la preuve que d&apos;autres chemins sont
                possibles. »
              </blockquote>
              <figcaption className="mt-3 text-sm text-creme/75">Melkia, présidente de KOM&apos;MEL</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Piliers */}
      <section className="bg-pervenche px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-title leading-[0.9]">Nos trois piliers</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Confiance en soi", "Croire en ses capacités et trouver sa place.", "bg-blanc"],
              ["Dépassement de soi", "Progresser, persévérer et se dépasser.", "bg-corail"],
              ["Transmission & solidarité", "Créer du lien et inspirer les générations.", "bg-rose"],
            ].map(([title, text, bg]) => (
              <article key={title} className={`rounded-card border-2 border-brun p-7 shadow-dure-lg ${bg}`}>
                <h3 className="text-subtitle">{title}</h3>
                <p className="mt-4 text-brun/75">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe + brochure */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col items-start gap-6 rounded-bento border-2 border-brun bg-blanc p-8 shadow-dure-lg sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="text-subtitle">Qui porte KOM&apos;MEL ?</h2>
            <p className="mt-2 text-brun/75">Cinq membres engagées, chacune avec son rôle.</p>
          </div>
          <Link href="/equipe" className="btn btn-rose shrink-0">
            Rencontrer l&apos;équipe →
          </Link>
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 rounded-bento bg-moutarde p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="text-subtitle">Tout KOM&apos;MEL en quelques pages</h2>
            <p className="mt-2 text-brun/75">Notre brochure présente l&apos;association, nos actions et nos besoins.</p>
          </div>
          <BrochureLink className="btn btn-primary shrink-0" />
        </div>
      </section>
    </>
  );
}
