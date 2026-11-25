import { getDb } from "@/lib/db";

type IgPost = {
  id: string;
  image_url: string;
  permalink: string;
  alt: string;
};

export async function InstagramGrid() {
  let posts: IgPost[] = [];

  try {
    const db = getDb();
    if (db) {
      const { data } = await db
        .from("instagram_posts")
        .select("id,image_url,permalink,alt")
        .order("sort_order")
        .limit(6);
      if (data?.length) posts = data as IgPost[];
    }
  } catch {
    // Base indisponible : on garde les visuels par défaut
  }

  if (posts.length === 0) return null; // rien à afficher si vide

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-display text-sm font-extrabold uppercase tracking-widest text-brun/60">
              Suivez l&apos;aventure
            </p>
            <h2 className="text-title leading-[0.9]">Sur Instagram</h2>
          </div>
          <a
            href="https://www.instagram.com/associationkommel"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary shrink-0"
          >
            @kommel_asso →
          </a>
        </div>

        {/* Grille 6 cases */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, i) =>
            post.permalink ? (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-card border-2 border-brun shadow-dure transition-transform duration-300 hover:-translate-y-1 hover:shadow-dure-lg"
                aria-label={post.alt || `Post Instagram ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image_url}
                  alt={post.alt || ""}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {post.alt && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brun/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="line-clamp-3 text-xs font-semibold text-blanc">{post.alt}</p>
                  </div>
                )}
              </a>
            ) : (
              <div
                key={post.id}
                className="group relative aspect-square overflow-hidden rounded-card border-2 border-brun shadow-dure"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image_url}
                  alt={post.alt || ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
