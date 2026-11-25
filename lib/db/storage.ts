import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "./connection";

const ALLOWED = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

/**
 * Enregistre un fichier envoyé depuis l'admin dans DATA_DIR/uploads/<dossier>/
 * et renvoie son URL publique (servie par app/uploads/[...path]/route.ts).
 */
export async function saveUpload(folder: string, baseName: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  if (!ALLOWED.has(ext)) throw new Error("Format d'image non pris en charge.");
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "");
  const safeName = baseName.replace(/[^a-z0-9_-]/gi, "");
  // Suffixe horodaté : évite qu'un ancien fichier reste en cache navigateur
  const fileName = `${safeName}-${Date.now()}.${ext}`;
  const dir = path.join(UPLOADS_DIR, safeFolder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${safeFolder}/${fileName}`;
}
