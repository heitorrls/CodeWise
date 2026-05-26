(function () {
    const USER_STORAGE_KEY = 'codewiseUser';
    const PREMIUM_STORAGE_KEY = 'cw_user_premium';

    function readStoredUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
        } catch (error) {
            return {};
        }
    }

    function getCurrentUser() {
        const storedUser = readStoredUser();
        const premiumValue = localStorage.getItem(PREMIUM_STORAGE_KEY);

        return {
            id: storedUser.id || localStorage.getItem('userId') || null,
            email: storedUser.email || localStorage.getItem('userEmail') || null,
            name: storedUser.name || localStorage.getItem('userName') || localStorage.getItem('username') || null,
            premium: premiumValue === 'true' || storedUser.premium === true
        };
    }

    function saveCurrentUser(user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(PREMIUM_STORAGE_KEY, String(user.premium === true));
    }

    function setPremiumStatus(isPremium) {
        const user = getCurrentUser();
        user.premium = Boolean(isPremium);
        saveCurrentUser(user);
        applyPremiumAccess(user);
        return user;
    }

    function hasPremiumAccess(user = getCurrentUser()) {
        // Futuro: substituir esta checagem local por validação segura no backend.
        // Aqui entrará a validação real da assinatura retornada pelo servidor.
        return user.premium === true;
    }

    function unlockPremiumElement(element) {
        element.classList.add('premium-unlocked');
        element.classList.remove('premium-locked');
        element.removeAttribute('data-premium-locked');
        element.removeAttribute('role');
        element.setAttribute('tabindex', '-1');
        element.setAttribute('aria-label', 'Recurso Premium liberado');

        if (element.textContent.includes('🔒')) {
            element.textContent = element.textContent.replace('🔒 Bloqueado', '✓ Liberado');
        }
    }

    function lockPremiumElement(element) {
        element.classList.add('premium-locked');
        element.classList.remove('premium-unlocked');

        if (element.textContent.includes('✓ Liberado')) {
            element.textContent = element.textContent.replace('✓ Liberado', '🔒 Bloqueado');
        }

        if (element.dataset.premiumFeature !== 'static') {
            element.setAttribute('data-premium-locked', '');
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('aria-label', 'Recurso Premium bloqueado');
        }
    }

    function applyPremiumAccess(user = getCurrentUser()) {
        const isPremium = hasPremiumAccess(user);

        document.body.classList.toggle('user-premium', isPremium);
        document.body.classList.toggle('user-free', !isPremium);

        document.querySelectorAll('[data-premium-feature]').forEach((element) => {
            if (isPremium) {
                unlockPremiumElement(element);
            } else {
                lockPremiumElement(element);
            }
        });
    }

    function liberarRecursosPremium() {
        return applyPremiumAccess(getCurrentUser());
    }

    // Futuro: depois do checkout aprovado, o gateway chamará um webhook no backend.
    // Esse webhook atualizará o status da assinatura no banco e o front apenas lerá esse estado.
    // Nenhum pagamento real é feito aqui; esta função existe só para testes de interface.
    function simulatePremiumSubscription() {
        return setPremiumStatus(true);
    }

    function simulatePremiumCancellation() {
        return setPremiumStatus(false);
    }

    window.getCurrentUser = getCurrentUser;
    window.hasPremiumAccess = hasPremiumAccess;
    window.applyPremiumAccess = applyPremiumAccess;
    window.liberarRecursosPremium = liberarRecursosPremium;
    window.setPremiumStatus = setPremiumStatus;
    window.simulatePremiumSubscription = simulatePremiumSubscription;
    window.simulatePremiumCancellation = simulatePremiumCancellation;

    document.addEventListener('DOMContentLoaded', () => {
        applyPremiumAccess();
    });
})();
