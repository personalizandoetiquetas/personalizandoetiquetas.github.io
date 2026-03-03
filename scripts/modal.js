import { PRODUCTS_DATA } from './data.js';
import { formatCurrency } from './utils.js';

function setupImageModal() {
    if (document.getElementById('image-viewer-modal')) return;

    const modalHTML = `
        <div id="image-viewer-modal" style="
            display:none;
            position:fixed;inset:0;z-index:60;
            background:rgba(0,0,0,0.2);
            backdrop-filter:blur(2px);
            align-items:center;justify-content:center;
            padding:16px;
        " onclick="closeImageModal(event)">

            <div style="
                background:white;border-radius:16px;
                box-shadow:0 20px 60px rgba(0,0,0,0.15);
                max-width:480px;width:100%;
                overflow:hidden;position:relative;
                border:1px solid #F0F0F0;
            ">
                <div style="
                    display:flex;align-items:center;
                    justify-content:space-between;
                    padding:16px;
                    border-bottom:1px solid #F0F0F0;
                ">
                    <div style="width:32px;"></div>
                    <h3 id="modal-image-title" style="
                        font-weight:700;color:#1a1a1a;
                        font-size:11px;text-transform:uppercase;
                        letter-spacing:0.1em;text-align:center;flex:1;
                    "></h3>
                    <button onclick="forceCloseModal()" style="
                        color:#9CA3AF;background:none;border:none;
                        cursor:pointer;padding:4px;
                        display:flex;align-items:center;
                    ">
                        <i data-lucide="x" style="width:20px;height:20px;"></i>
                    </button>
                </div>

                <div style="background:#F9FAFB;display:flex;align-items:center;justify-content:center;padding:8px;">
                    <img id="modal-image-content" src="" style="
                        max-width:100%;height:auto;
                        object-fit:contain;max-height:50vh;
                        border-radius:8px;
                    ">
                </div>

                <div style="padding:24px;background:white;">
                    <p id="modal-image-specs" style="color:#9CA3AF;font-size:12px;font-weight:500;margin-bottom:4px;"></p>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div style="display:flex;flex-direction:column;">
                            <span id="modal-image-price" class="preco" style="font-size:24px;font-weight:900;color:#1a1a1a;"></span>
                            <span id="modal-selected-qty" style="font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;"></span>
                        </div>
                        <button onclick="forceCloseModal()" style="
                            background:#111;color:white;
                            padding:8px 16px;border-radius:8px;
                            font-size:12px;font-weight:700;
                            border:none;cursor:pointer;
                            transition:background 0.2s;
                        " onmouseover="this.style.background='#F03E7A'" onmouseout="this.style.background='#111'">
                            Fechar Visualização
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openImageModal(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const dropdown = document.getElementById(`dropdown-${productId}`);
    const selectedIdx = dropdown ? parseInt(dropdown.dataset.selected || 0) : 0;
    const selectedOption = product.options[selectedIdx];

    document.getElementById('modal-image-content').src = product.image;
    document.getElementById('modal-image-title').innerText = product.title;
    document.getElementById('modal-image-specs').innerText = product.specs;
    document.getElementById('modal-selected-qty').innerText = `${selectedOption.qtd} unidades selecionadas`;
    document.getElementById('modal-image-price').innerText = formatCurrency(selectedOption.price);

    const modal = document.getElementById('image-viewer-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    lucide.createIcons();
}

function closeImageModal(event) {
    if (event.target.id === 'image-viewer-modal') {
        forceCloseModal();
    }
}

function forceCloseModal() {
    const modal = document.getElementById('image-viewer-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

window.setupImageModal  = setupImageModal;
window.openImageModal   = openImageModal;
window.closeImageModal  = closeImageModal;
window.forceCloseModal  = forceCloseModal;

export { setupImageModal, openImageModal, closeImageModal, forceCloseModal };
