import Link from "next/link";
import { mainNav, supportHref, volunteerHref } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  // Marge négative = hauteur du header : la couleur de la première section remonte jusqu'en haut, sous le header.
  return (
    <header className="site-header sticky top-0 z-40 -mb-18 px-3 pt-3 sm:-mb-20 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-pill border-2 border-brun bg-blanc/95 py-2 pr-2 pl-3 shadow-dure backdrop-blur-sm sm:pl-4">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <NavLinks items={mainNav} />
        </nav>

        <div className="flex items-center gap-2">
          <Link href={volunteerHref} className="btn btn-rose btn-sm hidden md:inline-flex">
            Devenir bénévole
          </Link>
          <Link href={supportHref} className="btn btn-primary btn-sm hidden sm:inline-flex">
            Nous soutenir
          </Link>
          <MobileMenu items={mainNav} supportHref={supportHref} volunteerHref={volunteerHref} />
        </div>
      </div>
    </header>
  );
}
