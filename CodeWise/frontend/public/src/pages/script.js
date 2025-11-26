/*
 * ARQUIVO MODIFICADO - LÓGICA DO FIREBASE REMOVIDA
 */

// 1. Importações e inicialização do Firebase REMOVIDAS.
// Não há mais 'app', 'auth' ou 'db'.

// Controle de sessão simples para páginas protegidas
(function enforceAuthGuard() {
  const protectedPages = [
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
  window.location.replace("login.html");
};

// Fallback global for buttons that use inline `onclick="continuar()"` before the script initializes.
window.continuar = function () {
  // Safe fallback: direct navigation to login (will be overridden when DOM loads)
  window.location.href = "login.html";
};

// Make the DOMContentLoaded handler async so we can use `await` inside it.
document.addEventListener("DOMContentLoaded", async () => {
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
                window.location.href = "home.html";
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

  // ... (Todo o código anterior, incluindo signup e login, permanece o mesmo) ...

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

  // ... (Restante do seu script.js, seções 7 em diante, permanece o mesmo) ...

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

    function finishTest() {
      const percentage = Math.round((score / testQuestions.length) * 100);
      console.log(
        `Teste finalizado! Pontuação: ${score}/${testQuestions.length} (${percentage}%)`
      );
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
          const userId = localStorage.getItem("userId");
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
      transitionToPage("home.html"); // Placeholder
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
        transitionToPage("home.html");
      }, 1500);
    });
  }

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
      const lessonQuestions = [
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
      ];

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

      function goToNext() {
        if (selectedAnswer === null) return;
        userAnswers[currentQuestion] = selectedAnswer;
        showAnswerFeedback(
          lessonQuestions[currentQuestion].options[selectedAnswer].correct
        );
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

      function finishQuiz() {
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
        transitionToPage(
          `resultado_modulo.html?score=${score}&total=${lessonQuestions.length}`
        );
      }

      backBtn.addEventListener("click", goBack);
      skipBtnLesson.addEventListener("click", skipQuestion);
      nextBtnLesson.addEventListener("click", goToNext);

      displayQuestion();
      updateProgress();
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
    // Abrir
    chatFloatBtn.addEventListener("click", () => {
      chatModalOverlay.classList.add("active");
      chatInput.focus();
      document.body.style.overflow = "hidden"; // Previne scroll do body
    });

    // Função para fechar o modal
    function closeModal() {
      chatModalOverlay.classList.remove("active");
      document.body.style.overflow = "auto"; // Restaura scroll
    }

    // Fechar pelo botão X
    chatCloseBtn.addEventListener("click", closeModal);

    // Fechar clicando fora (no overlay)
    chatModalOverlay.addEventListener("click", (e) => {
      if (e.target === chatModalOverlay) {
        closeModal();
      }
    });

    // Fechar com a tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatModalOverlay.classList.contains("active")) {
        closeModal();
      }
    });
  }

  // --- LÓGICA DE ENVIO DE MENSAGEM (MERGE DA SUA API + NOVO MODAL) ---
  const chatSendBtn = document.getElementById("chatSendBtn"); // ID do novo modal
  const chatMessages = document.getElementById("chatMessages"); // ID do novo modal
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
    
    // SE FOR O ROBÔ (assistant), CONVERTE O MARKDOWN EM HTML
    if (type === 'assistant') {
        // marked.parse converte **texto** em <b>texto</b>, etc.
        messageContent.innerHTML = marked.parse(content); 
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
  }

  // 15. Página calendario.html (executa apenas se os elementos existirem)
  const monthYearElement = document.getElementById("monthYear");
  const calendarDaysElement = document.getElementById("calendarDays");
  const streakCountElement = document.getElementById("streakCount");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");

  if (
    monthYearElement &&
    calendarDaysElement &&
    streakCountElement &&
    prevBtn &&
    nextBtn
  ) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    let currentDate = new Date();
    let loginDates = [];

    try {
      const response = await fetch(`/api/calendar/${userId}`);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      loginDates = Array.isArray(data?.dates) ? data.dates : [];
      streakCountElement.textContent = data?.streak || 0;
      renderCalendar();
    } catch (error) {
      console.error("Erro ao carregar calendário:", error);
      loginDates = [];
      streakCountElement.textContent = 0;
      renderCalendar();
    }

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];

      monthYearElement.textContent = `${monthNames[month]} ${year}`;
      calendarDaysElement.innerHTML = "";

      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement("div");
        calendarDaysElement.appendChild(emptyDiv);
      }

      for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = i;

        const checkDate = new Date(year, month, i);
        const yyyy = checkDate.getFullYear();
        const mm = String(checkDate.getMonth() + 1).padStart(2, "0");
        const dd = String(checkDate.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        if (loginDates.includes(formattedDate)) {
          dayDiv.classList.add("active-day");
        }

        const today = new Date();
        if (
          i === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          dayDiv.classList.add("today");
        }

        calendarDaysElement.appendChild(dayDiv);
      }
    }
  }

  // THEME: Toggle Claro/Escuro com persistência
  (function () {
    const THEME_KEY = "cw_theme";
    const root = document.documentElement;
    const switches = document.querySelectorAll(
      '[data-setting="theme-light"], #lightTheme'
    );
    const isLight = root.getAttribute("data-theme") === "light";

    if (switches.length) {
      switches.forEach((sw) => {
        sw.checked = isLight;
      });

      const syncSwitches = (checked) => {
        switches.forEach((sw) => {
          if (sw.checked !== checked) sw.checked = checked;
        });
      };

      const applyTheme = (enabled) => {
        if (enabled) {
          root.setAttribute("data-theme", "light");
          localStorage.setItem(THEME_KEY, "light");
        } else {
          root.removeAttribute("data-theme");
          localStorage.setItem(THEME_KEY, "dark");
        }
        syncSwitches(enabled);
      };

      switches.forEach((sw) => {
        sw.addEventListener("change", (e) => {
          applyTheme(e.target.checked);
        });
      });
    }
  })();

  // 13. PÁGINA DE PERFIL (perfil.html) // <-- MUDOU PARA DENTRO
  const saveAccountBtn = document.getElementById("save-account-btn");
  const editAccountBtn = document.getElementById("edit-account-btn");
  const deleteAccountBtn = document.querySelector(".delete-button");
  if (saveAccountBtn) {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");

    // Preenche o email do usuário logado e bloqueia por padrão
    const userEmail = localStorage.getItem("userEmail");
    if (emailInput && userEmail) {
      emailInput.value = userEmail;
    }
    // Bloqueia os campos por padrão
    if (usernameInput) usernameInput.disabled = true;
    if (emailInput) emailInput.disabled = true;

    // Botão Editar habilita os campos para edição
    if (editAccountBtn) {
      editAccountBtn.addEventListener("click", () => {
        if (usernameInput) usernameInput.disabled = false;
        if (emailInput) emailInput.disabled = false;
        if (usernameInput) usernameInput.focus();
      });
    }

    // Botão Salvar envia as alterações
    saveAccountBtn.addEventListener("click", async () => {
      const newUsername = usernameInput ? usernameInput.value.trim() : "";
      const newEmail = emailInput ? emailInput.value.trim() : "";
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Erro: ID do usuário não encontrado. Faça login novamente.");
        return;
      }
      if (!newUsername && !newEmail) {
        alert("Nada para atualizar.");
        return;
      }

      try {
        const response = await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            username: newUsername,
            email: newEmail,
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          // Atualiza localStorage do email se alterado
          if (newEmail) {
            localStorage.setItem("userEmail", newEmail);
          }
          alert(data.message || "Dados atualizados com sucesso.");
          // Rebloqueia os campos após salvar
          if (usernameInput) usernameInput.disabled = true;
          if (emailInput) emailInput.disabled = true;
        } else {
          alert(data.message || "Erro ao atualizar dados.");
        }
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        alert("Erro de conexão com o servidor. Tente novamente.");
      }
    });
  }

  // Botão Excluir Conta
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Erro: ID do usuário não encontrado. Faça login novamente.");
        return;
      }
      const confirmed = confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
      );
      if (!confirmed) return;

      try {
        const response = await fetch(`/api/user/${userId}`, {
          method: "DELETE",
        });
        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          alert(data.message || "Conta excluída com sucesso.");
          window.logout(false);
        } else {
          alert(data.message || "Não foi possível excluir a conta.");
        }
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Erro de conexão com o servidor. Tente novamente.");
      }
    });
  }
});


// 15 página de estatisticas.html
  // Lógica Frontend (Mockada por enquanto)
        document.addEventListener('DOMContentLoaded', () => {
            // DADOS FICTÍCIOS (Simulando o que viria do banco)
            // Quando fizermos o backend, substituiremos isso por um fetch()
            const statsData = {
                correct: 42,
                incorrect: 12,
                total: 54
            };

            // 1. Atualiza os Cards
            document.getElementById('totalQuestions').textContent = statsData.total;
            document.getElementById('totalCorrect').textContent = statsData.correct;
            document.getElementById('totalIncorrect').textContent = statsData.incorrect;

            // 2. Configura o Gráfico (Chart.js)
            const ctx = document.getElementById('performanceChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Acertos', 'Erros'],
                    datasets: [{
                        data: [statsData.correct, statsData.incorrect],
                        backgroundColor: [
                            '#4ade80', // Verde (Acertos)
                            '#f87171'  // Vermelho (Erros)
                        ],
                        borderColor: [
                            'rgba(74, 222, 128, 0.2)',
                            'rgba(248, 113, 113, 0.2)'
                        ],
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
                            labels: {
                                color: '#b8b0d0', // Cor do texto da legenda
                                font: { size: 14 }
                            }
                        }
                    },
                    cutout: '70%' // Espessura da rosca
                }
            });

            // 3. Calcula e Anima a Taxa de Precisão
            const accuracy = Math.round((statsData.correct / statsData.total) * 100) || 0;
            document.getElementById('accuracyPercent').textContent = `${accuracy}%`;
            
            // Animação do círculo SVG (Stroke Dashoffset)
            const circle = document.getElementById('progressCircle');
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;

            const offset = circumference - (accuracy / 100) * circumference;
            
            // Pequeno delay para a animação ocorrer
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 100);

            // Texto Motivacional
            const motivation = document.getElementById('motivationText');
            if(accuracy >= 80) motivation.textContent = "Excelente! Você é um mestre.";
            else if(accuracy >= 50) motivation.textContent = "Muito bom! Continue assim.";
            else motivation.textContent = "Não desista! A prática leva à perfeição.";
        });