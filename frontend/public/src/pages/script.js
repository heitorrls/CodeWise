/*
 * ARQUIVO MODIFICADO - LÓGICA DO FIREBASE REMOVIDA
 */

// 1. Importações e inicialização do Firebase REMOVIDAS.
// Não há mais 'app', 'auth' ou 'db'.

// Toast global (substitui alert por card)
(function setupGlobalToast() {
  const style = document.createElement("style");
  style.textContent = `
    .cw-toast {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -30px);
      background: var(--card, #222743);
      color: var(--text, #fff);
      border: 1px solid var(--border, rgba(255,255,255,0.08));
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 18px 40px rgba(0,0,0,0.3);
      z-index: 9999;
      min-width: 260px;
      max-width: 460px;
      opacity: 0;
      transition: opacity .2s ease, transform .2s ease;
      display: flex;
      gap: 10px;
      align-items: center;
      text-align: left;
    }
    .cw-toast.show { opacity: 1; transform: translate(-50%, 0); }
    .cw-toast .dot { width: 10px; height: 10px; border-radius: 50%; background: #8b7cc8; box-shadow: 0 0 8px rgba(139,124,200,0.6); }
    .cw-toast .msg { flex: 1; font-weight: 600; }
  `;
  document.head.appendChild(style);

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "cw-toast";
    toast.innerHTML = `<span class="dot"></span><span class="msg">${message}</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }

window.alert = function (msg) {
    showToast(msg);
  };
  window.showToast = showToast;
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
      background: var(--card, #222743);
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
      background: var(--card, #222743);
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

  window.showConfirmBox = function ({ title, message, onConfirm, onCancel }) {
    const overlay = document.createElement("div");
    overlay.className = "cw-confirm-overlay";
    overlay.innerHTML = `
      <div class="cw-confirm-card">
        <h3>${title || "Confirmação"}</h3>
        <p>${message || ""}</p>
        <div class="cw-confirm-actions">
          <button class="close-btn">Cancelar</button>
          <button class="primary confirm-btn">Confirmar</button>
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
    overlay.querySelector(".confirm-btn").addEventListener("click", () => {
      close();
      if (onConfirm) onConfirm();
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        close();
        if (onCancel) onCancel();
      }
    });
  };
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
    "intro_criacao-avatar.html",
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
  if (showConfirm && !confirm("Deseja realmente sair?")) return;
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("cw_avatar_data");
  localStorage.removeItem("pendingAchievement");
  localStorage.removeItem("achievements_state");
  window.location.replace("login.html");
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
  // -------------------------------------------------------------------------------

  // Catálogo simples de módulos (frontend) enquanto o backend não envia a lista.
  const moduleCatalog = [
    {
      id: "mod-js-basico",
      badge: "Módulo 1",
      title: "JavaScript Básico",
      description: "Sintaxe, variáveis e primeiros passos com funções.",
      totalLessons: 2, // preview: só duas lições jogáveis
      displayLessons: 5, // mostra 5 nós, mas só 2 liberadas
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
  const progressKey = (moduleId) => userScopedKey(`module_progress_${moduleId}`);
  const lessonIndexKey = (moduleId) => userScopedKey(`currentLessonIndex_${moduleId || "default"}`);
  const selectedModuleKey = () => userScopedKey("selectedModule");

  function getModuleProgress(moduleId) {
    const mod = moduleCatalog.find((m) => m.id === moduleId);
    const fallbackTotal = mod?.totalLessons || 1;
    try {
      const raw = localStorage.getItem(progressKey(moduleId));
      if (!raw) {
        return { completedLessons: 0, totalLessons: fallbackTotal };
      }
      const parsed = JSON.parse(raw);
      const total = Math.max(1, Math.min(Number(parsed.totalLessons) || fallbackTotal, fallbackTotal));
      const completed = Math.max(0, Math.min(Number(parsed.completedLessons) || 0, total));
      return {
        completedLessons: completed,
        totalLessons: total,
      };
    } catch (e) {
      return { completedLessons: 0, totalLessons: fallbackTotal };
    }
  }

  function saveModuleProgress(moduleId, completedLessons, totalLessons) {
    localStorage.setItem(
      progressKey(moduleId),
      JSON.stringify({
        completedLessons: Math.max(0, Number(completedLessons) || 0),
        totalLessons: Math.max(1, Number(totalLessons) || 1),
      })
    );
  }

  function isModuleUnlocked(mod) {
    // Preview: apenas o primeiro módulo é liberado
    if (mod.id !== "mod-js-basico") return false;
    if (!mod.unlockWith) return true;
    const req = getModuleProgress(mod.unlockWith);
    return req.completedLessons >= (req.totalLessons || 0);
  }

  function markModuleCompleted(moduleId) {
    const mod = moduleCatalog.find((m) => m.id === moduleId);
    const total = mod?.totalLessons || getModuleProgress(moduleId).totalLessons || 1;
    saveModuleProgress(moduleId, total, total);
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
        title: "Agora você vai iniciar uma lição sobre variáveis em JavaScript",
        focus: "Variáveis, tipos e atribuição",
        goal: "Checar fundamentos antes de liberar os desafios práticos",
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

  // SISTEMA DE VIDAS
  const MAX_LIVES = 5;
  const LIFE_PRICE = 50;

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

  async function setLivesRemote(count) {
    if (!userId) return count;
    try {
      const resp = await fetch("/api/profile/lives/refill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (resp.ok) {
        const data = await resp.json();
        updateLivesUI(data.lives || count);
        return data.lives || count;
      }
    } catch (e) {}
    updateLivesUI(count);
    return count;
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
        updateLivesUI(data.lives);
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
    const livesEls = document.querySelectorAll("#livesCounter, #livesCounterHome, #livesCounterModules, #livesCounterSidebar, .lives-pill");
    livesEls.forEach((el) => {
      el.textContent = `❤️ ${state.lives ?? MAX_LIVES}/${MAX_LIVES} vidas`;
    });
  }

  // Atualiza vidas periodicamente para refletir regeneração do backend
  setInterval(() => updateLivesUI(), 30000);
  updateLivesUI();

  async function attemptBuyLifeRecharge() {
    const ok = await updateCoins(-LIFE_PRICE);
    if (!ok) return false;
    await setLivesRemote(MAX_LIVES);
    if (window.showToast) window.showToast("Vidas recarregadas!");
    return true;
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
      const percent = Math.min(
        100,
        Math.round(
          (completedCount / (displayTotal || 1)) *
            100
        )
      );

      const card = document.createElement("article");
      card.className = "module-card";
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
          <span class="status ${completed ? "completed" : unlocked ? "" : "locked"}">
            ${
              completed
                ? '<i class="fas fa-check-circle"></i> Concluído'
                : unlocked
                ? '<i class="fas fa-unlock"></i> Em andamento'
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
}

  // Intro da lição (intro_modulo.html) - preenche textos conforme lição atual
  const introPage = document.querySelector(".intro-page");
  if (introPage) {
    const selectedModule = resolveSelectedModule();
    const progress = selectedModule ? getModuleProgress(selectedModule.id) : { completedLessons: 0 };
    const rawLessonIndex =
      Number(localStorage.getItem(lessonIndexKey(selectedModule?.id))) ||
      progress.completedLessons ||
      0;
    const metaList = lessonMeta[selectedModule?.id] || [];
    const meta = metaList[Math.min(rawLessonIndex, metaList.length - 1)] || metaList[0];
    if (meta) {
      const titleEl = document.querySelector(".highlight-card .title");
      const focusEl = document.getElementById("lessonFocus");
      const goalEl = document.getElementById("lessonGoal");
      const timeEl = document.getElementById("estimatedTime");
      const pillEl = document.querySelector(".intro-header .pill");
      if (titleEl) titleEl.textContent = meta.title;
      if (focusEl) focusEl.textContent = meta.focus;
      if (goalEl) goalEl.textContent = meta.goal;
      if (timeEl) timeEl.textContent = meta.estimatedTime;
      if (pillEl) pillEl.textContent = meta.pill || "Lição";
    }
  }

  // Injeta vidas na barra lateral (home/modulos) se existir
  function ensureLivesInSidebar() {
    const sidebarLives = document.querySelector(".right-sidebar .lives-pill");
    if (sidebarLives) return;
    const container = document.querySelector(".right-sidebar .stats-missions-container");
    if (container) {
      const pill = document.createElement("div");
      pill.className = "lives-pill";
      pill.id = "livesCounterSidebar";
      pill.textContent = "❤️ 5/5 vidas";
      container.prepend(pill);
    }
  }
  if (
    window.location.pathname.endsWith("home.html") ||
    window.location.pathname.endsWith("modulos.html")
  ) {
    ensureLivesInSidebar();
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
    window.startLevelTest = function () {
      transitionToPage("qst_nivelamento.html");
    };

    startBtn.addEventListener("click", window.startLevelTest);

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

    let currentQuestion = 0;
    let selectedAnswer = null;
    let userAnswers = [];
    let score = 0;

    const questionTitle = document.getElementById("questionTitle");
    const optionsContainer = document.getElementById("optionsContainer");
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const nextBtn = document.querySelector(".next-btn");
    const backBtn = document.querySelector(".back-btn");

    window.goBackQuestion = function () {
      if (currentQuestion > 0) {
        currentQuestion--;
        selectedAnswer = userAnswers[currentQuestion] || null;
        displayQuestion();
        updateProgress();
        updateButtons();
      }
    };

    window.nextQuestion = function () {
      if (selectedAnswer === null) return;
      userAnswers[currentQuestion] = selectedAnswer;
      const isCorrect =
        testQuestions[currentQuestion].options[selectedAnswer].correct;
      if (isCorrect) {
        score++;
      }
      showAnswerFeedback(isCorrect);
      setTimeout(() => {
        if (currentQuestion < testQuestions.length - 1) {
          currentQuestion++;
          selectedAnswer = userAnswers[currentQuestion] || null;
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
      questionTitle.textContent = questionData.question;
      optionsContainer.innerHTML = "";
      questionData.options.forEach((option, index) => {
        const optionElement = document.createElement("div");
        optionElement.className = "option";
        if (selectedAnswer === index) {
          optionElement.classList.add("selected");
        }
        optionElement.innerHTML = `<span class=\"option-letter\">${option.letter}-</span> <span class=\"option-text\">${option.text}</span>`;
        optionElement.addEventListener("click", () =>
          selectOption(index, optionElement)
        );
        optionsContainer.appendChild(optionElement);
      });
    }

    function selectOption(index, element) {
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
        if (testQuestions[currentQuestion].options[index].correct) {
          option.classList.add("correct");
        }
        if (index === selectedAnswer && !isCorrect) {
          option.classList.add("incorrect");
        }
      });
      nextBtn.disabled = true;
    }

    function updateProgress() {
      const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
      progressFill.style.width = progress + "%";
      progressText.textContent = `Questão ${currentQuestion + 1} de ${
        testQuestions.length
      }`;
    }

    function updateButtons() {
      backBtn.disabled = currentQuestion === 0;
      backBtn.style.opacity = currentQuestion === 0 ? "0.5" : "1";
      nextBtn.disabled = selectedAnswer === null;
      nextBtn.textContent =
        currentQuestion < testQuestions.length - 1 ? "Avançar" : "Finalizar";
    }

    async function finishTest() {
      const percentage = Math.round((score / testQuestions.length) * 100);
      console.log(
        `Teste finalizado! Pontuação: ${score}/${testQuestions.length} (${percentage}%)`
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

      nextBtn.addEventListener("click", window.nextQuestion);
      backBtn.addEventListener("click", window.goBackQuestion);
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
            Avançando para a criação de avatar...
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
            transitionToPage("intro_criacao-avatar.html");
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
        const categoryItem = document.createElement("div");
        categoryItem.className = "category-item";
        categoryItem.style.animationDelay = `${0.3 + index * 0.2}s`;
        categoryItem.innerHTML = `
          <span class="category-name">${category.name}</span>
          <span class="category-score">${category.correct}/${category.total}</span>
        `;
        categoryScoresElement.appendChild(categoryItem);
      });
    }

    // Atualiza melhor categoria
    const bestCategoryElement = document.getElementById("bestCategory");
    if (bestCategoryElement) {
      bestCategoryElement.textContent = bestCategory.name;
    }

    // Marca o módulo selecionado como concluído (desbloqueia o próximo)
    const currentModule = resolveSelectedModule();
    if (currentModule) {
      markModuleCompleted(currentModule.id);
    }

    // Atualiza classificação
    const classificationElement = document.getElementById(
      "finalClassification"
    );
    if (classificationElement) {
      classificationElement.textContent = classification.level;
      classificationElement.className = `final-classification classification-${classification.class}`;
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

  // 10. PÁGINA DE INTRODUÇÃO À CRIAÇÃO DE AVATAR (intro_criacao-avatar.html)
  // ... (lógica mantida)
  const avatarBtn = document.querySelector(".avatar-btn");
  if (avatarBtn) {
    avatarBtn.addEventListener("click", () => {
      // Futuramente, redirecionar para a página de criação de avatar
      transitionToPage("modulos.html"); // Placeholder
    });
  }

  // 11. LÓGICA DO BOTÃO PULAR (skipBtn)
  // ... (lógica mantida)
  const skipBtn = document.getElementById("skipBtn");
  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Mostra um estado de carregamento
      skipBtn.innerHTML = `
        <div class="loading">
          <div class="spinner"></div>
          <span>Carregando...</span>
        </div>
      `;
      skipBtn.disabled = true;
      // Redireciona para a home após um pequeno atraso
      setTimeout(() => {
        transitionToPage("modulos.html");
      }, 1500);
    });
  }

  (function(){
    try {
      const el = document.getElementById('userLevel');
      const stored = localStorage.getItem('lastTestResult');
      let level = 'Iniciante';
      if (stored) {
        const data = JSON.parse(stored);
        if (data && typeof data.classification === 'string' && data.classification.trim()) {
          level = data.classification;
        }
      }
      if (el) el.textContent = level;
    } catch (e) {
      const el = document.getElementById('userLevel');
      if (el) el.textContent = 'Iniciante';
    }
  })();

  // 12. QUESTIONÁRIO DO MÓDULO (qst_modulo.html) - fluxo inspirado no nivelamento
  const lessonQuizPage = document.querySelector(".quiz-page");
  if (lessonQuizPage) {
    const questionText = document.getElementById("questionText");
    const optionsList = document.getElementById("optionsList");
    const progressFill = document.getElementById("progressFill");
    const questionIndicator = document.getElementById("questionIndicator");
    const questionPill = document.querySelector(".question-pill");
    const backBtn = document.getElementById("lessonBackBtn");
    const skipBtnLesson = document.getElementById("lessonSkipBtn");
    const nextBtnLesson = document.getElementById("lessonNextBtn");

    if (
      questionText &&
      optionsList &&
      progressFill &&
      questionIndicator &&
      questionPill &&
      backBtn &&
      skipBtnLesson &&
      nextBtnLesson
    ) {
      const selectedModule = resolveSelectedModule();
      const progress = selectedModule ? getModuleProgress(selectedModule.id) : { completedLessons: 0, totalLessons: 1 };
    const rawLessonIndex =
      Number(localStorage.getItem(lessonIndexKey(selectedModule?.id))) ||
      progress.completedLessons ||
      0;
      const maxLessons =
        selectedModule?.totalLessons ||
        (lessonsByModule[selectedModule?.id]?.length || 1);
      const availableLessons =
        (lessonsByModule[selectedModule?.id] &&
          lessonsByModule[selectedModule?.id].length) ||
        maxLessons ||
        1;
      const currentLessonIndex = Math.max(
        0,
        Math.min(rawLessonIndex, availableLessons - 1)
      );
      const questionsForModule = lessonsByModule[selectedModule?.id] || [];
      const lessonQuestions =
        questionsForModule[currentLessonIndex] ||
        questionsForModule[0] ||
        [];
      const metaList = lessonMeta[selectedModule?.id] || [];
      const meta = metaList[Math.min(currentLessonIndex, metaList.length - 1)] || metaList[0];
      const lessonTitleEl = document.getElementById("lessonTitle");
      if (lessonTitleEl && meta?.pill) lessonTitleEl.textContent = meta.pill;

      const livesCounterEl = document.getElementById("livesCounter");
      updateLivesUI();

      let currentQuestion = 0;
      let selectedAnswer = null;
      let userAnswers = [];
      let score = 0;

      function displayQuestion() {
        const data = lessonQuestions[currentQuestion];
        questionText.textContent = data.question;
        questionPill.textContent = `Questão ${currentQuestion + 1}`;
        optionsList.innerHTML = "";
        data.options.forEach((opt, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "option";
          if (selectedAnswer === idx) btn.classList.add("selected");
          btn.innerHTML = `<strong>${opt.letter})</strong> ${opt.text}`;
          btn.addEventListener("click", () => selectOption(idx));
          optionsList.appendChild(btn);
        });
      }

      function selectOption(idx) {
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
          if (lessonQuestions[currentQuestion].options[i].correct) {
            btn.classList.add("correct");
          }
          if (i === selectedAnswer && !isCorrect) {
            btn.classList.add("incorrect");
          }
        });
        nextBtnLesson.disabled = true;
      }

      function updateProgress() {
        const progress = ((currentQuestion + 1) / lessonQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
        questionIndicator.textContent = `Questão ${
          currentQuestion + 1
        } de ${lessonQuestions.length}`;
        nextBtnLesson.textContent =
          currentQuestion < lessonQuestions.length - 1 ? "Avançar" : "Finalizar";
        backBtn.disabled = currentQuestion === 0;
        backBtn.style.opacity = currentQuestion === 0 ? "0.6" : "1";
        nextBtnLesson.disabled = selectedAnswer === null;
      }

      async function goToNext() {
        if (selectedAnswer === null) return;
        userAnswers[currentQuestion] = selectedAnswer;
        const isCorrect =
          lessonQuestions[currentQuestion].options[selectedAnswer].correct;
        showAnswerFeedback(
          isCorrect
        );
        if (!isCorrect) {
          const lives = await consumeLifeRemote();
          updateLivesUI(lives);
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
        userAnswers[currentQuestion] = null;
        selectedAnswer = null;
        if (currentQuestion < lessonQuestions.length - 1) {
          currentQuestion++;
          displayQuestion();
          updateProgress();
        } else {
          finishQuiz();
        }
      }

      async function finishQuiz() {
        // Recalcula o score com base em todas as respostas marcadas
        score = userAnswers.reduce((total, answer, idx) => {
          const question = lessonQuestions[idx];
          if (
            typeof answer === "number" &&
            question?.options?.[answer] &&
            question.options[answer].correct
          ) {
            return total + 1;
          }
          return total;
        }, 0);
        // Persistir estatísticas desta lição
        try {
          const uid = localStorage.getItem('userId');
          if (uid) {
            const answered = lessonQuestions.length;
            const correct = score;
            const wrong = Math.max(0, answered - correct);
            await fetch('/api/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: uid, answeredCount: answered, correctCount: correct, wrongCount: wrong })
            }).catch(() => {});
          }
        } catch (e) { /* ignora erros */ }
        // Marca primeira lição concluída (para conquistas) e agenda modal ao voltar à home
        if (!localStorage.getItem("ach_first_lesson")) {
          localStorage.setItem("ach_first_lesson", "1");
          localStorage.setItem("pendingAchievement", JSON.stringify({ title: "Primeira Lição" }));
        }
        // Atualiza progresso do módulo (incrementa uma lição)
        const currentModule = resolveSelectedModule();
        if (currentModule) {
          const prog = getModuleProgress(currentModule.id);
          const availableLessons =
            (lessonsByModule[currentModule.id] &&
              lessonsByModule[currentModule.id].length) ||
            prog.totalLessons ||
            currentModule.totalLessons ||
            lessonQuestions.length;
          const nextCompleted = Math.min(
            (prog.completedLessons || 0) + 1,
            availableLessons
          );
          saveModuleProgress(
            currentModule.id,
            nextCompleted,
            availableLessons
          );
          if (nextCompleted >= availableLessons) {
            markModuleCompleted(currentModule.id);
          }
          // avança o índice para a próxima lição disponível
          const nextIndex = Math.min(
            nextCompleted,
            availableLessons - 1
          );
          localStorage.setItem(lessonIndexKey(currentModule.id), String(nextIndex));
        }
        // recompensa de moedas
        const rewardCoins = 75;
        updateCoins(rewardCoins);
        localStorage.setItem("lastRewardCoins", String(rewardCoins));
        transitionToPage(
          `resultado_modulo.html?score=${score}&total=${lessonQuestions.length}`
        );
      }

      backBtn.addEventListener("click", goBack);
      skipBtnLesson.addEventListener("click", skipQuestion);
      nextBtnLesson.addEventListener("click", goToNext);
      const exitBtn = document.getElementById("lessonExitBtn");
      if (exitBtn) exitBtn.addEventListener("click", () => transitionToPage("home.html"));

      (async () => {
        const state = await fetchLivesState();
        updateLivesUI(state.lives);
        if ((state.lives ?? MAX_LIVES) <= 0) {
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
    const score = parseInt(params.get("score"), 10);
    const total = parseInt(params.get("total"), 10);
    const hasValidScore =
      Number.isFinite(score) && Number.isFinite(total) && total > 0;
    const percentage = hasValidScore ? Math.round((score / total) * 100) : 0;

    const scoreValue = document.getElementById("scoreValue");
    const motivationMessage = document.getElementById("motivationMessage");
    const rewardBtn = document.getElementById("rewardBtn");

    const messages = {
      high: "Excelente! Você dominou este conteúdo e está pronto para avançar.",
      mid: "Ótimo progresso! Continue praticando e refine os pontos que faltam.",
      low: "Cada tentativa conta. Reveja os conceitos e tente novamente, você consegue!",
    };

    if (hasValidScore) {
      scoreValue.textContent = `${percentage}%`;
      if (percentage >= 85) {
        motivationMessage.textContent = messages.high;
      } else if (percentage >= 70) {
        motivationMessage.textContent = messages.mid;
      } else {
        motivationMessage.textContent = messages.low;
        rewardBtn.textContent = "Tentar de novo";
        rewardBtn.href = "qst_modulo.html";
      }
    }
  }

  // 13.1 Recompensa do módulo (recompensa_modulo.html)
  const rewardTitle = document.getElementById("rewardTitle");
  const rewardDescription = document.getElementById("rewardDescription");
  if (rewardTitle && rewardDescription) {
    const coins = parseInt(localStorage.getItem("lastRewardCoins"), 10) || 0;
    const value = coins > 0 ? coins : 75;
    rewardTitle.textContent = `+${value} moedas`;
    rewardDescription.textContent = "Você ganhou moedas por completar a atividade.";
  }

  // 14. Ações de senha em perfil.html
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
    const DEFAULT_CHAT_WIDTH = 420;

    // Abrir
    chatFloatBtn.addEventListener("click", () => {
      document.documentElement.style.setProperty(
        "--chat-width",
        `${DEFAULT_CHAT_WIDTH}px`
      );
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
      document.documentElement.style.setProperty(
        "--chat-width",
        `${DEFAULT_CHAT_WIDTH}px`
      );
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

    const exerciseTree = document.querySelector(".exercise-tree");
    if (exerciseTree) {
      exerciseTree.innerHTML = "";
      for (let i = 0; i < displayTotal; i++) {
        const status =
          i < completed
            ? "completed"
            : i === completed && i < availableLessons
            ? "current"
            : "locked";

        const node = document.createElement("div");
        node.className = "trail-item";
        node.innerHTML = `
          <button class="exercise-node ${status}" type="button" title="Lição ${i + 1}" data-lesson-index="${i}">
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

  async function fetchBalance() {
    if (!userId) return;
    try {
      const resp = await fetch(`/api/profile/${userId}`);
      if (resp.ok) {
        const data = await resp.json();
        if (balanceDisplay) balanceDisplay.textContent = data?.moedas ?? 0;
        const statCoins = document.querySelector(".daily-missions .stat-item:nth-child(2) .stat-value, .stats .stat-item:nth-child(2) .stat-value");
        if (statCoins) statCoins.textContent = data?.moedas ?? 0;
      }
    } catch (e) {
      // ignore
    }
  }

  async function updateCoins(delta) {
    if (!userId) return false;
    try {
      const resp = await fetch("/api/profile/coins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, delta: Number(delta) }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (window.showToast) window.showToast(data.message || "Saldo insuficiente.");
        return false;
      }
      if (balanceDisplay) balanceDisplay.textContent = data.saldo ?? 0;
      return true;
    } catch (e) {
      if (window.showToast) window.showToast("Erro ao atualizar saldo.");
      return false;
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
        if (itemType === "visual" && btn.disabled) return;

        if (window.showConfirmBox) {
          window.showConfirmBox({
            title: "Confirmar compra",
            message: `Deseja comprar "${itemName}" por ${price} moedas?`,
            onConfirm: async () => {
              const ok = await updateCoins(-price);
              if (ok) {
                if (userId) {
                  await fetch("/api/profile/inventory", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId,
                      tipo: itemType,
                      nome: itemName,
                      descricao: itemDesc,
                      quantidade: 1,
                    }),
                  }).catch(() => {});
                }
                if (itemName.toLowerCase().includes("recarga de vidas")) {
                  setLivesRemote(MAX_LIVES);
                  if (window.showToast) window.showToast("Recarga de vidas aplicada!");
                } else if (window.showToast) window.showToast("Item comprado!");
                if (itemType === "visual") {
                  btn.disabled = true;
                  btn.textContent = "Adquirido";
                }
              }
            },
          });
        } else {
          const ok = await updateCoins(-price);
          if (ok) {
            if (userId) {
              await fetch("/api/profile/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  tipo: itemType,
                  nome: itemName,
                  descricao: itemDesc,
                  quantidade: 1,
                }),
              }).catch(() => {});
            }
            if (itemName.toLowerCase().includes("recarga de vidas")) {
              setLivesRemote(MAX_LIVES);
              if (window.showToast) window.showToast("Recarga de vidas aplicada!");
            } else if (window.showToast) window.showToast("Item comprado!");
            if (itemType === "visual") {
              btn.disabled = true;
              btn.textContent = "Adquirido";
            }
          }
        }
      });
    });
  }

  // Inventário: renderiza visuais e utilizáveis
  const visualItemsContainer = document.getElementById("visualItems");
  const usableItemsContainer = document.getElementById("usableItems");
  const inventoryPreview = document.getElementById("inventoryPreview");
  if ((visualItemsContainer || usableItemsContainer) && userId) {
    (async function () {
      try {
        const resp = await fetch(`/api/profile/inventory/${userId}`);
        const items = (await resp.json()) || [];
        const visuals = items.filter((i) => i.tipo === "visual");
        const usables = items.filter((i) => i.tipo !== "visual");

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
              <div class="badge">${item.tipo === "visual" ? "🎨" : "🛠"}</div>
              <div>
                <strong>${item.nome}</strong>
                <p>${item.descricao || ""}</p>
              </div>
              ${item.tipo !== "visual" ? '<button class="use-item-btn" data-item-id="' + item.id + '">Usar</button>' : ""}
            `;
            container.appendChild(card);

            if (item.tipo !== "visual") {
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
                    await setLivesRemote(MAX_LIVES);
                    if (itemId && userId) {
                      await fetch("/api/profile/inventory/consume", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, itemId }),
                      }).catch(() => {});
                    }
                    if (window.showToast) window.showToast("Vidas recarregadas!");
                    card.remove();
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

        renderList(visualItemsContainer, visuals);
        renderList(usableItemsContainer, usables);
      } catch (e) {
        if (visualItemsContainer) visualItemsContainer.innerHTML = "<p>Erro ao carregar.</p>";
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
            <div class="badge">${item.tipo === "visual" ? "🎨" : "🛠"}</div>
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
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: message }),
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

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita que o 'Enter' pule linha no input
      sendMessage();
    }
  });

  // Redimensionamento horizontal do chat (arrastando a borda esquerda)
  if (chatModal && chatResizeHandle) {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    const MIN_WIDTH = 320;
    const MAX_WIDTH = 900;

    const applyChatWidthVar = () => {
      const w = chatModal.getBoundingClientRect().width;
      document.documentElement.style.setProperty("--chat-width", `${w}px`);
    };

    chatResizeHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX;
      startWidth = chatModal.getBoundingClientRect().width;
      applyChatWidthVar();
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const delta = startX - e.clientX; // arrastar para a esquerda aumenta largura
      let newWidth = startWidth + delta;
      newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      chatModal.style.width = `${newWidth}px`;
      document.documentElement.style.setProperty("--chat-width", `${newWidth}px`);
    });

    window.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = "";
        applyChatWidthVar();
      }
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
    const avatarImg = document.getElementById("profileAvatar");

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
          
          if (data?.avatar && avatarImg) {
            avatarImg.src = data.avatar;
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
  // 4. GERENCIAMENTO DE AVATAR (UPLOAD)
  // ==================================================================
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const avatarInput = document.getElementById("avatarInput");
  const avatarImg = document.getElementById("profileAvatar");

  if (changePhotoBtn && avatarInput) {
    changePhotoBtn.addEventListener("click", () => {
      avatarInput.click();
    });
  }

  if (avatarInput && avatarImg) {
    // Carrega avatar salvo localmente ao iniciar
    const savedAvatar = userId ? localStorage.getItem(`cw_avatar_data_${userId}`) : null;
    if (savedAvatar) avatarImg.src = savedAvatar;

    avatarInput.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        avatarImg.src = dataUrl;
        
        // 1. Salva localmente
        if (userId) localStorage.setItem(`cw_avatar_data_${userId}`, dataUrl);
        
        // 2. Envia para o backend
        if (userId) {
          try {
            await fetch("/api/profile/avatar", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: userId, avatar: dataUrl }),
            });
            if (window.showToast) window.showToast("Avatar atualizado.");
          } catch (err) {
            console.error(err);
            if (window.showToast) window.showToast("Não foi possível salvar no servidor.");
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
