'use client'

import React, { useState } from 'react'

const ERROR_SVG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K'

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  priority?: boolean
}

export function ImageWithFallback({ src, alt, className, style, priority, loading, ...rest }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`inline-block bg-gray-100 ${className ?? ''}`} style={style}>
        <div className="flex h-full w-full items-center justify-center">
          <img src={ERROR_SVG} alt="Erro ao carregar imagem" />
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      onError={() => setError(true)}
      {...rest}
    />
  )
}
