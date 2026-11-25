# KOM'MEL — site web

Site de l'association KOM'MEL : « Révéler la force des jeunes par le sport ».

Stack : Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · Motion + GSAP ScrollTrigger · SQLite (`node:sqlite`) · Brevo · Zod · Railway.

## Installation

Prérequis : Node.js 22.13 ou plus (SQLite intégré à Node).

```bash
npm install
cp .env.example .env.local   # puis remplir ADMIN_EMAIL / ADMIN_PASSWORD
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

Voir `.env.example`. Les clés `AUTH_SECRET`, `ADMIN_PASSWORD`, `BREVO_API_KEY` et `TURNSTILE_SECRET_KEY` ne doivent jamais être préfixées par `NEXT_PUBLIC_`.

## Données

Tout est stocké dans un seul dossier, `DATA_DIR` :

- `kommel.db` : base SQLite (articles, témoignages, chiffres, messages, demandes, admins) ;
- `uploads/` : images envoyées depuis l'admin, servies sous `/uploads/...`.

Par défaut `DATA_DIR` vaut `/data` en production et `./data` en développement (ignoré par git).
Le schéma est créé automatiquement au démarrage (`lib/db/schema.ts`).
**Sauvegarde** = copier ce dossier.

## Administration

- Le compte admin est créé au démarrage à partir de `ADMIN_EMAIL` et `ADMIN_PASSWORD`.
- Pour changer le mot de passe : modifier `ADMIN_PASSWORD` puis redémarrer.
- Connexion sur `/connexion`, session signée avec `AUTH_SECRET` (7 jours).

## Déploiement sur Railway

1. Créer un service à partir du dépôt GitHub (build `npm run build`, démarrage `npm run start` : détectés automatiquement).
2. **Ajouter un volume** au service, monté sur **`/data`** (sinon les données sont perdues à chaque déploiement).
3. Variables : `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` (`openssl rand -hex 32`), `NEXT_PUBLIC_SITE_URL`, puis Brevo / Turnstile si utilisés.
4. Une seule instance (SQLite ne se partage pas entre plusieurs répliques).
# kommel
