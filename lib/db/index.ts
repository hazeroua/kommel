import "server-only";
import { getConnection } from "./connection";
import { createQueryClient, type QueryClient } from "./query";

export { DATA_DIR, UPLOADS_DIR } from "./connection";

/** Accès à la base SQLite (dans DATA_DIR). */
export function getDb(): QueryClient {
  return createQueryClient(getConnection());
}

/** Accès brut pour les cas particuliers (transactions, requêtes spécifiques). */
export { getConnection };
