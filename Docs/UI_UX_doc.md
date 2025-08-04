# Documentação de UI/UX - Manifeste

## Sistema de Design

### Paleta de Cores

**Cores Principais:**

- **Roxo Médio:** `#8e44ad` - Criatividade, mistério, sexualidade
- **Coral Rosado:** `#ff6f61` - Calor, acolhimento
- **Nude Claro:** `#f4eae6` - Elegância, sofisticação
- **Champanhe:** `#f8e5d8` - Premium, luxo
- **Preto:** `#000` - Contraste, elegância
- **Dourado Metálico:** Detalhes premium

**Cores Secundárias:**

- **Roxo Claro:** `#b689e0` - Background principal
- **Rosa Vibrante:** `#fe53b3` - Call-to-action
- **Azul:** `#7b61ff` - Elementos interativos
- **Verde:** `#00b85b` - Preços, sucesso

### Tipografia

**Família Principal:** Poppins

- **Peso:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Tamanhos:** 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px
- **Uso:** Títulos, textos principais, botões

**Família Secundária:** Montserrat

- **Peso:** 400 (Regular), 500 (Medium), 600 (SemiBold)
- **Uso:** Textos secundários, navegação

### Espaçamento

**Sistema de Grid:**

- **Base:** 4px
- **Espaçamentos:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px
- **Margens:** 16px, 24px, 32px, 48px
- **Padding:** 8px, 12px, 16px, 20px, 24px

## Componentes de UI

### Cards de Produto

**Especificações:**

- **Altura:** Uniforme (420px para desktop, 220px para mobile)
- **Largura:** Responsiva (grid adaptativo)
- **Border Radius:** 2.5rem (40px)
- **Sombra:** `shadow-xl` com hover `shadow-2xl`
- **Background:** Branco com borda `#ececec`
- **Hover:** `-translate-y-2` com `scale-105` (mobile)

**Estados:**

- **Normal:** Sombra suave, borda sutil
- **Hover:** Elevação, escala, sombra intensa
- **Loading:** Skeleton com animação
- **Error:** Bordas vermelhas, ícone de erro

### Imagens de Produto

**Especificações:**

- **Border Radius:** 1rem (16px) para suavizar
- **Aspect Ratio:** 1:1 (quadrado) com `object-fit: contain`
- **Sombra:** Sutil para profundidade
- **Loading:** Placeholder com animação
- **Error:** Ícone de imagem quebrada

**Otimizações:**

- **Lazy Loading:** Implementado
- **Formatos:** WebP com fallback JPEG
- **Tamanhos:** Responsivos (sm, md, lg, xl)

### Botões

**Tipos:**

1. **Primário:** `#fe53b3` com texto branco
2. **Secundário:** Borda `#7b61ff` com texto roxo
3. **Terciário:** Transparente com borda

**Estados:**

- **Normal:** Cor base
- **Hover:** Escala 105%, sombra
- **Active:** Escala 95%
- **Disabled:** Opacidade 50%

### Formulários

**Inputs:**

- **Border:** 1px sólido `#e1e1e1`
- **Focus:** 2px `#fe53b3`
- **Border Radius:** 0.5rem (8px)
- **Padding:** 12px 16px

**Labels:**

- **Cor:** Preto
- **Peso:** 500 (Medium)
- **Tamanho:** 14px

## Responsividade

### Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Grid System

**Mobile:**

- **Colunas:** 1-2 produtos por linha
- **Espaçamento:** 16px
- **Margens:** 16px

**Tablet:**

- **Colunas:** 2-3 produtos por linha
- **Espaçamento:** 24px
- **Margens:** 24px

**Desktop:**

- **Colunas:** 3-5 produtos por linha
- **Espaçamento:** 32px
- **Margens:** 32px

### Adaptações Específicas

**Cards de Produto:**

- **Mobile:** Altura reduzida, texto menor
- **Tablet:** Altura média, texto médio
- **Desktop:** Altura completa, texto grande

**Navegação:**

- **Mobile:** Menu hambúrguer
- **Tablet:** Menu horizontal compacto
- **Desktop:** Menu horizontal completo

## Microinterações

### Animações

**Transições:**

- **Duração:** 200ms (rápida), 300ms (média), 500ms (lenta)
- **Easing:** `ease-in-out` para suavidade
- **Propriedades:** `transform`, `opacity`, `color`

**Hover Effects:**

- **Cards:** Elevação + escala
- **Botões:** Escala + sombra
- **Links:** Mudança de cor suave

### Loading States

**Skeletons:**

- **Cards:** Retângulos com animação pulse
- **Imagens:** Placeholder com shimmer
- **Textos:** Linhas com animação

**Spinners:**

- **Tamanho:** 24px, 32px, 48px
- **Cor:** `#fe53b3`
- **Duração:** 1s

## Acessibilidade

### Contraste

- **Texto:** Mínimo 4.5:1
- **Elementos interativos:** Mínimo 3:1
- **Cores:** Testadas para daltonismo

### Navegação por Teclado

- **Tab Order:** Lógico e intuitivo
- **Focus:** Visível e destacado
- **Skip Links:** Para navegação rápida

### Screen Readers

- **Alt Text:** Descritivo para imagens
- **ARIA Labels:** Para elementos complexos
- **Semântica:** HTML semântico correto

## Experiência do Usuário

### Fluxo de Compra

1. **Descoberta:** Listagem clara e atrativa
2. **Exploração:** Detalhes completos do produto
3. **Seleção:** Escolha de variantes intuitiva
4. **Compra:** Checkout simplificado
5. **Confirmação:** Feedback claro do sucesso

### Estados de Feedback

**Sucesso:**

- **Cor:** Verde (`#00b85b`)
- **Ícone:** Checkmark
- **Mensagem:** Clara e positiva

**Erro:**

- **Cor:** Vermelho (`#ff4136`)
- **Ícone:** X ou warning
- **Mensagem:** Explicativa e com solução

**Informação:**

- **Cor:** Azul (`#0074d9`)
- **Ícone:** Info
- **Mensagem:** Útil e contextual

## Padrões de Marca

### Tom de Voz

- **Empoderador:** Encoraja autoestima
- **Caloroso:** Acolhedor e próximo
- **Informativo:** Educativo sem ser técnico
- **Elegante:** Sofisticado sem ser distante

### Elementos Visuais

**Formas:**

- **Fluídas:** Silhuetas, ondas, borboletas
- **Orgânicas:** Flores, pontos concêntricos
- **Suaves:** Bordas arredondadas

**Texturas:**

- **Sutis:** Sombras suaves
- **Elegantes:** Gradientes discretos
- **Premium:** Detalhes dourados

### Fotografia

**Estilo:**

- **Conceitual:** Mãos, sombras, texturas
- **Sensorial:** Cenários que evocam sensações
- **Inclusivo:** Diversidade de corpos e tons

**Diretrizes:**

- **Sem nudez explícita**
- **Foco em elegância**
- **Representação diversa**
- **Qualidade profissional**

## Implementação Técnica

### CSS Variables

```css
:root {
  --background: #b689e0;
  --secondary: #fe53b3;
  --secondary-background: #e1e1e1;
  --primary: #8e44ad;
  --accent: #7b61ff;
  --success: #00b85b;
  --error: #ff4136;
  --text: #000;
  --text-secondary: #666;
}
```

### Classes Utilitárias

```css
/* Cards */
.product-card {
  @apply rounded-[2.5rem] shadow-xl border border-[#ececec];
}

/* Botões */
.btn-primary {
  @apply bg-[#fe53b3] text-white rounded-full font-bold;
}

/* Transições */
.transition-smooth {
  @apply transition-all duration-300 ease-in-out;
}
```

### Componentes Base

- **Button:** Reutilizável com variantes
- **Card:** Base para produtos e conteúdo
- **Input:** Formulários consistentes
- **Modal:** Overlays e diálogos
- **Toast:** Notificações temporárias

## Testes de Usabilidade

### Critérios de Aceitação

- [ ] Navegação intuitiva em todos os dispositivos
- [ ] Tempo de carregamento < 3s
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Funcionamento offline básico
- [ ] Feedback visual para todas as ações

### Métricas de Performance

- **Core Web Vitals:**
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

- **UX Metrics:**
  - Task completion rate > 90%
  - Error rate < 5%
  - User satisfaction > 4.5/5
