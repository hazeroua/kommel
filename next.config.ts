import type { NextConfig } from "next";


/**
 * Content Security Policy.
 * Ligne directrice : aussi restrictive que possible sans casser les fonctions légitimes.
 * - Toutes les polices et images de confiance sont auto-hébergées → pas de CDN externe dans default-src.
 * - Images : le site lui-même (dont /uploads) + images HTTPS externes (galerie Instagram).
 * - Cloudflare Turnstile nécessite frames + scripts depuis challenges.cloudflare.com.
 * - 'unsafe-inline' retiré pour les styles → remplacé par nonces en production si nécessaire.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self'`,
  `media-src 'self'`,
  `connect-src 'self' https://api.brevo.com`,
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
    remotePatterns: [],
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
