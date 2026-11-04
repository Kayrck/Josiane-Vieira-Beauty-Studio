# Josiane Vieira Beauty Studio

Site institucional desenvolvido para a **Josiane Vieira Beauty Studio**, estúdio especializado em extensão de cílios e design do olhar localizado em Acarape, CE.

🔗 **[josiane-vieira-beauty-studio.vercel.app](https://josiane-vieira-beauty-studio.vercel.app/)**

---

## Sobre o projeto

Landing page com foco em conversão via WhatsApp, apresentando os procedimentos, diferenciais, galeria de resultados e informações de contato da profissional. Cada botão de agendamento envia uma mensagem personalizada para o procedimento correspondente.

Os procedimentos (nome, preços, duração, foto, categoria e status) são administrados pela própria Josiane em um **painel protegido por login** (`/admin`), sem editar código e sem novo deploy.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router, ISR) |
| UI | React 18 + TypeScript |
| Estilização | Tailwind CSS v4 |
| Animações | Motion (Framer Motion v12) |
| Componentes | Radix UI Accordion |
| Banco, login e fotos | Supabase (Postgres + Auth + Storage, com RLS) |
| Deploy | Vercel |
| Containerização | Docker + Docker Compose |

## Funcionalidades

- Página estática (ISR) para máxima performance e SEO; atualiza na hora quando algo é salvo no painel
- Catálogo de procedimentos vindo do banco, com filtro por categoria e fotos otimizadas (`next/image`)
- Mensagens do WhatsApp personalizadas por procedimento e contexto de CTA
- Seção de antes e depois com slider interativo
- Galeria de trabalhos
- FAQ com accordion
- Layout responsivo (mobile-first)
- Metadata, Open Graph e robots.txt configurados
- **Painel administrativo** (`/admin`): login, dashboard, cadastro/edição, valores de aplicação e manutenção, envio de fotos pelo celular, categorias e ativar/inativar (exclusão lógica); um botão discreto **Área restrita** no rodapé do site leva ao login

## Executando localmente

**Pré-requisitos:** Node.js >= 20 e npm >= 10

```bash
# Instalar dependências
npm install

# (opcional) configurar o painel: copie e preencha as variáveis
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse <http://localhost:3000>. Sem `.env.local`, o site funciona com o catálogo original (contingência) e `/admin` mostra o aviso de configuração.

### Com Docker

```bash
docker compose up
```

Inicia o servidor de desenvolvimento na porta 3000 com hot reload (carrega `.env.local`, se existir).

## Painel administrativo

Para colocar o painel no ar (criar o projeto Supabase, rodar as migrations, criar a primeira administradora e configurar as variáveis na Vercel), siga o guia:

**➡️ [docs/ADMIN-SETUP.md](docs/ADMIN-SETUP.md)**

Variáveis de ambiente (exemplo em [`.env.example`](.env.example)):

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública (publishable/anon). Nunca use a `service_role` |

## Estrutura

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata SEO e Open Graph
│   ├── page.tsx            # Composição das seções (busca o catálogo no banco)
│   ├── globals.css         # Estilos globais e tema
│   └── admin/              # Painel: login, dashboard, formulários, categorias, Server Actions
├── components/
│   ├── site/               # Seções da landing page
│   ├── admin/              # Componentes do painel
│   ├── shared/             # Componentes reutilizáveis
│   └── ui/                 # Primitivos de interface
├── lib/
│   ├── site.ts             # Conteúdo institucional, imagens e dados centralizados
│   ├── whatsapp.ts         # Catálogo de mensagens e gerador de links WA
│   ├── auth.ts             # Sessão + autorização de administradora (servidor)
│   ├── catalog/            # Tipos, formatação, validação e consultas do catálogo
│   └── supabase/           # Clientes do Supabase (servidor, navegador, middleware)
├── middleware.ts           # Renova a sessão e protege /admin (somente /admin)
supabase/
├── config.toml             # Configuração do Supabase CLI (cadastro público desativado)
└── migrations/             # SQL: tabelas, RLS, Storage e carga inicial
docs/
└── ADMIN-SETUP.md          # Guia de configuração do painel
```

## Personalização de conteúdo

- **Procedimentos, preços, durações, fotos e categorias:** pelo painel `/admin` (ficam no banco).
- `src/lib/site.ts` — textos institucionais, imagens fixas, endereço e horários.
- `src/lib/whatsapp.ts` — mensagens do WhatsApp por procedimento e contexto. Procedimentos novos usam a mensagem padrão com o nome atual.

Desenvolvido por Kaylanne Silva.
