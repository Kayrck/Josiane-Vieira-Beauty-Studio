export const PHONE = '5585996614346'

export const WA_MESSAGES = {
  // Procedimentos específicos
  'mega-volume': `Olá, Josiane!\n\nGostaria de agendar um horário para realizar o procedimento *Mega Volume*.\n\nVi o atendimento pelo site e gostaria de consultar os horários disponíveis.\n\nAguardo seu retorno. 😊`,
  'fox-eyes': `Olá, Josiane!\n\nTenho interesse em realizar o procedimento *Volume Fox Eyes*.\n\nGostaria de verificar disponibilidade de datas e horários.\n\nObrigada!`,
  'volume-brasileiro': `Olá, Josiane!\n\nGostaria de agendar um horário para fazer o procedimento *Volume Brasileiro*.\n\nPoderia me informar os próximos horários disponíveis?`,
  'brow-lamination': `Olá, Josiane!\n\nTenho interesse em realizar o procedimento *Brow Lamination*.\n\nGostaria de agendar um horário.`,
  'design-henna': `Olá, Josiane!\n\nGostaria de marcar um horário para realizar o procedimento *Design com Henna*.\n\nQuais horários você possui disponíveis?`,
  'lash-lifting': `Olá, Josiane!\n\nGostaria de agendar um horário para fazer o procedimento *Lash Lifting*.\n\nVi seu trabalho pelo site e gostaria de mais informações.`,
  // CTAs gerais
  'agendar-agora': `Olá, Josiane!\n\nConheci seu trabalho através do site e gostaria de agendar um atendimento.\n\nPoderia me informar quais horários estão disponíveis?`,
  'entrar-em-contato': `Olá, Josiane!\n\nConheci seu trabalho pelo site e gostaria de conversar sobre seus procedimentos.\n\nPoderia me passar algumas informações?`,
  'duvida': `Olá, Josiane!\n\nVim pelo site e tenho uma dúvida antes de agendar.\n\nPoderia me ajudar?`,
} as const

export type WaMessageKey = keyof typeof WA_MESSAGES

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
 * Usa mensagem personalizada se existir em WA_MESSAGES; caso contrário, cria uma genérica.
 */
export function procedureWaLink(procedureId: string, procedureName: string): string {
  const predefined = (WA_MESSAGES as Record<string, string>)[procedureId]
  if (predefined) return `https://wa.me/${PHONE}?text=${encodeURIComponent(predefined)}`
  const msg = `Olá, Josiane!\n\nGostaria de agendar um horário para realizar o procedimento *${procedureName}*.\n\nVi o atendimento pelo site e gostaria de consultar os horários disponíveis.\n\nAguardo seu retorno. 😊`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
}
