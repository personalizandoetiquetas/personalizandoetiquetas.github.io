import { PRODUCTS_DATA } from './data.js';
import { formatCurrency } from './utils.js';

function setupImageModal() {
    const modalHTML = `
        <div id="image-viewer-modal" 
             class="fixed inset-0 z-[60] hidden bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4 transition-all duration-300"
             onclick="closeImageModal(event)">
            
            <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden relative border border-gray-100">
                
                <div class="flex items-center justify-between p-4 border-b border-gray-100">
                    <div class="w-8"></div>
                    <h3 id="modal-image-title" class="font-bold text-gray-800 text-xs uppercase tracking-widest text-center flex-1"></h3>
                    <button onclick="forceCloseModal()" class="text-gray-400 hover:text-black transition-colors">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <div class="bg-gray-50 flex items-center justify-center p-2">
                    <img id="modal-image-content" src="" class="max-w-full h-auto object-contain max-h-[50vh] rounded-lg">
                </div>

                <div class="p-6 bg-white">
                    <p id="modal-image-specs" class="text-gray-400 text-xs font-medium mb-1"></p>
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <span id="modal-image-price" class="preco text-2xl font-black text-gray-900"></span>
                            <span id="modal-selected-qty" class="text-[10px] font-bold text-gray-400 uppercase"></span>
                        </div>
                        <button onclick="forceCloseModal()" class="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold">
                            Fechar Visualização
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (!document.getElementById('image-viewer-modal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
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
    document.getElementById('modal-selected-qty').innerText =
        `${selectedOption.qtd} unidades selecionadas`;
    document.getElementById('modal-image-price').innerText =
        formatCurrency(selectedOption.price);

    const modal = document.getElementById('image-viewer-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
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
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

window.setupImageModal = setupImageModal;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.forceCloseModal = forceCloseModal;

export { setupImageModal, openImageModal, closeImageModal, forceCloseModal };