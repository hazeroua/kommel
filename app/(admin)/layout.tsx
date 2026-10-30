import type { Metadata } from "next";
import React from "react";
import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: { default: "Administration — KOM'MEL", template: "%s — Admin KOM'MEL" },
  robots: { index: false, follow: false },
};

/** Layout minimal pour l'espace admin (connexion + toutes les pages /admin). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="bg-creme text-brun text-[15px] antialiased">{children}</body>
    </html>
  );
}
