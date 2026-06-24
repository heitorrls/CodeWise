(function setupGlobalFeedback() {
  const TOAST_QUEUE_KEY = "cw_pending_toasts";
  const toastIcons = {
    info: "•",
    success: "✓",
    error: "!",
    warning: "!",
    coins: "💎",
    lives: "❤️",
    unlock: "🔓",
    achievement: "★",
    loading: "…",
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const style = document.createElement("style");
  style.textContent = `
    .cw-toast-stack {
      position: fixed;
      top: clamp(18px, 4vh, 32px);
      left: 50%;
      z-index: 10020;
      display: grid;
      gap: 10px;
      width: min(460px, calc(100vw - 28px));
      pointer-events: none;
      transform: translateX(-50%);
    }
    .cw-toast {
      --toast-accent: #8b7cc8;
      transform: translateY(-14px) scale(.98);
      background: var(--surface, var(--card, #222743));
      color: var(--text, #fff);
      border: 1px solid color-mix(in srgb, var(--toast-accent) 34%, transparent);
      border-radius: 16px;
      padding: 13px 15px;
      box-shadow: 0 18px 42px rgba(0,0,0,0.28);
      opacity: 0;
      transition: opacity .22s ease, transform .22s ease;
      display: flex;
      gap: 10px;
      align-items: center;
      text-align: left;
      pointer-events: auto;
      overflow: hidden;
      position: relative;
    }
    .cw-toast::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 4px;
      background: var(--toast-accent);
    }
    .cw-toast.show { opacity: 1; transform: translateY(0) scale(1); }
    .cw-toast .dot {
      width: 28px;
      height: 28px;
      flex: 0 0 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--toast-accent) 18%, transparent);
      color: var(--toast-accent);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--toast-accent) 28%, transparent);
      font-size: .9rem;
      font-weight: 900;
    }
    .cw-toast .msg { flex: 1; font-weight: 700; line-height: 1.35; }
    .cw-toast.success { --toast-accent: #10b981; }
    .cw-toast.error { --toast-accent: #ef4444; }
    .cw-toast.warning { --toast-accent: #f59e0b; }
    .cw-toast.coins { --toast-accent: #8b5cf6; }
    .cw-toast.lives { --toast-accent: #f43f5e; }
    .cw-toast.unlock { --toast-accent: #3b82f6; }
    .cw-toast.achievement { --toast-accent: #f59e0b; }
    .cw-feedback-pop { animation: cwFeedbackPop .38s ease; }
    .cw-button-loading { position: relative; cursor: progress !important; }
    .cw-button-loading::after {
      content: "";
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 999px;
      animation: cwFeedbackSpin .7s linear infinite;
    }
    .cw-skeleton {
      position: relative;
      overflow: hidden;
      color: transparent !important;
      background: color-mix(in srgb, var(--cw-primary, #8b5cf6) 10%, transparent) !important;
      border-radius: 12px;
    }
    .cw-skeleton::after {
      content: "";
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.26), transparent);
      animation: cwFeedbackSheen 1.2s linear infinite;
    }
    @keyframes cwFeedbackSpin { to { transform: rotate(360deg); } }
    @keyframes cwFeedbackSheen { to { transform: translateX(100%); } }
    @keyframes cwFeedbackPop {
      0% { transform: scale(1); }
      45% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  function getToastStack() {
    let stack = document.querySelector(".cw-toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "cw-toast-stack";
      document.body.appendChild(stack);
    }
    return stack;
  }

  function showToast(message, options = {}) {
    const type = options.type || "info";
    const toast = document.createElement("div");
    toast.className = `cw-toast ${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    toast.innerHTML = `<span class="dot">${toastIcons[type] || toastIcons.info}</span><span class="msg">${escapeHtml(message)}</span>`;
    getToastStack().appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 200);
    }, options.duration || 3200);
  }

  function queueToast(message, options = {}) {
    try {
      const queued = JSON.parse(localStorage.getItem(TOAST_QUEUE_KEY) || "[]");
      queued.push({ message, options });
      localStorage.setItem(TOAST_QUEUE_KEY, JSON.stringify(queued.slice(-5)));
    } catch (error) {
      // Feedback is non-critical.
    }
  }

  function flushQueuedToasts() {
    let queued = [];
    try {
      queued = JSON.parse(localStorage.getItem(TOAST_QUEUE_KEY) || "[]");
      localStorage.removeItem(TOAST_QUEUE_KEY);
    } catch (error) {
      queued = [];
    }
    queued.forEach((item, index) => {
      setTimeout(() => showToast(item.message, item.options || {}), 250 + index * 180);
    });
  }

  function setButtonLoading(button, isLoading, loadingText = "Carregando...") {
    if (!button) return;
    if (isLoading) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }
      button.disabled = true;
      button.classList.add("cw-button-loading");
      button.setAttribute("aria-busy", "true");
      button.textContent = loadingText;
    } else {
      button.disabled = false;
      button.classList.remove("cw-button-loading");
      button.removeAttribute("aria-busy");
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }

  function pulseElement(element) {
    if (!element) return;
    element.classList.remove("cw-feedback-pop");
    void element.offsetWidth;
    element.classList.add("cw-feedback-pop");
  }

  window.alert = function (msg) {
    const normalized = String(msg || "").toLowerCase();
    const type =
      normalized.includes("sucesso") ||
      normalized.includes("conclu") ||
      normalized.includes("salv")
        ? "success"
        : normalized.includes("erro") ||
          normalized.includes("falha") ||
          normalized.includes("inválid") ||
          normalized.includes("inval") ||
          normalized.includes("não foi") ||
          normalized.includes("nao foi")
        ? "error"
        : normalized.includes("preencha") ||
          normalized.includes("informe") ||
          normalized.includes("atenção") ||
          normalized.includes("atencao")
        ? "warning"
        : "info";
    showToast(msg, { type });
  };
  window.showToast = showToast;
  window.queueToast = queueToast;
  window.setButtonLoading = setButtonLoading;
  window.pulseFeedbackElement = pulseElement;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", flushQueuedToasts);
  } else {
    setTimeout(flushQueuedToasts, 0);
  }
})();

// Modal de conquista
(function setupAchievementModal() {
  const style = document.createElement("style");
  style.textContent = `
    .cw-achievement-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease;
    }
    .cw-achievement-overlay.show { opacity: 1; pointer-events: all; }
    .cw-achievement-card {
      background: var(--surface, var(--card, #222743));
      color: var(--text, #fff);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 16px;
      padding: 18px 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.35);
      max-width: 420px;
      width: 90%;
      text-align: center;
      transform: translateY(12px);
      transition: transform .2s ease;
    }
    .cw-achievement-overlay.show .cw-achievement-card { transform: translateY(0); }
    .cw-achievement-card h3 { margin-bottom: 8px; font-size: 1.1rem; }
    .cw-achievement-card p { margin-bottom: 14px; color: var(--text-muted, #c8cbee); }
    .cw-achievement-actions { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    .cw-achievement-actions button {
      border: 1px solid var(--border, rgba(255,255,255,0.2));
      background: rgba(139,124,200,0.12);
      color: var(--text, #fff);
      padding: 10px 14px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
    }
    .cw-achievement-actions .primary {
      background: linear-gradient(135deg, #8b7cc8, #6f5ac8);
      color: #fff;
      border: none;
      box-shadow: 0 8px 20px rgba(139,124,200,0.35);
    }
  `;
  document.head.appendChild(style);

  window.showAchievementModal = function (title) {
    const overlay = document.createElement("div");
    overlay.className = "cw-achievement-overlay";
    overlay.innerHTML = `
      <div class="cw-achievement-card">
        <h3>Você alcançou uma conquista!</h3>
        <p>Conquista desbloqueada: <strong>${title}</strong></p>
        <div class="cw-achievement-actions">
          <button class="close-btn">Fechar</button>
          <button class="primary view-btn">Ver conquistas</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));

    const close = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 200);
    };

    overlay.querySelector(".close-btn").addEventListener("click", close);
    overlay.querySelector(".view-btn").addEventListener("click", () => {
      window.location.href = "conquistas.html";
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
  };
})();

// Modal de confirmação (compras)
(function setupConfirmModal() {
  const style = document.createElement("style");
  style.textContent = `
    .cw-confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease;
    }
    .cw-confirm-overlay.show { opacity: 1; pointer-events: all; }
    .cw-confirm-card {
      background: var(--surface, var(--card, #222743));
      color: var(--text, #fff);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.35);
      max-width: 420px;
      width: 90%;
      text-align: center;
      transform: translateY(12px);
      transition: transform .2s ease;
    }
    .cw-confirm-overlay.show .cw-confirm-card { transform: translateY(0); }
    .cw-confirm-card h3 { margin-bottom: 8px; font-size: 1.1rem; }
    .cw-confirm-card p { margin-bottom: 14px; color: var(--text-muted, #c8cbee); }
    .cw-confirm-actions { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    .cw-confirm-actions button {
      border: 1px solid var(--border, rgba(255,255,255,0.2));
      background: rgba(139,124,200,0.12);
      color: var(--text, #fff);
      padding: 10px 14px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
    }
    .cw-confirm-actions .primary {
      background: linear-gradient(135deg, #8b7cc8, #6f5ac8);
      color: #fff;
      border: none;
      box-shadow: 0 8px 20px rgba(139,124,200,0.35);
    }
  `;
  document.head.appendChild(style);

  window.showConfirmBox = function ({ title, message, onConfirm, onCancel, confirmText, cancelText }) {
    const overlay = document.createElement("div");
    overlay.className = "cw-confirm-overlay";
    overlay.innerHTML = `
      <div class="cw-confirm-card">
        <h3>${title || "Confirmação"}</h3>
        <p>${message || ""}</p>
        <div class="cw-confirm-actions">
          <button class="close-btn">${cancelText || "Cancelar"}</button>
          <button class="primary confirm-btn">${confirmText || "Confirmar"}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("show"));

    const close = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 200);
    };

    overlay.querySelector(".close-btn").addEventListener("click", () => {
      close();
      if (onCancel) onCancel();
    });
    overlay.querySelector(".confirm-btn").addEventListener("click", async () => {
      const confirmButton = overlay.querySelector(".confirm-btn");
      window.setButtonLoading?.(confirmButton, true, "Processando...");
      try {
        if (onConfirm) await onConfirm();
        close();
      } catch (error) {
        window.showToast?.("Não foi possível concluir a ação.", { type: "error" });
        window.setButtonLoading?.(confirmButton, false);
      }
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        close();
        if (onCancel) onCancel();
      }
    });
  };
})();

// Sidebar única do CodeWise: normaliza todas as navbars laterais duplicadas.
(function setupCodeWiseSidebar() {
  const sidebarItems = [
    {
      key: "modulos",
      label: "Módulos",
      href: "modulos.html",
      icon: "fas fa-map",
      pages: ["modulos.html", "home.html", "intro_modulo.html", "qst_modulo.html", "resultado_modulo.html", "recompensa_modulo.html"],
    },
    {
      key: "perfil",
      label: "Perfil",
      href: "perfil.html",
      icon: "fas fa-user",
      pages: ["perfil.html", "inventario.html", "conquistas.html"],
    },
    {
      key: "loja",
      label: "Loja",
      href: "loja.html",
      icon: "fas fa-store",
      pages: ["loja.html"],
    },
    {
      key: "rank",
      label: "Rank",
      href: "rank.html",
      icon: "fas fa-trophy",
      pages: ["rank.html"],
    },
    {
      key: "calendario",
      label: "Calendário",
      href: "calendario.html",
      icon: "fas fa-calendar-alt",
      pages: ["calendario.html"],
    },
    {
      key: "estatisticas",
      label: "Estatísticas",
      href: "estatisticas.html",
      icon: "fas fa-chart-pie",
      pages: ["estatisticas.html"],
    },
    {
      key: "configuracoes",
      label: "Configurações",
      href: "configuracoes.html",
      icon: "fas fa-cog",
      pages: ["configuracoes.html", "conta.html", "suporte.html"],
    },
  ];

  function getCurrentPage() {
    return window.location.pathname.split("/").pop() || "modulos.html";
  }

  function isItemActive(item, currentPage) {
    return item.pages.includes(currentPage);
  }

  function renderSidebar(nav) {
    const currentPage = getCurrentPage();
    nav.classList.add("cw-sidebar");
    nav.dataset.component = "codewise-sidebar";
    nav.setAttribute("aria-label", "Navegação principal");
    nav.innerHTML = sidebarItems
      .map((item) => {
        const active = isItemActive(item, currentPage);
        return `
          <button
            class="nav-item${active ? " active" : ""}"
            type="button"
            data-sidebar-key="${item.key}"
            data-href="${item.href}"
            ${active ? 'aria-current="page"' : ""}
          >
            <i class="${item.icon}" aria-hidden="true"></i>
            <span>${item.label}</span>
          </button>
        `;
      })
      .join("");

    nav.querySelectorAll(".nav-item").forEach((button) => {
      button.addEventListener("click", () => {
        const href = button.dataset.href;
        if (href && !button.classList.contains("active")) {
          window.location.href = href;
        }
      });
    });
  }

  function normalizeSidebars() {
    document.querySelectorAll("nav.sidebar").forEach(renderSidebar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", normalizeSidebars);
  } else {
    normalizeSidebars();
  }
})();

// Controle de sessão simples para páginas protegidas
(function enforceAuthGuard() {
  const protectedPages = [
    "modulos.html",
    "home.html",
    "perfil.html",
    "loja.html",
    "rank.html",
    "configuracoes.html",
    "calendario.html",
    "suporte.html",
    "intro_nivelamento.html",
    "qst_nivelamento.html",
    "resultado_nivelamento.html",
    "intro_modulo.html",
    "qst_modulo.html",
    "resultado_modulo.html",
    "recompensa_modulo.html",
  ];
  const currentPage = window.location.pathname.split("/").pop();
  const userId = localStorage.getItem("userId");

  if (!userId && protectedPages.includes(currentPage)) {
    window.location.replace("login.html");
  }
})();

// Logout global (limpa sessão e evita retornar logado)
window.logout = function logout(showConfirm = true) {
  const finishLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("pendingAchievement");
    localStorage.removeItem("achievements_state");
    window.location.replace("login.html");
  };

  if (showConfirm && window.showConfirmBox) {
    window.showConfirmBox({
      title: "Sair da conta",
      message: "Deseja realmente sair do CodeWise?",
      confirmText: "Sair",
      onConfirm: finishLogout,
    });
    return;
  }

  if (showConfirm && !confirm("Deseja realmente sair?")) return;
  finishLogout();
};

// Fallback global for buttons that use inline `onclick="continuar()"` before the script initializes.
window.continuar = function () {
  // Safe fallback: direct navigation to login (will be overridden when DOM loads)
  window.location.href = "login.html";
};

// Make the DOMContentLoaded handler async so we can use `await` inside it.
document.addEventListener("DOMContentLoaded", async () => {
  // ---------- ADIÇÃO: declaração única de sessão (usar em todo o handler) ----------
  const userId = localStorage.getItem("userId") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const storedUsername = localStorage.getItem("userName") || localStorage.getItem("username");
  const fallbackUserName = storedUsername || (userEmail ? userEmail.split("@")[0] : "");
  const currentPageName = window.location.pathname.split("/").pop() || "";
  const isLevelingFlowPage = [
    "intro_nivelamento.html",
    "qst_nivelamento.html",
    "resultado_nivelamento.html",
  ].includes(currentPageName);
  // -------------------------------------------------------------------------------

  // Catálogo simples de módulos (frontend) enquanto o backend não envia a lista.
  const moduleCatalog = [
    {
      id: "mod-js-basico",
      badge: "Módulo 1",
      title: "JavaScript Básico",
      description: "Sintaxe, variáveis e primeiros passos com funções.",
      totalLessons: 5,
      playableLessons: 2,
      displayLessons: 5,
      unlockWith: null,
    },
    {
      id: "mod-html-css",
      badge: "Módulo 2",
      title: "HTML & CSS",
      description: "Estrutura de páginas, semântica e estilos modernos.",
      totalLessons: 6,
      unlockWith: "mod-js-basico",
    },
    {
      id: "mod-algoritmos",
      badge: "Módulo 3",
      title: "Algoritmos",
      description: "Resolução de problemas e raciocínio lógico aplicado.",
      totalLessons: 6,
      unlockWith: "mod-html-css",
    },
  ];

  const userScopedKey = (key) => (userId ? `${key}_${userId}` : key);
  const lessonIndexKey = (moduleId) => userScopedKey(`currentLessonIndex_${moduleId || "default"}`);
  const selectedModuleKey = () => userScopedKey("selectedModule");
  const lessonResultKey = (moduleId, lessonIndex) =>
    userScopedKey(`lesson_result_${moduleId || "default"}_${lessonIndex ?? "current"}`);
  const lastLessonResultKey = () => userScopedKey("last_lesson_result");
  const moduleProgressCache = new Map();

  function normalizeLessonResultSnapshot(result = {}) {
    result = result || {};
    const total = Math.max(0, Number(result.total) || 0);
    const score = Math.max(0, Math.min(Number(result.score) || 0, total || Number.MAX_SAFE_INTEGER));
    const rawPercentage = Number(result.percentage);
    const percentage = Number.isFinite(rawPercentage)
      ? Math.max(0, Math.min(Math.round(rawPercentage), 100))
      : total > 0
      ? Math.round((score / total) * 100)
      : 0;

    return {
      moduleId: result.moduleId || "default",
      lessonIndex: Number.isFinite(Number(result.lessonIndex))
        ? Number(result.lessonIndex)
        : 0,
      score,
      total,
      percentage,
      rewardCoins: Math.max(0, Number(result.rewardCoins) || 0),
      awarded: result.awarded === true,
      completedAt: result.completedAt || new Date().toISOString(),
    };
  }

  function saveLessonResultSnapshot(result = {}) {
    const snapshot = normalizeLessonResultSnapshot(result);
    const serialized = JSON.stringify(snapshot);
    localStorage.setItem(
      lessonResultKey(snapshot.moduleId, snapshot.lessonIndex),
      serialized
    );
    localStorage.setItem(lastLessonResultKey(), serialized);
    return snapshot;
  }

  function readLessonResultSnapshot(moduleId, lessonIndex) {
    const hasSpecificTarget =
      moduleId && lessonIndex !== null && lessonIndex !== undefined;
    const raw = hasSpecificTarget
      ? localStorage.getItem(lessonResultKey(moduleId, lessonIndex))
      : localStorage.getItem(lastLessonResultKey());
    if (!raw) return null;
    try {
      return normalizeLessonResultSnapshot(JSON.parse(raw));
    } catch (error) {
      return null;
    }
  }

  function getLessonResultUrl(snapshot) {
    const result = normalizeLessonResultSnapshot(snapshot);
    const params = new URLSearchParams({
      score: String(result.score),
      total: String(result.total),
      module: result.moduleId,
      lesson: String(result.lessonIndex),
    });
    return `resultado_modulo.html?${params.toString()}`;
  }

  function getLessonRewardUrl(snapshot) {
    const result = normalizeLessonResultSnapshot(snapshot);
    const params = new URLSearchParams({
      module: result.moduleId,
      lesson: String(result.lessonIndex),
    });
    return `recompensa_modulo.html?${params.toString()}`;
  }

  function resolveLessonIndex(moduleId, availableLessons, completedLessons) {
    const stored = Number(localStorage.getItem(lessonIndexKey(moduleId)));
    const highestUnlocked = Math.max(
      0,
      Math.min(
        Number(completedLessons) || 0,
        Math.max(availableLessons - 1, 0)
      )
    );
    if (!Number.isNaN(stored)) {
      return Math.max(0, Math.min(stored, highestUnlocked));
    }
    return highestUnlocked;
  }

  function getModuleProgress(moduleId) {
    const mod = moduleCatalog.find((m) => m.id === moduleId);
    const total = mod?.displayLessons || mod?.totalLessons || 1;
    const completed = Math.max(
      0,
      Math.min(Number(moduleProgressCache.get(moduleId)) || 0, total)
    );
    return { completedLessons: completed, totalLessons: total };
  }

  function saveModuleProgress(moduleId, completedLessons, totalLessons) {
    moduleProgressCache.set(
      moduleId,
      Math.max(
        0,
        Math.min(
          Number(completedLessons) || 0,
          Number(totalLessons) || Number.MAX_SAFE_INTEGER
        )
      )
    );
  }

  async function loadActivityProgress() {
    moduleCatalog.forEach((module) => {
      moduleProgressCache.set(module.id, 0);
      localStorage.removeItem(
        userScopedKey(`module_progress_${module.id}`)
      );
    });

    if (!userId) return;

    try {
      const response = await fetch(`/api/activity-progress/${userId}`);
      if (!response.ok) throw new Error("Falha ao carregar progresso");
      const data = await response.json();
      (data.progress || []).forEach((progress) => {
        const module = moduleCatalog.find(
          (item) => item.id === progress.moduleId
        );
        saveModuleProgress(
          progress.moduleId,
          progress.completedActivities,
          module?.displayLessons || module?.totalLessons || 1
        );
      });
    } catch (error) {
      console.warn("Progresso remoto indisponível; usando estado inicial.", error);
    }
  }

  function isModuleUnlocked(mod) {
    // Preview: apenas o primeiro módulo é liberado
    if (mod.id !== "mod-js-basico") return false;
    if (!mod.unlockWith) return true;
    const req = getModuleProgress(mod.unlockWith);
    return req.completedLessons >= (req.totalLessons || 0);
  }

  function persistSelection(mod) {
    if (!mod) return;
    localStorage.setItem(selectedModuleKey(), mod.id);
    localStorage.setItem("selectedModuleName", mod.title || "");
    localStorage.setItem("selectedModuleBadge", mod.badge || "");
    localStorage.setItem("selectedModuleTotal", String(mod.totalLessons || ""));
  }

  function resolveSelectedModule() {
    const storedId = localStorage.getItem(selectedModuleKey());
    const stored = moduleCatalog.find((m) => m.id === storedId);
    if (stored && isModuleUnlocked(stored)) return stored;
    return moduleCatalog.find((m) => isModuleUnlocked(m)) || moduleCatalog[0];
  }

  // Questões por lição (por módulo)
  const lessonsByModule = {
    "mod-js-basico": [
      [
        {
          question:
            "Qual símbolo é usado para fazer um comentário de linha em JavaScript?",
          options: [
            { letter: "A", text: "// Comentário", correct: true },
            { letter: "B", text: "-- Comentário", correct: false },
            { letter: "C", text: "/* Comentário */", correct: false },
            { letter: "D", text: "<> Comentário", correct: false },
          ],
        },
        {
          question: "Qual palavra-chave cria uma variável com escopo de bloco?",
          options: [
            { letter: "A", text: "var", correct: false },
            { letter: "B", text: "let", correct: true },
            { letter: "C", text: "const", correct: false },
            { letter: "D", text: "static", correct: false },
          ],
        },
        {
          question:
            "Qual é o valor padrão de uma variável declarada mas não inicializada?",
          options: [
            { letter: "A", text: "null", correct: false },
            { letter: "B", text: "undefined", correct: true },
            { letter: "C", text: "0", correct: false },
            { letter: "D", text: '""', correct: false },
          ],
        },
        {
          question: "Como declarar uma constante chamada PI com valor 3.14?",
          options: [
            { letter: "A", text: "var PI = 3.14;", correct: false },
            { letter: "B", text: "let PI = 3.14;", correct: false },
            { letter: "C", text: "const PI = 3.14;", correct: true },
            { letter: "D", text: "static PI = 3.14;", correct: false },
          ],
        },
        {
          question: "Qual tipo é retornado por typeof [] em JavaScript?",
          options: [
            { letter: "A", text: '"array"', correct: false },
            { letter: "B", text: '"object"', correct: true },
            { letter: "C", text: '"list"', correct: false },
            { letter: "D", text: '"undefined"', correct: false },
          ],
        },
      ],
      [
        {
          question: "Qual método adiciona um item ao final de um array em JS?",
          options: [
            { letter: "A", text: "push()", correct: true },
            { letter: "B", text: "add()", correct: false },
            { letter: "C", text: "append()", correct: false },
            { letter: "D", text: "insert()", correct: false },
          ],
        },
        {
          question: "Qual operador compara valor e tipo em JavaScript?",
          options: [
            { letter: "A", text: "==", correct: false },
            { letter: "B", text: "!=", correct: false },
            { letter: "C", text: "===", correct: true },
            { letter: "D", text: "<=>", correct: false },
          ],
        },
        {
          question: "Qual é a saída de console.log(typeof null)?",
          options: [
            { letter: "A", text: '"null"', correct: false },
            { letter: "B", text: '"object"', correct: true },
            { letter: "C", text: '"undefined"', correct: false },
            { letter: "D", text: '"number"', correct: false },
          ],
        },
        {
          question: "Como declarar uma função de seta que retorna x * 2?",
          options: [
            { letter: "A", text: "const f = (x) => x * 2;", correct: true },
            { letter: "B", text: "function f => x * 2;", correct: false },
            { letter: "C", text: "let f(x) = x * 2;", correct: false },
            { letter: "D", text: "arrow f(x) { x * 2; }", correct: false },
          ],
        },
        {
          question: "Qual método converte uma string '5' para número inteiro?",
          options: [
            { letter: "A", text: "parseInt('5')", correct: true },
            { letter: "B", text: "'5'.number()", correct: false },
            { letter: "C", text: "toInt('5')", correct: false },
            { letter: "D", text: "int('5')", correct: false },
          ],
        },
      ],
    ],
  };

  // Metadados das lições (para intro_modulo.html)
  const lessonMeta = {
    "mod-js-basico": [
      {
        title: "Comece pelos primeiros passos com variáveis em JavaScript",
        focus: "Entender como criar variáveis, guardar valores e reconhecer tipos básicos.",
        goal: "Construir sua base inicial para resolver os primeiros exercícios com segurança.",
        estimatedTime: "10 questões • ~15 min",
        pill: "Variáveis e Tipos",
      },
      {
        title: "Pratique arrays e comparações em JavaScript",
        focus: "Arrays, métodos básicos e igualdade estrita",
        goal: "Consolidar operações com coleções e operadores de comparação",
        estimatedTime: "10 questões • ~15 min",
        pill: "Arrays e Operadores",
      },
    ],
  };

  await loadActivityProgress();

  // SISTEMA DE VIDAS
  const MAX_LIVES = 5;
  const LIFE_PRICE = 50;
  let lastKnownLives = null;

  async function fetchLivesState() {
    if (!userId) return { lives: MAX_LIVES, max: MAX_LIVES };
    try {
      const resp = await fetch(`/api/profile/lives/${userId}`);
      if (!resp.ok) throw new Error();
      return await resp.json();
    } catch (e) {
      return { lives: MAX_LIVES, max: MAX_LIVES };
    }
  }

  async function consumeLifeRemote() {
    if (!userId) {
      updateLivesUI(MAX_LIVES);
      return MAX_LIVES;
    }
    try {
      const resp = await fetch("/api/profile/lives/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: 1 }),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.lives;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  async function updateLivesUI(forcedLives) {
    const state = forcedLives !== undefined
      ? { lives: forcedLives }
      : await fetchLivesState();
    const currentLives = state.lives ?? MAX_LIVES;
    const shouldAnimateLives =
      forcedLives !== undefined &&
      lastKnownLives !== null &&
      currentLives !== lastKnownLives;
    const lostLife =
      forcedLives !== undefined &&
      lastKnownLives !== null &&
      currentLives < lastKnownLives;
    const livesEls = document.querySelectorAll("#livesCounter, #livesCounterHome, #livesCounterModules, #livesCounterSidebar, .lives-pill");
    livesEls.forEach((el) => {
      el.innerHTML = `
        <span class="life-icon" aria-hidden="true">❤️</span>
        <span class="life-count">${currentLives}/${MAX_LIVES}</span>
        <span class="life-label">${currentLives === 1 ? "vida restante" : "vidas restantes"}</span>
      `;
      el.setAttribute(
        "aria-label",
        `${currentLives} ${currentLives === 1 ? "vida restante" : "vidas restantes"} de ${MAX_LIVES}`
      );
      el.classList.toggle("lives-low", currentLives > 0 && currentLives <= 2);
      el.classList.toggle("lives-empty", currentLives <= 0);
      if (shouldAnimateLives) {
        window.pulseFeedbackElement?.(el);
      }
      if (lostLife) {
        el.classList.remove("life-lost");
        void el.offsetWidth;
        el.classList.add("life-lost");
        setTimeout(() => el.classList.remove("life-lost"), 700);
      }
    });
    lastKnownLives = currentLives;
  }

  // Atualiza vidas periodicamente para refletir regeneração do backend
  if (!isLevelingFlowPage) {
    setInterval(() => updateLivesUI(), 30000);
    updateLivesUI();
  }

  async function attemptBuyLifeRecharge() {
    if (!userId) return false;

    try {
      const response = await fetch("/api/profile/inventory/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          nome: "Recarga de Vidas",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (window.showToast) {
          window.showToast(data.message || "Compra não realizada.");
        }
        return false;
      }

      updateLivesUI(data.lives ?? MAX_LIVES);
      updateCoinBalanceUI(data.saldo);
      if (window.showToast) window.showToast("Vidas recarregadas!");
      return true;
    } catch (error) {
      if (window.showToast) {
        window.showToast("Não foi possível concluir a compra.");
      }
      return false;
    }
  }

  async function promptRechargeFlow() {
    return new Promise((resolve) => {
      const doBuy = async () => {
        const bought = await attemptBuyLifeRecharge();
        if (!bought && window.showToast) window.showToast("Compra não realizada.");
        resolve(bought);
      };
      if (window.showConfirmBox) {
        window.showConfirmBox({
          title: "Sem vidas",
          message: `Comprar recarga de vidas por ${LIFE_PRICE} moedas?`,
          onConfirm: doBuy,
          onCancel: () => resolve(false),
        });
      } else {
        const wants = window.confirm(
          `Sem vidas. Comprar recarga de vidas por ${LIFE_PRICE} moedas?`
        );
        if (wants) doBuy();
        else resolve(false);
      }
    });
  }

  // --- FUNÇÕES GLOBAIS E UTILITÁRIAS ---
  // (Funções mantidas: isValidEmail, showError, clearError, showSuccess, transitionToPage, goBack, etc.)

  // Função para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Função para mostrar mensagem de erro em um campo
  function showError(input, message) {
    if (!input) return;
    const parent = input.parentNode;
    parent.classList.add("shake");
    input.classList.add("error");

    const existingError = parent.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    parent.appendChild(errorDiv);

    setTimeout(() => {
      parent.classList.remove("shake");
    }, 500);
  }

  // Função para limpar la mensagem de erro de um campo
  function clearError(input) {
    if (!input) return;
    input.classList.remove("error");
    const errorMessage = input.parentNode.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  // Função para mostrar uma mensagem de sucesso geral
  function showSuccess(message, formElement) {
    if (!formElement) return;
    const existingSuccess = formElement.querySelector(".success-message");
    if (existingSuccess) {
      existingSuccess.remove();
    }

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    successDiv.style.display = "block";

    const formTitle = formElement.querySelector(".title, .form-title");
    if (formTitle) {
      formTitle.parentNode.insertBefore(successDiv, formTitle.nextSibling);
    }
  }

  // Função para transição suave de página
  function transitionToPage(href) {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = href;
    }, 500);
  }

  // Função para voltar à página anterior
  window.goBack = function () {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.history.back();
    }, 500);
  };

  // Efeitos globais (paralaxe, foco em inputs)
  document.addEventListener("mousemove", (e) => {
    const mascot = document.querySelector(".mascot, .mascot-container");
    if (mascot) {
      const x = (e.clientX / window.innerWidth) * 15 - 7.5;
      const y = (e.clientY / window.innerHeight) * 15 - 7.5;
      mascot.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
  });

  const allInputs = document.querySelectorAll("input");
  allInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentNode.style.transform = "scale(1.02)";
    });
    input.addEventListener("blur", () => {
      input.parentNode.style.transform = "scale(1)";
    });
    input.addEventListener("input", () => clearError(input));
  });

  // --- LÓGICA ESPECÍFICA DE CADA PÁGINA ---

  // 0. PÁGINA DE MÓDULOS (modulos.html)
  const modulesGrid = document.getElementById("modulesGrid");
  if (modulesGrid) {
    modulesGrid.innerHTML = "";
    moduleCatalog.forEach((mod) => {
      const progress = getModuleProgress(mod.id);
      // força total de lições alinhado ao catálogo
      if (progress.totalLessons !== (mod.totalLessons || progress.totalLessons)) {
        saveModuleProgress(mod.id, progress.completedLessons, mod.totalLessons || progress.totalLessons);
        progress.totalLessons = mod.totalLessons || progress.totalLessons;
      }
      const unlocked = isModuleUnlocked(mod);
      const availableLessons =
        (lessonsByModule[mod.id] && lessonsByModule[mod.id].length) ||
        mod.totalLessons ||
        progress.totalLessons ||
        1;
      const displayTotal = mod.displayLessons || availableLessons;
      const completedCount = Math.min(progress.completedLessons || 0, availableLessons);
      // Considera concluído apenas quando todas as lições previstas (displayTotal) estiverem feitas
      const completed = completedCount >= displayTotal && unlocked;
      const moduleState = completed
        ? "completed"
        : unlocked && completedCount > 0
        ? "in-progress"
        : unlocked
        ? "available"
        : "locked";
      const percent = Math.min(
        100,
        Math.round(
          (completedCount / (displayTotal || 1)) *
            100
        )
      );

      const card = document.createElement("article");
      card.className = `module-card module-state-${moduleState}`;
      card.innerHTML = `
        <span class="badge">${mod.badge || "Módulo"}</span>
        <h3>${mod.title}</h3>
        <p>${mod.description || ""}</p>
        <div class="progress-row">
          <span>${completedCount}/${displayTotal} lições</span>
          <span>${percent}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${percent}%"></div>
        </div>
        <div class="module-footer">
          <span class="status ${moduleState}">
            ${
              completed
                ? '<i class="fas fa-check-circle"></i> Concluído'
                : moduleState === "in-progress"
                ? '<i class="fas fa-play-circle"></i> Em andamento'
                : moduleState === "available"
                ? '<i class="fas fa-unlock"></i> Disponível'
                : '<i class="fas fa-lock"></i> Bloqueado'
            }
          </span>
        <button class="primary select-module" ${unlocked ? "" : "disabled"}>
            ${completed ? "Revisar" : unlocked ? "Entrar" : "Bloqueado"}
        </button>
        </div>
      `;

      const btn = card.querySelector(".select-module");
      btn.addEventListener("click", () => {
        if (!unlocked) return;
        persistSelection(mod);
        window.location.href = "home.html";
      });

    modulesGrid.appendChild(card);
  });

    const selectedModule = resolveSelectedModule();
    const selectedProgress = selectedModule
      ? getModuleProgress(selectedModule.id)
      : { completedLessons: 0, totalLessons: 0 };
    const nextModules = moduleCatalog
      .filter((mod) => {
        const progress = getModuleProgress(mod.id);
        return progress.completedLessons < (mod.totalLessons || 0);
      })
      .map((mod) => mod.title);

    window.CodeBuddyContext?.updateContext?.({
      student: {
        currentModule: selectedModule?.title || "",
        currentLesson: "",
      },
      page: {
        type: "module",
        title: "Módulos",
        description: [
          selectedModule
            ? `Módulo selecionado: ${selectedModule.title}`
            : "Nenhum módulo selecionado",
          `Progresso: ${selectedProgress.completedLessons || 0}/${
            selectedProgress.totalLessons || selectedModule?.totalLessons || 0
          } lições concluídas`,
          nextModules.length
            ? `Próximos conteúdos: ${nextModules.join(", ")}`
            : "Não há próximos conteúdos disponíveis",
        ].join("\n"),
        moduleId: selectedModule?.id ?? null,
        lessonId: null,
        exerciseId: null,
      },
    });
}

  // Intro da lição (intro_modulo.html) - preenche textos conforme lição atual
  const introPage = document.querySelector(".intro-page");
  if (introPage) {
    const selectedModule = resolveSelectedModule();
    const progress = selectedModule ? getModuleProgress(selectedModule.id) : { completedLessons: 0 };
    const availableIntro =
      (lessonsByModule[selectedModule?.id] &&
        lessonsByModule[selectedModule?.id].length) ||
      progress.totalLessons ||
      selectedModule?.totalLessons ||
      1;
    const rawLessonIndex = resolveLessonIndex(
      selectedModule?.id,
      availableIntro,
      progress.completedLessons || 0
    );
    const metaList = lessonMeta[selectedModule?.id] || [];
    const meta = metaList[Math.min(rawLessonIndex, metaList.length - 1)] || metaList[0];
    if (meta) {
      const titleEl = document.querySelector(".highlight-card .title");
      const descriptionEl = document.getElementById("lessonIntroDesc");
      const focusEl = document.getElementById("lessonFocus");
      const goalEl = document.getElementById("lessonGoal");
      const timeEl = document.getElementById("estimatedTime");
      const pillEl = document.querySelector(".intro-header .pill");
      const eyebrowEl = document.getElementById("lessonIntroEyebrow");
      if (titleEl) titleEl.textContent = meta.title;
      if (focusEl) focusEl.textContent = meta.focus;
      if (goalEl) goalEl.textContent = meta.goal;
      if (timeEl) timeEl.textContent = meta.estimatedTime;
      if (pillEl) pillEl.textContent = meta.pill || "Lição";
      if (eyebrowEl) {
        eyebrowEl.textContent =
          rawLessonIndex === 0 ? "Primeira atividade" : "Próxima atividade";
      }

      let studentLevel = "";
      try {
        const result = JSON.parse(
          localStorage.getItem("lastTestResult") || "{}"
        );
        studentLevel = result.classification || "";
      } catch (error) {
        studentLevel = "";
      }

      window.CodeBuddyContext?.updateContext?.({
        student: {
          level: studentLevel,
          currentModule: selectedModule?.title || "",
          currentLesson: meta.pill || titleEl?.textContent || "",
        },
        page: {
          type: "lesson",
          title: meta.pill || titleEl?.textContent || "",
          description: [
            descriptionEl?.textContent?.trim(),
            meta.focus ? `Foco: ${meta.focus}` : "",
            meta.goal ? `Objetivo: ${meta.goal}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          moduleId: selectedModule?.id ?? null,
          lessonId: meta.id ?? null,
          exerciseId: null,
        },
      });

      window.addEventListener(
        "pagehide",
        () => window.CodeBuddyContext?.resetContext?.(),
        { once: true }
      );
    }
  }

  if (window.location.pathname.endsWith("modulos.html")) {
    updateLivesUI();
  }

  // 1. PÁGINA DE APRESENTAÇÃO (apresentacao.html)
  const continueBtn = document.querySelector(".continue-btn");
  if (continueBtn) {
    window.continuar = function () {
      transitionToPage("login.html");
    };
  }

  // 2. PÁGINA DE LOGIN (login.html)
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitButton = loginForm.querySelector("button[type='submit']");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      let hasError = false;

      if (!email) {
        showError(emailInput, "Por favor, digite seu email");
        hasError = true;
      } else if (!isValidEmail(email)) {
        showError(emailInput, "Por favor, digite um email válido");
        hasError = true;
      }

      if (!password) {
        showError(passwordInput, "Por favor, digite sua senha");
        hasError = true;
      }

      if (!hasError) {
        // LÓGICA DE LOGIN MODIFICADA (sem Firebase)
        try {
          window.setButtonLoading?.(submitButton, true, "Entrando...");
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            // Login bem-sucedido!
            console.log("Usuário logado:", data.user);
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("userEmail", data.user.email);
            alert(data.message || "Login realizado com sucesso!");

            // Opcional: Salvar token/info do usuário no localStorage, se o backend enviar
            // localStorage.setItem("user", JSON.stringify(data.user));

            // Redireciona dependendo se o usuário já completou o nivelamento
            try {
              const completed = data.user && data.user.leveling_completed;
              if (completed) {
                window.location.href = "modulos.html";
              } else {
                window.location.href = "intro_nivelamento.html";
              }
            } catch (e) {
              // Em caso de erro, fallback para intro de nivelamento
              window.location.href = "intro_nivelamento.html";
            }
          } else {
            // Erro vindo do backend
            console.error("Erro no login:", data.message);
            alert(data.message || "Email ou senha inválidos.");
          }
        } catch (error) {
          // Erro de rede ou fetch
          console.error("Erro de rede:", error);
          alert("Erro ao conectar ao servidor. Tente novamente.");
        } finally {
          window.setButtonLoading?.(submitButton, false);
        }
      }
    }); // Fim do 'submit'

    const signupLink = document.getElementById("signupLink");
    if (signupLink) {
      signupLink.addEventListener("click", (e) => {
        e.preventDefault();
        transitionToPage("signup.html");
      });
    }
  }

  // 3. PÁGINA DE CADASTRO (signup.html)
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("user").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Validação básica
      if (!username || !email || !password || !confirmPassword) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
      if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          // Mensagem de sucesso e redirecionamento
          alert(data.message || "Cadastro realizado com sucesso!");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Erro ao cadastrar.");
        }
      } catch (err) {
        alert("Erro de conexão. Tente novamente.");
      }
    }); // Fim do 'submit'

    const loginLink = document.getElementById("loginLink");
    if (loginLink) {
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        transitionToPage("login.html");
      });
    }
  }

  // 4. PÁGINA DE CONFIRMAÇÃO DE EMAIL (email-confirmation.html)
  const confirmationForm = document.getElementById("confirmationForm");
  if (confirmationForm) {
    const emailInput = document.getElementById("email");
    const submitBtn = confirmationForm.querySelector("button[type='submit']"); // Pega o botão

    confirmationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const originalBtnText = submitBtn.textContent;

      if (isValidEmail(email)) {
        // Desabilita o botão e mostra loading
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

        try {
          const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          // Salva o email no localStorage para usar nas próximas etapas
          localStorage.setItem("resetEmail", email);

          // Mostra a mensagem (seja de sucesso ou erro)
          showSuccess(data.message || "Solicitação enviada.", confirmationForm);

          // Transiciona para a próxima página
          setTimeout(() => transitionToPage("verify-code.html"), 2000);
        } catch (error) {
          console.error("Erro em forgot-password:", error);
          showError(emailInput, "Erro ao conectar ao servidor.");
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      } else {
        showError(emailInput, "Por favor, digite um email válido");
      }
    });
  }

  // 5. PÁGINA DE VERIFICAÇÃO DE CÓDIGO (verify-code.html)
  const verificationForm = document.getElementById("verificationForm");
  if (verificationForm) {
    const codeInputs = document.querySelectorAll(".code-input");
    const submitBtn = verificationForm.querySelector("button[type='submit']");

    // ... (lógica de inputs de código mantida) ...
    codeInputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        if (input.value && index < codeInputs.length - 1) {
          codeInputs[index + 1].focus();
        }
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
          codeInputs[index - 1].focus();
        }
      });
    });

    verificationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = Array.from(codeInputs)
        .map((input) => input.value)
        .join("");

      // Pega o email salvo
      const email = localStorage.getItem("resetEmail");
      const originalBtnText = submitBtn.textContent;

      if (!email) {
        alert("Erro: Email não encontrado. Por favor, volte ao início.");
        return;
      }

      if (code.length === 6) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Verificando...";

        try {
          const response = await fetch("/api/auth/verify-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
          });

          const data = await response.json();

          if (response.ok) {
            // Salva o código verificado para usar na última etapa
            localStorage.setItem("resetCode", code);
            showSuccess("Código verificado com sucesso!", verificationForm);
            setTimeout(() => transitionToPage("new-password.html"), 1500);
          } else {
            showError(codeInputs[0], data.message || "Código inválido.");
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        } catch (error) {
          console.error("Erro em verify-code:", error);
          showError(codeInputs[0], "Erro ao conectar ao servidor.");
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      } else {
        showError(codeInputs[0], "O código deve ter 6 dígitos.");
      }
    });
  }

  // 6. PÁGINA DE NOVA SENHA (new-password.html)
  const newPasswordForm = document.getElementById("newPasswordForm");
  if (newPasswordForm) {
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const submitBtn = newPasswordForm.querySelector("button[type='submit']");

    newPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const originalBtnText = submitBtn.textContent;

      // Pega dados salvos
      const email = localStorage.getItem("resetEmail");
      const code = localStorage.getItem("resetCode");

      if (!email || !code) {
        alert(
          "Erro: Sessão de redefinição inválida. Por favor, comece novamente."
        );
        return;
      }

      let hasError = false;
      if (newPassword.length < 6) {
        showError(
          newPasswordInput,
          "A nova senha deve ter pelo menos 6 caracteres."
        );
        hasError = true;
      }
      if (newPassword !== confirmPassword) {
        showError(confirmPasswordInput, "As senhas não coincidem.");
        hasError = true;
      }

      if (!hasError) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Salvando...";

        try {
          const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, newPassword }),
          });

          const data = await response.json();

          if (response.ok) {
            // Limpa o localStorage
            localStorage.removeItem("resetEmail");
            localStorage.removeItem("resetCode");

            showSuccess("Senha alterada com sucesso!", newPasswordForm);
            setTimeout(() => transitionToPage("login.html"), 1500);
          } else {
            showError(
              newPasswordInput,
              data.message || "Não foi possível alterar a senha."
            );
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        } catch (error) {
          console.error("Erro em reset-password:", error);
          showError(newPasswordInput, "Erro ao conectar ao servidor.");
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // 7. PÁGINA DE INTRODUÇÃO DO NIVELAMENTO (intro_nivelamento.html)
  // ... (lógica mantida)
  const startBtn = document.querySelector(".start-btn");
  if (startBtn) {
    let isLevelConfirmOpen = false;

    window.startLevelTest = function () {
      if (isLevelConfirmOpen) return;
      isLevelConfirmOpen = true;

      const startLeveling = () => transitionToPage("qst_nivelamento.html");
      const resetConfirmState = () => {
        isLevelConfirmOpen = false;
      };

      if (window.showConfirmBox) {
        window.showConfirmBox({
          title: "Iniciar nivelamento",
          message:
            "Responda com atenção: depois de avançar para a próxima questão, sua resposta não poderá ser alterada. O resultado será usado para definir seu nível inicial.",
          confirmText: "Iniciar nivelamento",
          cancelText: "Cancelar",
          onConfirm: startLeveling,
          onCancel: resetConfirmState,
        });
        return;
      }

      const confirmed = window.confirm(
        "Depois de avançar para a próxima questão, sua resposta não poderá ser alterada. O resultado será usado para definir seu nível inicial. Iniciar nivelamento?"
      );
      if (confirmed) {
        startLeveling();
      } else {
        resetConfirmState();
      }
    };

    const leftSection = document.querySelector(".left-section");
    if (leftSection) {
      leftSection.style.opacity = "0";
      leftSection.style.transform = "translateX(-50px)";
      setTimeout(() => {
        leftSection.style.transition = "all 0.8s ease";
        leftSection.style.opacity = "1";
        leftSection.style.transform = "translateX(0)";
      }, 300);
    }
  }

  // 8. PÁGINA DE TESTE DE NIVELAMENTO (qst_nivelamento.html)
  // ... (lógica mantida)
  const testCard = document.querySelector(".test-card");
  if (testCard && !document.querySelector(".result-card")) {
    // Tenta carregar as perguntas do backend; se falhar, usa um fallback local
    let testQuestions = [];

    const fallbackQuestions = [
      {
        question:
          "Qual das alternativas abaixo cria corretamente uma função em JavaScript?",
        options: [
          {
            letter: "A",
            text: 'function = minhaFuncao() { console.log("Olá Mundo"); }',
            correct: false,
          },
          {
            letter: "B",
            text: 'let minhaFuncao() => { console.log("Olá Mundo"); }',
            correct: false,
          },
          {
            letter: "C",
            text: 'function minhaFuncao() { console.log("Olá Mundo"); }',
            correct: true,
          },
          {
            letter: "D",
            text: 'fun minhaFuncao() { console.log("Olá Mundo"); }',
            correct: false,
          },
        ],
      },
      {
        question:
          "Como você declara uma variável em JavaScript que não pode ser reatribuída?",
        options: [
          { letter: "A", text: "var minhaVariavel = 10;", correct: false },
          { letter: "B", text: "let minhaVariavel = 10;", correct: false },
          { letter: "C", text: "const minhaVariavel = 10;", correct: true },
          { letter: "D", text: "final minhaVariavel = 10;", correct: false },
        ],
      },
      // ... mantenha um menor conjunto de fallback se necessário ...
    ];

    async function loadQuestions() {
      try {
        const resp = await fetch("/api/leveling/questions");
        if (resp.ok) {
          const data = await resp.json();
          // data deve vir no formato: [{ question: '...', options: [{ letter, text, correct, id }, ...]}, ...]
          testQuestions = data.map((q) => ({
            question: q.question || q.question_text || "",
            options: (q.options || []).map((opt) => ({
              letter: opt.letter || "",
              text: opt.text || opt.option_text || "",
              correct: !!opt.correct,
            })),
          }));
          if (!testQuestions.length)
            throw new Error("Sem perguntas retornadas");
        } else {
          console.warn(
            "Falha ao carregar perguntas do servidor, usando fallback. Status:",
            resp.status
          );
          testQuestions = fallbackQuestions;
        }
      } catch (err) {
        console.error("Erro ao buscar perguntas:", err);
        testQuestions = fallbackQuestions;
      }
    }

    await loadQuestions();

    const isLevelingReviewMode =
      new URLSearchParams(window.location.search).get("review") === "1";
    const levelingReviewKey = userScopedKey("leveling_review_snapshot");

    let currentQuestion = 0;
    let selectedAnswer = null;
    let userAnswers = [];
    let answeredFlags = [];
    let isNavigatingQuestion = false;
    let levelingReviewSnapshot = null;

    if (isLevelingReviewMode) {
      try {
        levelingReviewSnapshot = JSON.parse(
          localStorage.getItem(levelingReviewKey) || "null"
        );
        if (Array.isArray(levelingReviewSnapshot?.questions)) {
          testQuestions = levelingReviewSnapshot.questions;
        }
        if (Array.isArray(levelingReviewSnapshot?.userAnswers)) {
          userAnswers = levelingReviewSnapshot.userAnswers;
          answeredFlags = testQuestions.map((_, index) =>
            Number.isInteger(Number(userAnswers[index]))
          );
        }
      } catch (error) {
        levelingReviewSnapshot = null;
      }
    }

    const questionTitle = document.getElementById("questionTitle");
    const optionsContainer = document.getElementById("optionsContainer");
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const nextBtn = document.querySelector(".next-btn");
    const backBtn = document.querySelector(".back-btn");

    window.goBackQuestion = function () {
      if (isNavigatingQuestion) return;
      if (currentQuestion > 0) {
        currentQuestion--;
        selectedAnswer = userAnswers[currentQuestion] ?? null;
        displayQuestion();
        updateProgress();
        updateButtons();
      }
    };

    window.nextQuestion = function () {
      if (isNavigatingQuestion) return;

      if (isLevelingReviewMode) {
        if (currentQuestion < testQuestions.length - 1) {
          currentQuestion++;
          selectedAnswer = userAnswers[currentQuestion] ?? null;
          displayQuestion();
          updateProgress();
          updateButtons();
        } else {
          const score = Number(levelingReviewSnapshot?.score) || 0;
          const total = Number(levelingReviewSnapshot?.total) || testQuestions.length;
          transitionToPage(`resultado_nivelamento.html?score=${score}&total=${total}`);
        }
        return;
      }

      if (!answeredFlags[currentQuestion]) {
        if (selectedAnswer === null) return;
        userAnswers[currentQuestion] = selectedAnswer;
        answeredFlags[currentQuestion] = true;
        showAnswerFeedback(
          !!testQuestions[currentQuestion].options[selectedAnswer]?.correct
        );
      } else {
        lockCurrentQuestion();
      }

      isNavigatingQuestion = true;
      updateButtons();

      setTimeout(() => {
        isNavigatingQuestion = false;
        if (currentQuestion < testQuestions.length - 1) {
          currentQuestion++;
          selectedAnswer = userAnswers[currentQuestion] ?? null;
          displayQuestion();
          updateProgress();
          updateButtons();
        } else {
          finishTest();
        }
      }, 1000);
    };

    function displayQuestion() {
      const questionData = testQuestions[currentQuestion];
      const isAnswered =
        isLevelingReviewMode || !!answeredFlags[currentQuestion];
      questionTitle.textContent = questionData.question;
      optionsContainer.innerHTML = "";
      questionData.options.forEach((option, index) => {
        const optionElement = document.createElement("div");
        optionElement.className = "option";
        if (selectedAnswer === index) {
          optionElement.classList.add("selected");
        }
        if (isAnswered) {
          optionElement.classList.add("locked");
          optionElement.setAttribute("aria-disabled", "true");
          if (option.correct) {
            optionElement.classList.add("correct");
          }
          if (selectedAnswer === index && !option.correct) {
            optionElement.classList.add("incorrect");
          }
        }
        optionElement.innerHTML = `<span class=\"option-letter\">${option.letter}-</span> <span class=\"option-text\">${option.text}</span>`;
        if (!isAnswered) {
          optionElement.addEventListener("click", () =>
            selectOption(index, optionElement)
          );
        }
        optionsContainer.appendChild(optionElement);
      });
    }

    function selectOption(index, element) {
      if (isLevelingReviewMode) return;
      if (answeredFlags[currentQuestion]) return;
      const previousSelected =
        optionsContainer.querySelector(".option.selected");
      if (previousSelected) {
        previousSelected.classList.remove("selected");
      }
      element.classList.add("selected");
      selectedAnswer = index;
      nextBtn.disabled = false;
    }

    function showAnswerFeedback(isCorrect) {
      const options = optionsContainer.querySelectorAll(".option");
      options.forEach((option, index) => {
        option.style.pointerEvents = "none";
        option.classList.add("locked");
        option.setAttribute("aria-disabled", "true");
        if (testQuestions[currentQuestion].options[index].correct) {
          option.classList.add("correct");
        }
        if (index === selectedAnswer && !isCorrect) {
          option.classList.add("incorrect");
        }
      });
    }

    function lockCurrentQuestion() {
      const options = optionsContainer.querySelectorAll(".option");
      options.forEach((option) => {
        option.style.pointerEvents = "none";
        option.classList.add("locked");
        option.setAttribute("aria-disabled", "true");
      });
    }

    function updateProgress() {
      const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
      progressFill.style.width = progress + "%";
      progressText.textContent = `Questão ${currentQuestion + 1} de ${
        testQuestions.length
      }`;
    }

    function updateButtons() {
      backBtn.disabled = isNavigatingQuestion || currentQuestion === 0;
      backBtn.style.opacity = backBtn.disabled ? "0.5" : "1";
      if (isLevelingReviewMode) {
        nextBtn.disabled = false;
        nextBtn.textContent =
          currentQuestion < testQuestions.length - 1
            ? "Pr\u00f3xima quest\u00e3o"
            : "Voltar ao resultado";
        return;
      }
      nextBtn.disabled = isNavigatingQuestion || (!answeredFlags[currentQuestion] && selectedAnswer === null);
      nextBtn.textContent =
        currentQuestion < testQuestions.length - 1 ? "Avançar" : "Finalizar";
    }

    async function finishTest() {
      const score = testQuestions.reduce((total, question, index) => {
        const answerIndex = userAnswers[index];
        return total + (question.options?.[answerIndex]?.correct ? 1 : 0);
      }, 0);
      const percentage = Math.round((score / testQuestions.length) * 100);
      console.log(
        `Teste finalizado! Pontuação: ${score}/${testQuestions.length} (${percentage}%)`
      );
      localStorage.setItem(
        levelingReviewKey,
        JSON.stringify({
          questions: testQuestions,
          userAnswers,
          score,
          total: testQuestions.length,
          percentage,
        })
      );
      try {
        const uid = localStorage.getItem('userId');
        if (uid) {
          const answered = testQuestions.length;
          const correct = score;
          const wrong = Math.max(0, answered - correct);
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid, answeredCount: answered, correctCount: correct, wrongCount: wrong })
          }).catch(() => {});
        }
      } catch (e) { /* não bloqueia fluxo */ }
      transitionToPage(
        `resultado_nivelamento.html?score=${score}&total=${testQuestions.length}`
      );
    }

    // Inicialização do Teste
    if (questionTitle) {
      displayQuestion();
      updateProgress();
      updateButtons();
    }

    testCard.style.opacity = "0";
    testCard.style.transform = "translateY(30px)";
    setTimeout(() => {
      testCard.style.transition = "all 0.6s ease";
      testCard.style.opacity = "1";
      testCard.style.transform = "translateY(0)";
    }, 100);
  }

  // 9. PÁGINA DE RESULTADO DO NIVELAMENTO (resultado_nivelamento.html)
  // ... (lógica mantida)
  const resultCard = document.querySelector(".result-card:not(.lesson)");
  if (resultCard) {
    // Função para calcular percentual
    function calculatePercentage(correct, total) {
      return Math.round((correct / total) * 100);
    }

    // Função para determinar classificação
    function getClassification(percentage) {
      if (percentage >= 80) return { level: "Avançado", class: "avancado" };
      if (percentage >= 60)
        return { level: "Intermediário", class: "intermediario" };
      return { level: "Iniciante", class: "iniciante" };
    }

    // Função para simular categorias baseadas na pontuação
    function generateCategoryScores(score, total) {
      const percentage = calculatePercentage(score, total);
      const baseScore = Math.floor(score * 0.4); // 40% do score base

      return [
        {
          name: "Variáveis e Tipos de Dados",
          correct: Math.min(baseScore + Math.floor(Math.random() * 2), 2),
          total: 2,
        },
        {
          name: "Operadores e Condicionais",
          correct: Math.min(baseScore + Math.floor(Math.random() * 3), 3),
          total: 3,
        },
        {
          name: "Funções e Escopo",
          correct: Math.min(baseScore + Math.floor(Math.random() * 3), 3),
          total: 3,
        },
        {
          name: "Laços de Repetição",
          correct: Math.min(score - baseScore * 3, 2),
          total: 2,
        },
      ];
    }

    // Função para encontrar melhor categoria
    function getBestCategory(categories) {
      return categories.reduce((best, current) => {
        const bestPercentage = calculatePercentage(best.correct, best.total);
        const currentPercentage = calculatePercentage(
          current.correct,
          current.total
        );
        return currentPercentage > bestPercentage ? current : best;
      });
    }

    // Função para animar contador
    function animateCounter(element, start, end, duration) {
      const range = end - start;
      const increment = range / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        element.textContent = Math.round(current) + "%";
      }, 16);
    }

    // Função para avançar para próxima etapa
    window.proceedToNextStep = function () {
      const advanceBtn = document.querySelector(".advance-btn");
      const originalText = advanceBtn.textContent;
      advanceBtn.innerHTML = `
          <div class="loading">
            <div class="spinner"></div>
            Abrindo módulos
          </div>
        `;
      advanceBtn.disabled = true;

      (async function () {
        try {
          // Tenta marcar o nivelamento como concluído no backend
          const level =
            window &&
            window.getComputedStyle &&
            typeof classification !== "undefined"
              ? classification.level
              : null;
          if (userId) {
            await fetch("/api/leveling/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: userId, level: level }),
            });
          }
        } catch (err) {
          console.error("Erro ao marcar nivelamento concluído:", err);
          // Não impede o fluxo do usuário caso a chamada falhe
        } finally {
          // Redireciona independentemente do resultado da chamada
          setTimeout(() => {
            transitionToPage("modulos.html");
            advanceBtn.textContent = originalText;
            advanceBtn.disabled = false;
          }, 1200);
        }
      })();
    };

    // Pega os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const score = parseInt(params.get("score")) || 4;
    const total = parseInt(params.get("total")) || 10;
    const percentage = calculatePercentage(score, total);

    // Gera dados das categorias
    const categories = generateCategoryScores(score, total);
    const bestCategory = getBestCategory(categories);
    const classification = getClassification(percentage);

    // Atualiza elementos na tela
    document.getElementById(
      "resultTitle"
    ).textContent = `Você acertou ${percentage}% do teste!`;

    // Anima o percentual principal
    const scoreElement = document.getElementById("scorePercentage");
    animateCounter(scoreElement, 0, percentage, 2000);

    // Atualiza categorias
    const categoryScoresElement = document.getElementById("categoryScores");
    if (categoryScoresElement) {
      categoryScoresElement.innerHTML = "";
      categories.forEach((category, index) => {
        const categoryPercent = category.total
          ? Math.round((category.correct / category.total) * 100)
          : 0;
        const categoryStatus =
          categoryPercent >= 70
            ? "Ponto forte"
            : categoryPercent >= 50
            ? "Revisar"
            : "Estudar";
        const categoryStatusClass =
          categoryPercent >= 70
            ? "strong"
            : categoryPercent >= 50
            ? "medium"
            : "low";
        const categoryItem = document.createElement("div");
        categoryItem.className = `category-item category-strength-${categoryStatusClass}`;
        categoryItem.style.animationDelay = `${0.3 + index * 0.2}s`;
        categoryItem.innerHTML = `
          <div class="category-main">
            <span class="category-name">${category.name}</span>
            <span class="category-status">${categoryStatus}</span>
          </div>
          <div class="category-progress" aria-hidden="true">
            <span class="category-progress-fill" style="width: ${categoryPercent}%"></span>
          </div>
          <div class="category-meta">
            <span class="category-score">${category.correct}/${category.total}</span>
            <span class="category-percent">${categoryPercent}%</span>
          </div>
        `;
        categoryScoresElement.appendChild(categoryItem);
      });
    }

    // Atualiza melhor categoria
    const bestCategoryElement = document.getElementById("bestCategory");
    if (bestCategoryElement) {
      bestCategoryElement.textContent = bestCategory.name;
    }

    // Atualiza classificação
    const classificationElement = document.getElementById(
      "finalClassification"
    );
    if (classificationElement) {
      classificationElement.textContent = classification.level;
      classificationElement.className = `final-classification classification-${classification.class}`;
    }

    const classificationDescriptionElement = document.getElementById(
      "classificationDescription"
    );
    if (classificationDescriptionElement) {
      const descriptions = {
        iniciante:
          "Você está começando agora ou ainda precisa reforçar os fundamentos. A trilha recomendada vai priorizar conceitos essenciais e avançar no seu ritmo.",
        intermediario:
          "Você já domina parte dos fundamentos e pode seguir para desafios um pouco mais práticos. A trilha recomendada vai revisar pontos importantes e acelerar sua evolução.",
        avancado:
          "Você demonstrou boa base nos conteúdos avaliados. A trilha recomendada pode começar por tópicos mais desafiadores e aprofundar sua prática.",
      };
      classificationDescriptionElement.textContent =
        descriptions[classification.class] ||
        "Sua trilha será ajustada de acordo com seu nível inicial.";
    }

    const classificationMotivationElement = document.getElementById(
      "classificationMotivation"
    );
    if (classificationMotivationElement) {
      const motivations = {
        iniciante:
          "Comece pela base e construa confiança a cada etapa. Sua trilha vai te ajudar a evoluir com clareza desde os primeiros conceitos.",
        intermediario:
          "Você já tem uma boa base para seguir em frente. Continue praticando e use sua trilha para transformar conhecimento em domínio.",
        avancado:
          "Você está pronto para desafios maiores. Inicie sua trilha para aprofundar a prática e consolidar seu próximo nível.",
      };
      classificationMotivationElement.textContent =
        motivations[classification.class] ||
        "Continue avançando: sua trilha de aprendizagem começa agora.";
    }

    // Adiciona evento ao botão avançar
    const advanceBtn = document.querySelector(".advance-btn");
    if (advanceBtn) {
      advanceBtn.addEventListener("click", window.proceedToNextStep);
    }

    // Animação de entrada da página
    resultCard.style.opacity = "0";
    resultCard.style.transform = "translateY(40px)";
    setTimeout(() => {
      resultCard.style.transition = "all 0.8s ease";
      resultCard.style.opacity = "1";
      resultCard.style.transform = "translateY(0)";
    }, 100);

    // Salva resultado no localStorage
    const resultData = {
      score,
      total,
      percentage,
      categories,
      classification: classification.level,
      bestCategory: bestCategory.name,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("lastTestResult", JSON.stringify(resultData));
  }

  // 10. QUESTIONÁRIO DO MÓDULO (qst_modulo.html) - fluxo inspirado no nivelamento
  const lessonQuizPage = document.querySelector(".quiz-page");
  if (lessonQuizPage) {
    const questionText = document.getElementById("questionText");
    const optionsList = document.getElementById("optionsList");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const questionIndicator = document.getElementById("questionIndicator");
    const questionPill = document.querySelector(".question-pill");
    const backBtn = document.getElementById("lessonBackBtn");
    const skipBtnLesson = document.getElementById("lessonSkipBtn");
    const nextBtnLesson = document.getElementById("lessonNextBtn");

    if (
      questionText &&
      optionsList &&
      progressFill &&
      progressPercent &&
      questionIndicator &&
      questionPill &&
      backBtn &&
      skipBtnLesson &&
      nextBtnLesson
    ) {
      const pageParams = new URLSearchParams(window.location.search);
      const isReviewMode = pageParams.get("review") === "1";
      const reviewModuleId = isReviewMode ? pageParams.get("module") : "";
      const selectedModule =
        (reviewModuleId && moduleCatalog.find((mod) => mod.id === reviewModuleId)) ||
        resolveSelectedModule();
      const progress = selectedModule ? getModuleProgress(selectedModule.id) : { completedLessons: 0, totalLessons: 1 };
      const availableLessons =
        (lessonsByModule[selectedModule?.id] &&
          lessonsByModule[selectedModule?.id].length) ||
        progress.totalLessons ||
        selectedModule?.totalLessons ||
        1;
      const rawLessonIndex = resolveLessonIndex(
        selectedModule?.id,
        availableLessons,
        progress.completedLessons || 0
      );
      const maxLessons =
        selectedModule?.totalLessons ||
        (lessonsByModule[selectedModule?.id]?.length || 1);
      const reviewLessonIndex = Number(pageParams.get("lesson"));
      const currentLessonIndex =
        isReviewMode && Number.isInteger(reviewLessonIndex)
          ? Math.max(0, Math.min(reviewLessonIndex, availableLessons - 1))
          : Math.max(0, Math.min(rawLessonIndex, availableLessons - 1));
      const questionsForModule = lessonsByModule[selectedModule?.id] || [];
      const lessonQuestions =
        questionsForModule[currentLessonIndex] ||
        questionsForModule[0] ||
        [];
      const metaList = lessonMeta[selectedModule?.id] || [];
      const meta = metaList[Math.min(currentLessonIndex, metaList.length - 1)] || metaList[0];
      const lessonTitleEl = document.getElementById("lessonTitle");
      if (lessonTitleEl && meta?.pill) lessonTitleEl.textContent = meta.pill;
      lessonQuizPage.classList.toggle("review-mode", isReviewMode);
      document.body.classList.toggle("lesson-review-mode", isReviewMode);
      const helperText = document.querySelector(".helper p");
      if (helperText && isReviewMode) {
        helperText.textContent =
          "Modo revisão: suas respostas estão bloqueadas. Use esta tela apenas para comparar sua escolha com a alternativa correta.";
      }

      const livesCounterEl = document.getElementById("livesCounter");
      updateLivesUI();

      let currentQuestion = 0;
      let selectedAnswer = null;
      let userAnswers = [];
      let answeredFlags = [];
      let score = 0;

      function getStudentLevel() {
        try {
          const result = JSON.parse(
            localStorage.getItem("lastTestResult") || "{}"
          );
          return result.classification || "";
        } catch (error) {
          return "";
        }
      }

      function updateExerciseContext() {
        if (!window.CodeBuddyContext?.updateContext) return;

        const exercise = lessonQuestions[currentQuestion] || {};
        const answeredIndexes = answeredFlags
          .map((answered, index) => (answered ? index : -1))
          .filter((index) => index >= 0);
        const testsPassed = answeredIndexes.filter((index) => {
          const answer = userAnswers[index];
          return lessonQuestions[index]?.options?.[answer]?.correct === true;
        }).length;

        window.CodeBuddyContext.updateContext({
          student: {
            level: getStudentLevel(),
            currentModule: selectedModule?.title || "",
            currentLesson: meta?.pill || lessonTitleEl?.textContent || "",
          },
          page: {
            type: "exercise",
            title: `${meta?.pill || "Exercício"} - Questão ${
              currentQuestion + 1
            }`,
            description: exercise.question || "",
            moduleId: selectedModule?.id ?? null,
            lessonId: meta?.id ?? null,
            exerciseId: exercise.id ?? null,
          },
          editor: {
            language: "javascript",
            code: "",
          },
          execution: {
            lastError: "",
            testsPassed,
            testsFailed: answeredIndexes.length - testsPassed,
            attempts: answeredIndexes.length,
          },
        });
      }

      async function loadSavedActivityAnswers() {
        if (!userId || !selectedModule?.id) return;

        try {
          const params = new URLSearchParams({
            userId,
            moduleId: selectedModule.id,
            lessonIndex: String(currentLessonIndex),
          });
          const response = await fetch(`/api/activity-answers?${params}`);
          const data = await response.json().catch(() => ({}));
          if (!response.ok || !Array.isArray(data.answers)) return;

          data.answers.forEach((answer) => {
            const questionIndex = Number(answer.questionIndex);
            const selected = Number(answer.selectedAnswer);
            if (
              Number.isInteger(questionIndex) &&
              questionIndex >= 0 &&
              questionIndex < lessonQuestions.length &&
              Number.isInteger(selected)
            ) {
              userAnswers[questionIndex] = selected;
              answeredFlags[questionIndex] = true;
            }
          });
        } catch (error) {
          console.warn("Não foi possível carregar respostas da atividade.", error);
        }
      }

      async function resetCurrentActivityAnswers() {
        if (!userId || !selectedModule?.id) return;

        try {
          const response = await fetch("/api/activity-answers", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              moduleId: selectedModule.id,
              lessonIndex: currentLessonIndex,
            }),
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(data.message || "Não foi possível reiniciar a atividade.");
          }
          userAnswers = [];
          answeredFlags = [];
        } catch (error) {
          if (window.showToast) {
            window.showToast(error.message || "Não foi possível reiniciar a atividade.");
          }
        }
      }

      async function saveActivityAnswer(questionIndex, answerIndex) {
        const response = await fetch("/api/activity-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            moduleId: selectedModule?.id,
            lessonIndex: currentLessonIndex,
            questionIndex,
            selectedAnswer: answerIndex,
          }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.answer) {
          throw new Error(data.message || "Não foi possível registrar a resposta.");
        }

        return data.answer;
      }

      function getFirstUnansweredQuestionIndex() {
        return lessonQuestions.findIndex((_, index) => !answeredFlags[index]);
      }

      function returnToLessonResult() {
        const snapshot =
          readLessonResultSnapshot(selectedModule?.id, currentLessonIndex) ||
          readLessonResultSnapshot();

        if (snapshot) {
          transitionToPage(getLessonResultUrl(snapshot));
          return;
        }

        transitionToPage("resultado_modulo.html");
      }

      function createOptionFeedbackLabel(option, isSelected) {
        if (option.correct && isSelected) {
          return `<span class="answer-feedback correct">Sua resposta correta</span>`;
        }
        if (option.correct) {
          return `<span class="answer-feedback correct">Resposta correta</span>`;
        }
        if (isSelected) {
          return `<span class="answer-feedback incorrect">Sua resposta</span>`;
        }
        return "";
      }

      function displayQuestion() {
        const data = lessonQuestions[currentQuestion];
        questionText.textContent = data.question;
        if (isReviewMode) {
          questionPill.textContent = `Revisão ${currentQuestion + 1}`;
        }
        questionPill.textContent = `Questão ${currentQuestion + 1}`;
        selectedAnswer = userAnswers[currentQuestion] ?? null;
        if (isReviewMode) {
          questionPill.textContent = `Revisão ${currentQuestion + 1}`;
        }
        optionsList.innerHTML = "";
        data.options.forEach((opt, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "option";
          const isSelected = selectedAnswer === idx;
          if (isSelected) btn.classList.add("selected");
          const feedbackLabel = answeredFlags[currentQuestion]
            ? createOptionFeedbackLabel(opt, isSelected)
            : "";
          btn.innerHTML = `
            <span class="option-main">
              <strong>${opt.letter})</strong>
              <span>${opt.text}</span>
            </span>
            ${feedbackLabel}
          `;
          if (answeredFlags[currentQuestion]) {
            // já respondida: mostra feedback e trava interação
            btn.disabled = true;
            btn.setAttribute("aria-disabled", "true");
            btn.classList.add("locked");
            if (data.options[idx].correct) {
              btn.classList.add("correct");
            }
            if (selectedAnswer === idx && !data.options[idx].correct) {
              btn.classList.add("incorrect");
            }
          } else {
            btn.addEventListener("click", () => selectOption(idx));
          }
          optionsList.appendChild(btn);
        });
        nextBtnLesson.disabled = !answeredFlags[currentQuestion];
        skipBtnLesson.disabled = isReviewMode || !answeredFlags[currentQuestion];
        skipBtnLesson.style.display = isReviewMode ? "none" : "";
        skipBtnLesson.textContent = "Pular";
        backBtn.disabled = currentQuestion === 0;
        if (isReviewMode) {
          if (currentQuestion === lessonQuestions.length - 1) {
            skipBtnLesson.textContent = "Rever quest\u00f5es";
            skipBtnLesson.style.display = "";
            skipBtnLesson.disabled = false;
            nextBtnLesson.textContent = "Sair da atividade";
          } else {
            nextBtnLesson.textContent = "Próxima questão";
          }
          nextBtnLesson.disabled = false;
        }
        updateExerciseContext();
      }

      function selectOption(idx) {
        if (isReviewMode) return;
        if (answeredFlags[currentQuestion]) return;
        selectedAnswer = idx;
        const buttons = optionsList.querySelectorAll(".option");
        buttons.forEach((btn, i) => {
          btn.classList.toggle("selected", i === idx);
        });
        nextBtnLesson.disabled = false;
      }

      function showAnswerFeedback(isCorrect) {
        const buttons = optionsList.querySelectorAll(".option");
        buttons.forEach((btn, i) => {
          btn.style.pointerEvents = "none";
          btn.disabled = true;
          btn.setAttribute("aria-disabled", "true");
          btn.classList.add("locked");
          if (lessonQuestions[currentQuestion].options[i].correct) {
            btn.classList.add("correct");
          }
          if (i === selectedAnswer && !isCorrect) {
            btn.classList.add("incorrect");
          }
        });
        answeredFlags[currentQuestion] = true;
        nextBtnLesson.disabled = true;
      }

      function updateProgress() {
        const progress = ((currentQuestion + 1) / lessonQuestions.length) * 100;
        const roundedProgress = Math.round(progress);
        progressFill.style.width = `${roundedProgress}%`;
        progressPercent.textContent = `${currentQuestion + 1}/${
          lessonQuestions.length
        } • ${roundedProgress}%`;
        progressFill.parentElement?.setAttribute(
          "aria-valuenow",
          String(roundedProgress)
        );
        questionIndicator.textContent = `Questão ${
          currentQuestion + 1
        } de ${lessonQuestions.length}`;
        nextBtnLesson.textContent =
          currentQuestion < lessonQuestions.length - 1
            ? "Próxima questão"
            : "Finalizar";
        backBtn.disabled = currentQuestion === 0;
        backBtn.style.opacity = currentQuestion === 0 ? "0.6" : "1";
        nextBtnLesson.disabled = selectedAnswer === null && !answeredFlags[currentQuestion];
        skipBtnLesson.disabled =
          !answeredFlags[currentQuestion] ||
          currentQuestion >= lessonQuestions.length - 1;
        skipBtnLesson.textContent = "Pular";
        if (isReviewMode) {
          questionIndicator.textContent = `Revisão ${
            currentQuestion + 1
          } de ${lessonQuestions.length}`;
          nextBtnLesson.textContent =
            currentQuestion < lessonQuestions.length - 1
              ? "Próxima questão"
              : "Sair da atividade";
          nextBtnLesson.disabled = false;
          if (currentQuestion === lessonQuestions.length - 1) {
            skipBtnLesson.textContent = "Rever quest\u00f5es";
            skipBtnLesson.style.display = "";
            skipBtnLesson.disabled = false;
          } else {
            skipBtnLesson.style.display = "none";
            skipBtnLesson.disabled = true;
          }
        }
      }

      function restartReview() {
        currentQuestion = 0;
        selectedAnswer = userAnswers[currentQuestion] ?? null;
        displayQuestion();
        updateProgress();
      }

      async function goToNext() {
        if (isReviewMode) {
          if (currentQuestion < lessonQuestions.length - 1) {
            currentQuestion++;
            selectedAnswer = userAnswers[currentQuestion] ?? null;
            displayQuestion();
            updateProgress();
          } else {
            returnToLessonResult();
          }
          return;
        }

        if (!answeredFlags[currentQuestion]) {
          if (selectedAnswer === null) return;

          const proposedAnswer = selectedAnswer;
          try {
            nextBtnLesson.disabled = true;
            const savedAnswer = await saveActivityAnswer(
              currentQuestion,
              proposedAnswer
            );
            selectedAnswer = Number(savedAnswer.selectedAnswer);
            userAnswers[currentQuestion] = selectedAnswer;
            answeredFlags[currentQuestion] = true;
            showAnswerFeedback(!!savedAnswer.isCorrect);
            updateExerciseContext();

            if (!savedAnswer.isCorrect && savedAnswer.inserted !== false) {
              const lives = await consumeLifeRemote();
              updateLivesUI(lives);
              window.showToast?.("Você perdeu 1 vida.", { type: "lives" });
              if (lives <= 0) {
                nextBtnLesson.disabled = true;
                const wants = await promptRechargeFlow();
                if (!wants) {
                  transitionToPage("home.html");
                  return;
                } else {
                  nextBtnLesson.disabled = false;
                }
              }
            }
          } catch (error) {
            nextBtnLesson.disabled = false;
            if (window.showToast) {
              window.showToast(error.message || "Não foi possível registrar a resposta.");
            }
            return;
          }
        }

        setTimeout(() => {
          if (currentQuestion < lessonQuestions.length - 1) {
            currentQuestion++;
            selectedAnswer = userAnswers[currentQuestion] ?? null;
            displayQuestion();
            updateProgress();
          } else {
            finishQuiz();
          }
        }, 700);
      }

      function goBack() {
        if (currentQuestion === 0) return;
        currentQuestion--;
        selectedAnswer = userAnswers[currentQuestion] ?? null;
        displayQuestion();
        updateProgress();
      }

      function skipQuestion() {
        if (isReviewMode) {
          if (currentQuestion === lessonQuestions.length - 1) {
            restartReview();
          }
          return;
        }

        if (!answeredFlags[currentQuestion]) {
          if (window.showToast) {
            window.showToast("Responda a questão antes de avançar.");
          }
          return;
        }

        if (currentQuestion < lessonQuestions.length - 1) {
          currentQuestion++;
          selectedAnswer = userAnswers[currentQuestion] ?? null;
          displayQuestion();
          updateProgress();
        } else {
          finishQuiz();
        }
      }

      async function finishQuiz() {
        const firstUnanswered = getFirstUnansweredQuestionIndex();
        if (firstUnanswered >= 0) {
          currentQuestion = firstUnanswered;
          selectedAnswer = userAnswers[currentQuestion] ?? null;
          displayQuestion();
          updateProgress();
          if (window.showToast) {
            window.showToast("Responda todas as questões antes de finalizar.");
          }
          return;
        }

        let rewardCoins = 0;
        let completionRegistered = false;
        let rewardAwarded = false;
        let resultSnapshot = null;
        try {
          const rewardResponse = await fetch("/api/profile/rewards/lesson", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              moduleId: selectedModule?.id,
              lessonIndex: currentLessonIndex,
            }),
          });
          const rewardData = await rewardResponse.json().catch(() => ({}));

          if (rewardResponse.ok) {
            completionRegistered = true;
            rewardAwarded = rewardData.awarded !== false;
            const resultTotal =
              Number(rewardData.totalQuestions) || lessonQuestions.length;
            score = Number(rewardData.correctCount) || 0;
            rewardCoins = Number(rewardData.reward) || 0;
            resultSnapshot = saveLessonResultSnapshot({
              moduleId: selectedModule?.id,
              lessonIndex: currentLessonIndex,
              score,
              total: resultTotal,
              percentage: rewardData.percentage,
              rewardCoins: rewardAwarded ? rewardCoins : 0,
              awarded: rewardAwarded,
            });
            updateCoinBalanceUI(rewardData.saldo);
            const completedActivities =
              Number(rewardData.completedActivities) || 0;

            if (rewardAwarded) {
              if (!localStorage.getItem("ach_first_lesson")) {
                localStorage.setItem("ach_first_lesson", "1");
                localStorage.setItem(
                  "pendingAchievement",
                  JSON.stringify({ title: "Primeira Lição" })
                );
              }
              window.queueToast?.("Atividade concluída!", { type: "success" });
              if (rewardCoins > 0) {
                window.queueToast?.(`+${rewardCoins} moedas recebidas.`, {
                  type: "coins",
                });
              }
              saveModuleProgress(
                selectedModule.id,
                completedActivities,
                selectedModule.displayLessons || selectedModule.totalLessons
              );
              const currentModuleIndex = moduleCatalog.findIndex(
                (mod) => mod.id === selectedModule?.id
              );
              const nextModule = moduleCatalog[currentModuleIndex + 1];
              const moduleFullyCompleted =
                completedActivities >=
                (selectedModule.displayLessons || selectedModule.totalLessons || 1);
              const unlockToastKey = nextModule
                ? `cw_unlock_toast_${userId || "anon"}_${nextModule.id}`
                : "";
              if (
                nextModule &&
                moduleFullyCompleted &&
                !localStorage.getItem(unlockToastKey)
              ) {
                localStorage.setItem(unlockToastKey, "1");
                window.queueToast?.(`Módulo desbloqueado: ${nextModule.title}`, {
                  type: "unlock",
                });
              }
              localStorage.setItem(
                lessonIndexKey(selectedModule.id),
                String(
                  Math.min(
                    completedActivities,
                    (selectedModule.displayLessons || 1) - 1
                  )
                )
              );
            } else if (window.showToast) {
              window.showToast(
                "Esta atividade já foi concluída. Nenhum progresso ou moeda adicional foi aplicado."
              );
            }
          } else if (rewardResponse.status === 409) {
            const failedScore = Number(rewardData.correctCount) || 0;
            const failedTotal =
              Number(rewardData.totalQuestions) || lessonQuestions.length;
            const failedSnapshot = saveLessonResultSnapshot({
              moduleId: selectedModule?.id,
              lessonIndex: currentLessonIndex,
              score: failedScore,
              total: failedTotal,
              percentage: rewardData.percentage,
              rewardCoins: 0,
              awarded: false,
            });
            transitionToPage(getLessonResultUrl(failedSnapshot));
            return;
          } else if (window.showToast) {
            window.showToast(
              rewardData.message || "Não foi possível registrar a recompensa."
            );
          }
        } catch (error) {
          if (window.showToast) {
            window.showToast("Não foi possível registrar a recompensa.");
          }
        }
        if (!completionRegistered) return;
        localStorage.setItem(
          "lastRewardCoins",
          String(resultSnapshot?.rewardCoins || 0)
        );
        if (rewardAwarded) {
          window.markPremiumAdAfterActivity?.();
        }
        transitionToPage(getLessonResultUrl(resultSnapshot));
      }

      backBtn.addEventListener("click", goBack);
      skipBtnLesson.addEventListener("click", skipQuestion);
      nextBtnLesson.addEventListener("click", goToNext);
      const exitBtn = document.getElementById("lessonExitBtn");
      if (exitBtn) {
        if (isReviewMode) {
          exitBtn.style.display = "none";
          exitBtn.setAttribute("aria-hidden", "true");
          exitBtn.addEventListener("click", returnToLessonResult);
        } else {
          exitBtn.addEventListener("click", () => {
            const leaveLesson = () => transitionToPage("home.html");
            if (window.showConfirmBox) {
              window.showConfirmBox({
                title: "Sair da lição?",
                message:
                  "As respostas já enviadas ficam salvas, mas você sairá da atividade atual.",
                cancelText: "Continuar lição",
                confirmText: "Sair da lição",
                message:
                  "Se sair antes de finalizar, o progresso atual pode ficar incompleto. As respostas já enviadas continuarão registradas e não poderão ser alteradas.",
                onConfirm: leaveLesson,
              });
              return;
            }

            if (
              window.confirm(
                "Sair da lição? As respostas já enviadas ficam salvas."
              )
            ) {
              leaveLesson();
            }
          });
        }
      }

      (async () => {
        const shouldRetry =
          pageParams.get("retry") === "1";
        if (shouldRetry && !isReviewMode) {
          window.showToast?.(
            "As respostas já registradas não podem ser alteradas.",
            { type: "warning" }
          );
          await loadSavedActivityAnswers();
          returnToLessonResult();
          return;
        }
        await loadSavedActivityAnswers();
        if (isReviewMode && getFirstUnansweredQuestionIndex() >= 0) {
          returnToLessonResult();
          return;
        }
        const state = await fetchLivesState();
        updateLivesUI(state.lives);
        if (
          !isReviewMode &&
          (state.lives ?? MAX_LIVES) <= 0 &&
          getFirstUnansweredQuestionIndex() >= 0
        ) {
          const wants = await promptRechargeFlow();
          if (!wants) {
            transitionToPage("home.html");
            return;
          }
        }
        displayQuestion();
        updateProgress();
      })();
    } else {
      console.warn("Elementos do questionário do módulo não encontrados.");
    }
  }

  // 13. RESULTADO DO MÓDULO (resultado_modulo.html)
  const lessonResultCard = document.querySelector(".result-card.lesson");
  if (lessonResultCard) {
    const params = new URLSearchParams(window.location.search);
    const moduleParam = params.get("module");
    const lessonParam = params.get("lesson");
    const lessonIndexParam =
      lessonParam !== null && lessonParam !== ""
        ? Number(lessonParam)
        : null;
    const urlScore = parseInt(params.get("score"), 10);
    const urlTotal = parseInt(params.get("total"), 10);
    const urlHasValidScore =
      Number.isFinite(urlScore) && Number.isFinite(urlTotal) && urlTotal > 0;
    const specificSnapshot =
      moduleParam && lessonIndexParam !== null
        ? readLessonResultSnapshot(moduleParam, lessonIndexParam)
        : null;
    const savedSnapshot =
      specificSnapshot || (!urlHasValidScore ? readLessonResultSnapshot() : null);
    const displayResult = savedSnapshot
      ? savedSnapshot
      : normalizeLessonResultSnapshot({
          moduleId: moduleParam || "default",
          lessonIndex: lessonIndexParam ?? 0,
          score: urlHasValidScore ? urlScore : 0,
          total: urlHasValidScore ? urlTotal : 0,
        });
    const hasValidScore = displayResult.total > 0;
    const percentage = displayResult.percentage;

    const scoreValue = document.getElementById("scoreValue");
    const motivationMessage = document.getElementById("motivationMessage");
    const rewardBtn = document.getElementById("rewardBtn");
    const reviewBtn = lessonResultCard.querySelector(
      '.actions .ghost[href*="qst_modulo"]'
    );

    const messages = {
      high: "Excelente! Voc\u00ea dominou este conte\u00fado e est\u00e1 pronto para avan\u00e7ar.",
      mid: "\u00d3timo progresso! Continue praticando e refine os pontos que faltam.",
      low: "Cada tentativa conta. Reveja os conceitos e tente novamente, voc\u00ea consegue!",
    };

    if (scoreValue) {
      scoreValue.textContent = `${percentage}%`;
    }
    if (reviewBtn) {
      const reviewParams = new URLSearchParams({
        review: "1",
        module: displayResult.moduleId,
        lesson: String(displayResult.lessonIndex),
      });
      reviewBtn.href = `qst_modulo.html?${reviewParams.toString()}`;
    }
    if (rewardBtn && hasValidScore) {
      rewardBtn.href = getLessonRewardUrl(displayResult);
    }

    if (hasValidScore) {
      if (percentage >= 85) {
        if (motivationMessage) motivationMessage.textContent = messages.high;
      } else if (percentage >= 70) {
        if (motivationMessage) motivationMessage.textContent = messages.mid;
      } else {
        if (motivationMessage) motivationMessage.textContent = messages.low;
        if (rewardBtn) {
          rewardBtn.style.display = "none";
          rewardBtn.setAttribute("aria-hidden", "true");
        }
      }
    } else {
      if (motivationMessage) motivationMessage.textContent = messages.low;
      if (rewardBtn) {
        rewardBtn.style.display = "none";
        rewardBtn.setAttribute("aria-hidden", "true");
      }
    }
  }

  // 13.1 Recompensa do módulo (recompensa_modulo.html)
  const rewardTitle = document.getElementById("rewardTitle");
  const rewardDescription = document.getElementById("rewardDescription");
  if (rewardTitle && rewardDescription) {
    const coins = parseInt(localStorage.getItem("lastRewardCoins"), 10) || 0;
    rewardTitle.textContent = coins > 0 ? `+${coins} moedas` : "Atividade concluída";
    rewardDescription.textContent =
      coins > 0
        ? "Você ganhou moedas por concluir a atividade e pelas respostas corretas."
        : "Esta atividade já havia recebido recompensa.";
  }

  // 14. Ações de senha em perfil.html
  if (rewardTitle && rewardDescription) {
    const params = new URLSearchParams(window.location.search);
    const moduleParam = params.get("module");
    const lessonParam = params.get("lesson");
    const snapshot =
      readLessonResultSnapshot(
        moduleParam,
        lessonParam !== null && lessonParam !== "" ? Number(lessonParam) : null
      ) || readLessonResultSnapshot();
    const coins =
      Number(snapshot?.rewardCoins) ||
      parseInt(localStorage.getItem("lastRewardCoins"), 10) ||
      0;
    const resultBackLink = document.querySelector(
      '.reward-page .actions .ghost[href*="resultado_modulo"]'
    );
    if (resultBackLink && snapshot) {
      resultBackLink.href = getLessonResultUrl(snapshot);
    }
    rewardTitle.textContent =
      coins > 0 ? `+${coins} moedas` : "Atividade conclu\u00edda";
    rewardDescription.textContent =
      coins > 0
        ? "Voc\u00ea ganhou moedas por concluir a atividade e pelas respostas corretas."
        : "Esta atividade j\u00e1 havia recebido recompensa.";
  }

  const editPasswordBtn = document.getElementById("edit-password-btn");
  const savePasswordBtn = document.getElementById("save-password-btn");
  if (editPasswordBtn && savePasswordBtn) {
    const currentPasswordInput = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    // Desabilita por padrão (já no HTML), botão Editar habilita
    editPasswordBtn.addEventListener("click", () => {
      if (currentPasswordInput) currentPasswordInput.disabled = false;
      if (newPasswordInput) newPasswordInput.disabled = false;
      if (confirmPasswordInput) confirmPasswordInput.disabled = false;
      if (currentPasswordInput) currentPasswordInput.focus();
    });

    // Pergunta de confirmação antes de enviar
    function confirmPasswordChange() {
      return new Promise((resolve) => {
        if (window.showConfirmBox) {
          window.showConfirmBox({
            title: "Alterar senha?",
            message:
              "Tem certeza de que deseja atualizar sua senha? Você precisará usá-la no próximo login.",
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false),
          });
        } else {
          const proceed = window.confirm(
            "Tem certeza de que deseja atualizar sua senha?"
          );
          resolve(proceed);
        }
      });
    }

    savePasswordBtn.addEventListener("click", async () => {
      const currentPassword = currentPasswordInput
        ? currentPasswordInput.value
        : "";
      const newPassword = newPasswordInput ? newPasswordInput.value : "";
      const confirmPassword = confirmPasswordInput
        ? confirmPasswordInput.value
        : "";
      const email = localStorage.getItem("userEmail");

      if (!email) {
        alert("Erro: email do usuário não encontrado. Faça login novamente.");
        return;
      }
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Preencha todos os campos de senha.");
        return;
      }
      if (newPassword.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      const confirmed = await confirmPasswordChange();
      if (!confirmed) return;

      const originalBtnText = savePasswordBtn.textContent;
      savePasswordBtn.disabled = true;
      savePasswordBtn.textContent = "Salvando...";

      try {
        const response = await fetch("/api/user/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, currentPassword, newPassword }),
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          alert(data.message || "Senha alterada com sucesso.");
          // Limpa e desabilita novamente
          if (currentPasswordInput) currentPasswordInput.value = "";
          if (newPasswordInput) newPasswordInput.value = "";
          if (confirmPasswordInput) confirmPasswordInput.value = "";
          if (currentPasswordInput) currentPasswordInput.disabled = true;
          if (newPasswordInput) newPasswordInput.disabled = true;
          if (confirmPasswordInput) confirmPasswordInput.disabled = true;
        } else {
          alert(data.message || "Não foi possível alterar a senha.");
        }
      } catch (error) {
        console.error("Erro ao alterar senha:", error);
        alert("Erro de conexão com o servidor. Tente novamente.");
      } finally {
        savePasswordBtn.disabled = false;
        savePasswordBtn.textContent = originalBtnText || "Salvar";
      }
    });
  }

  // 12. Pagina home.html (LÓGICA DO MODAL E CHAT ATUALIZADA)

  // --- LÓGICA DO MODAL (ABRIR/FECHAR) ---
  const chatFloatBtn = document.getElementById("chatFloatBtn");
  const chatModalOverlay = document.getElementById("chatModalOverlay");
  const chatCloseBtn = document.getElementById("chatCloseBtn");
  const chatInput = document.getElementById("chatInput"); // ID do novo modal

  if (chatFloatBtn && chatModalOverlay && chatCloseBtn && chatInput) {
    const activityPages = [
      "intro_modulo.html",
      "qst_modulo.html",
    ];
    const chatPage = window.location.pathname.split("/").pop();
    document.body.classList.toggle(
      "codebuddy-activity",
      activityPages.includes(chatPage)
    );

    const CHAT_SIZE_KEY = "codeBuddyPanelSize";
    const DEFAULT_CHAT_WIDTH = Math.round(
      Math.min(960, Math.max(480, window.innerWidth * 0.38))
    );
    const DEFAULT_CHAT_HEIGHT = Math.round(window.innerHeight * 0.88);

    function getStoredChatSize() {
      try {
        const stored = JSON.parse(localStorage.getItem(CHAT_SIZE_KEY) || "{}");
        return {
          width: Number(stored.width) || DEFAULT_CHAT_WIDTH,
          height: Number(stored.height) || DEFAULT_CHAT_HEIGHT,
        };
      } catch (error) {
        return {
          width: DEFAULT_CHAT_WIDTH,
          height: DEFAULT_CHAT_HEIGHT,
        };
      }
    }

    function applyStoredChatSize() {
      const stored = getStoredChatSize();
      const maxWidth = Math.min(960, Math.max(320, window.innerWidth - 32));
      const maxHeight = Math.max(320, window.innerHeight - 32);
      const minWidth = Math.min(420, maxWidth);
      const minHeight = Math.min(520, maxHeight);
      const width = Math.min(Math.max(stored.width, minWidth), maxWidth);
      const height = Math.min(Math.max(stored.height, minHeight), maxHeight);
      const modal = chatModalOverlay.querySelector(".chat-modal");

      if (modal) {
        modal.style.width = `${width}px`;
        modal.style.height = `${height}px`;
      }

      document.documentElement.style.setProperty("--chat-width", `${width}px`);
      document.documentElement.style.setProperty("--chat-height", `${height}px`);
      document.documentElement.style.setProperty(
        "--chat-input-height",
        `${Math.min(120, Math.max(48, Math.round(height * 0.1)))}px`
      );
    }

    // Abrir
    chatFloatBtn.addEventListener("click", () => {
      applyStoredChatSize();
      chatModalOverlay.classList.add("active");
      chatInput.focus();
      // Mantemos o scroll normal e interação com o quiz
      document.body.classList.add("chat-open");
    });

    // Função para fechar o modal
    function closeModal() {
      chatModalOverlay.classList.remove("active");
      document.body.style.overflow = "auto"; // Restaura scroll
      document.body.classList.remove("chat-open");
    }

    // Fechar pelo botão X
    chatCloseBtn.addEventListener("click", closeModal);

    // Fecha apenas pelo botão (overlay não fecha; ESC desabilitado)
  }

  // Checa conquista pendente ao abrir a home
  if (window.location.pathname.endsWith("home.html")) {
    const pending = localStorage.getItem("pendingAchievement");
    if (pending) {
      try {
        const data = JSON.parse(pending);
        if (data?.title && window.showAchievementModal) {
          window.showAchievementModal(data.title);
        } else if (data?.title && window.showToast) {
          window.showToast(`Conquista desbloqueada: ${data.title}`);
        }
      } catch (e) {
        // ignore parse errors
      }
      localStorage.removeItem("pendingAchievement");
    }

    // Configura o contexto do módulo selecionado
    const selectedModule = resolveSelectedModule();
    if (!selectedModule) {
      window.location.replace("modulos.html");
      return;
    }
    persistSelection(selectedModule);
    const progress = getModuleProgress(selectedModule.id);
    const availableLessons =
      (lessonsByModule[selectedModule.id] &&
        lessonsByModule[selectedModule.id].length) ||
      selectedModule.totalLessons ||
      progress.totalLessons ||
      1;
    const displayTotal =
      selectedModule.displayLessons || availableLessons;
    const completed = Math.min(progress.completedLessons || 0, availableLessons);
    const percent = Math.min(
      100,
      Math.round((completed / (displayTotal || 1)) * 100)
    );

    const headerTitle = document.querySelector(".header h1");
    if (headerTitle) headerTitle.textContent = selectedModule.title || "Lições";

    const trailTitle = document.querySelector(".knowledge-trail h2");
    if (trailTitle)
      trailTitle.textContent = selectedModule.badge
        ? `${selectedModule.badge} · Lições`
        : "Lições do módulo";

    const trailLabel = document.querySelector(".trail-progress span");
    if (trailLabel)
      trailLabel.textContent = `${completed}/${displayTotal} lições`;

    const progressBarFill = document.querySelector(".progress-bar-fill");
    if (progressBarFill) progressBarFill.style.width = `${percent}%`;

    const completedLessons = (lessonMeta[selectedModule.id] || [])
      .slice(0, completed)
      .map((lesson) => lesson.pill)
      .filter(Boolean);
    const nextContents = (lessonMeta[selectedModule.id] || [])
      .slice(completed)
      .map((lesson) => lesson.pill)
      .filter(Boolean);

    window.CodeBuddyContext?.updateContext?.({
      student: {
        currentModule: selectedModule.title || "",
        currentLesson: "",
        completedConcepts: completedLessons,
      },
      page: {
        type: "module",
        title: selectedModule.title || "Trilha de módulos",
        description: [
          selectedModule.description || "",
          `Progresso: ${completed}/${displayTotal} lições concluídas (${percent}%)`,
          completedLessons.length
            ? `Lições concluídas: ${completedLessons.join(", ")}`
            : "Nenhuma lição concluída",
          nextContents.length
            ? `Próximos conteúdos: ${nextContents.join(", ")}`
            : "Não há próximos conteúdos disponíveis",
        ]
          .filter(Boolean)
          .join("\n"),
        moduleId: selectedModule.id ?? null,
        lessonId: null,
        exerciseId: null,
      },
    });

    const exerciseTree = document.querySelector(".exercise-tree");
    if (exerciseTree) {
      exerciseTree.innerHTML = "";
      const playableLessons =
        selectedModule.playableLessons || availableLessons;
      const sequentiallyAvailable = Math.min(
        displayTotal,
        playableLessons + 1
      );

      for (let i = 0; i < displayTotal; i++) {
        const status =
          i < completed
            ? "completed"
            : i === completed && i < sequentiallyAvailable
            ? "current"
            : "locked";
        const isNextAvailable =
          i === completed + 1 && i < sequentiallyAvailable;

        const node = document.createElement("div");
        node.className = "trail-item";
        node.innerHTML = `
          <button class="exercise-node ${status}${
            isNextAvailable ? " next-available" : ""
          }" type="button" title="Lição ${i + 1}" data-lesson-index="${i}">
            ${
              status === "completed"
                ? '<i class="fas fa-check"></i>'
                : status === "current"
                ? '<i class="fas fa-pencil-alt"></i>'
            : '<i class="fas fa-lock"></i>'
          }
          </button>
        `;
        exerciseTree.appendChild(node);

        const btn = node.querySelector("button");
        if (status !== "locked" && btn) {
          btn.addEventListener("click", () => {
            if (i >= playableLessons) {
              if (window.showToast) {
                window.showToast("Esta atividade estará disponível em breve.");
              }
              return;
            }
            localStorage.setItem(lessonIndexKey(selectedModule.id), String(i));
            transitionToPage("intro_modulo.html");
          });
        }
      }
    }
  }

  // Loja/Perfil/Home: saldo e compras
  const balanceDisplay = document.querySelector(".balance-amount");
  const buyButtons = document.querySelectorAll(".buy-button");

  function updateCoinBalanceUI(balance) {
    if (balance === undefined || balance === null) return;
    if (balanceDisplay) balanceDisplay.textContent = balance;
    document
      .querySelectorAll(
        ".daily-missions .stat-item:nth-child(2) .stat-value, .stats .stat-item:nth-child(2) .stat-value"
      )
      .forEach((element) => {
        element.textContent = balance;
      });
  }

  async function fetchBalance() {
    if (!userId) return;
    try {
      const resp = await fetch(`/api/profile/${userId}`);
      if (resp.ok) {
        const data = await resp.json();
        updateCoinBalanceUI(data?.moedas ?? 0);
      }
    } catch (e) {
      // ignore
    }
  }

  fetchBalance();

  // Atualiza ofensiva/streak na home e módulos usando o backend do calendário
  const isHomeOrModulos =
    window.location.pathname.endsWith("home.html") ||
    window.location.pathname.endsWith("modulos.html");
  if (isHomeOrModulos) {
    const statStreak = document.querySelector(".daily-missions .stat-item:nth-child(1) .stat-value, .stats .stat-item:nth-child(1) .stat-value");
    const streakCountElement = statStreak;
    if (userId && streakCountElement) {
      (async () => {
        try {
          const response = await fetch(`/api/calendar/${userId}`);
          if (!response.ok) throw new Error();
          const data = await response.json();
          streakCountElement.textContent = data?.streak || 0;
        } catch (e) {
          streakCountElement.textContent = "0";
        }
      })();
    }
  }

  if (buyButtons.length) {
    buyButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const priceText = btn.dataset.price || btn.textContent.trim().split(" ")[0];
        const price = parseInt(priceText, 10);
        if (Number.isNaN(price)) return;
        const itemName = btn.dataset.name || "Item";
        const itemType = btn.dataset.type || "utilizavel";
        const itemDesc = btn.dataset.description || "";
        const decorationType = btn.dataset.decorationType || "";
        if (itemType === "decoracao" && btn.disabled) return;

        if (window.showConfirmBox) {
          window.showConfirmBox({
            title: "Confirmar compra",
            message: `Deseja comprar "${itemName}" por ${price} moedas?`,
            onConfirm: async () => {
              const response = await fetch("/api/profile/inventory/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  tipo: itemType,
                  nome: itemName,
                  descricao: itemDesc,
                  preco: price,
                  meta:
                    itemType === "decoracao"
                      ? { decorationType }
                      : null,
                }),
              });
              const purchase = await response.json().catch(() => ({}));
              if (response.ok) {
                updateCoinBalanceUI(purchase.saldo);
                if (itemName.toLowerCase().includes("recarga de vidas")) {
                  updateLivesUI(purchase.lives ?? MAX_LIVES);
                  if (window.showToast) window.showToast("Recarga de vidas aplicada!");
                } else if (window.showToast) window.showToast("Decoração comprada!");
                if (itemType === "decoracao") {
                  btn.disabled = true;
                  btn.textContent = "Adquirido";
                }
              } else if (window.showToast) {
                window.showToast(purchase.message || "Compra não realizada.");
              }
            },
          });
        } else {
          const response = await fetch("/api/profile/inventory/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              tipo: itemType,
              nome: itemName,
              descricao: itemDesc,
              preco: price,
              meta:
                itemType === "decoracao" ? { decorationType } : null,
            }),
          });
          const purchase = await response.json().catch(() => ({}));
          if (response.ok) {
            updateCoinBalanceUI(purchase.saldo);
            if (itemName.toLowerCase().includes("recarga de vidas")) {
              updateLivesUI(purchase.lives ?? MAX_LIVES);
              if (window.showToast) window.showToast("Recarga de vidas aplicada!");
            } else if (window.showToast) window.showToast("Decoração comprada!");
            if (itemType === "decoracao") {
              btn.disabled = true;
              btn.textContent = "Adquirido";
            }
          } else if (window.showToast) {
            window.showToast(purchase.message || "Compra não realizada.");
          }
        }
      });
    });

    if (userId) {
      fetch(`/api/profile/inventory/${userId}`)
        .then((response) => response.json())
        .then((items) => {
          const ownedDecorations = new Set(
            items
              .filter((item) => item.tipo === "decoracao")
              .map((item) => item.nome)
          );

          buyButtons.forEach((button) => {
            if (
              button.dataset.type === "decoracao" &&
              ownedDecorations.has(button.dataset.name)
            ) {
              button.disabled = true;
              button.textContent = "Adquirido";
            }
          });
        })
        .catch(() => {});
    }
  }

  // Inventário: renderiza decorações da foto e itens utilizáveis
  const decorationItemsContainer = document.getElementById("decorationItems");
  const usableItemsContainer = document.getElementById("usableItems");
  const inventoryPreview = document.getElementById("inventoryPreview");
  if ((decorationItemsContainer || usableItemsContainer) && userId) {
    (async function () {
      try {
        const resp = await fetch(`/api/profile/inventory/${userId}`);
        const items = (await resp.json()) || [];
        const decorations = items.filter((i) => i.tipo === "decoracao");
        const usables = items.filter((i) => i.tipo !== "decoracao");
        const profileResponse = await fetch(`/api/profile/${userId}`);
        const profile = profileResponse.ok ? await profileResponse.json() : {};

        const renderList = (container, list) => {
          if (!container) return;
          container.innerHTML = "";
          if (!list.length) {
            container.innerHTML = "<p class='text-muted'>Nenhum item.</p>";
            return;
          }
          list.forEach((item) => {
            const card = document.createElement("div");
            card.className = "ach-card unlocked";
          card.innerHTML = `
              <div class="badge">${item.tipo === "decoracao" ? "✨" : "🛠"}</div>
              <div>
                <strong>${item.nome}</strong>
                <p>${item.descricao || ""}</p>
              </div>
              ${
                item.tipo === "decoracao"
                  ? `<button class="equip-decoration-btn" data-item-id="${item.id}" ${
                      Number(profile.decoracao_foto_id) === Number(item.id)
                        ? "disabled"
                        : ""
                    }>${
                      Number(profile.decoracao_foto_id) === Number(item.id)
                        ? "Equipado"
                        : "Equipar"
                    }</button>`
                  : '<button class="use-item-btn" data-item-id="' +
                    item.id +
                    '">Usar</button>'
              }
            `;
            container.appendChild(card);

            if (item.tipo === "decoracao") {
              const equipButton = card.querySelector(".equip-decoration-btn");
              equipButton?.addEventListener("click", async () => {
                const response = await fetch("/api/profile/decoration", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId, itemId: item.id }),
                });
                const data = await response.json().catch(() => ({}));

                if (!response.ok && response.status !== 501) {
                  if (window.showToast) {
                    window.showToast(data.message || "Não foi possível equipar.");
                  }
                  return;
                }

                let meta = item.meta || {};
                if (typeof meta === "string") {
                  try {
                    meta = JSON.parse(meta);
                  } catch (_) {
                    meta = {};
                  }
                }
                localStorage.setItem(
                  `cw_profile_decoration_${userId}`,
                  JSON.stringify({
                    id: item.id,
                    decorationType: meta.decorationType || "",
                  })
                );

                document
                  .querySelectorAll(".equip-decoration-btn")
                  .forEach((button) => {
                    button.disabled = false;
                    button.textContent = "Equipar";
                  });
                equipButton.disabled = true;
                equipButton.textContent = "Equipado";
                if (window.showToast) {
                  window.showToast(
                    response.ok
                      ? "Decoração equipada."
                      : "Decoração aplicada neste navegador."
                  );
                }
              });
            } else {
              const btn = card.querySelector(".use-item-btn");
              btn?.addEventListener("click", () => {
                if ((item.nome || "").toLowerCase().includes("recarga de vidas")) {
                  (async () => {
                    const state = await fetchLivesState();
                    if ((state.lives ?? MAX_LIVES) >= MAX_LIVES) {
                      if (window.showToast) window.showToast("Suas vidas já estão cheias.");
                      return;
                    }
                    const itemId = btn.getAttribute("data-item-id");
                    if (itemId && userId) {
                      const response = await fetch(
                        "/api/profile/inventory/use-life-refill",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId, itemId }),
                        }
                      );
                      const data = await response.json().catch(() => ({}));
                      if (!response.ok) {
                        if (window.showToast) {
                          window.showToast(
                            data.message || "Não foi possível usar a recarga."
                          );
                        }
                        return;
                      }
                      updateLivesUI(data.lives);
                      if (window.showToast) {
                        window.showToast("Vidas recarregadas!");
                      }
                      if ((data.remaining ?? 0) <= 0) card.remove();
                    }
                  })();
                } else {
                  const itemId = btn.getAttribute("data-item-id");
                  if (itemId && userId) {
                    fetch("/api/profile/inventory/consume", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId, itemId }),
                    }).catch(() => {});
                  }
                  if (window.showToast) window.showToast("Item utilizado!");
                  card.remove();
                }
              });
            }
          });
        };

        renderList(decorationItemsContainer, decorations);
        renderList(usableItemsContainer, usables);
      } catch (e) {
        if (decorationItemsContainer) decorationItemsContainer.innerHTML = "<p>Erro ao carregar.</p>";
        if (usableItemsContainer) usableItemsContainer.innerHTML = "<p>Erro ao carregar.</p>";
      }
    })();
  }
  if (inventoryPreview && userId) {
    (async function () {
      try {
        const resp = await fetch(`/api/profile/inventory/${userId}`);
        const items = (await resp.json()) || [];
        inventoryPreview.innerHTML = "";
        if (!items.length) {
          inventoryPreview.innerHTML = "<p class='text-muted'>Nenhum item.</p>";
          return;
        }
        items.forEach((item) => {
          const card = document.createElement("div");
          card.className = "ach-card unlocked";
          card.innerHTML = `
            <div class="badge">${item.tipo === "decoracao" ? "✨" : "🛠"}</div>
            <div>
              <strong>${item.nome}</strong>
              <p>${item.descricao || ""}</p>
            </div>
          `;
          inventoryPreview.appendChild(card);
        });
      } catch (e) {
        inventoryPreview.innerHTML = "<p>Erro ao carregar.</p>";
      }
    })();
  }

  // --- LÓGICA DE ENVIO DE MENSAGEM (MERGE DA SUA API + NOVO MODAL) ---
  const chatSendBtn = document.getElementById("chatSendBtn"); // ID do novo modal
  const chatMessages = document.getElementById("chatMessages"); // ID do novo modal
  const chatModal = document.querySelector(".chat-modal");
  const chatResizeHandle = document.getElementById("chatResizeHandle");
  // O chatInput já foi selecionado ali em cima

  if (chatSendBtn && chatInput && chatMessages) {
    // Esta função 'sendMessage' AGORA usa sua API real
    async function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // Adiciona mensagem do usuário
      addMessage("user", message);
      chatInput.value = "";

      // Adiciona o indicador de "digitando"
      const typingMsg = addTypingIndicator();

      try {
        // **AQUI ESTÁ A SUA LÓGICA DE API REAL**
        const codeBuddyContext =
          window.CodeBuddyContext?.getContext?.() || {};

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: message,
            question: message,
            context: codeBuddyContext,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao contatar o assistente.");
        }

        const data = await response.json();
        const geminiReply = data.response;

        // Remove o indicador de "digitando"
        typingMsg.remove();

        if (geminiReply) {
          // Adiciona a resposta real do Gemini
          addMessage("assistant", geminiReply);
        } else {
          addMessage("assistant", "Recebi uma resposta vazia.");
        }
      } catch (error) {
        console.error("Erro no chat:", error);
        // Remove o indicador de "digitando" mesmo se der erro
        if (typingMsg) {
          typingMsg.remove();
        }
        addMessage(
          "assistant",
          "Desculpe, estou com problemas para conectar. Tente novamente."
        );
      }
    }

    // Função para adicionar mensagem (do novo modal)
    function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`; // 'user' ou 'assistant'
      
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // SE FOR O ROBÔ (assistant), CONVERTE O MARKDOWN EM HTML SE MARKED EXISTIR
    if (type === 'assistant' && typeof marked !== 'undefined') {
        messageContent.innerHTML = marked.parse(content); 
    } else if (type === 'assistant') {
        messageContent.textContent = content;
    } else {
        // Se for o usuário, mantém texto puro por segurança
        messageContent.textContent = content; 
    }
      
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
      
    // Scroll automático para o final
    chatMessages.scrollTop = chatMessages.scrollHeight;
      
    return messageDiv;
}

    // Função de indicador de digitação (do novo modal)
    function addTypingIndicator() {
      const messageDiv = document.createElement("div");
      messageDiv.className = "message assistant";

      const typingDiv = document.createElement("div");
      typingDiv.className = "message-content typing-indicator";
      typingDiv.innerHTML = "<span></span><span></span><span></span>";

      messageDiv.appendChild(typingDiv);
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      return messageDiv;
    }

  // Eventos de envio (Botão e Enter)
  chatSendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Evita que o 'Enter' pule linha no input
      sendMessage();
    }
  });

  // Redimensionamento do chat pela alça no canto inferior direito
  if (chatModal && chatResizeHandle) {
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    const MIN_WIDTH = 420;
    const MIN_HEIGHT = 520;
    const MAX_WIDTH = 960;
    const CHAT_SIZE_KEY = "codeBuddyPanelSize";

    const applyChatSize = (width, height, persist = false) => {
      const maxWidth = Math.min(MAX_WIDTH, Math.max(320, window.innerWidth - 32));
      const maxHeight = Math.max(320, window.innerHeight - 32);
      const minWidth = Math.min(MIN_WIDTH, maxWidth);
      const minHeight = Math.min(MIN_HEIGHT, maxHeight);
      const safeWidth = Math.min(Math.max(width, minWidth), maxWidth);
      const safeHeight = Math.min(Math.max(height, minHeight), maxHeight);

      chatModal.style.width = `${safeWidth}px`;
      chatModal.style.height = `${safeHeight}px`;
      document.documentElement.style.setProperty(
        "--chat-width",
        `${safeWidth}px`
      );
      document.documentElement.style.setProperty(
        "--chat-height",
        `${safeHeight}px`
      );
      document.documentElement.style.setProperty(
        "--chat-input-height",
        `${Math.min(120, Math.max(48, Math.round(safeHeight * 0.1)))}px`
      );

      if (persist) {
        localStorage.setItem(
          CHAT_SIZE_KEY,
          JSON.stringify({ width: safeWidth, height: safeHeight })
        );
      }
    };

    chatResizeHandle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = chatModal.getBoundingClientRect().width;
      startHeight = chatModal.getBoundingClientRect().height;
      chatResizeHandle.setPointerCapture(e.pointerId);
      chatModal.classList.add("is-resizing");
      document.body.style.userSelect = "none";
    });

    chatResizeHandle.addEventListener("pointermove", (e) => {
      if (!isResizing) return;
      const width = startWidth + (startX - e.clientX);
      const height = startHeight + (e.clientY - startY);
      applyChatSize(width, height);
    });

    const stopResizing = () => {
      if (!isResizing) return;
      isResizing = false;
      chatModal.classList.remove("is-resizing");
      document.body.style.userSelect = "";
      const rect = chatModal.getBoundingClientRect();
      applyChatSize(rect.width, rect.height, true);
    };

    chatResizeHandle.addEventListener("pointerup", stopResizing);
    chatResizeHandle.addEventListener("pointercancel", stopResizing);

    window.addEventListener("resize", () => {
      const rect = chatModal.getBoundingClientRect();
      applyChatSize(rect.width, rect.height, true);
    });
  }
  }
// 14. PÁGINA CALENDÁRIO (calendario.html)
  const monthYearElement = document.getElementById('monthYear');
  const calendarDaysElement = document.getElementById('calendarDays');
  const streakCountElement = document.getElementById('streakCount');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  // Verifica se os elementos existem na página antes de rodar
  if (monthYearElement && calendarDaysElement && streakCountElement && prevBtn && nextBtn) {
    const userId = localStorage.getItem('userId');
    if (!userId) return; // Se não tiver logado, não carrega

    let currentDate = new Date();
    let loginDates = [];

    // Busca os dados de login do backend
    try {
      // Nota: O código original usava um fetch logo de cara. 
      // Recomendo envolver isso numa função async autoinvocada ou chamada direta.
      (async () => {
          const response = await fetch(`/api/calendar/${userId}`);
          if (response.ok) {
            const data = await response.json();
            loginDates = Array.isArray(data.dates) ? data.dates : [];
            streakCountElement.textContent = data.streak || 0;
          }
          renderCalendar(); // Renderiza só depois de tentar buscar os dados
      })();
    } catch (error) {
      console.error('Erro ao carregar calendário:', error);
      renderCalendar(); // Renderiza mesmo se der erro (sem os destaques)
    }

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      monthYearElement.textContent = `${monthNames[month]} ${year}`;
      calendarDaysElement.innerHTML = '';

      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();

      // Cria espaços vazios antes do dia 1
      for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        calendarDaysElement.appendChild(emptyDiv);
      }

      // Cria os dias do mês
      for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;

        // Verifica log de login para marcar o dia (formato YYYY-MM-DD)
        const checkDate = new Date(year, month, i);
        const yyyy = checkDate.getFullYear();
        const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
        const dd = String(checkDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        if (loginDates.includes(formattedDate)) {
          dayDiv.classList.add('active-day'); // Classe CSS que deixa verde
        }

        // Marca o dia atual (hoje)
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          dayDiv.classList.add('today');
        }

        calendarDaysElement.appendChild(dayDiv);
      }
    }

    // Botões de navegação
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }
  // 15 página de estatisticas.html
  (function renderStatisticsIfPresent() {
    const totalEl = document.getElementById('totalQuestions');
    const correctEl = document.getElementById('totalCorrect');
    const wrongEl = document.getElementById('totalIncorrect');
    const perfCanvas = document.getElementById('performanceChart');
    const accEl = document.getElementById('accuracyPercent');
    const circle = document.getElementById('progressCircle');

    if (!totalEl || !correctEl || !wrongEl || !perfCanvas || !accEl || !circle) return;

    (async () => {
      try {
        let summary = { totalAnswered: 0, totalCorrect: 0, totalWrong: 0 };
        if (userId) {
          const resp = await fetch(`/api/progress/summary/${userId}`);
          if (resp.ok) summary = await resp.json();
        }

        const total = Number(summary.totalAnswered) || 0;
        const correct = Number(summary.totalCorrect) || 0;
        const wrong = Number(summary.totalWrong) || Math.max(0, total - correct);

        totalEl.textContent = total;
        correctEl.textContent = correct;
        wrongEl.textContent = wrong;

        if (perfCanvas && perfCanvas.getContext) {
          const ctx = perfCanvas.getContext('2d');
          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Acertos', 'Erros'],
              datasets: [{
                data: [correct, wrong],
                backgroundColor: ['#4ade80', '#f87171'],
                borderColor: ['rgba(74,222,128,0.2)', 'rgba(248,113,113,0.2)'],
                borderWidth: 2,
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#b8b0d0', font: { size: 14 } }
                }
              },
              cutout: '70%'
            }
          });
        }

        // Progress circle (SVG)
        if (circle) {
          const radius = Number(circle.getAttribute('r')) || (circle.r && circle.r.baseVal && circle.r.baseVal.value) || 0;
          const circumference = radius * 2 * Math.PI;
          circle.style.strokeDasharray = `${circumference} ${circumference}`;
          circle.style.strokeDashoffset = circumference;
          const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
          accEl.textContent = `${accuracy}%`;
          const offset = circumference - (accuracy / 100) * circumference;
          setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
        }

        const motivation = document.getElementById('motivationText');
        if (motivation) {
          const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
          if (total === 0) {
            motivation.textContent = 'Comece a responder perguntas para ver suas estatísticas.';
          } else if (accuracy >= 80) {
            motivation.textContent = 'Excelente! Você é um mestre.';
          } else if (accuracy >= 50) {
            motivation.textContent = 'Muito bom! Continue assim.';
          } else {
            motivation.textContent = 'Não desista! A prática leva à perfeição.';
          }
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      }
    })();
  })();

  // ==================================================================
  // 1. ESTADO GLOBAL E UTILITÁRIOS
  // ==================================================================


  // ==================================================================
  // 2. LÓGICA DE PERFIL E ESTATÍSTICAS
  // ==================================================================
  
  // Carrega estatísticas do LocalStorage
  async function loadProfileStats() {
    const statTotalEl = document.getElementById("statTotal");
    const statAccuracyEl = document.getElementById("statAccuracy");
    const statLessonsEl = document.getElementById("statLessons");
    if (!statTotalEl || !statAccuracyEl || !statLessonsEl) return;

    let total = 0;
    let correct = 0;
    if (userId) {
      try {
        const resp = await fetch(`/api/progress/summary/${userId}`);
        if (resp.ok) {
          const summary = await resp.json();
          total = Number(summary.totalAnswered) || 0;
          correct = Number(summary.totalCorrect) || 0;
        }
      } catch (e) {}
    }
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    // Lições concluídas: soma completions por módulo clamped ao máximo disponível
    let lessons = 0;
    moduleCatalog.forEach((mod) => {
      const prog = getModuleProgress(mod.id);
      const avail =
        (lessonsByModule[mod.id] && lessonsByModule[mod.id].length) ||
        mod.totalLessons ||
        prog.totalLessons ||
        0;
      lessons += Math.min(prog.completedLessons || 0, avail);
    });

    statTotalEl.textContent = total;
    statAccuracyEl.textContent = `${accuracy}%`;
    statLessonsEl.textContent = lessons;
  }
  loadProfileStats();

  // Função para carregar dados do usuário (API)
  async function loadProfile() {
    const userNameEl = document.getElementById("userName");
    const userHandleEl = document.getElementById("userHandle");
    const userEmailEl = document.getElementById("userEmail");
    const profilePhotoImg = document.getElementById("profilePhoto");
    const profilePhotoWrapper = profilePhotoImg?.closest(
      ".profile-photo-wrapper"
    );

    const applyProfileDecoration = (decoration) => {
      if (!profilePhotoWrapper) return;
      profilePhotoWrapper.dataset.decoration =
        decoration?.decorationType || "";
    };

    try {
      const savedDecoration = JSON.parse(
        localStorage.getItem(`cw_profile_decoration_${userId}`) || "{}"
      );
      applyProfileDecoration(savedDecoration);
    } catch (_) {
      applyProfileDecoration(null);
    }

    try {
      if (userId) {
        const resp = await fetch(`/api/profile/${userId}`);
        if (resp.ok) {
          const data = await resp.json();
          
          if (data?.username && userNameEl && userHandleEl) {
            userNameEl.textContent = data.username;
            userHandleEl.textContent = `@${data.username}`;
            try { 
              localStorage.setItem("username", data.username); 
              localStorage.setItem("userName", data.username); 
            } catch (_) {}
          }
          
          if (data?.foto_perfil && profilePhotoImg) {
            profilePhotoImg.src = data.foto_perfil;
          }

          if (data?.decoracao_foto_id) {
            const inventoryResponse = await fetch(
              `/api/profile/inventory/${userId}`
            );
            if (inventoryResponse.ok) {
              const items = await inventoryResponse.json();
              const equippedDecoration = items.find(
                (item) =>
                  item.tipo === "decoracao" &&
                  Number(item.id) === Number(data.decoracao_foto_id)
              );
              if (equippedDecoration) {
                let meta = equippedDecoration.meta || {};
                if (typeof meta === "string") {
                  try {
                    meta = JSON.parse(meta);
                  } catch (_) {
                    meta = {};
                  }
                }
                const decoration = {
                  id: equippedDecoration.id,
                  decorationType: meta.decorationType || "",
                };
                localStorage.setItem(
                  `cw_profile_decoration_${userId}`,
                  JSON.stringify(decoration)
                );
                applyProfileDecoration(decoration);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Falha ao carregar perfil remoto, usando cache.", e);
    }

    // Fallbacks visuais caso a API falhe ou dados não existam
    if (userNameEl && !userNameEl.textContent) {
      userNameEl.textContent = fallbackUserName || "Usuário";
    }
    if (userHandleEl && !userHandleEl.textContent) {
      userHandleEl.textContent = (fallbackUserName && fallbackUserName.trim())
        ? `@${fallbackUserName.replace(/\s+/g, "").toLowerCase()}`
        : "@codewise_user";
    }
    if (userEmailEl) {
      userEmailEl.textContent = userEmail || "email@codewise.dev";
    }
  }

  // Executa carregamento do perfil
  loadProfile();

  // ==================================================================
  // 3. SISTEMA DE CONQUISTAS
  // ==================================================================
  const achievementsPreview = document.getElementById("achievementsPreview");
  
  if (achievementsPreview) {
    const toast = document.getElementById("achievementToast");
    const toastTitle = document.getElementById("toastTitle");
    
    const achievements = [
      {
        id: "achv_login",
        title: "Novo Aprendiz",
        desc: "Criou conta e acessou o CodeWise.",
        unlocked: !!userId,
      },
      {
        id: "achv_first_lesson",
        title: "Primeira Lição",
        desc: "Concluiu a primeira lição no CodeWise.",
        unlocked: !!localStorage.getItem("lessonComplete") || !!localStorage.getItem("lastLessonScore"),
      },
    ];

    const previousState = JSON.parse(localStorage.getItem("achievements_state") || "{}");

    function showToast(title) {
      if (!toast || !toastTitle) return;
      toastTitle.textContent = title;
      toast.classList.add("visible");
      setTimeout(() => toast.classList.remove("visible"), 3200);
    }

    function renderAchievements() {
      achievementsPreview.innerHTML = "";
      achievements.forEach((ach) => {
        const card = document.createElement("div");
        card.className = `ach-card ${ach.unlocked ? "unlocked" : "locked"}`;
        card.innerHTML = `
          <div class="badge">${ach.unlocked ? "✓" : "…"}</div>
          <div>
            <strong>${ach.title}</strong>
            <p>${ach.desc}</p>
          </div>
        `;
        achievementsPreview.appendChild(card);

        if (ach.unlocked && !previousState[ach.id]) {
          showToast(ach.title);
          previousState[ach.id] = true;
        }
      });
      localStorage.setItem("achievements_state", JSON.stringify(previousState));
    }

    renderAchievements();
  }

  // ==================================================================
  // 4. GERENCIAMENTO DA FOTO DE PERFIL (UPLOAD)
  // ==================================================================
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const profilePhotoInput = document.getElementById("profilePhotoInput");
  const profilePhotoImg = document.getElementById("profilePhoto");

  if (changePhotoBtn && profilePhotoInput) {
    changePhotoBtn.addEventListener("click", () => {
      profilePhotoInput.click();
    });
  }

  if (profilePhotoInput && profilePhotoImg) {
    const savedProfilePhoto = userId
      ? localStorage.getItem(`cw_profile_photo_${userId}`)
      : null;
    if (savedProfilePhoto) profilePhotoImg.src = savedProfilePhoto;

    profilePhotoInput.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        profilePhotoImg.src = dataUrl;

        if (userId) localStorage.setItem(`cw_profile_photo_${userId}`, dataUrl);

        if (userId) {
          try {
            const response = await fetch("/api/profile/photo", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, foto_perfil: dataUrl }),
            });
            if (response.ok && window.showToast) {
              window.showToast("Foto de perfil atualizada.");
            } else if (response.status === 501 && window.showToast) {
              window.showToast("Foto salva neste navegador.");
            }
          } catch (err) {
            console.error(err);
            if (window.showToast) window.showToast("Foto salva neste navegador.");
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // ==================================================================
  // 5. CONFIGURAÇÕES DA CONTA (EDITAR / EXCLUIR)
  // ==================================================================
// ==================================================================
  // 5. CONFIGURAÇÕES DA CONTA (EDITAR / EXCLUIR)
  // ==================================================================
  const saveAccountBtn = document.getElementById("save-account-btn");
  const editAccountBtn = document.getElementById("edit-account-btn");
  const deleteAccountBtn = document.querySelector(".delete-button");

  // Só executa a lógica de bloquear inputs SE estivermos na página de conta
  if (saveAccountBtn || editAccountBtn) {
      const usernameInput = document.getElementById("username");
      const emailInput = document.getElementById("email");

      // Preenchimento inicial dos inputs de configuração
      if (emailInput && userEmail) {
        emailInput.value = userEmail;
      }
      if (usernameInput) usernameInput.disabled = true;
      if (emailInput) emailInput.disabled = true;

      // Botão Editar
      if (editAccountBtn) {
        editAccountBtn.addEventListener("click", () => {
          if (usernameInput) usernameInput.disabled = false;
          if (emailInput) emailInput.disabled = false;
          if (usernameInput) usernameInput.focus();
        });
      }

      // Botão Salvar
      if (saveAccountBtn) {
         saveAccountBtn.addEventListener("click", async () => {
             if (!userId) {
               alert("Erro: usuário não encontrado. Faça login novamente.");
               return;
             }
             const username = usernameInput ? usernameInput.value.trim() : "";
             const email = emailInput ? emailInput.value.trim() : "";
            if (!username && !email) {
              alert("Informe nome ou e-mail para salvar.");
              return;
            }

            const originalText = saveAccountBtn.textContent;
            saveAccountBtn.disabled = true;
            saveAccountBtn.textContent = "Salvando...";
            try {
               const resp = await fetch(`/api/user/user`, {
                 method: "PUT",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ id: userId, username, email }),
               });
               const data = await resp.json().catch(() => ({}));
               if (resp.ok) {
                 if (window.showToast) window.showToast(data.message || "Dados salvos.");
                 if (usernameInput) usernameInput.disabled = true;
                 if (emailInput) emailInput.disabled = true;
                 if (email) localStorage.setItem("userEmail", email);
                 if (username) {
                   localStorage.setItem("userName", username);
                   localStorage.setItem("username", username);
                    // Atualiza visualmente em páginas já carregadas (perfil)
                    const nameEl = document.getElementById("userName");
                    const handleEl = document.getElementById("userHandle");
                    if (nameEl) nameEl.textContent = username;
                    if (handleEl) handleEl.textContent = `@${username}`;
                 }
               } else {
                 alert(data.message || "Não foi possível salvar.");
               }
             } catch (e) {
               alert("Erro ao salvar. Tente novamente.");
             } finally {
               saveAccountBtn.disabled = false;
               saveAccountBtn.textContent = originalText;
             }
         });
      }
  }

  // Botão Excluir Conta
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", async () => {
      if (!userId) {
        alert("Erro: ID do usuário não encontrado. Faça login novamente.");
        return;
      }
      
      const confirmed = await new Promise((resolve) => {
        if (window.showConfirmBox) {
          window.showConfirmBox({
            title: "Excluir conta",
            message: "Tem certeza que deseja excluir sua conta? Esta ação é irreversível.",
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false),
          });
        } else {
          const res = window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.");
          resolve(res);
        }
      });
      if (!confirmed) return;

      try {
        const response = await fetch(`/api/user/${userId}`, {
          method: "DELETE",
        });
        
        const data = await response.json().catch(() => ({}));
        
        if (response.ok) {
          alert(data.message || "Conta excluída com sucesso.");
          if (window.logout) {
            window.logout(false);
          } else {
            // Fallback caso a função global logout não exista
            localStorage.clear();
            window.location.href = "login.html";
          }
        } else {
          alert(data.message || "Não foi possível excluir a conta.");
        }
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Erro de conexão com o servidor. Tente novamente.");
      }
    });
  } 

  // ==================================================================
  // 7. LÓGICA DO TEMA (CLARO/ESCURO)
  // ==================================================================
  const themeToggles = document.querySelectorAll(
    'input[type="checkbox"][data-setting="theme-light"]'
  );
  const themeToggleTexts = document.querySelectorAll('[data-theme-toggle-text]');
  const rootElement = document.documentElement;
  const THEME_KEY = 'cw_theme';

  function updateThemeToggleText(isLight) {
    themeToggleTexts.forEach((el) => {
      el.textContent = isLight ? "Mudar para modo escuro" : "Mudar para modo claro";
    });
  }

  function applyTheme(isLight) {
    if (isLight) {
      rootElement.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      rootElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    themeToggles.forEach((toggle) => {
      toggle.checked = isLight;
    });
    updateThemeToggleText(isLight);
  }

  // Sincroniza o estado inicial dos toggles com o atributo já definido no loader
  const currentThemeIsLight = rootElement.getAttribute('data-theme') === 'light';
  updateThemeToggleText(currentThemeIsLight);
  themeToggles.forEach((toggle) => {
    toggle.checked = currentThemeIsLight;
    toggle.addEventListener('change', (event) => {
      applyTheme(event.target.checked);
    });
  });
});


// Logica do botao entrar com google (login.html)
// 1. Função que o Google dispara automaticamente quando o usuário faz login
function handleGoogleResponse(response) {
    // Aqui está o token gigante que o Google nos devolve
    const tokenDoGoogle = response.credential;
    console.log("Sucesso! Token recebido:", tokenDoGoogle);

    // 2. Vamos enviar este token para o nosso backend Node.js validar
    fetch('http://localhost:3001/api/auth/google', { // Coloque a URL certa do seu backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: tokenDoGoogle })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Se o backend validou e criou a sessão, salvamos o token do CodeWise
            localStorage.setItem('codewise_token', data.token);
            // Redireciona para a página interna
            window.location.href = '/intro_nivelamento.html'; 
        } else {
            alert('Falha na autenticação.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição para o backend:', error);
    });
}

// 3. Inicializar o botão assim que a página carregar
window.onload = function () {
    google.accounts.id.initialize({
        // Substitua pela chave que você acabou de gerar no Google Cloud Console
        client_id: "302930330479-adsf9nav3ink0genmpc3aj2vuv33cit2.apps.googleusercontent.com",
        callback: handleGoogleResponse
    });

    // Pinta o botão oficial do Google dentro da nossa div vazia
    google.accounts.id.renderButton(
        document.getElementById("googleButtonDiv"),
        { theme: "outline", size: "large", text: "continue_with" } // Estilos do botão
    );

    // (Opcional) Mostra aquele pop-up automático no canto direito superior
    google.accounts.id.prompt(); 
};
