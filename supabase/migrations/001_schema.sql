-- =============================================================
-- KOM'MEL — Migration 001 : Schéma initial
-- Créé pour Supabase (PostgreSQL 15+)
-- À appliquer dans l'ordre depuis le SQL Editor de Supabase.
-- =============================================================

-- ---------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- ---------------------------------------------------------------
-- Helpers d'authentification
-- ---------------------------------------------------------------

/**
 * is_admin() — vrai si l'utilisateur JWT est dans la table admins.
 */
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------
-- Table : admins
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
  id   uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_self_read"
  ON public.admins FOR SELECT
  USING (id = auth.uid());

-- ---------------------------------------------------------------
-- Table : posts (actualités & événements)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  slug          text        NOT NULL UNIQUE,
  excerpt       text        NOT NULL DEFAULT '',
  kind          text        NOT NULL DEFAULT 'actualite'
                            CHECK (kind IN ('actualite', 'evenement')),
  status        text        NOT NULL DEFAULT 'brouillon'
                            CHECK (status IN ('brouillon', 'publie')),
  published_on  date        NOT NULL DEFAULT CURRENT_DATE,
  cover_url     text,
  cover_alt     text        NOT NULL DEFAULT '',
  content       jsonb,
  image_rights_ok boolean   NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_public_read"
  ON public.posts FOR SELECT
  USING (status = 'publie');

CREATE POLICY "posts_admin_all"
  ON public.posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- Table : testimonials (témoignages)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  quote      text        NOT NULL,
  author     text        NOT NULL,
  color      text        NOT NULL DEFAULT 'corail',
  visible    boolean     NOT NULL DEFAULT true,
  sort_order int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_public_read"
  ON public.testimonials FOR SELECT
  USING (visible = true);

CREATE POLICY "testimonials_admin_all"
  ON public.testimonials FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------
-- Table : key_stats (chiffres clés de la page d'accueil)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.key_stats (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  prefix     text        NOT NULL DEFAULT '',
  value      int         NOT NULL,
  suffix     text        NOT NULL DEFAULT '',
  label      text        NOT NULL,
  color      text        NOT NULL DEFAULT 'corail',
  sort_order int         NOT NULL DEFAULT 0
);

ALTER TABLE public.key_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "key_stats_public_read"
  ON public.key_stats FOR SELECT
  USING (true);

CREATE POLICY "key_stats_admin_all"
  ON public.key_stats FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------
-- Table : partners (partenaires)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partners (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  logo_url   text,
  url        text,
  sort_order int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partners_public_read"
  ON public.partners FOR SELECT
  USING (true);

CREATE POLICY "partners_admin_all"
  ON public.partners FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------
-- Table : instagram_posts (cache galerie Instagram)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.instagram_posts (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url  text        NOT NULL,
  alt        text        NOT NULL DEFAULT '',
  permalink  text        NOT NULL,
  sort_order int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "instagram_public_read"
  ON public.instagram_posts FOR SELECT
  USING (true);

CREATE POLICY "instagram_admin_all"
  ON public.instagram_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------
-- Table : intervention_requests (formulaire demande d'intervention)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.intervention_requests (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_name  text        NOT NULL,
  structure_type  text        NOT NULL
                              CHECK (structure_type IN ('ecole','college','lycee','universite','club','autre')),
  contact_name    text        NOT NULL,
  email           text        NOT NULL,
  phone           text,
  youth_age       text        NOT NULL,
  participants    int,
  desired_dates   text,
  action_type     text        NOT NULL
                              CHECK (action_type IN ('scolaire','club','tout-public','autre')),
  message         text,
  status          text        NOT NULL DEFAULT 'nouvelle'
                              CHECK (status IN ('nouvelle','en_cours','traitee')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.intervention_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "intervention_admin_all"
  ON public.intervention_requests FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "intervention_public_insert"
  ON public.intervention_requests FOR INSERT
  WITH CHECK (true);

-- ---------------------------------------------------------------
-- Table : contact_messages
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  kind         text        NOT NULL DEFAULT 'contact'
                           CHECK (kind IN ('contact','partenariat','benevolat')),
  name         text        NOT NULL,
  email        text        NOT NULL,
  phone        text,
  organization text,
  topic        text,
  message      text        NOT NULL,
  status       text        NOT NULL DEFAULT 'nouvelle'
                           CHECK (status IN ('nouvelle','en_cours','traitee')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_admin_all"
  ON public.contact_messages FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "contact_public_insert"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- ---------------------------------------------------------------
-- Table : rate_limits
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key          text        NOT NULL,
  window_start timestamptz NOT NULL,
  count        int         NOT NULL DEFAULT 1,
  PRIMARY KEY (key, window_start)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rate_limits_deny_all"
  ON public.rate_limits FOR ALL
  USING (false);

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key            text,
  p_max            int  DEFAULT 10,
  p_window_minutes int  DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_window timestamptz := date_trunc('minute', now())
    - (EXTRACT(MINUTE FROM now())::int % p_window_minutes * interval '1 minute');
  v_count  int;
BEGIN
  INSERT INTO public.rate_limits (key, window_start, count)
  VALUES (p_key, v_window, 1)
  ON CONFLICT (key, window_start)
  DO UPDATE SET count = rate_limits.count + 1
  RETURNING count INTO v_count;

  RETURN v_count <= p_max;
END;
$$;

-- ---------------------------------------------------------------
-- Storage bucket : public-images
-- ---------------------------------------------------------------
-- À exécuter manuellement dans Supabase Storage si l'API SQL ne
-- le prend pas en charge :
--   INSERT INTO storage.buckets (id, name, public)
--   VALUES ('public-images', 'public-images', true)
--   ON CONFLICT DO NOTHING;
