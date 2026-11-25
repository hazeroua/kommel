import type { Metadata } from "next";
import { deleteSubscriber } from "@/app/actions/admin-newsletter";
import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { CopyEmails } from "./CopyEmails";

export const metadata: Metadata = { title: "Newsletter" };
export const dynamic = "force-dynamic";

type Subscriber = { id: string; email: string; first_name: string | null; created_at: string };

export default async function NewsletterPage() {
  await requireAdmin();
  const { data } = await getDb()
    .from("newsletter_subscribers")
    .select("id,email,first_name,created_at")
    .order("created_at", { ascending: false });
  const subscribers = (data ?? []) as Subscriber[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Newsletter</h1>
          <p className="mt-1 text-brun/70">
            {subscribers.length} inscrit{subscribers.length > 1 ? "·es" : "·e"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyEmails emails={subscribers.map((s) => s.email)} />
          <a href="/admin/newsletter/export" className="btn btn-primary btn-sm">
            Exporter en CSV
          </a>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-brun/30 py-16 text-center text-brun/50">
          <p>Aucune inscription pour l&apos;instant.</p>
          <p className="mt-2 text-sm">Les inscriptions du formulaire en bas du site apparaîtront ici.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border-2 border-brun bg-blanc shadow-dure">
          <table className="w-full text-left text-sm">
            <thead className="border-b-2 border-brun bg-creme/50 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Prénom</th>
                <th className="px-4 py-3">Inscription</th>
                <th className="px-4 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-brun/10 last:border-0">
                  <td className="px-4 py-3 font-medium break-all">{s.email}</td>
                  <td className="px-4 py-3">{s.first_name || <span className="text-brun/40">—</span>}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-brun/70">
                    {new Date(s.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteSubscriber}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="text-xs font-bold text-brun/50 hover:text-corail">
                        Désinscrire
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
