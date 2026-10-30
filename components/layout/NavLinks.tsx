"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/site";

/** Liens de navigation desktop ; la page active reçoit un surlignage penché. */
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
              className="group relative inline-block px-3 py-2 font-semibold"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-1 top-2 bottom-1.5 -z-10 -rotate-2 rounded-sm bg-moutarde transition-transform duration-300 ease-(--ease-elastique) ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                } origin-left`}
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
