import Link from "next/link";
import { PageIntro } from "@/components/sections/PageIntro";
import { getDb } from "@/lib/db";
import { postKindLabels } from "@/types";

export const revalidate = 0;

type PostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  kind: "actualite" | "evenement";
  cover_url: string | null;
  cover_alt: string;
  published_on: string;
};

async function getPublishedPosts(): Promise<PostCard[]> {
  const db = getDb();
  if (!db) return [];
  const { data, error } = await db
    .from("posts")
    .select("id,slug,title,excerpt,kind,cover_url,cover_alt,published_on")
    .eq("status", "publie")
    .order("published_on", { ascending: false })
    .limit(60);
  if (error) {
    console.error("[actualites] fetch error", error.message);
    return [];
  }
  return (data ?? []) as PostCard[];
}

export default async function ActualitesPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageIntro
        eyebrow="Le journal KOM'MEL"
        title="Des nouvelles qui donnent envie d&apos;oser."
        color="rose"
      >
        Retrouvez les actualités, les événements et les histoires de l&apos;association.
      </PageIntro>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        {posts.length === 0 ? (
          <p className="text-center text-brun/60">
            Les premières actualités arrivent bientôt. Revenez prochainement&nbsp;!
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className={`rounded-card border-2 border-brun p-7 shadow-dure-lg ${i % 3 === 0 ? "bg-moutarde" : "bg-blanc"}`}
              >
                <p className="font-display text-sm font-extrabold uppercase tracking-widest text-corail">
                  {postKindLabels[post.kind]}
                </p>
                <h2 className="mt-5 text-subtitle">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-4 text-brun/70">{post.excerpt}</p>
                )}
                <Link
                  href={`/actualites/${post.slug}`}
                  className="link-feutre mt-8 inline-block font-bold"
                >
                  Lire l&apos;article →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
