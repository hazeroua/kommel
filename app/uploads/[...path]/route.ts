import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/db";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

/** Sert les fichiers de DATA_DIR/uploads (images envoyées depuis l'admin). */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const root = path.resolve(UPLOADS_DIR);
  const file = path.resolve(root, ...parts);
  // Empêche de sortir du dossier uploads (../)
  if (!file.startsWith(root + path.sep)) return new Response("Introuvable", { status: 404 });

  const type = TYPES[path.extname(file).slice(1).toLowerCase()];
  if (!type) return new Response("Introuvable", { status: 404 });

  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error();
    return new Response(new Uint8Array(await readFile(file)), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(info.size),
        // Noms de fichiers horodatés → cache long sans risque
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
