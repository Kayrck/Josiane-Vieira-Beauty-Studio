-- =============================================================================
-- Josiane Vieira Beauty Studio · catálogo de procedimentos + painel administrativo
-- Migração 2 de 2: carga inicial com os procedimentos que já estavam no site.
--
-- Estes são os dados REAIS que antes ficavam fixos em src/lib/site.ts.
-- Nada foi perdido na migração:
--   • "Manutenção R$ 89,99" etc.  → extra_prices  [{"label":"Manutenção","amount":89.99}]
--   • "Exceto manutenção"         → price_note
--   • "sem henna R$ 24,99"        → extra_prices  [{"label":"Sem henna","amount":24.99}]
--   • "≈ 2h30"                    → duration_minutes 150
--   • "Mais desejado"/"Tendência" → tag
--
-- Pode ser executada novamente com segurança: `on conflict do nothing` garante
-- que preços e textos editados pelo painel NUNCA são sobrescritos.
-- =============================================================================

-- As duas categorias seguem o posicionamento da marca:
-- "Design do olhar & extensão de cílios premium". Podem ser renomeadas no painel.
insert into public.categories (slug, name, sort_order)
values
  ('extensao-de-cilios', 'Extensão de cílios', 10),
  ('design-do-olhar',    'Design do olhar',    20)
on conflict do nothing;

insert into public.procedures
  (slug, name, description, price, extra_prices, price_note, duration_minutes, image_url, tag, category_id, sort_order, active)
select
  v.slug, v.name, v.description, v.price, v.extra_prices::jsonb, v.price_note,
  v.duration_minutes, v.image_url, v.tag, c.id, v.sort_order, true
from (
  values
    ('mega-volume',       'Mega Volume',          'Fio preto · volume intenso e marcante',          149.99, '[]',                                                   'Exceto manutenção', 150, '/images/mega-volume.png',       'Mais desejado', 'extensao-de-cilios', 10),
    ('fox-eyes',          'Volume Fox Eyes',      'Fio preto · efeito olhar puxado e felino',       129.99, '[{"label":"Manutenção","amount":89.99}]',              null,                135, '/images/fox-eyes.png',          'Tendência',     'extensao-de-cilios', 20),
    ('volume-power',      'Volume Power',         'Fios marrom e preto · profundidade natural',     109.99, '[{"label":"Manutenção","amount":80}]',                 null,                120, '/images/volume-power.png',      null,            'extensao-de-cilios', 30),
    ('volume-soft',       'Volume Soft / Sirena', 'Fio preto · leveza e delicadeza',                 99.99, '[{"label":"Manutenção","amount":80}]',                 null,                120, '/images/volume-soft.png',       null,            'extensao-de-cilios', 40),
    ('volume-brasileiro', 'Volume Brasileiro',    'Fios marrom e preto · naturalidade absoluta',     99.99, '[{"label":"Manutenção","amount":70}]',                 null,                105, '/images/volume-brasileiro.png', null,            'extensao-de-cilios', 50),
    ('brow-lamination',   'Brow Lamination',      'Sobrancelhas alinhadas, preenchidas e fixadas',   89.99, '[]',                                                   null,                 60, '/images/brow-lamination.png',   null,            'design-do-olhar',    60),
    ('design-henna',      'Design com Henna',     'Design completo',                                 34.99, '[{"label":"Sem henna","amount":24.99}]',               null,                 40, '/images/design-henna.png',      null,            'design-do-olhar',    70),
    ('lash-lifting',      'Lash Lifting',         'Curvatura natural dos seus próprios cílios',      89.99, '[]',                                                   null,                 60, '/images/lash-lifting.png',      null,            'design-do-olhar',    80)
) as v (slug, name, description, price, extra_prices, price_note, duration_minutes, image_url, tag, category_slug, sort_order)
join public.categories c on c.slug = v.category_slug
on conflict do nothing;
