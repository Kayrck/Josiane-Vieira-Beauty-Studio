// Opções comuns a todos os clientes do Supabase deste projeto.

/**
 * O painel NÃO usa Realtime. Mesmo assim, o supabase-js instancia o cliente de Realtime
 * ao iniciar e, em Node < 22 (sem WebSocket nativo), lança erro já na criação do cliente
 * ("Node.js 20 detected without native WebSocket support").
 *
 * Informar um transporte evita essa exigência e mantém o projeto funcionando em
 * Node 20, 22 e 24 sem adicionar o pacote `ws`. Se um dia o Realtime for usado,
 * remova isto e passe um WebSocket real.
 */
class UnusedWebSocket {
  constructor() {
    throw new Error('Realtime não é utilizado neste projeto.')
  }
}

export const NO_REALTIME = { transport: UnusedWebSocket as never }
