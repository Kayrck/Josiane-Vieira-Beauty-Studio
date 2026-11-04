# Painel administrativo · Guia de configuração

Este guia coloca no ar o painel `/admin`, onde a Josiane edita os procedimentos do site
(preços, durações, fotos, categorias, ativar/inativar) **sem mexer em código e sem novo deploy**.

> **Tempo estimado:** 20–30 minutos, uma única vez.
> **Custo:** o plano gratuito do Supabase atende este projeto (veja [Limites do plano gratuito](#limites-do-plano-gratuito)).

---

## 1. Como funciona (resumo)

```
 Josiane (celular/PC)                 Visitantes (qualquer aparelho)
        │                                        │
   /admin  (login)                          site público (/)
        │                                        │
        ▼                                        ▼
  Server Actions  ── valida login + permissão ── leitura somente de procedimentos ATIVOS
        │                                        ▲
        └────────────►  Supabase  ◄──────────────┘
                 (Postgres + Auth + Storage, com RLS)
```

| Peça | Onde fica | Função |
|---|---|---|
| Procedimentos e categorias | Supabase Postgres | Fonte única de dados. O site deixou de ter preços fixos no código. |
| Login da administradora | Supabase Auth | E-mail + senha. **Não existe cadastro público.** |
| Quem pode editar | Tabela `public.admins` | Só quem está nela altera o catálogo. |
| Fotos | Supabase Storage (bucket `procedure-images`) | Leitura pública; só administradoras gravam. |
| Segurança | RLS (regras no banco) | Mesmo que alguém burle a tela, o banco recusa. |
| Atualização do site | ISR do Next.js | Salvar no painel atualiza o site **na hora**; alterações feitas direto no banco aparecem em cerca de 1 minuto. |

**Inativar não apaga:** o procedimento some do site, continua guardado e pode ser reativado.
O banco nem sequer aceita `DELETE` em procedimentos.

---

## 2. Criar o projeto no Supabase

1. Acesse <https://supabase.com> e entre (ou crie uma conta gratuita).
2. **New project** → escolha um nome (ex.: `josiane-beauty-studio`), defina uma senha forte para o banco
   (guarde no gerenciador de senhas) e a região **South America (São Paulo)** para ficar mais perto das clientes.
3. Aguarde o projeto ficar pronto (1–2 min).

## 3. Criar as tabelas (migrations)

No projeto, abra **SQL Editor → New query** e execute, **nesta ordem**, o conteúdo de cada arquivo:

1. [`supabase/migrations/20261104120000_catalogo_e_painel_admin.sql`](../supabase/migrations/20261104120000_catalogo_e_painel_admin.sql)
   — tabelas, regras de integridade, RLS e bucket de imagens.
2. [`supabase/migrations/20261104120100_seed_catalogo_atual.sql`](../supabase/migrations/20261104120100_seed_catalogo_atual.sql)
   — carrega os procedimentos que já estavam no site (com os mesmos preços, durações, fotos e valores de manutenção).

Clique em **Run**. Deve aparecer *"Success. No rows returned"*. Os dois scripts podem ser executados de novo sem
risco: o segundo **nunca sobrescreve** preços já editados no painel.

> **Alternativa (CLI):** `npx supabase link --project-ref <ref>` e depois `npx supabase db push`.

**Conferência:** em **Table Editor** devem existir `admins`, `categories` e `procedures` (as três com o selo
*RLS enabled*) e, em **Storage**, o bucket `procedure-images`.

## 4. Desligar o cadastro público (obrigatório)

Em **Authentication → Sign In / Providers** (em versões antigas: *Providers*), na seção **User Signups**,
**desative "Allow new users to sign up"** e salve.

Assim ninguém consegue criar conta sozinho. (Mesmo que fosse criada, a conta não seria administradora e o painel
e o banco recusariam qualquer alteração.)

Em **Authentication → URL Configuration**, defina **Site URL** com o endereço do site
(ex.: `https://josiane-vieira-beauty-studio.vercel.app`). Ele é usado nos e-mails de recuperação de senha.

Recomendado também, em **Authentication → Sign In / Providers → Email**:
* mínimo de **10 caracteres** para a senha e exigir letras maiúsculas, minúsculas e números;
* o resto pode ficar como está.

## 5. Criar a primeira administradora

**Passo 1 — criar o usuário.** Em **Authentication → Users → Add user → Create new user**:
* **Email:** o e-mail da Josiane (será o "usuário" do login);
* **Password:** uma senha forte;
* marque **Auto Confirm User**;
* **Create user**.

**Passo 2 — dar permissão de administradora.** Em **SQL Editor**, troque o e-mail e execute:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'josiane@exemplo.com'
on conflict do nothing;
```

**Conferir quem é administradora:**

```sql
select u.email, a.created_at
from public.admins a
join auth.users u on u.id = a.user_id;
```

**Remover uma administradora** (o acesso some na hora):

```sql
delete from public.admins
where user_id = (select id from auth.users where email = 'josiane@exemplo.com');
```

**Esqueceu a senha?** Em **Authentication → Users**, abra o menu (⋯) do usuário e use *Send password recovery*
(exige e-mail configurado) ou, em último caso, defina uma nova senha pelo SQL Editor:

```sql
update auth.users
set encrypted_password = extensions.crypt('NovaSenhaForte123', extensions.gen_salt('bf'))
where email = 'josiane@exemplo.com';
```

## 6. Variáveis de ambiente

Pegue os valores em **Project Settings → API Keys** (e a URL em **Project Settings → Data API**, campo *Project URL*).

| Variável | Valor | Observações |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Chave **pública** ("publishable"). Em projetos antigos pode ser a *anon public* (`eyJ...`) — nesse caso use o nome `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |

> 🔒 **Nunca** coloque a chave secreta / `service_role` em nenhuma variável deste projeto. O painel não precisa dela.
> A chave "publishable" é pública por desenho: quem protege os dados são as regras RLS do banco.

**Na Vercel:** *Project → Settings → Environment Variables* → cadastre as duas variáveis para **Production**
(e **Preview**, se quiser testar branches) → **Redeploy** (*Deployments → ⋯ → Redeploy*).

**Local:** copie `.env.example` para `.env.local` e preencha os mesmos valores.

> Enquanto as variáveis não existirem, o site público continua funcionando com o catálogo de contingência
> (o conteúdo original) e `/admin` mostra o aviso *"Painel ainda não configurado"*. Depois de configurar, o site
> **só** lê o banco: se o banco falhar, a página mantém a última versão válida e nunca volta a preços antigos.

## 7. Testar

1. Abra `https://SEU-SITE/admin` → faça login com o e-mail e a senha criados.
2. Altere o preço de um procedimento, salve e abra o site em outra aba/aparelho: o novo preço já aparece.
3. Cadastre um procedimento de teste com foto, depois **inative**, confira que sumiu do site e **reative**.

---

## 8. Usando o painel (para a Josiane)

| Quero... | Como |
|---|---|
| Mudar preço, duração, foto, nome | **Procedimentos → Editar** → altere → **Salvar alterações** |
| Cadastrar um novo | **+ Novo procedimento** → preencha → **Cadastrar procedimento** |
| Cadastrar valor de manutenção | No formulário, em **Outros valores**, toque em **+ Manutenção** e informe o valor |
| Tirar do site sem perder | **Inativar** (pode **Reativar** a qualquer momento) |
| Criar/renomear categoria | Aba **Categorias** |
| Ver como ficou | Botão **Ver site** (canto superior) |

Dicas: use a foto direto da galeria do celular (ela é reduzida automaticamente, então o envio é rápido, até no 4G).
O campo **Selo de destaque** é a etiqueta pequena sobre a foto (ex.: "Mais desejado").

---

## 9. Segurança: o que protege o painel

* **Sem cadastro público** e **sem credenciais no código**; a senha é guardada (com hash) pelo Supabase Auth.
* **Cada tela e cada ação** do painel confere, no servidor, o login **e** a permissão de administradora. `/admin` não é
  "segurança por esconder a URL".
* **RLS no banco:** visitantes só leem procedimentos *ativos*; só administradoras escrevem. Ninguém consegue se
  promover (a tabela `admins` não aceita escrita pela API).
* **Validação dupla:** formulário + servidor + restrições do banco (preço > 0, duração 5–720 min, nome único, URLs
  de imagem restritas ao nosso Storage, etc.).
* **Fotos:** só JPEG/PNG/WebP até 5 MB (o Storage recusa o resto; SVG fica de fora de propósito).
* **Exclusão lógica:** nada é apagado por engano.
* Cabeçalhos de `/admin`: sem cache, sem indexação e sem exibição em iframe.

Boas práticas: senha única e forte, não compartilhar o acesso, remover quem sair da equipe (seção 5).

---

## 10. Desenvolvimento local (opcional)

Com Docker instalado, dá para rodar um Supabase completo na máquina:

```bash
npx supabase start          # sobe Postgres + Auth + Storage e aplica as migrations
npx supabase status         # mostra a URL local e a chave publishable
npx supabase db reset       # recria o banco do zero (migrations + dados iniciais)
npx supabase stop
```

Coloque a URL (`http://127.0.0.1:54321`) e a chave *Publishable* no `.env.local`. Crie um usuário de teste em
`http://127.0.0.1:54323` (Studio → Authentication) e conceda admin com o SQL da seção 5.

Requisitos: Node.js 20 ou superior (o projeto funciona em 20, 22 e 24).

---

## 11. Problemas comuns

| Sintoma | Causa provável / solução |
|---|---|
| `/admin` mostra "Painel ainda não configurado" | Variáveis de ambiente ausentes (seção 6) ou falta **Redeploy** depois de cadastrá-las. |
| Login diz "E-mail ou senha incorretos" | Confira o e-mail/senha em *Authentication → Users*. Muitas tentativas bloqueiam por alguns minutos. |
| Login diz "Este e-mail ainda não foi confirmado" | O usuário foi criado sem **Auto Confirm User**. Em *Authentication → Users*, abra o menu (⋯) do usuário e confirme-o (ou recrie marcando a opção). |
| "Esta conta não tem permissão" | O usuário existe, mas não está em `public.admins` (seção 5, passo 2). |
| Alterei no painel e o site não mudou | Atualize a página. Se persistir, veja os logs da Vercel (*Functions*) e confirme as variáveis. Alterações feitas direto no banco levam cerca de 1 minuto. |
| Erro ao enviar foto | Formato não aceito (use JPG/PNG/WebP), sessão expirada (saia e entre de novo) ou bucket `procedure-images` ausente (rode a migration 1). |
| Build falha com "Não foi possível carregar os procedimentos" | O Supabase está configurado, mas as tabelas não existem (rode as migrations) ou o projeto está pausado (veja abaixo). A versão anterior do site permanece no ar. |

## Limites do plano gratuito

* Projetos gratuitos do Supabase **são pausados após ~1 semana sem atividade**. Se isso acontecer, o site continua
  exibindo a última versão, mas o painel para de funcionar até você clicar em **Restore project** no painel do Supabase.
  Visitas ao site já geram atividade; confira a política vigente em <https://supabase.com/pricing>.
* O plano gratuito não inclui backups diários automáticos. Faça um backup ocasional (*Table Editor → Export* ou
  `npx supabase db dump`) ou considere o plano Pro quando o negócio crescer.
* As fotos são entregues pelo otimizador de imagens do Next.js/Vercel (WebP no tamanho de cada tela), o que mantém
  o site leve no celular.
