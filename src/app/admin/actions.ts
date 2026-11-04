'use server'

// Server Actions do painel. Cada uma:
//   1. confere login + permissão de administradora NO SERVIDOR (adminGuard);
//   2. valida os dados de novo (nunca confia no formulário);
//   3. grava com a sessão da própria pessoa, então o RLS do banco também se aplica;
//   4. invalida o cache do site público para as mudanças aparecerem na hora.

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import type { ActionFailure, ActionResult, FailureCode } from '@/lib/action-result'
import { getAdminSession } from '@/lib/auth'
import { slugify } from '@/lib/catalog/format'
import { isUuid, validateCategoryName, validateProcedurePayload } from '@/lib/catalog/validation'
import { allowedImagePrefixes } from '@/lib/supabase/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function fail(code: FailureCode, error: string, fieldErrors?: Record<string, string>): ActionFailure {
  return { ok: false, code, error, fieldErrors }
}

function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data }
}

type Guard = { ok: true; supabase: SupabaseClient } | { ok: false; failure: ActionFailure }

async function adminGuard(): Promise<Guard> {
  const session = await getAdminSession()
  switch (session.status) {
    case 'ok':
      return { ok: true, supabase: session.supabase }
    case 'forbidden':
      return { ok: false, failure: fail('forbidden', 'Esta conta não tem permissão para fazer isso.') }
    case 'unauthenticated':
      return { ok: false, failure: fail('unauthorized', 'Sua sessão expirou. Entre novamente.') }
    case 'not-configured':
      return { ok: false, failure: fail('unknown', 'O painel ainda não foi configurado.') }
    default:
      return { ok: false, failure: fail('unknown', session.message) }
  }
}

/** Atualiza o site público e o painel. */
function revalidateSite() {
  revalidatePath('/')
  revalidatePath('/admin', 'layout')
}

function mapDbError(error: PostgrestError, context: 'procedure' | 'category'): ActionFailure {
  switch (error.code) {
    case '23505': {
      if (error.message.includes('procedures_name_key')) {
        return fail('validation', 'Já existe um procedimento com esse nome.', {
          name: 'Já existe um procedimento com esse nome (ele pode estar inativo: confira a lista).',
        })
      }
      if (error.message.includes('categories_name_key')) {
        return fail('validation', 'Já existe uma categoria com esse nome.', {
          name: 'Já existe uma categoria com esse nome.',
        })
      }
      return fail('conflict', 'Já existe um registro igual a este. Tente novamente.')
    }
    case '23514':
      return fail('validation', 'Algum valor está fora do permitido. Revise os campos.')
    case '23503':
      if (context === 'category') {
        return fail(
          'conflict',
          'Esta categoria ainda tem procedimentos. Mova-os para outra categoria antes de excluir.',
        )
      }
      return fail('validation', 'A categoria escolhida não existe mais.', {
        categoryId: 'A categoria escolhida não existe mais. Escolha outra.',
      })
    case '42501':
      return fail('forbidden', 'Esta conta não tem permissão para fazer isso.')
    default:
      console.error('[admin] erro do banco:', error.code, error.message)
      return fail('unknown', 'Não foi possível salvar agora. Tente novamente em instantes.')
  }
}

/** Gera um slug que ainda não existe (acrescenta -2, -3...). */
async function uniqueSlug(
  supabase: SupabaseClient,
  table: 'procedures' | 'categories',
  base: string,
): Promise<string> {
  const { data } = await supabase.from(table).select('slug').like('slug', `${base}%`)
  const taken = new Set((data ?? []).map((row: { slug: string }) => row.slug))
  if (!taken.has(base)) return base
  for (let n = 2; n < 100; n++) {
    const candidate = `${base}-${n}`
    if (!taken.has(candidate)) return candidate
  }
  return `${base}-${Date.now().toString(36)}`
}

async function nextSortOrder(supabase: SupabaseClient, table: 'procedures' | 'categories'): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  return ((data?.sort_order as number | undefined) ?? 0) + 10
}

// ───────────────────────────── Login / logout ─────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function signInAction(raw: unknown): Promise<ActionResult> {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
  const password = typeof input.password === 'string' ? input.password : ''

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return fail('validation', 'Informe um e-mail válido.', { email: 'Informe um e-mail válido.' })
  }
  if (!password || password.length > 200) {
    return fail('validation', 'Informe sua senha.', { password: 'Informe sua senha.' })
  }

  let supabase: SupabaseClient
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return fail('unknown', 'O painel ainda não foi configurado.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    if (error?.status === 429 || error?.code === 'over_request_rate_limit') {
      return fail('rate-limited', 'Muitas tentativas. Aguarde alguns minutos e tente de novo.')
    }
    // Sem status (falha de rede/timeout) ou erro do servidor: não é problema de senha.
    if (error && (!error.status || error.status >= 500)) {
      return fail('unknown', 'Não foi possível entrar agora. Tente novamente em instantes.')
    }
    // O Supabase só informa isto quando a senha está correta, então não revela se a conta existe.
    if (error?.code === 'email_not_confirmed') {
      return fail(
        'invalid-credentials',
        'Este e-mail ainda não foi confirmado. Marque "Auto Confirm User" ao criar o usuário no Supabase (veja docs/ADMIN-SETUP.md).',
      )
    }
    // Mensagem única para e-mail inexistente ou senha errada (não revela qual dos dois).
    return fail('invalid-credentials', 'E-mail ou senha incorretos.')
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin')
  if (rpcError) {
    await supabase.auth.signOut({ scope: 'local' })
    return fail('unknown', 'Não foi possível verificar seu acesso. Tente novamente.')
  }
  if (isAdmin !== true) {
    // Conta válida, mas sem permissão: encerra a sessão na hora.
    await supabase.auth.signOut({ scope: 'local' })
    return fail('forbidden', 'Esta conta não tem permissão para acessar o painel.')
  }

  return ok(null)
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut({ scope: 'local' })
  } catch {
    // sem Supabase configurado não há sessão a encerrar
  }
  redirect('/admin/login')
}

// ───────────────────────────── Procedimentos ─────────────────────────────

export async function saveProcedureAction(raw: unknown): Promise<ActionResult<{ id: string }>> {
  const guard = await adminGuard()
  if (!guard.ok) return guard.failure
  const { supabase } = guard

  const parsed = validateProcedurePayload(raw, { allowedImagePrefixes: allowedImagePrefixes() })
  if (!parsed.ok) return fail('validation', 'Revise os campos destacados.', parsed.errors)
  const v = parsed.value

  const fields = {
    name: v.name,
    description: v.description,
    price: v.price,
    extra_prices: v.extraPrices,
    price_note: v.priceNote,
    duration_minutes: v.durationMinutes,
    category_id: v.categoryId,
    image_url: v.imageUrl,
    tag: v.tag,
    active: v.active,
  }

  if (v.id) {
    const { data, error } = await supabase
      .from('procedures')
      .update(fields)
      .eq('id', v.id)
      .select('id')
      .maybeSingle()
    if (error) return mapDbError(error, 'procedure')
    // Nenhuma linha afetada = não existe (ou o RLS barrou): nunca finge que salvou.
    if (!data) return fail('not-found', 'Procedimento não encontrado.')
    revalidateSite()
    return ok({ id: data.id as string })
  }

  const slug = await uniqueSlug(supabase, 'procedures', slugify(v.name, 60))
  const sortOrder = await nextSortOrder(supabase, 'procedures')
  const { data, error } = await supabase
    .from('procedures')
    .insert({ ...fields, slug, sort_order: sortOrder })
    .select('id')
    .single()
  if (error) return mapDbError(error, 'procedure')

  revalidateSite()
  return ok({ id: data.id as string })
}

/** Inativar/reativar = exclusão lógica. Nada é apagado do banco. */
export async function setProcedureActiveAction(raw: unknown): Promise<ActionResult<{ active: boolean }>> {
  const guard = await adminGuard()
  if (!guard.ok) return guard.failure
  const { supabase } = guard

  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  if (!isUuid(input.id) || typeof input.active !== 'boolean') {
    return fail('validation', 'Pedido inválido. Recarregue a página.')
  }

  const { data, error } = await supabase
    .from('procedures')
    .update({ active: input.active })
    .eq('id', input.id)
    .select('active')
    .maybeSingle()
  if (error) return mapDbError(error, 'procedure')
  if (!data) return fail('not-found', 'Procedimento não encontrado.')

  revalidateSite()
  return ok({ active: data.active as boolean })
}

// ───────────────────────────── Categorias ─────────────────────────────

export async function createCategoryAction(raw: unknown): Promise<ActionResult<{ id: string }>> {
  const guard = await adminGuard()
  if (!guard.ok) return guard.failure
  const { supabase } = guard

  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const name = validateCategoryName(input.name)
  if (!name.ok) return fail('validation', name.errors.name, name.errors)

  const slug = await uniqueSlug(supabase, 'categories', slugify(name.value, 50))
  const sortOrder = await nextSortOrder(supabase, 'categories')
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.value, slug, sort_order: sortOrder })
    .select('id')
    .single()
  if (error) return mapDbError(error, 'category')

  revalidateSite()
  return ok({ id: data.id as string })
}

export async function renameCategoryAction(raw: unknown): Promise<ActionResult> {
  const guard = await adminGuard()
  if (!guard.ok) return guard.failure
  const { supabase } = guard

  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  if (!isUuid(input.id)) return fail('validation', 'Pedido inválido. Recarregue a página.')
  const name = validateCategoryName(input.name)
  if (!name.ok) return fail('validation', name.errors.name, name.errors)

  const { data, error } = await supabase
    .from('categories')
    .update({ name: name.value })
    .eq('id', input.id)
    .select('id')
    .maybeSingle()
  if (error) return mapDbError(error, 'category')
  if (!data) return fail('not-found', 'Categoria não encontrada.')

  revalidateSite()
  return ok(null)
}

/** Só é possível excluir categorias sem procedimentos (o banco também garante isso). */
export async function deleteCategoryAction(raw: unknown): Promise<ActionResult> {
  const guard = await adminGuard()
  if (!guard.ok) return guard.failure
  const { supabase } = guard

  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  if (!isUuid(input.id)) return fail('validation', 'Pedido inválido. Recarregue a página.')

  const { data, error } = await supabase.from('categories').delete().eq('id', input.id).select('id')
  if (error) return mapDbError(error, 'category')
  if (!data || data.length === 0) return fail('not-found', 'Categoria não encontrada.')

  revalidateSite()
  return ok(null)
}
