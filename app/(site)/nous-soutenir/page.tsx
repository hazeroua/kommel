import Link from "next/link";
import { BrochureLink } from "@/components/sections/BrochureLink";
import { PageIntro } from "@/components/sections/PageIntro";
import { site, volunteerHref } from "@/lib/site";

export default function SupportPage() {
  const donate = site.helloAssoUrl;
  const cards = [
    {
      title: "Adhérer ou faire un don",
      text: "Adhérer ou faire un don via notre page HelloAsso, pour soutenir directement nos actions.",
      bg: "bg-moutarde",
      href: donate || null,
      cta: "Soutenir sur HelloAsso →",
      external: true,
    },
    {
      title: "Devenir partenaire",
      text: "Visibilité locale, image engagée et participation à un projet à impact.",
      bg: "bg-pervenche",
      href: "/contact?motif=partenariat",
      cta: "Nous contacter →",
      external: false,
    },
    {
      title: "Devenir bénévole",
      text: "Aide aux devoirs, ateliers orientation, événements : découvrez nos missions.",
      bg: "bg-rose",
      href: volunteerHref,
      cta: "Voir les missions →",
      external: false,
    },
  ];

  return (
    <>
      <PageIntro eyebrow="Nous soutenir" title="Chaque geste compte." color="corail">
        Votre soutien permet de financer les interventions, le matériel et les nouvelles actions de KOM&apos;MEL.
      </PageIntro>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.title} className={`flex flex-col rounded-card border-2 border-brun p-8 shadow-dure-lg ${c.bg}`}>
              <h2 className="text-subtitle">{c.title}</h2>
              <p className="mt-4 flex-1 text-brun/75">{c.text}</p>
              {c.href ? (
                c.external ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="link-feutre mt-8 inline-block font-bold">
                    {c.cta}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                ) : (
                  <Link href={c.href} className="link-feutre mt-8 inline-block font-bold">
                    {c.cta}
                  </Link>
                )
              ) : (
                <p className="mt-8 font-bold text-brun/70">Cagnotte bientôt en ligne</p>
              )}
            </article>
          ))}
        </div>

        <div className="on-dark mt-12 flex flex-col items-start gap-6 rounded-bento bg-brun p-8 text-creme sm:p-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-title leading-[0.9]">Le dossier KOM&apos;MEL.</h2>
            <p className="mt-5 max-w-2xl text-lead text-creme/75">
              Toutes les infos sur l&apos;association et nos besoins, à télécharger ou à partager à votre entreprise,
              votre club ou votre établissement.
            </p>
          </div>
          <BrochureLink className="btn btn-moutarde shrink-0" />
        </div>
      </section>
    </>
  );
}
