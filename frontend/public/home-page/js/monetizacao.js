document.querySelectorAll('[data-plan]').forEach((button) => {
    button.addEventListener('click', () => {
        const plan = button.dataset.plan;
        const toast = document.querySelector('.plan-toast');
        const isPremiumPlan = plan.toLowerCase().includes('premium');

        // Futuro: aqui entrará a abertura do checkout do gateway de pagamento.
        // Após pagamento aprovado, o backend validará a assinatura e atualizará user.premium.
        if (isPremiumPlan && window.simulatePremiumSubscription) {
            window.simulatePremiumSubscription();
        }

        if (!isPremiumPlan && window.simulatePremiumCancellation) {
            window.simulatePremiumCancellation();
        }

        if (!toast) return;

        toast.textContent = isPremiumPlan
            ? 'Premium ativado para teste. Pagamento real será integrado em breve.'
            : 'Modo Free ativado para teste.';
        toast.classList.add('visible');

        window.clearTimeout(toast.hideTimeout);
        toast.hideTimeout = window.setTimeout(() => {
            toast.classList.remove('visible');
        }, 3200);
    });
});
