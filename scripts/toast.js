let toastTimeout;

function showAddedToast() {
    const existingToast = document.getElementById('added-toast');
    if (existingToast) existingToast.remove();
    clearTimeout(toastTimeout);

    const toastHTML = `
        <div id="added-toast" style="
            position:fixed;
            bottom:96px;
            left:50%;
            transform:translateX(-50%);
            z-index:100;
            width:90%;
            max-width:448px;
            background:white;
            border-radius:16px;
            box-shadow:0 20px 60px rgba(0,0,0,0.15);
            border:1px solid #F0F0F0;
            padding:16px;
            overflow:hidden;
        ">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div style="
                    background:#DCFCE7;padding:8px;
                    border-radius:50%;display:flex;
                    align-items:center;justify-content:center;
                ">
                    <i data-lucide="check" style="width:20px;height:20px;color:#16A34A;"></i>
                </div>
                <p style="font-weight:700;color:#1a1a1a;font-size:14px;">Item adicionado ao carrinho!</p>
            </div>

            <div style="display:flex;gap:8px;">
                <button id="open-cart-button" style="
                    flex:1;background:#111;color:white;
                    padding:12px;border-radius:12px;
                    font-size:12px;font-weight:700;
                    border:none;cursor:pointer;
                    transition:transform 0.15s;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    Abrir Carrinho
                </button>
                <button id="buy-continue-button" onclick="hideToast()" style="
                    flex:1;background:#F3F4F6;color:#4B5563;
                    padding:12px;border-radius:12px;
                    font-size:12px;font-weight:700;
                    border:none;cursor:pointer;
                    transition:transform 0.15s;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    Continuar Comprando
                </button>
            </div>

            <div id="toast-progress" style="
                position:absolute;bottom:0;left:0;
                height:4px;background:#22C55E;
                border-radius:0 0 0 16px;
                width:100%;
                transition:width 6000ms linear;
            "></div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toastHTML);
    lucide.createIcons();

    setTimeout(() => {
        const progress = document.getElementById('toast-progress');
        if (progress) progress.style.width = '0%';
    }, 100);

    toastTimeout = setTimeout(() => { hideToast(); }, 6000);
}

function hideToast() {
    const toast = document.getElementById('added-toast');
    if (toast) {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }
}

window.showAddedToast = showAddedToast;
window.hideToast      = hideToast;

export { showAddedToast, hideToast };
