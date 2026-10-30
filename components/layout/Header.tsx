import Link from "next/link";
import { mainNav, supportHref } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-pill border-2 border-brun bg-blanc/95 py-2 pr-2 pl-3 shadow-dure backdrop-blur-sm sm:pl-4">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <NavLinks items={mainNav} />
        </nav>

        <div className="flex items-center gap-2">
          <Link href={supportHref} className="btn btn-primary btn-sm hidden sm:inline-flex">
            Nous soutenir
          </Link>
          <MobileMenu items={mainNav} supportHref={supportHref} />
        </div>
      </div>
    </header>
  );
}
