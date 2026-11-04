'use client'

// Fotos dos procedimentos: otimiza no próprio celular/computador e envia direto ao
// Supabase Storage com a sessão da administradora (as policies do bucket só deixam
// administradoras gravarem; o bucket ainda recusa o que não for JPEG/PNG/WebP ou > 5 MB).

import { getSupabaseBrowserClient } from '@/lib/supabase/browser'
import { PROCEDURE_IMAGES_BUCKET } from '@/lib/supabase/env'

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(',')
export const MAX_SOURCE_BYTES = 15 * 1024 * 1024
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // mesmo limite do bucket
const MAX_EDGE = 1600

export class ImageError extends Error {}

export function describeSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/** Valida o arquivo escolhido (antes de qualquer envio). Devolve a mensagem de erro ou null. */
export function checkImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato não aceito. Escolha uma foto JPG, PNG ou WebP.'
  }
  if (file.size > MAX_SOURCE_BYTES) {
    return `A foto é muito grande (${describeSize(file.size)}). O máximo é ${describeSize(MAX_SOURCE_BYTES)}.`
  }
  return null
}

/**
 * Redimensiona (maior lado = 1600 px) e converte para JPEG. Uma foto de celular de
 * 4–8 MB vira ~200–500 KB: o envio é rápido até em 4G e o site carrega leve.
 */
export async function prepareImage(file: File): Promise<Blob> {
  const problem = checkImageFile(file)
  if (problem) throw new ImageError(problem)

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = objectUrl
    try {
      await img.decode()
    } catch {
      throw new ImageError('Não foi possível ler esta foto. Tente outra imagem.')
    }

    const longest = Math.max(img.naturalWidth, img.naturalHeight)
    if (!longest) throw new ImageError('Não foi possível ler esta foto. Tente outra imagem.')
    const scale = Math.min(1, MAX_EDGE / longest)
    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new ImageError('Seu navegador não conseguiu preparar a foto.')
    ctx.fillStyle = '#ffffff' // PNG com transparência não vira fundo preto no JPEG
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    for (const quality of [0.86, 0.72, 0.6]) {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
      if (blob && blob.size <= MAX_UPLOAD_BYTES) return blob
    }
    throw new ImageError('Não foi possível reduzir esta foto o bastante. Tente outra imagem.')
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function randomId(): string {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes) // funciona também em http (rede local), ao contrário de randomUUID
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Envia a foto já otimizada e devolve a URL pública. O nome do arquivo é sempre novo e gerado aqui. */
export async function uploadProcedureImage(blob: Blob): Promise<string> {
  const supabase = getSupabaseBrowserClient()
  const path = `procedures/${randomId()}.jpg`

  const { error } = await supabase.storage.from(PROCEDURE_IMAGES_BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  })

  if (error) {
    const status = (error as { statusCode?: string | number }).statusCode
    if (String(status) === '413' || /too large|payload/i.test(error.message)) {
      throw new ImageError('A foto é grande demais para enviar. Tente outra imagem.')
    }
    if (String(status) === '401' || String(status) === '403' || /row-level security|not authorized|jwt/i.test(error.message)) {
      throw new ImageError('Sua sessão expirou. Entre novamente para enviar a foto.')
    }
    throw new ImageError('Não foi possível enviar a foto. Verifique sua conexão e tente de novo.')
  }

  return supabase.storage.from(PROCEDURE_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
}
