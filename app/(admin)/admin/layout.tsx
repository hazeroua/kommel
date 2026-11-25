import type { ReactNode } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/posts", label: "Publications" },
  { href: "/admin/testimonials", label: "Témoignages" },
  { href: "/admin/stats", label: "Chiffres clés" },
  { href: "/admin/demandes", label: "Demandes" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/instagram", label: "Instagram" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell flex min-h-screen flex-col">
      {/* Barre de navigation */}
      <header className="border-b-2 border-brun bg-blanc">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <Link
            href="/admin"
            className="font-display text-lg font-black uppercase tracking-tight text-brun"
          >
            KOM&apos;MEL <span className="text-corail">Admin</span>
          </Link>
          <nav className="flex flex-1 gap-4 overflow-x-auto">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="whitespace-nowrap text-sm font-medium text-brun/70 transition-colors hover:text-brun"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm font-medium text-brun/50 transition-colors hover:text-corail"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
