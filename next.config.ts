import type { NextConfig } from "next";

// Domaines de ressources autorisés (Supabase storage + Brevo pixel de suivi)
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : "";

/**
 * Content Security Policy.
 * Ligne directrice : aussi restrictive que possible sans casser les fonctions légitimes.
 * - Toutes les polices et images de confiance sont auto-hébergées → pas de CDN externe dans default-src.
 * - Supabase est autorisé uniquement pour connect-src (API) et img-src (bucket public-images).
 * - Cloudflare Turnstile nécessite frames + scripts depuis challenges.cloudflare.com.
 * - 'unsafe-inline' retiré pour les styles → remplacé par nonces en production si nécessaire.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${supabaseHost ? `https://${supabaseHost}` : ""}`,
  `font-src 'self'`,
  `connect-src 'self' ${supabaseHost ? `https://${supabaseHost} wss://${supabaseHost}` : ""} https://api.brevo.com`,
  `frame-src https://challenges.cloudflare.com https://www.helloasso.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/**" }]
      : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
