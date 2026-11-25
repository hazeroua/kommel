"use client";

import { usePathname } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";

/**
 * Transition entre pages (View Transitions API, via React).
 * La clé change à chaque page : l'ancienne sort (classe `page-exit`), la nouvelle entre (`page-enter`).
 * Animations définies dans globals.css. Navigateurs non compatibles : changement instantané, sans erreur.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
