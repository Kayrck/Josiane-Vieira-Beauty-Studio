// Formato único de resposta das Server Actions do painel.

export type FailureCode =
  | 'unauthorized' // sem sessão (expirou)
  | 'forbidden' // logada, mas não é administradora
  | 'validation' // dados inválidos
  | 'conflict' // duplicidade / em uso
  | 'not-found'
  | 'invalid-credentials'
  | 'rate-limited'
  | 'unknown'

export type ActionFailure = {
  ok: false
  code: FailureCode
  error: string
  /** Mensagens por campo (mesmas chaves do formulário). */
  fieldErrors?: Record<string, string>
}

export type ActionSuccess<T> = { ok: true; data: T }

export type ActionResult<T = null> = ActionSuccess<T> | ActionFailure
