'use client'

import { useEffect, useMemo, useRef } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { buttonClass } from './styles'
import { ACCEPT_ATTRIBUTE, checkImageFile, describeSize } from '@/lib/images/upload'

type Props = {
  /** Foto já salva no procedimento (edição). */
  currentUrl: string | null
  /** Nova foto escolhida, ainda não enviada. */
  file: File | null
  /** A pessoa pediu para remover a foto atual. */
  removed: boolean
  error?: string
  disabled?: boolean
  onPick: (file: File) => void
  onRemove: () => void
  onProblem: (message: string) => void
}

/** Escolha de foto pela galeria/câmera do celular, com pré-visualização antes do envio. */
export function ImagePicker({ currentUrl, file, removed, error, disabled, onPick, onRemove, onProblem }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const shown = previewUrl ?? (removed ? null : currentUrl)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    e.target.value = '' // permite escolher o mesmo arquivo de novo
    if (!picked) return
    const problem = checkImageFile(picked)
    if (problem) {
      onProblem(problem)
      return
    }
    onPick(picked)
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[16rem] overflow-hidden rounded-[1.4rem] border border-border bg-champagne-soft sm:mx-0">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Pré-visualização da foto do procedimento" className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center p-6 text-center text-sm text-espresso/50">
            <div>
              <ImagePlus className="mx-auto size-9 text-gold/70" aria-hidden />
              <p className="mt-3">Nenhuma foto escolhida</p>
            </div>
          </div>
        )}
        {file && (
          <span className="absolute left-3 top-3 rounded-full bg-espresso/85 px-3 py-1 text-[11px] text-white">
            Nova foto
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:max-w-[16rem]">
        <input
          ref={inputRef}
          id="f-image"
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
          aria-describedby={error ? 'f-image-error' : 'f-image-hint'}
        />
        <label
          htmlFor="f-image"
          className={buttonClass(
            'outline',
            `w-full cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${disabled ? 'pointer-events-none opacity-55' : ''}`,
          )}
        >
          <ImagePlus className="size-4" aria-hidden />
          {shown ? 'Trocar foto' : 'Escolher foto'}
        </label>
        {shown && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className={buttonClass('ghost', 'w-full text-destructive hover:bg-destructive/10')}
          >
            <Trash2 className="size-4" aria-hidden />
            Remover foto
          </button>
        )}
      </div>

      {file ? (
        <p className="mt-3 text-xs text-espresso/60 sm:max-w-[16rem]">
          {file.name} · {describeSize(file.size)} (será otimizada ao salvar)
        </p>
      ) : null}
      {error ? (
        <p id="f-image-error" role="alert" className="mt-2 text-sm text-destructive sm:max-w-[16rem]">
          {error}
        </p>
      ) : (
        <p id="f-image-hint" className="mt-3 text-xs leading-relaxed text-espresso/55 sm:max-w-[16rem]">
          JPG, PNG ou WebP, até 15 MB. No celular, escolha da galeria ou tire uma foto agora.
        </p>
      )}
    </div>
  )
}
