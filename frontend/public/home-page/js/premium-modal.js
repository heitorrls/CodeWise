(function () {
    let lastFocusedElement = null;

    const defaultContent = {
        title: 'Esse recurso faz parte do Code Wise Premium',
        description: 'Assine o Premium para desbloquear IA personalizada, desafios avançados, estatísticas completas e uma experiência sem limitações.',
        icon: '💎'
    };

    function createModal() {
        const backdrop = document.createElement('div');
        backdrop.className = 'premium-modal-backdrop';
        backdrop.innerHTML = `
            <div class="premium-modal" role="dialog" aria-modal="true" aria-labelledby="premium-modal-title">
                <button class="premium-modal-close" type="button" aria-label="Fechar modal">×</button>
                <div class="premium-modal-content">
                    <div class="premium-modal-icon" aria-hidden="true">${defaultContent.icon}</div>
                    <h2 id="premium-modal-title">${defaultContent.title}</h2>
                    <p>${defaultContent.description}</p>
                    <div class="premium-modal-actions">
                        <button class="btn-primary" type="button" data-premium-action="subscribe">Assinar Premium</button>
                        <button class="btn-secondary" type="button" data-premium-action="dismiss">Agora não</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        return backdrop;
    }

    function getModal() {
        return document.querySelector('.premium-modal-backdrop') || createModal();
    }

    function closePremiumModal() {
        const modal = document.querySelector('.premium-modal-backdrop');
        if (!modal) return;

        modal.classList.remove('visible');
        document.body.style.overflow = '';

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function showPremiumModal(options = {}) {
        const modal = getModal();
        const content = { ...defaultContent, ...options };
        lastFocusedElement = document.activeElement;

        modal.querySelector('.premium-modal-icon').textContent = content.icon;
        modal.querySelector('#premium-modal-title').textContent = content.title;
        modal.querySelector('.premium-modal p').textContent = content.description;

        document.body.style.overflow = 'hidden';
        modal.classList.add('visible');

        window.setTimeout(() => {
            modal.querySelector('[data-premium-action="subscribe"]')?.focus();
        }, 0);
    }

    document.addEventListener('click', (event) => {
        const lockedTrigger = event.target.closest('[data-premium-locked]');
        if (lockedTrigger) {
            event.preventDefault();

            if (window.hasPremiumAccess && window.hasPremiumAccess()) {
                return;
            }

            showPremiumModal({
                title: lockedTrigger.dataset.premiumTitle || defaultContent.title,
                description: lockedTrigger.dataset.premiumDescription || defaultContent.description,
                icon: lockedTrigger.dataset.premiumIcon || defaultContent.icon
            });
            return;
        }

        const action = event.target.closest('[data-premium-action]');
        if (!action) return;

        if (action.dataset.premiumAction === 'subscribe') {
            if (
                window.location.pathname === '/monetizacao' ||
                window.location.pathname.endsWith('/monetizacao.html')
            ) {
                closePremiumModal();
                document.querySelector('#planos')?.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            window.location.href = 'monetizacao.html';
            return;
        }

        closePremiumModal();
    });

    document.addEventListener('click', (event) => {
        const modal = document.querySelector('.premium-modal-backdrop.visible');
        if (!modal) return;

        if (
            event.target.classList.contains('premium-modal-backdrop') ||
            event.target.closest('.premium-modal-close')
        ) {
            closePremiumModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        const lockedTrigger = event.target.closest?.('[data-premium-locked]');
        if (lockedTrigger && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();

            if (window.hasPremiumAccess && window.hasPremiumAccess()) {
                return;
            }

            showPremiumModal({
                title: lockedTrigger.dataset.premiumTitle || defaultContent.title,
                description: lockedTrigger.dataset.premiumDescription || defaultContent.description,
                icon: lockedTrigger.dataset.premiumIcon || defaultContent.icon
            });
            return;
        }

        if (event.key === 'Escape') closePremiumModal();
    });

    window.showPremiumModal = showPremiumModal;
    window.closePremiumModal = closePremiumModal;
})();
