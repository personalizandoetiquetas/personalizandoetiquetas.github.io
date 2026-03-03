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
    if (!dropdown) {
        console.warn("Dropdown não encontrado para produto:", productId);
        return;
    }

    const selectedIdx = parseInt(dropdown.dataset.selected || 0);
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    const option = product.options[selectedIdx];

    const existing = cart.find(i => i.product.id === productId && i.option.qtd === option.qtd);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            product: product,
            option: option,
            cartId: Date.now(),
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    if (typeof showAddedToast === "function") {
        showAddedToast();
    }
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

function changeQuantity(cartId, delta) {
    const item = cart.find(i => i.cartId === cartId);
    if (!item) return;

    item.quantity = (item.quantity || 1) + delta;

    if (item.quantity <= 0) {
        if (confirm("Deseja remover este item do carrinho?")) {
            cart = cart.filter(i => i.cartId !== cartId);
        } else {
            item.quantity = 1;
        }
    }

    saveCartToStorage();
    updateCartUI();
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return;

    const totalDisplay = document.getElementById('cart-total');
    const badgeHeader   = document.getElementById('cart-badge');
    const badgeFab      = document.getElementById('fab-badge');
    const footer        = document.getElementById('cart-footer');
    const emptyState    = document.getElementById('cart-empty-state');
    const btnClear      = document.getElementById('btn-clear-cart');

    const count = cart.length;
    badgeHeader.innerText = count;
    badgeFab.innerText    = count;

    if (count > 0) {
        badgeHeader.classList.remove('hidden');
        badgeFab.classList.remove('hidden');
        footer.classList.remove('hidden');
        emptyState.style.display = 'none';
        btnClear.classList.remove('hidden');
    } else {
        badgeHeader.classList.add('hidden');
        badgeFab.classList.add('hidden');
        footer.classList.add('hidden');
        emptyState.style.display = '';
        btnClear.classList.add('hidden');
    }

    // Renderiza itens
    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.product.image}" alt="${item.product.title}">
            </div>
            <div class="cart-item-body">
                <div class="cart-item-name">${item.product.title}</div>
                <span class="cart-item-badge">${item.option.qtd} unidades / pacote</span>
                <div class="cart-item-row">
                    <div>
                        <div class="cart-item-price preco">${formatCurrency(item.option.price * (item.quantity || 1))}</div>
                        <div class="cart-item-sub">${formatCurrency(item.option.price / item.option.qtd)} uni. · ${item.option.qtd * (item.quantity || 1)} unidades no total</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:4px;">
                        <div class="qty-controls">
                            <button onclick="changeQuantity(${item.cartId}, -1)" class="qty-btn">−</button>
                            <span class="qty-num">${item.quantity || 1}</span>
                            <button onclick="changeQuantity(${item.cartId}, 1)" class="qty-btn">+</button>
                        </div>
                        <button onclick="removeFromCart(${item.cartId})" class="btn-remove-item">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Total
    const total = cart.reduce((acc, item) => acc + item.option.price * (item.quantity || 1), 0);
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
        const qty = item.quantity || 1;
        message += `*${item.product.title}*\n`;
        message += `   Pacote: ${item.option.qtd} un. × ${qty} vez(es)\n`;
        message += `   Total de etiquetas: ${item.option.qtd * qty}\n`;
        message += `   Valor: ${formatCurrency(item.option.price * qty)}\n`;
        message += `------------------------------\n`;
        total += item.option.price * qty;
    });

    message += `\n*Valor Final: ${formatCurrency(total)}*`;
    message += `\n\nAguardo uma confirmação!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

window.saveCartToStorage  = saveCartToStorage;
window.loadCartFromStorage = loadCartFromStorage;
window.addToCart          = addToCart;
window.removeFromCart     = removeFromCart;
window.clearCart          = clearCart;
window.updateCartUI       = updateCartUI;
window.toggleCart         = toggleCart;
window.checkoutWhatsApp   = checkoutWhatsApp;
window.changeQuantity     = changeQuantity;

window.addEventListener("load", () => {
    if (sessionStorage.getItem("openCart") === "1") {
        sessionStorage.removeItem("openCart");
        setTimeout(() => { toggleCart(true); }, 300);
    }
});

export {
    saveCartToStorage,
    loadCartFromStorage,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartUI,
    toggleCart,
    checkoutWhatsApp,
    changeQuantity
};
