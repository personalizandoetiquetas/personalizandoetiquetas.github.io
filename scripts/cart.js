import { PRODUCTS_DATA, WHATSAPP_NUMBER } from './data.js';
import { formatCurrency } from './utils.js';

let cart = [];

function saveCartToStorage() {
    localStorage.setItem('meuCarrinhoCompras', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('meuCarrinhoCompras');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function addToCart(productId) {
    const dropdown = document.getElementById(`dropdown-${productId}`);
    const selectedIdx = parseInt(dropdown.dataset.selected || 0);

    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const option = product.options[selectedIdx];

    const cartItem = {
        product: product,
        option: option,
        cartId: Date.now()
    };

    cart.push(cartItem);
    saveCartToStorage();
    updateCartUI();
    showAddedToast();
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    saveCartToStorage();
    updateCartUI();
}

function clearCart() {
    if (confirm("Deseja realmente esvaziar seu carrinho?")) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
    }
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total');
    const badgeHeader = document.getElementById('cart-badge');
    const badgeFab = document.getElementById('fab-badge');
    const footer = document.getElementById('cart-footer');
    const emptyState = document.getElementById('cart-empty-state');
    const btnClear = document.getElementById('btn-clear-cart'); // Pega o botão de limpar

    const count = cart.length;
    badgeHeader.innerText = count;
    badgeFab.innerText = count;
    
    if(count > 0) {
        badgeHeader.classList.remove('hidden');
        badgeFab.classList.remove('hidden');
        footer.classList.remove('hidden');
        emptyState.classList.add('hidden');
        btnClear.classList.remove('hidden'); // MOSTRA o botão limpar
    } else {
        badgeHeader.classList.add('hidden');
        badgeFab.classList.add('hidden');
        footer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        btnClear.classList.add('hidden');    // ESCONDE o botão limpar
    }

    // Renderiza Itens
    itemsContainer.innerHTML = cart.map(item => `
        <div class="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-right duration-300">
            <div class="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img src="${item.product.image}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 flex flex-col justify-between">
                <div>
                    <h4 class="font-bold text-sm text-gray-900 line-clamp-1">${item.product.title}</h4>
                    <span class="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        ${item.option.qtd} unidades
                    </span>
                </div>
                <div class="flex justify-between items-center mt-1">
                    <span class="preco font-bold text-sm text-gray-900">${formatCurrency(item.option.price)}</span>
                    <button onclick="removeFromCart(${item.cartId})" class="text-red-400 hover:text-red-600 p-1">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Calcula Total
    const total = cart.reduce((acc, item) => acc + item.option.price, 0);
    totalDisplay.innerText = formatCurrency(total);

    lucide.createIcons();
}

function toggleCart(show) {
    const modal = document.getElementById('cart-modal');
    if (show) {
        modal.classList.remove('cart-hidden');
        modal.classList.add('cart-visible');
    } else {
        modal.classList.remove('cart-visible');
        modal.classList.add('cart-hidden');
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let message = "*Olá! Gostaria de fazer o seguinte pedido:*\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `*${item.product.title}*\n`;
        message += `   Qtd: ${item.option.qtd} un.\n`;
        message += `   Valor: ${formatCurrency(item.option.price)}\n`;
        message += `------------------------------\n`;
        total += item.option.price;
    });

    message += `\n*Valor Final: ${formatCurrency(total)}*`;
    message += `\n\nAguardo uma confirmação!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

window.saveCartToStorage = saveCartToStorage;
window.loadCartFromStorage = loadCartFromStorage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.updateCartUI = updateCartUI;
window.toggleCart = toggleCart;
window.checkoutWhatsApp = checkoutWhatsApp;

export {
    saveCartToStorage,
    loadCartFromStorage,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartUI,
    toggleCart,
    checkoutWhatsApp
 };