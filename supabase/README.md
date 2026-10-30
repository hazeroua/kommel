# Supabase — KOM'MEL

## Mise en place

### 1. Créer le projet Supabase

1. Aller sur [app.supabase.com](https://app.supabase.com) → **New project**
2. Choisir un nom (ex. `kommel`) et une région EU (Paris ou Frankfurt)
3. Copier les clés dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   # jamais exposée côté client
   ```

### 2. Appliquer les migrations

Dans le **SQL Editor** de Supabase, coller et exécuter **dans l'ordre** :

- `supabase/migrations/001_schema.sql` — tables, RLS, fonctions
- `supabase/migrations/002_seed_demo.sql` *(dev/staging seulement)*

### 3. Créer le bucket Storage

1. Aller dans **Storage** → **Create a new bucket**
2. Nom : `public-images`, cocher **Public bucket** ✅
3. Appliquer les politiques (en bas du fichier `001_schema.sql`,
   les lignes commentées sous `Storage bucket`) dans le SQL Editor
   après avoir créé le bucket.

### 4. Ajouter un premier admin

```sql
-- Après qu'un compte ait été créé via la magic-link :
INSERT INTO public.admins (id, email)
VALUES ('<uuid-de-l-utilisateur>', 'ton@email.fr');
```

L'UUID se trouve dans **Authentication** → **Users**.

### 5. Activer l'envoi d'e-mails magic-link

Dans **Authentication** → **Providers** → **Email** :
- Activer **Magic Link** ✅
- Désactiver **Email confirmation** *(la magie link confirme déjà)*

Dans **Authentication** → **URL Configuration** :
- `Site URL` : `https://ton-domaine.fr` (ou `http://localhost:3200` en dev)
- Ajouter dans **Redirect URLs** : `http://localhost:3200/**`

---

## Structure des tables

| Table | Description |
|---|---|
| `admins` | Utilisateurs autorisés à accéder au back-office |
| `posts` | Articles publiés (actualités & événements) |
| `testimonials` | Témoignages affichés sur l'accueil |
| `key_stats` | Chiffres clés de l'accueil |
| `partners` | Logos et liens des partenaires |
| `instagram_posts` | Cache manuel des posts Instagram |
| `intervention_requests` | Formulaires de demande d'intervention |
| `contact_messages` | Messages de contact, partenariat, bénévolat |
| `rate_limits` | Compteurs anti-spam par heure (via RPC) |

## Sécurité

- **RLS activée sur toutes les tables** — lecture publique limitée au strict nécessaire
- `is_admin()` est une fonction `SECURITY DEFINER` qui vérifie l'UUID JWT sans exposer la table admins
- `check_rate_limit()` est `SECURITY DEFINER` — inaccessible directement en SQL client
- La `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais être importée dans un composant `"use client"`
