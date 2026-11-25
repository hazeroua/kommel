import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";

/** URL publique de la brochure, ou null tant que le PDF n'a pas été déposé dans public/docs/. */
export function getBrochureHref(): string | null {
  const file = path.join(process.cwd(), "public", "docs", site.brochureFile);
  return existsSync(file) ? `/docs/${site.brochureFile}` : null;
}
