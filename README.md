# Manifeste - E-commerce de Produtos Eróticos

Uma loja online discreta e elegante construída com Next.js, Supabase e Stripe, focada em privacidade e experiência do usuário sem necessidade de criação de conta.

## 🚀 Stack Tecnológica

- **Frontend:** Next.js 15 com App Router e TypeScript
- **Estilização:** Tailwind CSS + Shadcn/UI
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Pagamentos:** Stripe Checkout
- **E-mails:** Resend (opcional)
- **Hospedagem:** Vercel

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no Stripe
- Conta no Resend (opcional)

## 🛠️ Configuração Inicial

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd manifeste
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

Edite o `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_do_stripe
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_do_stripe

# Resend (opcional)
RESEND_API_KEY=re_sua_chave_do_resend

# Base URL da aplicação
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Configure o Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Vá para SQL Editor e execute o script SQL fornecido no arquivo `database.sql`
3. Copie a URL e a chave anônima do projeto para o `.env.local`

### 5. Configure o Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Obtenha suas chaves de teste no Dashboard
3. Configure o webhook para desenvolvimento:

```bash
# Instale o Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copie o webhook secret fornecido para o `.env.local`

### 6. Configure o Resend (opcional)

1. Crie uma conta no [Resend](https://resend.com)
2. Obtenha sua API key
3. Adicione ao `.env.local`

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts          # API para criar sessão Stripe
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts      # Webhook para processar pagamentos
│   ├── produto/
│   │   └── [id]/
│   │       └── page.tsx          # Página de produto individual
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Página principal
├── components/
│   ├── ui/                       # Componentes Shadcn/UI
│   ├── Header.tsx               # Cabeçalho com carrinho
│   ├── ProductCard.tsx          # Card de produto
│   ├── ProductDetail.tsx        # Detalhes do produto
│   └── ShoppingCart.tsx         # Carrinho de compras
├── hooks/
│   └── useCart.ts               # Hook para gerenciar carrinho
└── lib/
    ├── supabaseClient.ts        # Cliente Supabase
    └── utils.ts                 # Utilitários
```

## 🛒 Funcionalidades

- **Catálogo de Produtos:** Exibição de produtos com imagens, preços e descrições
- **Carrinho de Compras:** Gerenciamento local com localStorage
- **Checkout Guest:** Processamento de pagamentos sem criação de conta
- **Webhook Stripe:** Processamento automático de pedidos confirmados
- **E-mails Automáticos:** Confirmação de pedido via Resend
- **Design Responsivo:** Interface adaptável para mobile e desktop

## 🔒 Privacidade e Segurança

- **Sem Contas:** Checkout como convidado sem necessidade de registro
- **Dados Mínimos:** Coleta apenas informações essenciais para entrega
- **Pagamento Seguro:** Processamento via Stripe com PCI compliance
- **RLS:** Row Level Security no Supabase para proteção de dados

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Configure o webhook do Stripe para apontar para sua URL de produção
4. Deploy automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js.

## 📝 Script SQL do Banco

O arquivo `database.sql` contém toda a estrutura do banco de dados, incluindo:

- Tabelas: `categories`, `products`, `coupons`, `orders`, `order_items`
- Tipos ENUM para status
- Índices para performance
- Row Level Security (RLS)
- Políticas de acesso

## 🔧 Configuração do Webhook Stripe

Para desenvolvimento local:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Para produção, configure o webhook no Dashboard do Stripe para:

- **URL:** `https://seu-dominio.com/api/webhooks/stripe`
- **Eventos:** `checkout.session.completed`

## 📧 Configuração de E-mails

Para enviar e-mails de confirmação:

1. Configure o Resend no `.env.local`
2. Atualize o domínio de envio no webhook
3. Personalize os templates de e-mail no código

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação
2. Abra uma issue no GitHub
3. Consulte os logs do Supabase e Stripe

---

**Manifeste** - Privacidade e elegância em cada compra.
