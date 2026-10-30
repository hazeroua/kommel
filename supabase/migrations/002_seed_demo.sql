-- =============================================================
-- KOM'MEL — Migration 002 : Données de démonstration
-- À appliquer UNIQUEMENT en développement / staging.
-- =============================================================

-- Chiffres clés
INSERT INTO public.key_stats (prefix, value, suffix, label, color, sort_order) VALUES
  ('', 200, '+', 'jeunes sensibilisés', 'corail', 0),
  ('', 15, '', 'interventions réalisées', 'pervenche', 1),
  ('', 3, '', 'établissements partenaires', 'moutarde', 2),
  ('', 1, '', 'championne au cœur du projet', 'rose', 3)
ON CONFLICT DO NOTHING;

-- Témoignages
INSERT INTO public.testimonials (quote, author, color, visible, sort_order) VALUES
  (
    'Melkia a su captiver nos élèves dès les premiers instants. Son discours sur la confiance en soi a résonné bien au-delà de la salle de judo.',
    'Directrice d''un collège REP+ de Seine-Saint-Denis',
    'corail',
    true,
    0
  ),
  (
    'Les enfants ont adoré ! Ils ont découvert le judo et les valeurs du sport de haut niveau de manière très accessible et inspirante.',
    'Animatrice centre de loisirs, Paris 19ème',
    'pervenche',
    true,
    1
  ),
  (
    'Une intervention qui a marqué toute notre équipe. Melkia parle vrai et ça se ressent.',
    'Entraîneur, Judo Club de Montreuil',
    'moutarde',
    true,
    2
  )
ON CONFLICT DO NOTHING;
