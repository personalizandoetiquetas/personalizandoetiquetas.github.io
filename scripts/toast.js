let toastTimeout;

function showAddedToast() {
    const existingToast = document.getElementById('added-toast');
    if (existingToast) existingToast.remove();
    clearTimeout(toastTimeout);

    const toastHTML = `
        <div id="added-toast" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-bottom-10 duration-300">
            <div class="flex items-center gap-3 mb-3">
                <div class="bg-green-100 p-2 rounded-full">
                    <i data-lucide="check" class="w-5 h-5 text-green-600"></i>
                </div>
                <p class="font-bold text-gray-900 text-sm">Item adicionado ao carrinho!</p>
            </div>
            
            <div class="flex gap-2">
                <button id="open-cart-button" class="flex-1 bg-black text-white py-3 rounded-xl text-xs font-bold active:scale-95 transition-all">
                    Abrir Carrinho
                </button>
                <button id="buy-continue-button" onclick="hideToast()" class="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl text-xs font-bold active:scale-95 transition-all">
                    Continuar Comprando
                </button>
            </div>
            
            <div class="absolute bottom-0 left-0 h-1 bg-green-500 rounded-full transition-all duration-[6000ms] ease-linear w-full" id="toast-progress"></div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toastHTML);
    lucide.createIcons();

    setTimeout(() => {
        const progress = document.getElementById('toast-progress');
        if (progress) {
            progress.style.transitionDuration = '6000ms';
            progress.style.width = '0%';
        }
    }, 100);

    toastTimeout = setTimeout(() => {
        hideToast();
    }, 6000);
}

function hideToast() {
    const toast = document.getElementById('added-toast');
    if (toast) {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-10');
        setTimeout(() => toast.remove(), 300);
    }
}

window.showAddedToast = showAddedToast;
window.hideToast = hideToast;

export { showAddedToast, hideToast };