"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NavItem } from "@/lib/site";

type MobileMenuProps = {
  items: NavItem[];
  supportHref: string;
  volunteerHref: string;
};

const tilts = ["-rotate-1", "rotate-1"];

export function MobileMenu({ items, supportHref, volunteerHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Ferme le menu à chaque changement de page
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const button = buttonRef.current;
    const panel = panelRef.current;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // Garde le focus dans le panneau
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen(true)}
        className="btn btn-moutarde btn-sm"
      >
        Menu
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-moutarde px-5 pt-5 pb-10"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Fermer
              </button>
            </div>

            <nav aria-label="Menu principal" className="mt-10 flex-1">
              <ul className="flex flex-col items-start gap-5">
                {items.map((item, i) => (
                  <li key={item.href} className={tilts[i % tilts.length]}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="inline-block rounded-pill border-2 border-brun bg-creme px-6 pt-3.5 pb-3 font-display text-3xl leading-none font-bold uppercase shadow-dure transition-transform duration-300 ease-(--ease-elastique) hover:-translate-y-1 hover:-rotate-2 hover:bg-rose active:scale-95 aria-[current=page]:bg-blanc"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={volunteerHref} onClick={() => setOpen(false)} className="btn btn-rose text-xl">
                Devenir bénévole
              </Link>
              <Link href={supportHref} onClick={() => setOpen(false)} className="btn btn-primary text-xl">
                Nous soutenir
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
