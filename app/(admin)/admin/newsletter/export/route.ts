import { getAdminSession } from "@/lib/auth/server";
import { getDb } from "@/lib/db";

/** Export CSV des inscrits (ouvrable dans Excel / importable dans Brevo). */
export async function GET() {
  if (!(await getAdminSession())) return new Response("Non autorisé", { status: 401 });
  const { data } = await getDb()
    .from("newsletter_subscribers")
    .select("email,first_name,created_at")
    .order("created_at", { ascending: false });

  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    "email;prenom;date_inscription",
    ...(data ?? []).map((r) => [r.email, r.first_name, r.created_at].map(esc).join(";")),
  ];
  // BOM pour qu'Excel lise correctement les accents
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-kommel-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
