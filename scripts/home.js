/**
 * home.js — Script exclusivo da página inicial (index.html)
 *
 * Responsabilidades:
 *  - Carregar os dados do products.json
 *  - Renderizar o produto em destaque dinamicamente (FEATURED_PRODUCT_ID)
 *  - Gerenciar o dropdown de opções do produto em destaque
 *  - Adicionar o produto ao carrinho e redirecionar para o catálogo
 */

import { loadData, PRODUCTS_DATA, FEATURED_PRODUCT_ID, WHATSAPP_NUMBER } from './data.js';
import { formatCurrency } from './utils.js';

// Índice da opção selecionada no dropdown da home
let selectedOptionIndex = 0;

// ─── Inicialização ────────────────────────────────────────────────────────────

async function init() {
    await loadData();
    renderFeaturedProduct();
    lucide.createIcons();
}

// ─── Produto em destaque ──────────────────────────────────────────────────────

function renderFeaturedProduct() {
    const product = PRODUCTS_DATA.find(p => p.id === FEATURED_PRODUCT_ID)
                 ?? PRODUCTS_DATA[0]; // fallback para o primeiro produto

    if (!product) return;

    selectedOptionIndex = 0;
    const firstOption   = product.options[0];

    // Preenche os elementos estáticos do HTML
    const imgEl    = document.getElementById('featured-image');
    const titleEl  = document.getElementById('featured-title');
    const priceEl  = document.getElementById('featured-price');
    const specsEl  = document.getElementById('featured-specs');
    const dropEl   = document.getElementById('featured-dropdown');

    if (imgEl)   { imgEl.src = product.image; imgEl.alt = product.title; }
    if (titleEl) titleEl.textContent = product.title;
    if (priceEl) priceEl.textContent = `A partir de ${formatCurrency(firstOption.price)}`;

    if (specsEl) {
        specsEl.innerHTML = product.specs
            .split('•')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => `<li>${s}</li>`)
            .join('');
    }

    if (dropEl) renderFeaturedDropdown(product, dropEl);

    // Botão "Adicionar ao Carrinho" — injeta o productId dinamicamente
    const btnAdd = document.getElementById('btn-featured-add');
    if (btnAdd) {
        btnAdd.onclick = () => addFeaturedToCart(product);
    }
}

function renderFeaturedDropdown(product, container) {
    const first = product.options[0];

    container.innerHTML = `
        <button
            type="button"
            class="featured-dropdown-trigger"
            id="featured-trigger"
            onclick="toggleFeaturedDropdown()"
            aria-haspopup="listbox"
            aria-expanded="false"
        >
            <span id="featured-selected-label" class="featured-selected-label">
                ${first.qtd} uni. — ${formatCurrency(first.price)}
            </span>
            <span class="dropdown-arrow" id="featured-arrow">
                <i data-lucide="chevron-down"></i>
            </span>
        </button>

        <ul
            class="featured-dropdown-menu opacity-0 scale-95 pointer-events-none"
            id="featured-menu"
            role="listbox"
        >
            ${product.options.map((opt, idx) => `
                <li
                    role="option"
                    class="featured-option-item ${idx === 0 ? 'option-selected' : ''}"
                    id="featured-opt-${idx}"
                    onclick="selectFeaturedOption(${idx})"
                    data-price="${opt.price}"
                    data-qtd="${opt.qtd}"
                >
                    <span class="featured-opt-left">
                        <span class="featured-opt-qty">${opt.qtd} uni.</span>
                        <span class="featured-opt-unit">${formatCurrency(opt.price / opt.qtd)} / uni.</span>
                    </span>
                    <span class="featured-opt-price">${formatCurrency(opt.price)}</span>
                    ${opt.label ? renderOptLabel(opt.label) : ''}
                </li>
            `).join('')}
        </ul>
    `;

    lucide.createIcons();
}

function renderOptLabel(label) {
    const l = label.toLowerCase();
    if (l.includes('mais vendido')) {
        return `<span class="opt-badge-hot">⭐ ${label}</span>`;
    }
    if (l.includes('economize')) {
        return `<span class="opt-badge-save">${label}</span>`;
    }
    return `<span class="opt-badge-default">${label}</span>`;
}

// ─── Dropdown da home ─────────────────────────────────────────────────────────

function toggleFeaturedDropdown() {
    const menu    = document.getElementById('featured-menu');
    const arrow   = document.getElementById('featured-arrow');
    const trigger = document.getElementById('featured-trigger');
    if (!menu) return;

    const isOpen = menu.classList.contains('opacity-100');

    if (isOpen) {
        menu.classList.remove('opacity-100', 'scale-100');
        menu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        arrow.style.transform = 'rotate(0deg)';
        trigger.setAttribute('aria-expanded', 'false');
    } else {
        menu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        menu.classList.add('opacity-100', 'scale-100');
        arrow.style.transform = 'rotate(180deg)';
        trigger.setAttribute('aria-expanded', 'true');
    }
}

function selectFeaturedOption(index) {
    const product = PRODUCTS_DATA.find(p => p.id === FEATURED_PRODUCT_ID)
                 ?? PRODUCTS_DATA[0];
    if (!product) return;

    selectedOptionIndex = index;
    const opt = product.options[index];

    // Atualiza label do trigger
    const label = document.getElementById('featured-selected-label');
    if (label) label.textContent = `${opt.qtd} uni. — ${formatCurrency(opt.price)}`;

    // Marca o item selecionado
    document.querySelectorAll('.featured-option-item').forEach((el, i) => {
        el.classList.toggle('option-selected', i === index);
    });

    toggleFeaturedDropdown();
}

// ─── Adicionar ao carrinho ────────────────────────────────────────────────────

function addFeaturedToCart(product) {
    const option = product.options[selectedOptionIndex];

    // Lê o carrinho atual do localStorage
    const cart = JSON.parse(localStorage.getItem('meuCarrinhoCompras') || '[]');

    // Agrupa se já existe o mesmo produto + opção
    const existing = cart.find(i =>
        i.product?.id === product.id && i.option?.qtd === option.qtd
    );

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({
            product:  product,
            option:   option,
            cartId:   Date.now(),
            quantity: 1
        });
    }

    localStorage.setItem('meuCarrinhoCompras', JSON.stringify(cart));

    // Sinaliza para abrir o carrinho ao chegar no catálogo
    sessionStorage.setItem('openCart', '1');
    window.location.href = '/catalogo';
}

// ─── Fecha dropdown ao clicar fora ───────────────────────────────────────────

document.addEventListener('click', (e) => {
    const wrap = document.getElementById('featured-dropdown');
    if (wrap && !wrap.contains(e.target)) {
        const menu  = document.getElementById('featured-menu');
        const arrow = document.getElementById('featured-arrow');
        if (menu && menu.classList.contains('opacity-100')) {
            menu.classList.remove('opacity-100', 'scale-100');
            menu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    }
});

// ─── Expõe funções necessárias no escopo global (chamadas via onclick no HTML) ─

window.toggleFeaturedDropdown = toggleFeaturedDropdown;
window.selectFeaturedOption   = selectFeaturedOption;

// ─── Inicializa ao carregar a página ─────────────────────────────────────────

window.addEventListener('load', init);
