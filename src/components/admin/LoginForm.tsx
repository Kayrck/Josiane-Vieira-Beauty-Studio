'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { signInAction, signOutAction } from '@/app/admin/actions'
import { NETWORK_ERROR, useHydrated } from './hooks'
import { inputClass } from './styles'
import { Button, Field } from './ui'

export function LoginForm({ notice }: { notice?: string }) {
  const router = useRouter()
  const hydrated = useHydrated()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(notice ?? null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (pending) return
    setError(null)
    setFieldErrors({})
    setPending(true)

    try {
      const result = await signInAction({ email, password })
      if (result.ok) {
        router.replace('/admin')
        router.refresh()
        return // mantém "Entrando…" até a troca de tela
      }
      setFieldErrors(result.fieldErrors ?? {})
      setError(result.fieldErrors ? null : result.error)
      if (result.code === 'invalid-credentials') setPassword('')
    } catch {
      setError(NETWORK_ERROR)
    }
    setPending(false)
  }

  return (
    <form onSubmit={onSubmit} noValidate method="post" className="mt-6">
      <fieldset disabled={!hydrated} className="min-w-0 space-y-5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}

        <Field id="login-email" label="E-mail" error={fieldErrors.email}>
          <input
            id="login-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={pending}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            className={inputClass}
          />
        </Field>

        <Field id="login-password" label="Senha" error={fieldErrors.password}>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={pending}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
              className={`${inputClass} pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-espresso/55 transition-colors hover:text-espresso"
            >
              {showPassword ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
            </button>
          </div>
        </Field>

        <Button type="submit" loading={pending} className="w-full">
          {pending ? 'Entrando…' : 'Entrar'}
        </Button>
      </fieldset>
    </form>
  )
}

/** Mostrado quando há uma sessão válida, porém sem permissão de administradora. */
export function SwitchAccount({ email }: { email: string | null }) {
  const [pending, setPending] = useState(false)
  return (
    <div className="mt-6 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
      <p>
        A conta{email ? <strong className="font-medium"> {email}</strong> : ''} não tem permissão para acessar o painel.
      </p>
      <Button
        variant="outline"
        className="mt-3 w-full"
        loading={pending}
        onClick={async () => {
          setPending(true)
          try {
            await signOutAction()
          } catch {
            setPending(false)
          }
        }}
      >
        Sair desta conta
      </Button>
    </div>
  )
}
