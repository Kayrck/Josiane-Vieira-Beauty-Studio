'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

type Props = {
  src: string | null
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}

/**
 * Foto de procedimento otimizada (next/image): entrega WebP no tamanho certo para cada
 * tela, o que é decisivo no celular (as fotos originais têm ~2 MB). Sem foto, ou se a
 * imagem falhar, mostra um bloco discreto na identidade da marca.
 * O pai precisa ser `relative` e ter proporção definida.
 */
export function ProcedureImage({ src, alt, sizes, className, priority }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className="absolute inset-0 grid place-items-center bg-gradient-to-br from-champagne-soft to-champagne text-gold/60"
        role="img"
        aria-label={src ? 'Não foi possível carregar a foto' : 'Sem foto'}
      >
        <ImageIcon className="size-10" aria-hidden />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
