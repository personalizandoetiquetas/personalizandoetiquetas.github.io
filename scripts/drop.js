import { PRODUCTS_DATA } from './data.js';
import { formatCurrency } from './utils.js';

function toggleDropdown(id) {
    const menu = document.getElementById(`menu-${id}`);
    const arrow = document.getElementById(`arrow-${id}`);
    const isOpen = menu.classList.contains("opacity-100");

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

        const items = menu.querySelectorAll(".option-item");

        items.forEach((item, index) => {
            const delay = index * 100;

            item.style.transitionDelay = `${delay}ms`;

            requestAnimationFrame(() => {
                item.classList.remove("opacity-0", "translate-y-3", "scale-95");
                item.classList.add("opacity-100", "translate-y-0", "scale-100");
            });
        });
    }
}

function selectOption(productId, index) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const option = product.options[index];

    const dropdown = document.getElementById(`dropdown-${productId}`);
    dropdown.dataset.selected = index;

    document.getElementById(`selected-${productId}`).innerText = `${option.qtd} uni.`;
    document.getElementById(`selected-price-${productId}`).innerText = formatCurrency(option.price);
    document.getElementById(`price-${productId}`).innerText = formatCurrency(option.price);

    // Remove destaque antigo
    document.querySelectorAll(`[id^="option-${productId}-"]`).forEach(el => {
        el.classList.remove('bg-gray-100');
    });

    // Destaca selecionado
    document.getElementById(`option-${productId}-${index}`).classList.add('bg-gray-100');

    toggleDropdown(productId);
}

window.toggleDropdown = toggleDropdown;
window.selectOption = selectOption;

export { toggleDropdown, selectOption };