import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "Devenir bénévole",
  description: "Aide aux devoirs, ateliers orientation, interventions : rejoignez KOM'MEL comme bénévole.",
};

const missions = [
  {
    title: "Aide aux devoirs",
    text: "Accompagner des collégien·nes et lycéen·nes dans leur travail scolaire, régulièrement ou ponctuellement.",
    profil: "Idéal pour les étudiant·es",
    bg: "bg-moutarde",
  },
  {
    title: "Animer un atelier orientation",
    text: "Présenter son métier, son parcours et ses conseils pour aider les jeunes à se projeter, notamment vers des filières où les filles sont peu nombreuses.",
    profil: "Pour les professionnel·les en activité",
    bg: "bg-pervenche",
  },
  {
    title: "Sensibiliser dans les écoles et les clubs",
    text: "Intervenir aux côtés de l’équipe dans les établissements scolaires et les clubs de sport.",
    profil: "Tous profils",
    bg: "bg-corail",
  },
  {
    title: "Participer aux actions de l’asso",
    text: "Donner un coup de main lors des événements, des initiations sportives et des journées solidaires.",
    profil: "Tous profils",
    bg: "bg-rose",
  },
  {
    title: "Représenter KOM’MEL",
    text: "Porter les couleurs de l’association lors de forums, salons et rencontres partenaires.",
    profil: "Tous profils",
    bg: "bg-vert-sauge",
  },
];

const etapes = [
  ["Tu nous écris", "Dis-nous quelle mission t’intéresse et tes disponibilités."],
  ["On échange", "Un premier contact avec l’équipe pour faire connaissance."],
  ["Tu t’engages", "Tu signes la charte d’engagement et tu remplis le formulaire d’inscription (bientôt disponibles)."],
];

export default function VolunteerPage() {
  return (
    <>
      <PageIntro eyebrow="Devenir bénévole" title="Donne de ton temps, révèle leur force." color="rose">
        Étudiant·e, professionnel·le, sportif·ve ou simplement motivé·e : chaque compétence compte pour accompagner
        les jeunes.
      </PageIntro>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="text-title leading-[0.9]">Nos missions</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {missions.map((m) => (
            <article key={m.title} className={`flex w-full flex-col sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-card border-2 border-brun p-7 shadow-dure-lg ${m.bg}`}>
              <h3 className="text-subtitle">{m.title}</h3>
              <p className="mt-4 flex-1 text-brun/80">{m.text}</p>
              <p className="mt-6 self-start rounded-pill bg-blanc/75 px-4 py-2 text-sm font-bold uppercase">{m.profil}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-pervenche px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-title leading-[0.9]">Comment ça se passe ?</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {etapes.map(([title, text], i) => (
              <li key={title} className="rounded-card border-2 border-brun bg-blanc p-7 shadow-dure-lg">
                <p className="font-display text-5xl font-extrabold text-corail">{i + 1}</p>
                <h3 className="mt-4 text-subtitle">{title}</h3>
                <p className="mt-3 text-brun/75">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <Link href="/contact?motif=benevolat" className="btn btn-primary">
              Je veux devenir bénévole →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
