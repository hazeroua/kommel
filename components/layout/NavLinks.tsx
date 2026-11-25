"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/site";

/**
 * Liens de navigation desktop.
 * Survol : surlignage rose qui se déroule + léger soulèvement du texte.
 * Page active : surlignage moutarde permanent.
 */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="group relative isolate inline-block px-3 py-2 font-semibold"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-1 top-2 bottom-1.5 -z-10 origin-left -rotate-2 rounded-sm transition-transform duration-300 ease-(--ease-elastique) ${
                  active ? "scale-x-100 bg-moutarde" : "scale-x-0 bg-rose group-hover:scale-x-100 group-focus-visible:scale-x-100"
                }`}
              />
              <span className="inline-block transition-transform duration-300 ease-(--ease-elastique) group-hover:-translate-y-0.5 group-hover:-rotate-2">
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
