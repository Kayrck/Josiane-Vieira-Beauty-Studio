// Formatação e leitura de valores. Roda igual no servidor e no navegador
// (evita diferenças de hidratação) e mantém exatamente o estilo atual do site:
// "R$ 149,99", "R$ 80" (sem ,00 quando o valor é inteiro), "≈ 2h30", "≈ 40min".

/** 149.99 → "R$ 149,99" · 80 → "R$ 80" */
export function formatBRL(value: number): string {
  const rounded = Math.round(value * 100) / 100
  const isWhole = Number.isInteger(rounded)
  const text = rounded.toLocaleString('pt-BR', {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return `R$ ${text}`
}

/** 150 → "≈ 2h30" · 120 → "≈ 2h" · 40 → "≈ 40min" */
export function formatDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `≈ ${m}min`
  return m === 0 ? `≈ ${h}h` : `≈ ${h}h${String(m).padStart(2, '0')}`
}

/** Valor numérico → texto de campo ("129,99"). */
export function moneyToInput(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return rounded.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  })
}

/**
 * Lê o que a pessoa digitou: "129,99", "129.99", "1.299,90", "R$ 80", "80".
 * Devolve null quando não for um número válido.
 */
export function parseMoney(input: string): number | null {
  let text = input.replace(/R\$/gi, '').replace(/\s/g, '')
  // O sinal e lido (e depois recusado pela validacao) para avisar "maior que zero"
  // em vez de uma mensagem generica.
  const negative = text.startsWith('-')
  if (negative) text = text.slice(1)
  if (!text || !/^[\d.,]+$/.test(text)) return null

  if (text.includes(',')) {
    // vírgula = decimal; pontos = milhar
    text = text.replace(/\./g, '').replace(',', '.')
  } else if (text.includes('.')) {
    const parts = text.split('.')
    const last = parts[parts.length - 1]
    const looksDecimal = parts.length === 2 && last.length > 0 && last.length <= 2
    text = looksDecimal ? text : parts.join('')
  }

  if ((text.match(/\./g) ?? []).length > 1) return null
  const n = Number(text)
  if (!Number.isFinite(n)) return null
  return negative ? -n : n
}

/** "Volume Soft / Sirena" → "volume-soft-sirena" */
export function slugify(text: string, maxLength = 60): string {
  const slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
  return slug || 'item'
}
