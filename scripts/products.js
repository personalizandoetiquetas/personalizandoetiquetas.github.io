import { PRODUCTS_DATA, CATEGORIES, WHATSAPP_NUMBER, ACTIVE_CATEGORY } from "./data.js";
import { formatCurrency } from './utils.js';

let activeCategory = "";
let searchQuery    = "";

function init() {
    activeCategory = ACTIVE_CATEGORY;
    renderCategories();
    renderProducts();
    lucide.createIcons();
}

function renderCategories() {
    const container = document.getElementById('category-list');
    container.innerHTML = CATEGORIES.map(cat => `
        <button onclick="setCategory('${cat}')" class="cat-btn ${activeCategory === cat ? 'active' : ''}">
            ${cat}
        </button>
    `).join('');

    document.getElementById('current-category-title').innerText =
        searchQuery ? `Resultados para "${searchQuery}"` : activeCategory;
}

function setCategory(cat) {
    activeCategory = cat;
    searchQuery    = "";
    const input = document.getElementById('search-input');
    const clear = document.getElementById('search-clear');
    if (input) input.value = "";
    if (clear) clear.classList.remove('visible');
    renderCategories();
    renderProducts();
}

function handleSearch(value) {
    searchQuery = value.trim();
    const clear = document.getElementById('search-clear');
    if (clear) clear.classList.toggle('visible', searchQuery.length > 0);
    renderCategories();
    renderProducts();
}

function clearSearch() {
    searchQuery = "";
    const input = document.getElementById('search-input');
    const clear = document.getElementById('search-clear');
    if (input) { input.value = ""; input.focus(); }
    if (clear) clear.classList.remove('visible');
    renderCategories();
    renderProducts();
}

function renderProducts() {
    const container = document.getElementById('products-grid');

    let filtered = searchQuery
        ? PRODUCTS_DATA.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : PRODUCTS_DATA.filter(p => p.category === activeCategory);

    document.getElementById('item-count').innerText =
        `${filtered.length} ${filtered.length === 1 ? 'item' : 'itens'}`;

    if (filtered.length === 0) {
        container.innerHTML = searchQuery
            ? `<div class="search-empty">
                <strong>Nenhum resultado para "${searchQuery}"</strong>
                <span>Tente outro termo ou <button onclick="clearSearch()" style="background:none;border:none;color:var(--pink);font-weight:700;cursor:pointer;font-family:inherit;font-size:13px;">veja todos os produtos</button></span>
               </div>`
            : `<div class="products-empty"><p>Nenhum produto encontrado nesta categoria.</p></div>`;
        return;
    }

    container.innerHTML = filtered.map(product => {
        const opt0     = product.options[0];
        const imageTag = product.specs.split('•')[0].trim();

        const chips = product.specs
            .split('•')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => `<span class="product-spec-chip">${s}</span>`)
            .join('');

        const options = product.options.map((opt, idx) => `
            <div onclick="selectOption(${product.id}, ${idx})"
                 id="option-${product.id}-${idx}"
                 class="option-item opacity-0 translate-y-3 scale-95">
                <div class="opt-left">
                    <span class="opt-qty">${opt.qtd} uni.</span>
                    <span class="opt-unit">${formatCurrency(opt.price / opt.qtd)}/uni.</span>
                </div>
                <span class="opt-price">${formatCurrency(opt.price)}</span>
            </div>
        `).join('');

        return `
        <div class="product-card">

            <div class="product-image-wrap" onclick="openImageModal(${product.id})">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <div class="product-image-tag">${imageTag}</div>
            </div>

            <div class="product-body">
                <h3 class="product-title">${highlightMatch(product.title, searchQuery)}</h3>
                <div class="product-specs-chips">${chips}</div>
                <p class="product-specs">${product.specs}</p>
                <div class="product-from-price">
                    <div class="product-from-label">A partir de</div>
                    <span id="price-${product.id}" class="product-from-value preco">${formatCurrency(opt0.price)}</span>
                </div>
            </div>

            <div class="product-actions">
                <div class="dropdown-wrap" id="dropdown-${product.id}" data-selected="0">

                    <button type="button" onclick="toggleDropdown(${product.id})" class="dropdown-trigger">
                        <div class="dd-left">
                            <span id="selected-${product.id}" class="dd-qty">${opt0.qtd} uni.</span>
                            <span id="selected-unit-${product.id}" class="dd-unit">${formatCurrency(opt0.price / opt0.qtd)}/uni.</span>
                        </div>
                        <div class="dd-right">
                            <span id="selected-price-${product.id}" class="dd-price">${formatCurrency(opt0.price)}</span>
                            <span id="arrow-${product.id}" class="dropdown-arrow">
                                <i data-lucide="chevron-down"></i>
                            </span>
                        </div>
                    </button>

                    <div id="menu-${product.id}" class="dropdown-menu opacity-0 scale-95 pointer-events-none">
                        ${options}
                    </div>
                </div>

                <button onclick="addToCart(${product.id})" class="btn-add-cart">
                    <i data-lucide="shopping-cart"></i>
                    <span>Adicionar ao Carrinho</span>
                </button>
            </div>

        </div>`;
    }).join('');

    lucide.createIcons();
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:var(--pink-mid);color:var(--black);border-radius:2px;padding:0 2px;">$1</mark>');
}

window.init             = init;
window.renderCategories = renderCategories;
window.setCategory      = setCategory;
window.renderProducts   = renderProducts;
window.handleSearch     = handleSearch;
window.clearSearch      = clearSearch;

export { init, renderCategories, setCategory, renderProducts, handleSearch, clearSearch };
