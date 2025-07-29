# Estrutura do Projeto - Manifeste

## Estrutura da Raiz

```
manifesto/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # Componentes React reutilizáveis
│   ├── contexts/              # Contextos React (estado global)
│   ├── hooks/                 # Custom hooks
│   └── lib/                   # Utilitários e configurações
├── public/                    # Assets estáticos
├── Docs/                      # Documentação do projeto
├── .cursor/                   # Configurações do Cursor
└── arquivos de configuração
```

## Estrutura Detalhada

### `/src/app/` - Páginas e Rotas

```
app/
├── page.tsx                   # Página inicial
├── layout.tsx                 # Layout principal
├── globals.css                # Estilos globais
├── produtos/
│   └── page.tsx              # Listagem de produtos
├── produto/
│   └── [id]/
│       └── page.tsx          # Detalhes do produto
├── checkout/
│   └── page.tsx              # Página de checkout
├── admin/                     # Área administrativa
│   ├── login/
│   │   └── page.tsx
│   └── pedidos/
│       ├── layout.tsx
│       ├── page.tsx
│       └── [id]/
│           └── page.tsx
├── api/                       # API Routes
│   ├── checkout/
│   │   └── route.ts
│   ├── orders/
│   │   ├── route.ts
│   │   ├── get-by-session/
│   │   │   └── route.ts
│   │   └── track/
│   │       └── route.ts
│   ├── send-order-email/
│   │   └── route.ts
│   ├── validate-coupon/
│   │   └── route.ts
│   ├── validate-referral/
│   └── webhooks/
│       └── stripe/
│           └── route.ts
└── páginas estáticas/
    ├── missao-visao-valores/
    ├── politica-de-entrega/
    ├── politica-de-privacidade/
    ├── quem-somos/
    ├── sucesso/
    └── trocas-e-devolucoes/
```

### `/src/components/` - Componentes Reutilizáveis

```
components/
├── ui/                        # Componentes base (shadcn/ui)
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── loading.tsx
│   ├── radio-group.tsx
│   ├── select.tsx
│   └── toast.tsx
├── Banner.tsx                 # Componente de banner
├── BannerCarousel.tsx         # Carrossel de banners
├── Footer.tsx                 # Rodapé
├── Header.tsx                 # Cabeçalho
├── ProductCard.tsx            # Card de produto
├── ProductDetail.tsx          # Detalhes do produto
├── ShoppingCart.tsx           # Carrinho de compras
└── StagewiseDevToolbar.tsx    # Toolbar de desenvolvimento
```

### `/src/contexts/` - Contextos React

```
contexts/
├── CartContext.tsx            # Contexto do carrinho
└── ThemeContext.tsx           # Contexto de tema
```

### `/src/hooks/` - Custom Hooks

```
hooks/
└── useCart.ts                # Hook do carrinho
```

### `/src/lib/` - Utilitários e Configurações

```
lib/
├── types/
│   └── supabse.ts            # Tipos do Supabase
├── gtag.ts                   # Google Analytics
├── supabaseClient.ts         # Cliente Supabase
└── utils.ts                  # Funções utilitárias
```

### `/public/` - Assets Estáticos

```
public/
├── banner/                    # Imagens de banner
│   ├── bath.png
│   ├── bed.png
│   ├── flower.png
│   ├── hand.png
│   ├── hands.png
│   └── new/                   # Novas imagens
├── card.svg                   # Ícones SVG
├── entrega.png
├── file.svg
├── frete.svg
├── globe.svg
├── icon.svg
├── logo.png                   # Logo da marca
├── logo.svg
├── next.svg
├── pagamento.svg
├── vercel.svg
└── window.svg
```

### `/Docs/` - Documentação

```
Docs/
├── Implementation.md          # Plano de implementação
├── project_structure.md       # Esta documentação
└── UI_UX_doc.md              # Documentação de UI/UX
```

## Arquivos de Configuração

### Configurações Principais:

- `package.json` - Dependências e scripts
- `next.config.js` - Configuração do Next.js
- `tsconfig.json` - Configuração do TypeScript
- `tailwind.config.js` - Configuração do Tailwind CSS
- `eslint.config.mjs` - Configuração do ESLint
- `postcss.config.mjs` - Configuração do PostCSS

### Arquivos de Marca:

- `brand.mdc` - Diretrizes de marca
- `design.json` - Configurações de design
- `components.json` - Configuração do shadcn/ui

## Padrões de Organização

### Nomenclatura:

- **Componentes:** PascalCase (ex: `ProductCard.tsx`)
- **Hooks:** camelCase com prefixo `use` (ex: `useCart.ts`)
- **Páginas:** kebab-case (ex: `produto/[id]/page.tsx`)
- **Utilitários:** camelCase (ex: `supabaseClient.ts`)

### Estrutura de Componentes:

- Componentes base em `/components/ui/`
- Componentes específicos em `/components/`
- Contextos em `/contexts/`
- Hooks customizados em `/hooks/`

### Estrutura de Páginas:

- Páginas principais em `/app/`
- API routes em `/app/api/`
- Layouts compartilhados em `/app/layout.tsx`

## Configurações de Ambiente

### Variáveis de Ambiente:

- `.env.example` - Exemplo de variáveis
- Configurações do Supabase
- Chaves do Stripe
- Configurações do Google Analytics

### Dependências Principais:

- **Next.js 15.3.5** - Framework React
- **React 19.0.0** - Biblioteca de UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS
- **Supabase** - Backend as a Service
- **Stripe** - Processamento de pagamentos
- **Radix UI** - Componentes acessíveis

## Fluxo de Desenvolvimento

### Estrutura de Branches:

- `main` - Código de produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `hotfix/*` - Correções urgentes

### Processo de Deploy:

1. Desenvolvimento local
2. Testes em ambiente de staging
3. Deploy para produção
4. Monitoramento e feedback

## Considerações de Performance

### Otimizações:

- **Imagens:** Otimização automática do Next.js
- **Bundle:** Code splitting automático
- **Caching:** Estratégias de cache implementadas
- **SEO:** Meta tags e estrutura otimizada

### Monitoramento:

- Google Analytics para métricas
- Error tracking para bugs
- Performance monitoring
- User experience tracking
