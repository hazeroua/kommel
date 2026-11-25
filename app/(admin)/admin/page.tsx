import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

/** Dashboard admin : compteurs lus directement dans la base. */
async function getStats() {
  await requireAdmin();
  const db = getDb();

  const [posts, testimonials, stats, demandes, messages] = await Promise.all([
    db.from("posts").select("id", { count: "exact", head: true }),
    db.from("testimonials").select("id", { count: "exact", head: true }),
    db.from("key_stats").select("id", { count: "exact", head: true }),
    db.from("intervention_requests").select("status", { count: "exact" }),
    db.from("contact_messages").select("status", { count: "exact" }),
  ]);

  const nouvelleDemandes = (demandes.data ?? []).filter(
    (d) => d.status === "nouvelle",
  ).length;
  const nouveauxMessages = (messages.data ?? []).filter(
    (m) => m.status === "nouvelle",
  ).length;

  return {
    posts: posts.count ?? 0,
    testimonials: testimonials.count ?? 0,
    stats: stats.count ?? 0,
    demandes: demandes.count ?? 0,
    messages: messages.count ?? 0,
    nouvelleDemandes,
    nouveauxMessages,
  };
}

const sections = [
  { href: "/admin/posts", label: "Publications", emoji: "📝", key: "posts" as const },
  { href: "/admin/testimonials", label: "Témoignages", emoji: "💬", key: "testimonials" as const },
  { href: "/admin/stats", label: "Chiffres clés", emoji: "📊", key: "stats" as const },
  { href: "/admin/demandes", label: "Demandes d'intervention", emoji: "📋", key: "demandes" as const },
  { href: "/admin/messages", label: "Messages", emoji: "✉️", key: "messages" as const },
];

export default async function AdminDashboardPage() {
  const data = await getStats();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase">Tableau de bord</h1>

      {data && (
        <>
          {(data.nouvelleDemandes > 0 || data.nouveauxMessages > 0) && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {data.nouvelleDemandes > 0 && (
                <Link
                  href="/admin/demandes"
                  className="rounded-card border-2 border-corail bg-corail/10 p-5 transition-colors hover:bg-corail/20"
                >
                  <p className="text-2xl font-black text-corail">{data.nouvelleDemandes}</p>
                  <p className="mt-1 font-bold text-corail">
                    nouvelle{data.nouvelleDemandes > 1 ? "s" : ""} demande
                    {data.nouvelleDemandes > 1 ? "s" : ""}
                  </p>
                </Link>
              )}
              {data.nouveauxMessages > 0 && (
                <Link
                  href="/admin/messages"
                  className="rounded-card border-2 border-bleu bg-bleu/10 p-5 transition-colors hover:bg-bleu/20"
                >
                  <p className="text-2xl font-black text-bleu">{data.nouveauxMessages}</p>
                  <p className="mt-1 font-bold text-bleu">
                    nouveau{data.nouveauxMessages > 1 ? "x" : ""} message
                    {data.nouveauxMessages > 1 ? "s" : ""}
                  </p>
                </Link>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-card border-2 border-brun/20 bg-blanc p-6 transition-all hover:border-brun hover:shadow-dure"
              >
                <span className="text-3xl">{s.emoji}</span>
                <p className="mt-3 font-display text-xl font-bold uppercase">{s.label}</p>
                <p className="mt-1 text-3xl font-black text-corail">{data[s.key]}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
