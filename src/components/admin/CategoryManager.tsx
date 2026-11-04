'use client'

import { useState, type FormEvent } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { createCategoryAction, deleteCategoryAction, renameCategoryAction } from '@/app/admin/actions'
import { cn } from '@/components/ui/utils'
import { LIMITS, type Category } from '@/lib/catalog/types'
import { validateCategoryName } from '@/lib/catalog/validation'
import { NETWORK_ERROR, useFailureHandler, useHydrated } from './hooks'
import { cardClass, inputClass } from './styles'
import { Button, ConfirmDialog, useToast } from './ui'

export type CategoryWithCount = Category & { count: number }

export function CategoryManager({ categories }: { categories: CategoryWithCount[] }) {
  const toast = useToast()
  const handleFailure = useFailureHandler()
  const hydrated = useHydrated()

  const [newName, setNewName] = useState('')
  const [newError, setNewError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  const [toDelete, setToDelete] = useState<CategoryWithCount | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function onAdd(event: FormEvent) {
    event.preventDefault()
    if (adding) return
    const check = validateCategoryName(newName)
    if (!check.ok) {
      setNewError(check.errors.name)
      return
    }
    setNewError(null)
    setAdding(true)
    try {
      const result = await createCategoryAction({ name: newName })
      if (result.ok) {
        toast.success(`Categoria “${check.value}” criada.`)
        setNewName('')
      } else if (result.fieldErrors?.name) {
        setNewError(result.fieldErrors.name)
      } else {
        handleFailure(result)
      }
    } catch {
      toast.error(NETWORK_ERROR)
    } finally {
      setAdding(false)
    }
  }

  function startEdit(category: CategoryWithCount) {
    setEditingId(category.id)
    setEditName(category.name)
    setEditError(null)
  }

  async function onRename(event: FormEvent, category: CategoryWithCount) {
    event.preventDefault()
    if (savingId) return
    const check = validateCategoryName(editName)
    if (!check.ok) {
      setEditError(check.errors.name)
      return
    }
    if (check.value === category.name) {
      setEditingId(null)
      return
    }
    setEditError(null)
    setSavingId(category.id)
    try {
      const result = await renameCategoryAction({ id: category.id, name: editName })
      if (result.ok) {
        toast.success('Categoria renomeada.')
        setEditingId(null)
      } else if (result.fieldErrors?.name) {
        setEditError(result.fieldErrors.name)
      } else {
        handleFailure(result)
      }
    } catch {
      toast.error(NETWORK_ERROR)
    } finally {
      setSavingId(null)
    }
  }

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      const result = await deleteCategoryAction({ id: toDelete.id })
      if (result.ok) toast.success(`Categoria “${toDelete.name}” excluída.`)
      else handleFailure(result)
      setToDelete(null)
    } catch {
      toast.error(NETWORK_ERROR)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onAdd} noValidate method="post" className={cn(cardClass, 'p-5')}>
        <fieldset disabled={!hydrated} className="min-w-0">
          <label htmlFor="new-category" className="block text-sm font-medium text-espresso">
            Nova categoria
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="new-category"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value)
                setNewError(null)
              }}
              maxLength={LIMITS.categoryNameMax + 10}
              placeholder="Ex.: Micropigmentação"
              autoComplete="off"
              disabled={adding}
              aria-invalid={newError ? true : undefined}
              aria-describedby={newError ? 'new-category-error' : undefined}
              className={cn(inputClass, 'flex-1')}
            />
            <Button type="submit" loading={adding} className="sm:min-w-40">
              <Plus className="size-4" aria-hidden /> Adicionar
            </Button>
          </div>
          {newError && (
            <p id="new-category-error" role="alert" className="mt-2 text-sm text-destructive">
              {newError}
            </p>
          )}
        </fieldset>
      </form>

      {categories.length === 0 ? (
        <div className={cn(cardClass, 'p-8 text-center text-espresso/60')}>
          Nenhuma categoria ainda. Crie a primeira acima.
        </div>
      ) : (
        <ul className="space-y-3">
          {categories.map((c) => {
            const editing = editingId === c.id
            return (
              <li key={c.id} className={cn(cardClass, 'p-4')}>
                {editing ? (
                  <form onSubmit={(e) => onRename(e, c)} noValidate>
                    <label htmlFor={`edit-${c.id}`} className="sr-only">
                      Nome da categoria
                    </label>
                    <input
                      id={`edit-${c.id}`}
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value)
                        setEditError(null)
                      }}
                      maxLength={LIMITS.categoryNameMax + 10}
                      autoComplete="off"
                      autoFocus
                      disabled={savingId === c.id}
                      aria-invalid={editError ? true : undefined}
                      className={inputClass}
                    />
                    {editError && (
                      <p role="alert" className="mt-2 text-sm text-destructive">
                        {editError}
                      </p>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button type="submit" loading={savingId === c.id} className="px-4">
                        <Check className="size-4" aria-hidden /> Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)} disabled={savingId === c.id} className="px-4">
                        <X className="size-4" aria-hidden /> Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-xl text-espresso">{c.name}</h3>
                      <span className="shrink-0 text-sm text-espresso/55">
                        {c.count === 0 ? 'Sem procedimentos' : c.count === 1 ? '1 procedimento' : `${c.count} procedimentos`}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => startEdit(c)} className="px-4">
                        <Pencil className="size-4" aria-hidden /> Renomear
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setToDelete(c)}
                        disabled={c.count > 0}
                        title={c.count > 0 ? 'Mova os procedimentos para outra categoria antes de excluir.' : undefined}
                        className="px-4 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" aria-hidden /> Excluir
                      </Button>
                    </div>
                    {c.count > 0 && (
                      <p className="mt-2 text-xs text-espresso/50">
                        Para excluir, primeiro mova os procedimentos desta categoria para outra.
                      </p>
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        busy={deleting}
        tone="danger"
        title="Excluir categoria?"
        description={
          <>
            A categoria <strong className="font-medium text-espresso">“{toDelete?.name}”</strong> será excluída. Ela não
            tem procedimentos, então nada some do site.
          </>
        }
        confirmLabel="Sim, excluir"
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />
    </div>
  )
}
