'use client'

import Link from 'next/link'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { saveProcedureAction } from '@/app/admin/actions'
import { formatBRL, formatDuration, moneyToInput, parseMoney } from '@/lib/catalog/format'
import { LIMITS, type Category, type Procedure } from '@/lib/catalog/types'
import { validateProcedurePayload, type FieldErrors, type ProcedurePayload } from '@/lib/catalog/validation'
import { ImageError, prepareImage, uploadProcedureImage } from '@/lib/images/upload'
import { cn } from '@/components/ui/utils'
import { NETWORK_ERROR, useFailureHandler, useHydrated } from './hooks'
import { ImagePicker } from './ImagePicker'
import { buttonClass, cardClass, inputClass } from './styles'
import { Button, Field, Switch, describedBy, useToast } from './ui'

type ExtraRow = { label: string; amount: string }

const FIELD_IDS: Record<string, string> = {
  name: 'f-name',
  description: 'f-description',
  categoryId: 'f-category',
  tag: 'f-tag',
  price: 'f-price',
  durationMinutes: 'f-hours',
  priceNote: 'f-note',
  imageUrl: 'f-image',
}

/** Ordem visual dos campos, para focar sempre no primeiro com erro. */
const FOCUS_ORDER = ['imageUrl', 'name', 'description', 'categoryId', 'tag', 'price', 'durationMinutes', 'priceNote']

function toMinutes(hours: string, minutes: string): number {
  const h = hours.trim() === '' ? 0 : Number(hours)
  const m = minutes.trim() === '' ? 0 : Number(minutes)
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || m < 0) return Number.NaN
  return h * 60 + m
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className={cn(cardClass, 'p-5 sm:p-7')}>
      <h2 className="font-display text-[1.4rem] leading-tight text-espresso">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-espresso/60">{subtitle}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

export function ProcedureForm({
  mode,
  categories,
  initial,
}: {
  mode: 'create' | 'edit'
  categories: Category[]
  initial?: Procedure
}) {
  const router = useRouter()
  const toast = useToast()
  const handleFailure = useFailureHandler()
  const hydrated = useHydrated()

  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '')
  const [tag, setTag] = useState(initial?.tag ?? '')
  const [price, setPrice] = useState(initial ? moneyToInput(initial.price) : '')
  const [hours, setHours] = useState(initial ? String(Math.floor(initial.durationMinutes / 60)) : '')
  const [minutes, setMinutes] = useState(initial ? String(initial.durationMinutes % 60) : '')
  const [extras, setExtras] = useState<ExtraRow[]>(
    initial?.extraPrices.map((e) => ({ label: e.label, amount: moneyToInput(e.amount) })) ?? [],
  )
  const [note, setNote] = useState(initial?.priceNote ?? '')
  const [active, setActive] = useState(initial?.active ?? true)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})
  const [step, setStep] = useState<'idle' | 'uploading' | 'saving'>('idle')
  const busy = step !== 'idle'

  // Se o envio da foto deu certo mas o salvamento falhou (ex.: nome repetido), não reenvia a mesma foto.
  const uploaded = useRef<{ file: File; url: string } | null>(null)

  const durationMinutes = toMinutes(hours, minutes)
  const durationPreview = Number.isFinite(durationMinutes) && durationMinutes > 0 ? formatDuration(durationMinutes) : null
  const pricePreview = (() => {
    const n = parseMoney(price)
    return n !== null && n > 0 ? formatBRL(n) : null
  })()

  function clearError(...keys: string[]) {
    setErrors((current) => {
      if (!keys.some((k) => k in current)) return current
      const next = { ...current }
      for (const k of keys) delete next[k]
      return next
    })
  }

  function buildPayload(imageUrl: string | null): ProcedurePayload {
    const amountOf = (text: string) => parseMoney(text) ?? Number.NaN
    return {
      id: initial?.id,
      name,
      description,
      price: amountOf(price),
      extraPrices: extras
        .filter((row) => row.label.trim() !== '' || row.amount.trim() !== '')
        .map((row) => ({ label: row.label, amount: amountOf(row.amount) })),
      priceNote: note,
      durationMinutes,
      categoryId,
      imageUrl,
      tag,
      active,
    }
  }

  function focusFirstError(found: FieldErrors) {
    const extraKey = Object.keys(found).find((k) => k.startsWith('extraPrices.'))
    const key = FOCUS_ORDER.find((k) => k in found)
    let id: string | undefined
    if (key) id = FIELD_IDS[key]
    else if (extraKey) {
      const [, index, part] = extraKey.split('.')
      id = `f-extra-${index}-${part}`
    }
    if (!id) return
    const el = document.getElementById(id)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    el?.focus({ preventScroll: true })
  }

  async function resolveImageUrl(): Promise<string | null> {
    if (imageFile) {
      if (uploaded.current?.file === imageFile) return uploaded.current.url
      setStep('uploading')
      const blob = await prepareImage(imageFile)
      const url = await uploadProcedureImage(blob)
      uploaded.current = { file: imageFile, url }
      return url
    }
    return imageRemoved ? null : (initial?.image ?? null)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (busy) return

    // 1) validação imediata (o servidor valida tudo de novo)
    const check = validateProcedurePayload(buildPayload(imageRemoved ? null : (initial?.image ?? null)))
    if (!check.ok) {
      setErrors(check.errors)
      focusFirstError(check.errors)
      toast.error('Revise os campos destacados em vermelho.')
      return
    }
    setErrors({})

    try {
      // 2) foto (se houver nova): otimiza e envia ao Storage
      const imageUrl = await resolveImageUrl()

      // 3) salva no banco (Server Action: confere login, valida de novo e atualiza o site)
      setStep('saving')
      const result = await saveProcedureAction(buildPayload(imageUrl))

      if (result.ok) {
        toast.success(
          mode === 'create'
            ? 'Procedimento cadastrado! Já aparece no site.'
            : 'Alterações salvas! O site já foi atualizado.',
        )
        router.push('/admin') // mantém "salvando" até a tela trocar (evita clique duplo)
        return
      }

      if (result.fieldErrors) {
        setErrors(result.fieldErrors)
        focusFirstError(result.fieldErrors)
      }
      handleFailure(result)
    } catch (err) {
      if (err instanceof ImageError) {
        setErrors((current) => ({ ...current, imageUrl: err.message }))
        document.getElementById('f-image')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        toast.error(err.message)
      } else {
        toast.error(NETWORK_ERROR)
      }
    }
    setStep('idle')
  }

  // Rótulo curto no celular (a barra fixa precisa caber em telas de 320 px) e completo a partir de sm.
  const submitLabel =
    step === 'uploading' ? (
      'Enviando foto…'
    ) : step === 'saving' ? (
      'Salvando…'
    ) : mode === 'create' ? (
      <>
        <span className="sm:hidden">Cadastrar</span>
        <span className="hidden sm:inline">Cadastrar procedimento</span>
      </>
    ) : (
      <>
        <span className="sm:hidden">Salvar</span>
        <span className="hidden sm:inline">Salvar alterações</span>
      </>
    )

  return (
    <form onSubmit={onSubmit} noValidate method="post" className="space-y-6">
      <fieldset disabled={!hydrated} className="min-w-0 space-y-6">
        <div>
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-espresso/70 transition-colors hover:text-espresso"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Voltar para a lista
          </Link>
          <h1 className="mt-1 font-display text-[clamp(1.8rem,5vw,2.4rem)] leading-tight text-espresso">
            {mode === 'create' ? 'Novo procedimento' : 'Editar procedimento'}
          </h1>
          <p className="mt-1 text-espresso/60">
            {mode === 'create'
              ? 'Preencha os dados abaixo. Ao salvar, ele aparece no site na hora.'
              : 'Altere o que precisar. Ao salvar, o site é atualizado na hora.'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:items-start">
          <SectionCard title="Foto">
            <ImagePicker
              currentUrl={initial?.image ?? null}
              file={imageFile}
              removed={imageRemoved}
              error={errors.imageUrl}
              disabled={busy}
              onPick={(file) => {
                setImageFile(file)
                setImageRemoved(false)
                clearError('imageUrl')
              }}
              onRemove={() => {
                setImageFile(null)
                setImageRemoved(true)
                clearError('imageUrl')
              }}
              onProblem={(message) => setErrors((c) => ({ ...c, imageUrl: message }))}
            />
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Informações">
              <Field id="f-name" label="Nome do procedimento" error={errors.name}>
                <input
                  id="f-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    clearError('name')
                  }}
                  maxLength={LIMITS.nameMax + 20}
                  autoComplete="off"
                  placeholder="Ex.: Volume Russo"
                  disabled={busy}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy('f-name', errors.name)}
                  className={inputClass}
                />
              </Field>

              <Field
                id="f-description"
                label="Descrição"
                optional
                error={errors.description}
                hint={`${description.length}/${LIMITS.descriptionMax} · aparece abaixo do nome, no card do site.`}
              >
                <textarea
                  id="f-description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    clearError('description')
                  }}
                  rows={3}
                  placeholder="Ex.: Fio preto · volume intenso e marcante"
                  disabled={busy}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={describedBy('f-description', errors.description, true)}
                  className={cn(inputClass, 'min-h-24 resize-y py-3 leading-relaxed')}
                />
              </Field>

              <Field id="f-category" label="Categoria" error={errors.categoryId}>
                {categories.length === 0 ? (
                  <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-espresso/70">
                    Ainda não há categorias.{' '}
                    <Link href="/admin/categorias" className="underline underline-offset-2">
                      Crie uma categoria
                    </Link>{' '}
                    primeiro.
                  </p>
                ) : (
                  <select
                    id="f-category"
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value)
                      clearError('categoryId')
                    }}
                    disabled={busy}
                    aria-invalid={errors.categoryId ? true : undefined}
                    aria-describedby={describedBy('f-category', errors.categoryId)}
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>

              <Field
                id="f-tag"
                label="Selo de destaque"
                optional
                error={errors.tag}
                hint="Etiqueta pequena sobre a foto. Ex.: Mais desejado, Novo, Tendência."
              >
                <input
                  id="f-tag"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value)
                    clearError('tag')
                  }}
                  maxLength={LIMITS.tagMax + 10}
                  autoComplete="off"
                  disabled={busy}
                  aria-invalid={errors.tag ? true : undefined}
                  aria-describedby={describedBy('f-tag', errors.tag, true)}
                  className={inputClass}
                />
              </Field>
            </SectionCard>

            <SectionCard title="Valores e duração">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="f-price"
                  label="Preço (aplicação)"
                  error={errors.price}
                  hint={pricePreview ? `Aparece no site como ${pricePreview}` : 'Use vírgula nos centavos. Ex.: 129,99'}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-espresso/50" aria-hidden>
                      R$
                    </span>
                    <input
                      id="f-price"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value)
                        clearError('price')
                      }}
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="0,00"
                      disabled={busy}
                      aria-invalid={errors.price ? true : undefined}
                      aria-describedby={describedBy('f-price', errors.price, true)}
                      className={cn(inputClass, 'pl-11')}
                    />
                  </div>
                </Field>

                <fieldset>
                  <legend className="mb-1.5 block text-sm font-medium text-espresso">Duração</legend>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        id="f-hours"
                        value={hours}
                        onChange={(e) => {
                          setHours(e.target.value.replace(/\D/g, '').slice(0, 2))
                          clearError('durationMinutes')
                        }}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="0"
                        aria-label="Horas"
                        disabled={busy}
                        aria-invalid={errors.durationMinutes ? true : undefined}
                        aria-describedby={describedBy('f-hours', errors.durationMinutes, true)}
                        className={cn(inputClass, 'pr-12')}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-espresso/50" aria-hidden>
                        h
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        id="f-minutes"
                        value={minutes}
                        onChange={(e) => {
                          setMinutes(e.target.value.replace(/\D/g, '').slice(0, 3))
                          clearError('durationMinutes')
                        }}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="0"
                        aria-label="Minutos"
                        disabled={busy}
                        aria-invalid={errors.durationMinutes ? true : undefined}
                        aria-describedby={describedBy('f-hours', errors.durationMinutes, true)}
                        className={cn(inputClass, 'pr-14')}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-espresso/50" aria-hidden>
                        min
                      </span>
                    </div>
                  </div>
                  {errors.durationMinutes ? (
                    <p id="f-hours-error" role="alert" className="mt-1.5 text-sm text-destructive">
                      {errors.durationMinutes}
                    </p>
                  ) : (
                    <p id="f-hours-hint" className="mt-1.5 text-xs text-espresso/55">
                      {durationPreview ? `Aparece no site como ${durationPreview}` : 'Ex.: 2 horas e 30 minutos.'}
                    </p>
                  )}
                </fieldset>
              </div>

              <div>
                <p className="text-sm font-medium text-espresso">
                  Outros valores <span className="font-normal text-espresso/50">(opcional)</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-espresso/55">
                  Para valores com finalidade própria, como a manutenção. Aparecem como etiquetas no card.
                </p>

                {extras.length > 0 && (
                  <ul className="mt-3 space-y-3">
                    {extras.map((row, index) => {
                      const labelError = errors[`extraPrices.${index}.label`]
                      const amountError = errors[`extraPrices.${index}.amount`]
                      return (
                        <li key={index} className="rounded-2xl border border-border bg-secondary/40 p-3">
                          <div className="grid gap-3 sm:grid-cols-[1fr_9.5rem_auto] sm:items-start">
                            <div>
                              <input
                                id={`f-extra-${index}-label`}
                                value={row.label}
                                onChange={(e) => {
                                  setExtras((list) => list.map((r, i) => (i === index ? { ...r, label: e.target.value } : r)))
                                  clearError(`extraPrices.${index}.label`)
                                }}
                                placeholder="Nome (ex.: Manutenção)"
                                aria-label={`Nome do valor ${index + 1}`}
                                maxLength={LIMITS.extraLabelMax + 10}
                                autoComplete="off"
                                disabled={busy}
                                aria-invalid={labelError ? true : undefined}
                                className={inputClass}
                              />
                              {labelError && (
                                <p role="alert" className="mt-1.5 text-sm text-destructive">
                                  {labelError}
                                </p>
                              )}
                            </div>
                            <div>
                              <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-espresso/50" aria-hidden>
                                  R$
                                </span>
                                <input
                                  id={`f-extra-${index}-amount`}
                                  value={row.amount}
                                  onChange={(e) => {
                                    setExtras((list) => list.map((r, i) => (i === index ? { ...r, amount: e.target.value } : r)))
                                    clearError(`extraPrices.${index}.amount`)
                                  }}
                                  inputMode="decimal"
                                  placeholder="0,00"
                                  aria-label={`Valor ${index + 1}`}
                                  autoComplete="off"
                                  disabled={busy}
                                  aria-invalid={amountError ? true : undefined}
                                  className={cn(inputClass, 'pl-11')}
                                />
                              </div>
                              {amountError && (
                                <p role="alert" className="mt-1.5 text-sm text-destructive">
                                  {amountError}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setExtras((list) => list.filter((_, i) => i !== index))
                                setErrors((current) => {
                                  const next = { ...current }
                                  for (const k of Object.keys(next)) if (k.startsWith('extraPrices.')) delete next[k]
                                  return next
                                })
                              }}
                              disabled={busy}
                              aria-label={`Remover valor ${index + 1}`}
                              className="grid size-12 place-items-center justify-self-end rounded-xl text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-55"
                            >
                              <Trash2 className="size-5" aria-hidden />
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
                {errors.extraPrices && (
                  <p role="alert" className="mt-2 text-sm text-destructive">
                    {errors.extraPrices}
                  </p>
                )}

                {extras.length < LIMITS.extraMax && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!extras.some((r) => r.label.trim().toLowerCase() === 'manutenção') && (
                      <button
                        type="button"
                        onClick={() => setExtras((list) => [...list, { label: 'Manutenção', amount: '' }])}
                        disabled={busy}
                        className={buttonClass('soft', 'px-4')}
                      >
                        <Plus className="size-4" aria-hidden /> Manutenção
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExtras((list) => [...list, { label: '', amount: '' }])}
                      disabled={busy}
                      className={buttonClass('soft', 'px-4')}
                    >
                      <Plus className="size-4" aria-hidden /> Outro valor
                    </button>
                  </div>
                )}
              </div>

              <Field
                id="f-note"
                label="Observação sobre valores"
                optional
                error={errors.priceNote}
                hint="Etiqueta curta no card. Ex.: Exceto manutenção."
              >
                <input
                  id="f-note"
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value)
                    clearError('priceNote')
                  }}
                  maxLength={LIMITS.noteMax + 10}
                  autoComplete="off"
                  disabled={busy}
                  aria-invalid={errors.priceNote ? true : undefined}
                  aria-describedby={describedBy('f-note', errors.priceNote, true)}
                  className={inputClass}
                />
              </Field>
            </SectionCard>

            <SectionCard title="Visibilidade">
              <Switch id="f-active" checked={active} onChange={setActive} disabled={busy}>
                <span className="block font-medium text-espresso">{active ? 'Ativo' : 'Inativo'}</span>
                <span className="block text-sm text-espresso/60">
                  {active
                    ? 'Aparece no site para todas as clientes.'
                    : 'Fica guardado, mas não aparece no site. Você pode reativar quando quiser.'}
                </span>
              </Switch>
            </SectionCard>
          </div>
        </div>

      </fieldset>

      {/* Barra de ações fixa na base: o botão salvar fica sempre ao alcance do polegar */}
      <div className="sticky bottom-0 z-30 -mx-4 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-5xl gap-3 sm:justify-end">
          <Link
            href="/admin"
            aria-disabled={busy}
            className={buttonClass('outline', busy ? 'pointer-events-none opacity-55' : '')}
          >
            Cancelar
          </Link>
          <Button type="submit" loading={busy} disabled={!hydrated} className="flex-1 sm:min-w-56 sm:flex-none">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
