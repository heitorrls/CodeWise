(function () {
  const CLOSE_DELAY_MS = 5000;
  const MIN_INTERVAL_MS = 60 * 1000;
  const storageKey = (key) => {
    const userId = localStorage.getItem("userId") || "guest";
    return `${key}_${userId}`;
  };
  const LAST_SHOWN_KEY = "cw_premium_ad_last_shown";
  const MODULE_SESSION_KEY = "cw_premium_ad_modules_seen";
  const ACTIVITY_PENDING_KEY = "cw_premium_activity_ad_pending";
  let closeAllowed = false;
  let timerId = null;

  function isPremiumLocal() {
    if (typeof window.hasPremiumAccess === "function") {
      return window.hasPremiumAccess();
    }

    try {
      const user = JSON.parse(localStorage.getItem("codewiseUser") || "{}");
      return (
        localStorage.getItem("cw_user_premium") === "true" ||
        user.premium === true
      );
    } catch (_) {
      return localStorage.getItem("cw_user_premium") === "true";
    }
  }

  async function isPremiumUser() {
    if (isPremiumLocal()) return true;

    const userId = localStorage.getItem("userId");
    if (!userId) return false;

    try {
      const response = await fetch(`/api/payment/subscription/${userId}`);
      if (!response.ok) return false;
      const data = await response.json();
      return data?.subscription?.active === true;
    } catch (_) {
      return false;
    }
  }

  function createModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "cw-premium-ad-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.innerHTML = `
      <section class="cw-premium-ad" role="dialog" aria-modal="true" aria-labelledby="cwPremiumAdTitle">
        <span class="cw-premium-ad-badge">💎 CodeWise Premium</span>
        <h2 id="cwPremiumAdTitle">Evolua mais rápido e jogue sem interrupções</h2>
        <p class="cw-premium-ad-intro">
          Ganhe uma experiência turbinada para aprender, praticar e avançar no CodeWise.
        </p>
        <ul class="cw-premium-ad-benefits">
          <li>✨ Recursos exclusivos</li>
          <li>🚫 Experiência sem anúncios</li>
          <li>❤️ Mais vidas e corações</li>
          <li>💰 Mais recompensas</li>
          <li>🚀 Progresso mais rápido</li>
          <li>🛍️ Benefícios especiais na loja</li>
        </ul>
        <div class="cw-premium-ad-actions">
          <button type="button" class="cw-premium-ad-primary">Conhecer Premium</button>
          <button type="button" class="cw-premium-ad-close" hidden>Continuar grátis</button>
        </div>
        <p class="cw-premium-ad-timer" aria-live="polite"></p>
      </section>
    `;

    backdrop
      .querySelector(".cw-premium-ad-primary")
      .addEventListener("click", () => {
        window.location.href = "monetizacao.html?origem=anuncio-premium";
      });
    backdrop
      .querySelector(".cw-premium-ad-close")
      .addEventListener("click", closeModal);
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function getModal() {
    return (
      document.querySelector(".cw-premium-ad-backdrop") || createModal()
    );
  }

  function closeModal() {
    if (!closeAllowed) return;
    const modal = document.querySelector(".cw-premium-ad-backdrop");
    if (!modal) return;
    clearInterval(timerId);
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function canShow(reason) {
    if (
      reason === "modules" &&
      sessionStorage.getItem(storageKey(MODULE_SESSION_KEY))
    ) {
      return false;
    }

    const lastShown =
      Number(localStorage.getItem(storageKey(LAST_SHOWN_KEY))) || 0;
    return Date.now() - lastShown >= MIN_INTERVAL_MS;
  }

  async function showPremiumAd(options = {}) {
    const reason = options.reason || "navigation";
    if (!canShow(reason) || (await isPremiumUser())) return false;

    const modal = getModal();
    const closeButton = modal.querySelector(".cw-premium-ad-close");
    const timer = modal.querySelector(".cw-premium-ad-timer");
    let seconds = Math.ceil(CLOSE_DELAY_MS / 1000);

    closeAllowed = false;
    closeButton.hidden = true;
    timer.textContent = `Você poderá fechar em ${seconds}s`;
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    localStorage.setItem(storageKey(LAST_SHOWN_KEY), String(Date.now()));

    if (reason === "modules") {
      sessionStorage.setItem(storageKey(MODULE_SESSION_KEY), "1");
    }

    clearInterval(timerId);
    timerId = setInterval(() => {
      seconds -= 1;
      if (seconds <= 0) {
        clearInterval(timerId);
        closeAllowed = true;
        closeButton.hidden = false;
        timer.textContent = "Você já pode continuar.";
        return;
      }
      timer.textContent = `Você poderá fechar em ${seconds}s`;
    }, 1000);

    return true;
  }

  async function handlePageTriggers() {
    const page = window.location.pathname.split("/").pop();

    if (page === "modulos.html") {
      window.setTimeout(
        () => showPremiumAd({ reason: "modules" }),
        700
      );
      return;
    }

    if (
      page === "resultado_modulo.html" &&
      sessionStorage.getItem(ACTIVITY_PENDING_KEY)
    ) {
      sessionStorage.removeItem(ACTIVITY_PENDING_KEY);
      window.setTimeout(
        () => showPremiumAd({ reason: "activity-complete" }),
        700
      );
    }
  }

  window.showPremiumAd = showPremiumAd;
  window.closePremiumAd = closeModal;
  window.markPremiumAdAfterActivity = function () {
    sessionStorage.setItem(ACTIVITY_PENDING_KEY, String(Date.now()));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handlePageTriggers);
  } else {
    handlePageTriggers();
  }
})();
