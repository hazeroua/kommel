import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { WaveEdge } from "@/components/decor/WaveEdge";
import { legalNav, mainNav, site, supportHref } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative mt-24 text-creme">
      <WaveEdge fillClassName="fill-brun" className="-mb-px" />

      <div className="bg-brun px-5 pt-10 pb-8 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-4xl font-display text-display font-bold uppercase">
            Révéler la force des jeunes{" "}
            <span className="inline-block -rotate-2 rounded-pill bg-moutarde px-[0.25em] pt-[0.08em] text-brun">
              par le sport
            </span>
          </p>

          <div className="mt-14 grid gap-12 md:grid-cols-12">
            <section aria-labelledby="footer-newsletter" className="md:col-span-6 lg:col-span-5">
              <h2 id="footer-newsletter" className="text-subtitle">
                La newsletter
              </h2>
              <p className="mt-2 mb-5 max-w-md text-creme/85">
                Nos interventions, nos événements et les nouvelles de l&apos;équipe, quelques fois
                par an.
              </p>
              <NewsletterForm />
            </section>

            <section aria-labelledby="footer-contact" className="md:col-span-3 lg:col-start-7">
              <h2 id="footer-contact" className="text-subtitle">
                Contact
              </h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href={site.contact.phoneHref} className="link-feutre">
                    {site.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.contact.email}`} className="link-feutre break-all">
                    {site.contact.email}
                  </a>
                </li>
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Réseaux sociaux">
                {site.socials.map((s, i) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block rounded-pill bg-creme px-4 py-2 font-display text-sm font-bold text-brun uppercase transition-transform duration-300 ease-(--ease-elastique) hover:-rotate-3 ${i % 2 ? "rotate-2" : "-rotate-1"}`}
                    >
                      {s.label}
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <nav aria-labelledby="footer-plan" className="md:col-span-3 lg:col-span-2">
              <h2 id="footer-plan" className="text-subtitle">
                Le site
              </h2>
              <ul className="mt-3 space-y-2">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-feutre">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={supportHref} className="link-feutre">
                    Nous soutenir
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t-2 border-dashed border-creme/25 pt-6 text-sm text-creme/80 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {site.name}, association loi 1901
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-feutre">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
