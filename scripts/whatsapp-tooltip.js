/**
 * Exibe um balão (tooltip) ao lado do botão de WhatsApp após 1 minuto
 * O balão fica visível por 5 segundos
 */

function initWhatsAppTooltip() {
    // Aguarda 20 segundos (20000 ms) antes de exibir o tooltip
    const showTooltipTimer = setTimeout(() => {
        const tooltip = document.getElementById('whatsapp-tooltip');
        const fabBtn = document.getElementById('fab-whatsapp-btn');
        
        if (tooltip && fabBtn) {
            // Adiciona a classe para mostrar o tooltip e aplicar tremida
            tooltip.classList.add('show', 'shaking');
            
            // Remove o tooltip após 5 segundos (5000 ms)
            setTimeout(() => {
                tooltip.classList.remove('show', 'shaking');
            }, 5000);
        }
    }, 20000); // 20 segundos
}

// Inicia o tooltip quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', initWhatsAppTooltip);

export { initWhatsAppTooltip };
