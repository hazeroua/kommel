import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import type { Post } from "@/types";

export const metadata: Metadata = { title: "Articles" };

const statusLabel: Record<Post["status"], string> = {
  brouillon: "Brouillon",
  publie: "Publié",
};
const statusColor: Record<Post["status"], string> = {
  brouillon: "bg-moutarde/20 text-moutarde",
  publie: "bg-vert-sauge/20 text-vert-sauge",
};
const kindLabel: Record<Post["kind"], string> = {
  actualite: "Actualité",
  evenement: "Événement",
};

async function getPosts() {
  await requireAdmin();
  const db = getDb();
  const { data } = await db
    .from("posts")
    .select("id,title,slug,kind,status,published_on")
    .order("published_on", { ascending: false });
  return (data ?? []) as Pick<Post, "id" | "title" | "slug" | "kind" | "status" | "published_on">[];
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase">Articles</h1>
        <Link href="/admin/posts/nouveau" className="btn btn-primary">
          + Nouvel article
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-brun/30 py-16 text-center text-brun/50">
          <p className="text-lg font-medium">Aucun article pour l&apos;instant.</p>
          <Link href="/admin/posts/nouveau" className="mt-3 inline-block text-corail underline">
            Créer le premier article
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border-2 border-brun shadow-dure">
          <table className="w-full text-sm">
            <thead className="bg-brun text-blanc">
              <tr>
                <th className="px-4 py-3 text-left font-bold uppercase">Titre</th>
                <th className="hidden px-4 py-3 text-left font-bold uppercase sm:table-cell">Type</th>
                <th className="hidden px-4 py-3 text-left font-bold uppercase md:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-bold uppercase">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-brun/10 bg-blanc">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-creme/40 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <span className="line-clamp-1">{p.title}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-brun/60 sm:table-cell">
                    {kindLabel[p.kind]}
                  </td>
                  <td className="hidden px-4 py-3 text-brun/60 md:table-cell">
                    {new Date(p.published_on).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[p.status]}`}
                    >
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/posts/${p.id}`}
                      className="font-medium text-pervenche underline hover:text-brun"
                    >
                      Modifier
                    </Link>
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
