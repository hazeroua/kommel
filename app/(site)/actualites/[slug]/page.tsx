import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/sections/PageIntro";
import { getDb } from "@/lib/db";
import { postKindLabels, type RichNode } from "@/types";

export const revalidate = 0;

type PostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  kind: "actualite" | "evenement";
  cover_url: string | null;
  cover_alt: string;
  content: RichNode | null;
  published_on: string;
};

async function getPost(slug: string): Promise<PostDetail | null> {
  const db = getDb();
  if (!db) return null;
  const { data, error } = await db
    .from("posts")
    .select("id,slug,title,excerpt,kind,cover_url,cover_alt,content,published_on")
    .eq("slug", slug)
    .eq("status", "publie")
    .maybeSingle();
  if (error) {
    console.error("[actualite] fetch error", error.message);
    return null;
  }
  return (data as PostDetail | null) ?? null;
}

/** Vrai si le document Tiptap contient au moins un texte. */
function hasText(node: RichNode | null): boolean {
  if (!node) return false;
  if (node.type === "text") return Boolean(node.text?.trim());
  return (node.content ?? []).some(hasText);
}

function renderNode(node: RichNode, key: string): React.ReactNode {
  if (node.type === "text") {
    let el: React.ReactNode = node.text ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") el = <strong key={key + "b"}>{el}</strong>;
      else if (mark.type === "italic") el = <em key={key + "i"}>{el}</em>;
      else if (mark.type === "link") {
        const href = String((mark.attrs?.href as string | undefined) ?? "#");
        el = (
          <a
            key={key + "l"}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-feutre"
          >
            {el}
          </a>
        );
      }
    }
    return <span key={key}>{el}</span>;
  }
  const children = (node.content ?? []).map((c, i) => renderNode(c, `${key}-${i}`));
  switch (node.type) {
    case "doc":
      return <>{children}</>;
    case "paragraph":
      return <p key={key} className="mt-5">{children}</p>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const className = "mt-8 font-display font-extrabold text-subtitle";
      if (level === 1) return <h1 key={key} className={className}>{children}</h1>;
      if (level === 2) return <h2 key={key} className={className}>{children}</h2>;
      if (level === 3) return <h3 key={key} className={className}>{children}</h3>;
      return <h4 key={key} className={className}>{children}</h4>;
    }
    case "bulletList":
      return <ul key={key} className="mt-5 list-disc space-y-2 pl-6">{children}</ul>;
    case "orderedList":
      return <ol key={key} className="mt-5 list-decimal space-y-2 pl-6">{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key} className="mt-6 border-l-4 border-brun pl-4 italic">{children}</blockquote>;
    case "hardBreak":
      return <br key={key} />;
    default:
      return <>{children}</>;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const date = new Date(post.published_on).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageIntro eyebrow={postKindLabels[post.kind]} title={post.title} color="moutarde">
        {post.excerpt || `Publié le ${date}`}
      </PageIntro>

      <article className="mx-auto max-w-3xl px-5 py-16 text-lg sm:px-8 sm:py-24">
        {post.cover_url && (
          <img
            src={post.cover_url}
            alt={post.cover_alt || post.title}
            className="mb-10 w-full rounded-card border-2 border-brun shadow-dure-lg"
          />
        )}
        <p className="text-sm font-semibold uppercase tracking-wide text-brun/60">
          {date}
        </p>
        {hasText(post.content) && post.content ? (
          <div className="mt-6">{renderNode(post.content, "r")}</div>
        ) : (
          <p className="mt-6 text-brun/70">
            Cet article sera bientôt enrichi. Revenez prochainement !
          </p>
        )}
        <Link href="/actualites" className="btn btn-secondary mt-10">
          ← Toutes les actualités
        </Link>
      </article>
    </>
  );
}
