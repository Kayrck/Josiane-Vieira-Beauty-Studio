-- =============================================================================
-- Josiane Vieira Beauty Studio · catálogo de procedimentos + painel administrativo
-- Migração 1 de 2: tabelas, regras de integridade, RLS e Storage.
--
-- Pode ser executada mais de uma vez sem efeitos colaterais (idempotente).
-- Rode no SQL Editor do Supabase (ou com `supabase db push`) ANTES da migração 2.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Administradoras
--    Só quem está nesta tabela consegue alterar o catálogo.
--    A tabela NÃO tem nenhuma policy e nenhum privilégio para anon/authenticated:
--    ninguém consegue se promover pela API. Só o SQL Editor / service_role escreve aqui.
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Usuários autorizados a administrar o catálogo. Gerenciada apenas pelo SQL Editor / service_role.';

alter table public.admins enable row level security;
revoke all on table public.admins from anon, authenticated;

-- Devolve true se o usuário da requisição atual é administrador.
-- SECURITY DEFINER: lê public.admins mesmo sem acesso direto à tabela.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- -----------------------------------------------------------------------------
-- 2. Funções auxiliares
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- O "slug" identifica o procedimento nas mensagens de WhatsApp e nunca muda
-- depois de criado, mesmo que o nome seja editado.
create or replace function public.procedures_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.slug := old.slug;
  new.updated_at := now();
  return new;
end;
$$;

-- Valida a lista de valores adicionais (manutenção, variações etc.):
-- até 5 itens no formato {"label": "Manutenção", "amount": 89.99}.
create or replace function public.valid_extra_prices(p jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  item   jsonb;
  amount numeric;
begin
  if p is null or jsonb_typeof(p) is distinct from 'array' then
    return false;
  end if;
  if jsonb_array_length(p) > 5 then
    return false;
  end if;

  for item in select * from jsonb_array_elements(p) loop
    if jsonb_typeof(item) is distinct from 'object' then return false; end if;
    if (item - 'label' - 'amount') <> '{}'::jsonb then return false; end if;
    if jsonb_typeof(item -> 'label') is distinct from 'string' then return false; end if;
    if jsonb_typeof(item -> 'amount') is distinct from 'number' then return false; end if;
    if char_length(btrim(item ->> 'label')) not between 2 and 40 then return false; end if;

    amount := (item ->> 'amount')::numeric;
    if amount <= 0 or amount > 99999.99 then return false; end if;
  end loop;

  return true;
end;
$$;


-- -----------------------------------------------------------------------------
-- 3. Categorias
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null,
  name       text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  constraint categories_name_length check (char_length(btrim(name)) between 2 and 40)
);

create unique index if not exists categories_slug_key on public.categories (slug);
create unique index if not exists categories_name_key on public.categories (lower(btrim(name)));

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();


-- -----------------------------------------------------------------------------
-- 4. Procedimentos
--    price            → valor principal (aplicação)
--    extra_prices     → valores com finalidade própria, ex.: Manutenção, Sem henna
--    price_note       → observação curta exibida no card, ex.: "Exceto manutenção"
--    duration_minutes → duração em minutos (o site formata como "≈ 2h30")
--    active           → exclusão lógica: false = some do site, mas continua no banco
-- -----------------------------------------------------------------------------
create table if not exists public.procedures (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null,
  name             text not null,
  description      text not null default '',
  price            numeric(10, 2) not null,
  extra_prices     jsonb not null default '[]'::jsonb,
  price_note       text,
  duration_minutes integer not null,
  category_id      uuid not null references public.categories (id) on delete restrict,
  image_url        text,
  tag              text,
  active           boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint procedures_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  constraint procedures_name_length check (char_length(btrim(name)) between 2 and 80),
  constraint procedures_description_length check (char_length(description) <= 300),
  constraint procedures_price_range check (price > 0 and price <= 99999.99),
  constraint procedures_duration_range check (duration_minutes between 5 and 720),
  constraint procedures_extra_prices_valid check (public.valid_extra_prices(extra_prices)),
  constraint procedures_price_note_length check (price_note is null or char_length(btrim(price_note)) between 1 and 60),
  constraint procedures_tag_length check (tag is null or char_length(btrim(tag)) between 1 and 24),
  constraint procedures_image_url_format check (
    image_url is null
    or (
      char_length(image_url) <= 500
      and image_url ~ '^(/images/[A-Za-z0-9._-]+|https?://[^[:space:]]+/storage/v1/object/public/procedure-images/[A-Za-z0-9/_.-]+)$'
    )
  )
);

-- Evita cadastros duplicados (ignora maiúsculas/minúsculas e espaços nas pontas).
create unique index if not exists procedures_slug_key on public.procedures (slug);
create unique index if not exists procedures_name_key on public.procedures (lower(btrim(name)));
create index if not exists procedures_category_idx on public.procedures (category_id);
create index if not exists procedures_public_order_idx on public.procedures (sort_order, created_at) where active;

drop trigger if exists procedures_before_update on public.procedures;
create trigger procedures_before_update
  before update on public.procedures
  for each row execute function public.procedures_before_update();


-- -----------------------------------------------------------------------------
-- 5. Segurança em nível de linha (RLS)
--    Visitantes (anon): só leem procedimentos ATIVOS (e as categorias que os contêm).
--    Administradoras: leem tudo e escrevem.
--    Procedimentos não têm DELETE: a remoção é sempre lógica (active = false).
-- -----------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.procedures enable row level security;

revoke all on table public.categories, public.procedures from anon, authenticated;
grant select on table public.categories, public.procedures to anon, authenticated;
grant insert, update, delete on table public.categories to authenticated;
grant insert, update on table public.procedures to authenticated;

-- procedures
drop policy if exists procedures_select_public on public.procedures;
create policy procedures_select_public on public.procedures
  for select to anon, authenticated
  using (active);

drop policy if exists procedures_select_admin on public.procedures;
create policy procedures_select_admin on public.procedures
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists procedures_insert_admin on public.procedures;
create policy procedures_insert_admin on public.procedures
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists procedures_update_admin on public.procedures;
create policy procedures_update_admin on public.procedures
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- categories
drop policy if exists categories_select_public on public.categories;
create policy categories_select_public on public.categories
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.procedures p
      where p.category_id = categories.id and p.active
    )
  );

drop policy if exists categories_select_admin on public.categories;
create policy categories_select_admin on public.categories
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists categories_insert_admin on public.categories;
create policy categories_insert_admin on public.categories
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists categories_update_admin on public.categories;
create policy categories_update_admin on public.categories
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists categories_delete_admin on public.categories;
create policy categories_delete_admin on public.categories
  for delete to authenticated
  using ((select public.is_admin()));


-- -----------------------------------------------------------------------------
-- 6. Storage: bucket público de imagens, escrita restrita às administradoras
--    Limite de 5 MB por arquivo; somente JPEG, PNG e WebP (validado pelo Storage).
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'procedure-images',
  'procedure-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- A leitura pública das imagens acontece pela URL pública do bucket (não depende de policy).
drop policy if exists "procedure_images_select_admin" on storage.objects;
create policy "procedure_images_select_admin" on storage.objects
  for select to authenticated
  using (bucket_id = 'procedure-images' and (select public.is_admin()));

drop policy if exists "procedure_images_insert_admin" on storage.objects;
create policy "procedure_images_insert_admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'procedure-images' and (select public.is_admin()));

drop policy if exists "procedure_images_update_admin" on storage.objects;
create policy "procedure_images_update_admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'procedure-images' and (select public.is_admin()))
  with check (bucket_id = 'procedure-images' and (select public.is_admin()));

drop policy if exists "procedure_images_delete_admin" on storage.objects;
create policy "procedure_images_delete_admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'procedure-images' and (select public.is_admin()));
