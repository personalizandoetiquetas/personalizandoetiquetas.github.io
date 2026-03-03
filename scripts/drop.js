import { PRODUCTS_DATA } from './data.js';
import { formatCurrency } from './utils.js';

function toggleDropdown(id) {
    const menu  = document.getElementById(`menu-${id}`);
    const arrow = document.getElementById(`arrow-${id}`);
    const isOpen = menu.classList.contains("opacity-100");

    // Fecha todos e remove dropdown-open de todos os cards
    document.querySelectorAll('.product-card.dropdown-open').forEach(card => {
        card.classList.remove('dropdown-open');
    });
    document.querySelectorAll('[id^="menu-"]').forEach(m => {
        m.classList.remove("opacity-100", "scale-100");
        m.classList.add("opacity-0", "scale-95", "pointer-events-none");
    });
    document.querySelectorAll('[id^="arrow-"]').forEach(a => {
        a.style.transform = "rotate(0deg)";
    });
    document.querySelectorAll('.option-item').forEach(item => {
        item.classList.remove("opacity-100", "translate-y-0", "scale-100");
        item.classList.add("opacity-0", "translate-y-3", "scale-95");
        item.style.transitionDelay = "0ms";
    });

    if (!isOpen) {
        menu.classList.remove("opacity-0", "scale-95", "pointer-events-none");
        menu.classList.add("opacity-100", "scale-100");
        arrow.style.transform = "rotate(180deg)";

        const card = menu.closest('.product-card');
        if (card) card.classList.add('dropdown-open');

        menu.querySelectorAll(".option-item").forEach((item, i) => {
            item.style.transitionDelay = `${i * 50}ms`;
            requestAnimationFrame(() => {
                item.classList.remove("opacity-0", "translate-y-3", "scale-95");
                item.classList.add("opacity-100", "translate-y-0", "scale-100");
            });
        });
    }
}

function selectOption(productId, index) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const option  = product.options[index];

    const dropdown = document.getElementById(`dropdown-${productId}`);
    dropdown.dataset.selected = index;

    // Atualiza trigger com os novos IDs separados
    const qtyEl   = document.getElementById(`selected-${productId}`);
    const unitEl  = document.getElementById(`selected-unit-${productId}`);
    const priceEl = document.getElementById(`selected-price-${productId}`);
    const fromEl  = document.getElementById(`price-${productId}`);

    if (qtyEl)   qtyEl.textContent   = `${option.qtd} uni.`;
    if (unitEl)  unitEl.textContent  = `${formatCurrency(option.price / option.qtd)}/uni.`;
    if (priceEl) priceEl.textContent = formatCurrency(option.price);
    if (fromEl)  fromEl.textContent  = formatCurrency(option.price);

    // Marca selecionado
    document.querySelectorAll(`[id^="option-${productId}-"]`).forEach(el => {
        el.classList.remove('option-selected');
    });
    document.getElementById(`option-${productId}-${index}`).classList.add('option-selected');

    toggleDropdown(productId);
}

window.toggleDropdown = toggleDropdown;
window.selectOption   = selectOption;

export { toggleDropdown, selectOption };
