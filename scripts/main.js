import { loadData, PRODUCTS_DATA, CATEGORIES, WHATSAPP_NUMBER } from './data.js';
import { formatCurrency } from './utils.js';
import { saveCartToStorage, loadCartFromStorage, addToCart, removeFromCart, clearCart, updateCartUI, toggleCart, checkoutWhatsApp } from './cart.js';
import { setupImageModal, openImageModal, closeImageModal, forceCloseModal } from './modal.js'; 
import { init, renderCategories, setCategory, renderProducts } from './products.js';
import { showAddedToast, hideToast } from './toast.js';
import { toggleDropdown, selectOption } from './drop.js';

document.addEventListener('click', function(e) {
    const clickedDropdown = e.target.closest('[id^="dropdown-"]');

    if (e.target.closest('#open-cart-button')) {
        toggleCart(true);
        hideToast();
        return;
    }

    document.querySelectorAll('[id^="menu-"]').forEach(menu => {
        const dropdown = menu.closest('[id^="dropdown-"]');

        if (!clickedDropdown || dropdown.id !== clickedDropdown.id) {
            menu.classList.remove('opacity-100', 'scale-100');
            menu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        }
    });

    document.querySelectorAll('[id^="arrow-"]').forEach(arrow => {
        arrow.classList.remove('rotate-180');
    });

});

window.onload = async () => {
    await loadData();
    loadCartFromStorage();
    setupImageModal();
    await init();
};