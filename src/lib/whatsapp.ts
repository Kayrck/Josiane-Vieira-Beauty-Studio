export const PHONE = '5585996614346'

export const WA_MESSAGES = {
  // CTAs gerais
  'agendar-agora': `Olá, Josiane!\n\nConheci seu trabalho através do site e gostaria de agendar um atendimento.\n\nPoderia me informar quais horários estão disponíveis?`,
  'entrar-em-contato': `Olá, Josiane!\n\nConheci seu trabalho pelo site e gostaria de conversar sobre seus procedimentos.\n\nPoderia me passar algumas informações?`,
  'duvida': `Olá, Josiane!\n\nVim pelo site e tenho uma dúvida antes de agendar.\n\nPoderia me ajudar?`,
} as const

export type WaMessageKey = keyof typeof WA_MESSAGES

/**
 * Mensagens específicas por procedimento, indexadas pelo `slug` (que nunca muda).
 * `{name}` é trocado pelo nome ATUAL do procedimento: se o nome for editado no painel,
 * a mensagem do WhatsApp acompanha. Procedimentos novos, sem texto próprio aqui,
 * usam a mensagem padrão.
 */
const PROCEDURE_MESSAGES: Record<string, string> = {
  'mega-volume': `Olá, Josiane!\n\nGostaria de agendar um horário para realizar o procedimento *{name}*.\n\nVi o atendimento pelo site e gostaria de consultar os horários disponíveis.\n\nAguardo seu retorno. 😊`,
  'fox-eyes': `Olá, Josiane!\n\nTenho interesse em realizar o procedimento *{name}*.\n\nGostaria de verificar disponibilidade de datas e horários.\n\nObrigada!`,
  'volume-brasileiro': `Olá, Josiane!\n\nGostaria de agendar um horário para fazer o procedimento *{name}*.\n\nPoderia me informar os próximos horários disponíveis?`,
  'brow-lamination': `Olá, Josiane!\n\nTenho interesse em realizar o procedimento *{name}*.\n\nGostaria de agendar um horário.`,
  'design-henna': `Olá, Josiane!\n\nGostaria de marcar um horário para realizar o procedimento *{name}*.\n\nQuais horários você possui disponíveis?`,
  'lash-lifting': `Olá, Josiane!\n\nGostaria de agendar um horário para fazer o procedimento *{name}*.\n\nVi seu trabalho pelo site e gostaria de mais informações.`,
}

const DEFAULT_PROCEDURE_MESSAGE = `Olá, Josiane!\n\nGostaria de agendar um horário para realizar o procedimento *{name}*.\n\nVi o atendimento pelo site e gostaria de consultar os horários disponíveis.\n\nAguardo seu retorno. 😊`

/**
 * Gera uma URL do WhatsApp com mensagem personalizada.
 * Aceita uma chave de WA_MESSAGES (ex: 'agendar-agora') ou uma string literal.
 */
export function waLink(messageOrKey?: WaMessageKey | (string & {})): string {
  if (!messageOrKey) return `https://wa.me/${PHONE}`
  const message = (WA_MESSAGES as Record<string, string>)[messageOrKey] ?? messageOrKey
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

/**
 * Gera URL do WhatsApp para um procedimento específico.
 * Usa a mensagem própria do procedimento (pelo slug) ou a padrão, sempre com o nome atual.
 */
export function procedureWaLink(procedureSlug: string, procedureName: string): string {
  const template = PROCEDURE_MESSAGES[procedureSlug] ?? DEFAULT_PROCEDURE_MESSAGE
  // Remove marcadores de formatação do WhatsApp (* _ ~ `) do nome para não quebrar o texto.
  const name = procedureName.replace(/[*_~`]/g, '').trim()
  const message = template.split('{name}').join(name)
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}
