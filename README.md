# KOM'MEL — site web

Site de l'association KOM'MEL : « Révéler la force des jeunes par le sport ».

Stack : Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · Motion + GSAP ScrollTrigger · Supabase · Brevo · Zod · Vercel.

## Installation

Prérequis : Node.js 20 ou plus.

```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run dev                  # http://localhost:3000
```

## Scripts

| Commande            | Rôle                               |
| ------------------- | ---------------------------------- |
| `npm run dev`       | serveur de développement           |
| `npm run build`     | build de production                |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | vérification TypeScript            |
| `npm run format`    | Prettier (classes Tailwind triées) |

## Où modifier quoi

- **Couleurs, tailles de texte, rayons, ombres** : `app/styles/tokens.css` (un seul fichier).
- **Polices** : fichiers dans `app/fonts/`, déclarées dans `lib/fonts.ts`. Combinaison retenue : Gluten (titres) + Nunito (texte).
- **Coordonnées, réseaux, menu** : `lib/site.ts`.
- **Logo** : à déposer dans `public/brand/`, puis brancher dans `components/layout/Logo.tsx`.

## Variables d'environnement

Voir `.env.example`. Les clés `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY` et `TURNSTILE_SECRET_KEY` ne doivent jamais être préfixées par `NEXT_PUBLIC_`.

## À venir

Création du premier admin et déploiement : documentés en phases 6 à 9.
