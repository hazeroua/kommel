# KOM'MEL — Phase 1 : Plan

## 1. Choix techniques

| Sujet | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js (App Router, dernière stable) + TypeScript strict | Demandé ; Server Components par défaut |
| Styles | Tailwind CSS v4 | Les tokens vivent dans un seul fichier CSS (`app/styles/tokens.css`, bloc `@theme`) → couleurs modifiables à un endroit |
| Animations | Motion (`motion/react`) | Voir option A/B ci-dessous |
| Défilement fluide | Lenis, désactivé si `prefers-reduced-motion` | Léger (~4 ko), améliore le rendu des sections pinnées |
| Base / Auth / fichiers | Supabase via `@supabase/ssr` | Sessions en cookies → droits vérifiés côté serveur |
| E-mails | Brevo pour newsletter **et** transactionnel | Un seul fournisseur, une seule clé, un seul tableau de bord pour l'asso |
| Validation | Zod, schémas partagés client/serveur dans `lib/validations/` | Une seule source de vérité |
| Anti-spam | Honeypot + limitation de débit + Turnstile optionnel | Voir option C |
| Éditeur riche | Tiptap (StarterKit + Link + Image) ; contenu stocké en JSON, rendu côté serveur | Pas de HTML brut stocké → pas de XSS |
| Hébergement | Vercel ; analytics Vercel Web Analytics (sans cookies) | Pas de bandeau cookies |

### Décisions ambiguës — 2 options chacune

**A. Scroll horizontal + cartes empilées**
- **A1 — Motion seul (recommandé)** : `position: sticky` + `useScroll` + `useTransform`. Une seule lib d'animation, ~30 ko de moins, cohérent avec le reste. Suffisant pour un pin simple.
- **A2 — Motion + GSAP ScrollTrigger** : pin plus robuste (gestion fine du redimensionnement, snap). GSAP est désormais gratuit, mais ajoute une 2ᵉ lib et deux modèles mentaux.

**B. Redimensionnement des images (admin)**
- **B1 — Côté navigateur avant upload (recommandé)** : compression en WebP ~1600 px avant envoi. Gratuit, rapide, upload léger. `next/image` génère ensuite AVIF/WebP aux bonnes tailles.
- **B2 — Côté serveur (sharp dans une server action)** : contrôle total, mais limite de taille de requête Vercel (4,5 Mo) et temps d'exécution facturé.

**C. Limitation de débit des formulaires**
- **C1 — Table Postgres + fonction SQL (recommandé)** : on compte les envois par IP hachée sur 10 min. Zéro service en plus.
- **C2 — Upstash Redis** : plus rapide et standard, mais un compte et une clé de plus à gérer.

**D. Fil Instagram**
- **D1 — Widget Behold (recommandé)** : JSON léger récupéré côté serveur, mis en cache 1 h, affiché avec nos propres composants. Offre gratuite suffisante. Nécessite un compte Instagram pro (créateur ou entreprise).
- **D2 — Pas d'API** : 6 posts « à la une » choisis dans l'admin (image + lien). Zéro dépendance, mais mise à jour manuelle.

## 2. Arborescence

```
kommel/
├─ app/
│  ├─ (site)/                      # layout public : header, footer, curseur, grain, Lenis
│  │  ├─ page.tsx                  # Accueil
│  │  ├─ association/page.tsx
│  │  ├─ actions/page.tsx
│  │  ├─ nous-soutenir/page.tsx
│  │  ├─ actualites/page.tsx
│  │  ├─ actualites/[slug]/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ mentions-legales/page.tsx
│  │  ├─ confidentialite/page.tsx
│  │  └─ styleguide/page.tsx       # noindex, interne
│  ├─ admin/                       # layout admin sobre, noindex
│  │  ├─ connexion/page.tsx        # lien magique
│  │  ├─ page.tsx                  # tableau de bord
│  │  ├─ actualites/ (liste, nouveau, [id])
│  │  ├─ temoignages/  chiffres/  partenaires/
│  │  ├─ demandes/ (liste filtrable, [id])
│  │  └─ messages/ (contact + partenariat)
│  ├─ auth/callback/route.ts       # échange du code Supabase
│  ├─ not-found.tsx                # « Ippon ! Cette page est au tapis. »
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx
│  └─ layout.tsx                   # polices next/font, métadonnées, JSON-LD NGO
├─ components/
│  ├─ ui/        Button, Pill, PillStack, Card, ValueCard, Bubble, Tag, HighlightLabel,
│  │             ChevronList, Field, Input, Select, Checkbox, Tabs, Dialog
│  ├─ sections/  Hero, WhoWeAre, Values, Actions, Impact, Testimonials, Partners,
│  │             FinalCta, Timeline, Team, Gallery, SupportBlocks…
│  ├─ decor/     Flower, Star, Blob, Wave, Marquee, MarqueeX, Sticker, StickerPhoto,
│  │             BlobMask, Duotone, Grain, Cursor, Placeholder
│  ├─ motion/    Reveal (variantes pop/rotate/slide/bounce), CountUp, ScrollStack,
│  │             HorizontalScroll, Parallax, MarkerUnderline, SmoothScroll
│  ├─ forms/     ContactForm, InterventionForm, PartnerForm, VolunteerForm, NewsletterForm
│  ├─ layout/    Header, MobileMenu, Footer
│  └─ admin/     AdminNav, DataTable, StatusBadge, ConfirmDelete, ImageUpload, RichEditor
├─ lib/
│  ├─ supabase/  server.ts, client.ts, admin.ts (service role, serveur uniquement)
│  ├─ brevo/     newsletter.ts, transactional.ts
│  ├─ validations/  contact.ts, intervention.ts, partner.ts, volunteer.ts, newsletter.ts, content.ts
│  ├─ auth.ts    requireAdmin()
│  ├─ rate-limit.ts  env.ts (variables validées par Zod)  utils.ts
├─ content/      textes statiques (valeurs, actions, palmarès, équipe)
├─ types/        database.ts (généré par Supabase), index.ts
├─ supabase/migrations/
├─ public/       brand/  images/  docs/
├─ proxy.ts (ou middleware.ts selon la version de Next) → protège /admin
├─ .env.example  README.md  eslint + prettier
```

## 3. Base de données (phase 6)

| Table | Lecture publique | Écriture |
|---|---|---|
| `admins` (email) | non | service role uniquement |
| `posts` (titre, slug, date, couverture, contenu JSON, statut, droit_image_ok) | si `statut = 'publie'` | admins |
| `testimonials` (citation, prénom, couleur, ordre, visible) | si `visible` | admins |
| `stats` (valeur, légende, couleur, ordre) | oui | admins |
| `partners` (nom, logo, lien, ordre) | oui | admins |
| `intervention_requests` | non | public : INSERT seul ; admins : tout |
| `contact_messages` (motif : contact / partenariat / bénévolat) | non | public : INSERT seul ; admins : tout |
| `rate_limits` | non | fonction SQL `security definer` |

- Fonction `is_admin()` (lit l'e-mail du JWT, vérifie `admins`) réutilisée dans toutes les politiques.
- Inscription publique désactivée dans Supabase Auth ; le lien magique n'est envoyé qu'aux e-mails de la liste blanche (vérification dans la server action avant l'envoi).
- Storage : bucket `public-images` (lecture publique, écriture admins).

## 4. Composition de l'accueil (pour casser la grille)

| # | Section | Fond | Procédés |
|---|---|---|---|
| 1 | Héro | crème | pilules en escalier, photo sticker, fleurs/étoiles en parallaxe, mot souligné au feutre |
| 2 | Séparateur | — | marquee incliné -3° |
| 3 | Qui sommes-nous | moutarde | photo détourée qui déborde, phrase géante, surlignage d'étiquette, bord ondulé |
| 4 | Valeurs | crème | cartes empilées au scroll (sticky), rotations différentes |
| 5 | Actions | pervenche | bento grid, photo en masque blob + duotone rose |
| 6 | Impact | crème | chiffres en quinconce, contour autocollant, compteurs |
| 7 | Témoignages | rose clair | scroll horizontal pinné → carrousel swipe sur mobile |
| — | Séparateur | — | **marquees croisés en X** (le moment fort) |
| 8 | Partenaires | crème | logos sur pastilles penchées |
| 9 | Bloc final | corail | 3 boutons, stickers déplaçables (easter egg desktop) |
| 10 | Footer | brun | texte crème, newsletter |

Stratégie de mouvement : les composants `motion/` lisent `useReducedMotion()` et basculent tous vers un simple fondu ; les formes décoratives arrêtent de tourner ; le curseur perso ne s'active que si `(hover: hover) and (pointer: fine)`.

## 5. Contraste (vérifié avec la formule WCAG)

| Combinaison | Ratio | Verdict |
|---|---|---|
| brun sur crème | ~11,5:1 | ✅ tout texte |
| brun sur moutarde | ~6,1:1 | ✅ tout texte |
| brun sur pervenche | ~4,6:1 | ✅ tout texte (juste) |
| brun sur rose | ~5,2:1 | ✅ tout texte |
| blanc sur bleu roi | ~7,4:1 | ✅ CTA |
| blanc sur corail | ~3,1:1 | ⚠️ grand texte gras uniquement |
| blanc sur pervenche / rose / moutarde | < 3:1 | ❌ à éviter |
| blanc sur vert sauge | ~3,4:1 | ⚠️ grand texte uniquement |

(Ratios recalculés précisément en phase 3 et affichés dans `/styleguide`.)

## 6. Variables d'environnement prévues

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          # serveur uniquement
BREVO_API_KEY                      # serveur uniquement
BREVO_LIST_ID
BREVO_DOI_TEMPLATE_ID
BREVO_DOI_REDIRECT_URL
NOTIFY_EMAIL                       # destinataire des demandes
NEXT_PUBLIC_HELLOASSO_WIDGET_URL
NEXT_PUBLIC_TURNSTILE_SITE_KEY     # optionnel
TURNSTILE_SECRET_KEY               # optionnel
BEHOLD_FEED_URL                    # si option D1
```

## 7. Étapes

1. Plan ← ici
2. Fondations : setup, tokens, 3 options de polices comparées, layout, header, footer
3. `/styleguide`
4. Accueil section par section
5. Autres pages publiques
6. Supabase : schéma, migrations, RLS, branchement
7. Admin
8. Brevo : newsletter double opt-in + notifications
9. Finitions + audit Lighthouse mobile
10. Revue de sécurité

## 8. Ce qu'il me faut de ton côté (pas bloquant avant la phase 4)

- Le logo (SVG idéalement) dans `public/brand/`
- Les photos (au moins Melkia détourée en PNG transparent)
- La brochure PDF pour caler les couleurs exactes
- Confirmation du compte Instagram/Facebook
- Plus tard : URL du widget HelloAsso, comptes Supabase et Brevo
