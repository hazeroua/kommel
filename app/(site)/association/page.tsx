import { Placeholder } from "@/components/decor/Placeholder";
import { PageIntro } from "@/components/sections/PageIntro";

export default function AssociationPage() {
  return <>
    <PageIntro eyebrow="L&apos;association" title="Comme elle. Comme toi. Comme nous." color="moutarde">
      KOM&apos;MEL est une association étudiante et citoyenne fondée par Melkia Auchecorne. Nous accompagnons les jeunes, et les jeunes filles en particulier, vers l&apos;émancipation par le sport et l&apos;éducation.
    </PageIntro>
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <Placeholder label="Portrait de Melkia" color="rose" className="aspect-[4/5] rotate-2 rounded-card shadow-dure-lg" />
      <div><p className="mb-4 font-display text-sm font-extrabold uppercase tracking-widest text-corail">Notre point de départ</p><h2 className="text-title leading-[0.9]">Le haut niveau donne des outils pour toute la vie.</h2><p className="mt-6 text-lead text-brun/75">Double championne du monde junior, championne de France et judokate de l&apos;équipe de France formée à l&apos;INSEP, Melkia transmet les apprentissages du haut niveau : discipline, persévérance, force mentale et solidarité.</p></div>
    </section>
    <section className="bg-pervenche px-5 py-16 sm:px-8 sm:py-24"><div className="mx-auto max-w-7xl"><h2 className="text-title leading-[0.9]">Nos trois piliers</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{[["Confiance en soi","Croire en ses capacités et trouver sa place.","bg-blanc"],["Dépassement de soi","Progresser, persévérer et se dépasser.","bg-corail"],["Transmission & solidarité","Créer du lien et inspirer les générations.","bg-rose"]].map(([title,text,bg])=><article key={title} className={`rounded-card border-2 border-brun p-7 shadow-dure-lg ${bg}`}><h3 className="text-subtitle">{title}</h3><p className="mt-4 text-brun/75">{text}</p></article>)}</div></div></section>
  </>;
}
