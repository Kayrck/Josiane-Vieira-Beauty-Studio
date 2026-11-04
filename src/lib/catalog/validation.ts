// Validação dos dados do painel. É a MESMA função no navegador (feedback imediato)
// e no servidor (única validação confiável) e espelha as constraints do banco.
// Nunca confie só na validação visual: as Server Actions sempre chamam isto.

import { LIMITS, type ExtraPrice } from './types'

export type FieldErrors = Record<string, string>

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: FieldErrors }

/** O que o formulário envia. */
export type ProcedurePayload = {
  id?: string
  name: string
  description: string
  price: number
  extraPrices: { label: string; amount: number }[]
  priceNote: string
  durationMinutes: number
  categoryId: string
  imageUrl: string | null
  tag: string
  active: boolean
}

/** Depois de validado e normalizado. */
export type ValidProcedure = {
  id: string | null
  name: string
  description: string
  price: number
  extraPrices: ExtraPrice[]
  priceNote: string | null
  durationMinutes: number
  categoryId: string
  imageUrl: string | null
  tag: string | null
  active: boolean
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F]/
const SAFE_URL_RE = /^[A-Za-z0-9:/._-]+$/

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

/** Aparas + espaços repetidos viram um só. Devolve null se não for texto. */
function cleanText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  return value.replace(/\s+/g, ' ').trim()
}

function formatLimit(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function checkMoney(
  value: unknown,
  what: string,
): { ok: true; value: number } | { ok: false; error: string } {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { ok: false, error: `Informe ${what} (ex.: 129,99).` }
  }
  if (value <= 0) return { ok: false, error: `${capitalize(what)} deve ser maior que zero.` }
  if (value > LIMITS.priceMax) {
    return { ok: false, error: `${capitalize(what)} deve ser no máximo R$ ${formatLimit(LIMITS.priceMax)}.` }
  }
  const cents = value * 100
  if (Math.abs(cents - Math.round(cents)) > 1e-6) {
    return { ok: false, error: 'Use no máximo 2 casas decimais (centavos).' }
  }
  return { ok: true, value: Math.round(cents) / 100 }
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function validateProcedurePayload(
  raw: unknown,
  options: { allowedImagePrefixes?: string[] } = {},
): ValidationResult<ValidProcedure> {
  const errors: FieldErrors = {}

  if (!raw || typeof raw !== 'object') {
    return { ok: false, errors: { form: 'Dados inválidos. Recarregue a página e tente novamente.' } }
  }
  const input = raw as Record<string, unknown>

  // id (somente na edição)
  let id: string | null = null
  if (input.id !== undefined && input.id !== null && input.id !== '') {
    if (isUuid(input.id)) id = input.id
    else errors.id = 'Procedimento inválido.'
  }

  // nome
  const name = cleanText(input.name)
  if (name === null || name.length === 0) {
    errors.name = 'Informe o nome do procedimento.'
  } else if (name.length < LIMITS.nameMin) {
    errors.name = `O nome precisa ter pelo menos ${LIMITS.nameMin} letras.`
  } else if (name.length > LIMITS.nameMax) {
    errors.name = `O nome pode ter no máximo ${LIMITS.nameMax} caracteres.`
  } else if (CONTROL_CHARS_RE.test(name)) {
    errors.name = 'O nome contém caracteres inválidos.'
  }

  // descrição (opcional)
  let description = ''
  if (input.description !== undefined && input.description !== null) {
    const text = cleanText(input.description)
    if (text === null) errors.description = 'Descrição inválida.'
    else if (text.length > LIMITS.descriptionMax) {
      errors.description = `A descrição pode ter no máximo ${LIMITS.descriptionMax} caracteres.`
    } else if (CONTROL_CHARS_RE.test(text)) {
      errors.description = 'A descrição contém caracteres inválidos.'
    } else description = text
  }

  // preço principal
  let price = 0
  const priceCheck = checkMoney(input.price, 'o preço')
  if (priceCheck.ok) price = priceCheck.value
  else errors.price = priceCheck.error

  // duração (em minutos)
  let durationMinutes = 0
  const duration = input.durationMinutes
  if (typeof duration !== 'number' || !Number.isFinite(duration) || !Number.isInteger(duration)) {
    errors.durationMinutes = 'Informe a duração em horas e minutos.'
  } else if (duration <= 0) {
    errors.durationMinutes = 'A duração deve ser maior que zero.'
  } else if (duration < LIMITS.durationMin) {
    errors.durationMinutes = `A duração mínima é de ${LIMITS.durationMin} minutos.`
  } else if (duration > LIMITS.durationMax) {
    errors.durationMinutes = `A duração máxima é de ${LIMITS.durationMax / 60} horas.`
  } else durationMinutes = duration

  // categoria
  let categoryId = ''
  if (!isUuid(input.categoryId)) errors.categoryId = 'Escolha uma categoria.'
  else categoryId = input.categoryId

  // outros valores (manutenção, variações...)
  const extraPrices: ExtraPrice[] = []
  if (input.extraPrices !== undefined && input.extraPrices !== null) {
    if (!Array.isArray(input.extraPrices)) {
      errors.extraPrices = 'Valores adicionais inválidos.'
    } else if (input.extraPrices.length > LIMITS.extraMax) {
      errors.extraPrices = `Use no máximo ${LIMITS.extraMax} valores adicionais.`
    } else {
      const seen = new Set<string>()
      input.extraPrices.forEach((item: unknown, index: number) => {
        const entry = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>
        const label = cleanText(entry.label)
        let labelOk = false
        if (!label) {
          errors[`extraPrices.${index}.label`] = 'Dê um nome ao valor (ex.: Manutenção).'
        } else if (label.length < LIMITS.extraLabelMin || label.length > LIMITS.extraLabelMax) {
          errors[`extraPrices.${index}.label`] =
            `O nome do valor deve ter de ${LIMITS.extraLabelMin} a ${LIMITS.extraLabelMax} caracteres.`
        } else if (CONTROL_CHARS_RE.test(label)) {
          errors[`extraPrices.${index}.label`] = 'O nome do valor contém caracteres inválidos.'
        } else if (seen.has(label.toLowerCase())) {
          errors[`extraPrices.${index}.label`] = 'Já existe um valor com esse nome.'
        } else {
          seen.add(label.toLowerCase())
          labelOk = true
        }

        const amount = checkMoney(entry.amount, 'o valor')
        if (!amount.ok) errors[`extraPrices.${index}.amount`] = amount.error

        if (labelOk && amount.ok && label) extraPrices.push({ label, amount: amount.value })
      })
    }
  }

  // observação curta (opcional)
  let priceNote: string | null = null
  if (input.priceNote !== undefined && input.priceNote !== null) {
    const text = cleanText(input.priceNote)
    if (text === null) errors.priceNote = 'Observação inválida.'
    else if (text.length > LIMITS.noteMax) {
      errors.priceNote = `A observação pode ter no máximo ${LIMITS.noteMax} caracteres.`
    } else if (CONTROL_CHARS_RE.test(text)) {
      errors.priceNote = 'A observação contém caracteres inválidos.'
    } else priceNote = text || null
  }

  // selo (opcional)
  let tag: string | null = null
  if (input.tag !== undefined && input.tag !== null) {
    const text = cleanText(input.tag)
    if (text === null) errors.tag = 'Selo inválido.'
    else if (text.length > LIMITS.tagMax) {
      errors.tag = `O selo pode ter no máximo ${LIMITS.tagMax} caracteres.`
    } else if (CONTROL_CHARS_RE.test(text)) {
      errors.tag = 'O selo contém caracteres inválidos.'
    } else tag = text || null
  }

  // imagem (opcional): só aceitamos arquivos do nosso Storage ou as fotos já existentes no site
  let imageUrl: string | null = null
  if (input.imageUrl !== undefined && input.imageUrl !== null && input.imageUrl !== '') {
    const url = input.imageUrl
    if (typeof url !== 'string' || url.length > 500 || !SAFE_URL_RE.test(url) || url.includes('..')) {
      errors.imageUrl = 'Imagem inválida. Escolha a foto novamente.'
    } else if (
      options.allowedImagePrefixes &&
      !options.allowedImagePrefixes.some((prefix) => url.startsWith(prefix))
    ) {
      errors.imageUrl = 'Imagem inválida. Escolha a foto novamente.'
    } else imageUrl = url
  }

  // status
  let active = true
  if (typeof input.active !== 'boolean') errors.active = 'Status inválido.'
  else active = input.active

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  return {
    ok: true,
    value: {
      id,
      name: name as string,
      description,
      price,
      extraPrices,
      priceNote,
      durationMinutes,
      categoryId,
      imageUrl,
      tag,
      active,
    },
  }
}

export function validateCategoryName(raw: unknown): ValidationResult<string> {
  const name = cleanText(raw)
  if (name === null || name.length === 0) {
    return { ok: false, errors: { name: 'Informe o nome da categoria.' } }
  }
  if (name.length < LIMITS.categoryNameMin) {
    return { ok: false, errors: { name: `O nome precisa ter pelo menos ${LIMITS.categoryNameMin} letras.` } }
  }
  if (name.length > LIMITS.categoryNameMax) {
    return { ok: false, errors: { name: `O nome pode ter no máximo ${LIMITS.categoryNameMax} caracteres.` } }
  }
  if (CONTROL_CHARS_RE.test(name)) {
    return { ok: false, errors: { name: 'O nome contém caracteres inválidos.' } }
  }
  return { ok: true, value: name }
}
