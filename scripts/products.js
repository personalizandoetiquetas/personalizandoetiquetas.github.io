import { PRODUCTS_DATA, CATEGORIES, WHATSAPP_NUMBER, ACTIVE_CATEGORY } from "./data.js";
import { formatCurrency } from './utils.js';

let activeCategory = "";

function init() {
    activeCategory = ACTIVE_CATEGORY;
    renderCategories();
    renderProducts();
    lucide.createIcons();
}

function renderCategories() {
    const container = document.getElementById('category-list');
    container.innerHTML = CATEGORIES.map(cat => `
        <button 
            onclick="setCategory('${cat}')"
            class="whitespace-nowrap px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeCategory === cat 
                ? 'text-white bg-pink-500 py-1 font-bolder' 
                : 'text-white hover:bg-pink-400'
            }" style="text-shadow: 1px 1px 5px rgba(31, 1, 18, 0.9)"
        >
            ${cat}
        </button>
    `).join('');

    document.getElementById('current-category-title').innerText = activeCategory;
}

function setCategory(cat) {
    activeCategory = cat;
    renderCategories();
    renderProducts();
}

function renderProducts() {
    const container = document.getElementById('products-grid');
    const filtered = PRODUCTS_DATA.filter(p => p.category === activeCategory);
    
    document.getElementById('item-count').innerText = `${filtered.length} itens`;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-2 text-center py-10 text-gray-400">
            <p>Nenhum produto encontrado nesta categoria.</p>
        </div>`;
        return;
    }

    container.innerHTML = filtered.map(product => {
        const firstOption = product.options[0];
        return `
        <div class="bg-white rounded-xl overflow-visible shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all duration-300 group">
            <div class="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" 
                 onclick="openImageModal(${product.id})">
                <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <div class="absolute top-2 left-2 pointer-events-none">
                    <span class="bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-medium">
                        ${product.specs.split('•')[0]}
                    </span>
                </div>
            </div>

            <div class="p-3 flex flex-col flex-grow">
                <h3 class="font-bold text-gray-900 text-sm mb-1 leading-snug line-clamp-2 min-h-[40px]">${product.title}</h3>
                <p class="text-[9px] text-gray-500 mb-3 truncate">${product.specs}</p>

                <div class="mt-auto space-y-2 relative z-30">
                    <div class="relative w-full" id="dropdown-${product.id}" data-selected="0">
       
                        <button type="button"
                            onclick="toggleDropdown(${product.id})"
                            class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 text-xs py-3 pl-4 pr-4 rounded-xl flex justify-between items-center transition-all duration-200 active:scale-[0.98]">

                            <div class="flex flex-col text-left leading-tight">
                                <span id="selected-${product.id}" class="font-semibold">
                                    ${firstOption.qtd} uni.
                                </span>
                            </div>

                            <div class="flex items-center gap-2">
                                <span id="selected-price-${product.id}" class="font-bold text-sm">
                                    ${formatCurrency(firstOption.price)}
                                </span>

                            <span id="arrow-${product.id}"
                                class="flex items-center transition-transform duration-300">
                                <i data-lucide="chevron-down" class="w-4 h-4"></i>
                            </span>
                            </div>
                        </button>

                        <div id="menu-${product.id}" class="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden opacity-0 scale-95 pointer-events-none transition-all duration-200 ease-out origin-top">
                            ${product.options.map((opt, idx) => `
                                <div onclick="selectOption(${product.id}, ${idx})"
                                     id="option-${product.id}-${idx}"
                                     class="option-item flex justify-between items-center px-4 py-3 text-xs cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] 
                                     opacity-0 translate-y-3 scale-95 
                                     odd:bg-white even:bg-gray-200 
                                     hover:bg-black hover:text-white">
                                    <span class="font-medium">${opt.qtd} uni.</span>
                                    <span class="font-bold">${formatCurrency(opt.price)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex items-end justify-between pt-1">
                        <div class="flex flex-col">
                            <span class="text-[9px] text-gray-400 font-medium uppercase">Valor Total</span>
                            <span id="price-${product.id}" class="text-base font-bold text-gray-900 leading-none">${formatCurrency(firstOption.price)}</span>
                        </div>
                        <button onclick="addToCart(${product.id})" class="bg-black text-white p-2 rounded-lg shadow-lg active:scale-95 transition-transform">
                            <i data-lucide="shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');

    lucide.createIcons();
}

window.init = init;
window.renderCategories = renderCategories;
window.setCategory = setCategory;
window.renderProducts = renderProducts;

export { init, renderCategories, setCategory, renderProducts };