# Personalizando Etiquetas

Site de vendas de etiquetas, tags e adesivos personalizados, com catálogo de produtos, carrinho de compras e finalização de pedido via WhatsApp.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Arquitetura CSS](#arquitetura-css)
- [Arquitetura JS](#arquitetura-js)
- [Fluxo de Dados](#fluxo-de-dados)
- [Funcionalidades](#funcionalidades)
- [Como rodar localmente](#como-rodar-localmente)
- [Como adicionar produtos](#como-adicionar-produtos)
- [Dependências externas](#dependências-externas)

---

## Visão Geral

O site é composto por duas páginas principais:

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Home | `index.html` | Apresentação da marca, produto em destaque e benefícios |
| Catálogo | `catalogo/index.html` | Listagem de produtos por categoria, carrinho e checkout |

Não há backend. Todos os dados de produtos são lidos de um arquivo JSON estático, e o checkout é feito via link do WhatsApp com o resumo do pedido.

---

## Estrutura de Arquivos

```
/
├── index.html                  # Página inicial
├── products.json               # Base de dados dos produtos + configurações
├── catalogo/
│   └── index.html              # Página do catálogo
├── scripts/
│   ├── data.js                 # loadData() + exports: PRODUCTS_DATA, CATEGORIES, FEATURED_PRODUCT_ID…
│   ├── utils.js                # formatCurrency()
│   ├── home.js                 # Script exclusivo da home — produto em destaque, dropdown, add ao carrinho
│   ├── main.js                 # Ponto de entrada do catálogo — importa e orquestra todos os módulos
│   ├── products.js             # Renderização de categorias, cards e busca
│   ├── drop.js                 # Dropdown de opções dos cards do catálogo
│   ├── cart.js                 # Estado e UI do carrinho
│   ├── modal.js                # Modal de ampliação da imagem do produto
│   ├── toast.js                # Toast de confirmação ao adicionar item
│   └── whatsapp-tooltip.js     # Tooltip animado do botão WhatsApp (FAB)
├── styles/
│   ├── style.css               # Ponto de entrada — apenas @imports
│   ├── base.css                # Reset, variáveis CSS, tipografia, utilitários globais
│   ├── animations.css          # Keyframes e transições
│   ├── home.css                # Estilos exclusivos da página inicial
│   ├── header.css              # Header (banners, logo, botão carrinho, responsivo)
│   ├── categories.css          # Barra de categorias com scroll horizontal
│   ├── products.css            # Grid, cards, dropdown e botão adicionar ao carrinho
│   ├── cart.css                # Sidebar do carrinho (modal overlay, itens, total)
│   ├── benefits.css            # Seção de benefícios da home
│   └── footer.css              # Rodapé e FAB (Floating Action Button)
└── images/
    ├── logo-personalizandoetiquetas-redondo.png
    ├── tags-400x1320px.png
    ├── tags-jl-hero.png
    └── produtos/
        ├── mini-tag-padrao.png
        ├── tag-retangular-padrao.png
        ├── tag-corte-especial.png
        └── cartao-visita-padrao.png
```

---

## Arquitetura CSS

O CSS está organizado em módulos independentes. O arquivo `styles/style.css` é o único importado nos HTMLs — ele reúne todos os outros via `@import`.

```css
/* styles/style.css */
@import './base.css';
@import './animations.css';
@import './header.css';
@import './home.css';
@import './categories.css';
@import './products.css';
@import './cart.css';
@import './footer.css';
@import './benefits.css';
```

### Módulos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `base.css` | Variáveis CSS (cores, sombras, raios, transições), reset, tipografia, utilitários globais |
| `header.css` | Banner de frete, banner CTA WhatsApp, logo, botões do header, responsivo mobile |
| `categories.css` | Barra de categorias com scroll horizontal, botão ativo/inativo, título e contador |
| `products.css` | Grid de produtos, cards com imagem, chips de specs, dropdown de opções, botão adicionar |
| `cart.css` | Modal overlay, sidebar com animação, header do carrinho, itens, quantidades, total, estado vazio |
| `footer.css` | Rodapé e FAB com tooltip do WhatsApp e badge do carrinho |
| `home.css` | Hero, seção de produto em destaque, seção de benefícios da página inicial |
| `benefits.css` | Grid de benefícios (ícones + texto) |
| `animations.css` | Keyframes do toast, shine das estrelas, transições de entrada/saída |

### Variáveis CSS (definidas em `base.css`)

```css
--pink              /* #F03E7A — cor primária */
--pink-light        /* #FFF0F5 — fundo rosa claro */
--pink-mid          /* #FFD6E7 — rosa médio */
--gold              /* #FF8C0F — badge "mais vendido" */
--black             /* #111111 */
--gray-mid          /* #777777 — texto secundário */
--gray-light        /* #F5F5F5 — fundos neutros */
--gray-border       /* #E8E8E8 — bordas */
--green-wpp         /* #25D366 — botão WhatsApp */
--radius / --radius-sm / --radius-lg / --radius-full
--shadow / --shadow-sm / --shadow-lg / --shadow-pink
--transition / --transition-slow
```

### Breakpoints

As media queries ficam **dentro de cada arquivo CSS**, ao final, referentes apenas aos seus próprios elementos:

| Breakpoint | Uso |
|-----------|-----|
| `max-width: 480px` | Mobile pequeno — botões do header reduzidos, padding menor |
| `max-width: 640px` | Mobile — header empilhado, busca em largura total |
| `min-width: 640px` | Grid de produtos em 2 colunas |
| `min-width: 768px` | Grid de produtos em 3 colunas |
| `min-width: 1100px` | Grid de produtos em 4 colunas |

> **Grid de produtos:** começa em 1 coluna no mobile (< 640px), e cresce progressivamente conforme a largura da tela.

---

## Arquitetura JS

Todos os scripts do catálogo usam **ES Modules** (`type="module"`). O `main.js` é o único importado no HTML e orquestra os demais.

### Módulos

#### `data.js`
Faz `fetch('/products.json')` e exporta as variáveis globais:
- `PRODUCTS_DATA` — array de produtos
- `CATEGORIES` — array de strings das categorias
- `WHATSAPP_NUMBER` — número de contato
- `ACTIVE_CATEGORY` — categoria selecionada por padrão
- `FEATURED_PRODUCT_ID` — id do produto em destaque na home

#### `products.js`
- `init()` — inicializa categorias e produtos
- `renderCategories()` — injeta os botões de categoria no `#category-list`
- `setCategory(cat)` — troca a categoria ativa e re-renderiza
- `renderProducts()` — filtra `PRODUCTS_DATA` pela categoria ativa e injeta os cards no `#products-grid`
- `handleSearch(value)` / `clearSearch()` — busca em tempo real por título, specs ou categoria

Cada card gerado contém:
- Imagem clicável (abre modal)
- Título e chips de specs
- Preço "A partir de" (`#price-{id}`)
- Dropdown de opções (`#dropdown-{id}`, `#menu-{id}`)
- Elementos separados para quantidade (`#selected-{id}`), preço unitário (`#selected-unit-{id}`) e total (`#selected-price-{id}`)
- Botão de adicionar ao carrinho

#### `drop.js`
- `toggleDropdown(id)` — abre/fecha o menu de opções, fechando todos os outros; adiciona `.dropdown-open` ao card para liberar o `overflow: visible` e o menu flutuar acima dos vizinhos
- `selectOption(productId, index)` — atualiza individualmente os elementos de qtd, preço unitário e total ao selecionar uma opção; salva o índice no `data-selected` do dropdown

#### `cart.js`
- `addToCart(productId)` — lê o `data-selected` do dropdown e adiciona ao carrinho; agrupa automaticamente se o mesmo produto+opção já existir (incrementa `quantity`)
- `removeFromCart(cartId)` — remove item pelo `cartId` único
- `changeQuantity(cartId, delta)` — incrementa ou decrementa; remove ao chegar a zero
- `clearCart()` — esvazia o carrinho com confirmação
- `updateCartUI()` — re-renderiza badges, lista, total e estados
- `toggleCart(show)` — abre/fecha o modal alternando `cart-visible` / `cart-hidden`
- `checkoutWhatsApp()` — monta a mensagem formatada e abre `wa.me`
- `saveCartToStorage()` / `loadCartFromStorage()` — persiste no `localStorage` com a chave `meuCarrinhoCompras`

#### `home.js`
Script exclusivo da `index.html`:
- `renderFeaturedProduct()` — busca o produto pelo `FEATURED_PRODUCT_ID` e preenche a seção de destaque
- `renderFeaturedDropdown()` — renderiza o dropdown de opções da home
- `addFeaturedToCart()` — salva o item no `localStorage`, marca `sessionStorage.openCart = 1` e redireciona para `/catalogo`
- Funções `toggleFeaturedDropdown()` e `selectFeaturedOption()` expostas globalmente

#### `modal.js`
- `setupImageModal()` — injeta o HTML do modal no `<body>` (uma vez no carregamento)
- `openImageModal(productId)` — preenche e exibe o modal com a imagem do produto
- `closeImageModal()` / `forceCloseModal()` — fecha o modal

#### `toast.js`
- `showAddedToast()` — exibe o toast de confirmação com barra de progresso de 6s e botões de ação
- `hideToast()` — remove o toast com animação de saída

#### `utils.js`
- `formatCurrency(value)` — formata para `R$ 0,00` com `Intl.NumberFormat` e arredondamento para cima (`Math.ceil`)

#### `whatsapp-tooltip.js`
- `initWhatsAppTooltip()` — exibe e anima o balão de dúvida próximo ao FAB do WhatsApp após um delay

---

## Fluxo de Dados

```
products.json
     │
     ▼
data.js (fetch + exporta variáveis)
     │
     ▼
main.js (importa tudo e chama loadData → init)
     │
     ├── products.js → renderiza categorias e cards no DOM
     ├── cart.js → carrega carrinho do localStorage e atualiza UI
     ├── modal.js → injeta modal de imagem no body
     ├── drop.js → funções do dropdown expostas globalmente
     └── whatsapp-tooltip.js → inicializa tooltip do FAB
```

### Fluxo do checkout

```
Usuário clica "Adicionar ao carrinho"
     │
     ▼
addToCart(productId)
  └── lê data-selected do dropdown
  └── agrupa se já existe, senão push
  └── saveCartToStorage()
  └── updateCartUI()
  └── showAddedToast()
     │
     ▼
Usuário clica "Enviar Pedido no WhatsApp"
     │
     ▼
checkoutWhatsApp()
  └── monta mensagem formatada com itens, qtd e total
  └── window.open(wa.me/...)
```

### Fluxo home → catálogo (produto em destaque)

```
Usuário clica "Adicionar ao Carrinho" na home
     │
     ▼
addFeaturedToCart()
  └── salva item no localStorage
  └── sessionStorage.setItem("openCart", "1")
  └── redireciona para /catalogo
     │
     ▼
cart.js (window load no catálogo)
  └── lê sessionStorage "openCart"
  └── chama toggleCart(true) após 300ms
```

---

## Funcionalidades

- **Catálogo por categorias** — filtro por Tags, Cartões, Adesivos, Outros
- **Busca em tempo real** — filtra por título, specs ou categoria
- **Dropdown de opções** — cada produto tem múltiplas opções de quantidade/preço com animação de entrada
- **Carrinho persistente** — salvo no `localStorage`, sobrevive a recarregamentos
- **Agrupamento automático** — adicionar o mesmo produto+opção incrementa a quantidade
- **Controle de quantidade** — botões +/− no carrinho com remoção ao zerar
- **Modal de imagem** — clique na foto do produto para ampliar
- **Toast de confirmação** — notificação ao adicionar item com barra de progresso
- **Checkout WhatsApp** — mensagem formatada com todos os itens, quantidades e total
- **Abertura automática do carrinho** — ao voltar da home após adicionar o produto em destaque
- **Responsivo** — 1 coluna (mobile), 2 colunas (640px+), 3 colunas (768px+), 4 colunas (1100px+)

---

## Como rodar localmente

O projeto usa `fetch('/products.json')`, então precisa de um servidor HTTP (não funciona abrindo o HTML via `file://`).

**Opção 1 — VS Code Live Server**
Instale a extensão "Live Server" e clique em "Go Live".

**Opção 2 — Python**
```bash
python3 -m http.server 8080
```
Acesse `http://localhost:8080`

**Opção 3 — Node.js**
```bash
npx serve .
```

---

## Como adicionar produtos

Edite o arquivo `products.json` seguindo a estrutura:

```json
{
  "id": 6,
  "category": "Adesivos",
  "title": "Nome do produto",
  "image": "/images/produtos/nome-do-arquivo.png",
  "specs": "Dimensões • Acabamento • Material",
  "options": [
    { "qtd": 100, "price": 49.90, "label": "" },
    { "qtd": 500, "price": 149.90, "label": "MAIS VENDIDO" },
    { "qtd": 1000, "price": 249.90, "label": "Economize R$50,00" }
  ]
}
```

> Para trocar o produto em destaque da home, basta mudar o `FEATURED_PRODUCT_ID` no `products.json`:
> ```json
> "FEATURED_PRODUCT_ID": 3
> ```

> **`label`** aceita três formatos reconhecidos pelo sistema:
> - `"MAIS VENDIDO"` — badge laranja com estrela
> - `"Economize R$X,00"` — texto verde
> - Qualquer outro texto — exibido em cinza

Para adicionar uma nova **categoria**, inclua a string no array `CATEGORIES` do `products.json`:

```json
"CATEGORIES": ["Tags", "Cartões", "Adesivos", "Outros", "Nova Categoria"]
```

---

## Dependências externas

| Dependência | Uso | CDN |
|------------|-----|-----|
| **Lucide Icons** | Ícones SVG (carrinho, caminhão, x, seta, etc.) | `https://unpkg.com/lucide@latest` |
| **Inter (Google Fonts)** | Fonte principal do site | `https://fonts.googleapis.com` |
| **Material Icons Outlined** | Ícone de estrela animado na home | `https://fonts.googleapis.com/icon` |

> Nenhuma dependência de CSS de terceiros — o projeto usa CSS puro modular, sem Tailwind ou frameworks.
