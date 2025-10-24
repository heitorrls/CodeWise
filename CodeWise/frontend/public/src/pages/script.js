document.addEventListener("DOMContentLoaded", () => {
  // --- FUNÇÕES GLOBAIS E UTILITÁRIAS ---

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

  // Função para limpar a mensagem de erro de um campo
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
        try {
          const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (response.ok) {
            alert("Login realizado com sucesso!");
            window.location.href = "intro_nivelamento.html";
          } else {
            alert(data.message || "Erro ao fazer login");
          }
        } catch (error) {
          alert("Erro de conexão com o servidor");
        }
      }
    });

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
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const loginLink = document.getElementById("loginLink");

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let hasError = false;

      if (!emailInput.value.trim()) {
        showError(emailInput, "Por favor, digite seu email");
        hasError = true;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, "Por favor, digite um email válido");
        hasError = true;
      }

      if (passwordInput.value.length < 6) {
        showError(passwordInput, "A senha deve ter pelo menos 6 caracteres");
        hasError = true;
      }

      if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, "As senhas não coincidem");
        hasError = true;
      }

      if (!hasError) {
        try {
          const response = await fetch(
            "http://localhost:3001/api/auth/signup",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value,
              }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            showSuccess("Conta criada com sucesso!", signupForm);
            setTimeout(() => transitionToPage("login.html"), 1500);
          } else {
            alert(data.message || "Erro ao cadastrar");
          }
        } catch (error) {
          alert("Erro de conexão com o servidor");
        }
      }
    });

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
    confirmationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isValidEmail(emailInput.value.trim())) {
        showSuccess(
          "Código de confirmação enviado para " + emailInput.value.trim(),
          confirmationForm
        );
        setTimeout(() => transitionToPage("verify-code.html"), 2000);
      } else {
        showError(emailInput, "Por favor, digite um email válido");
      }
    });
  }

  // 5. PÁGINA DE VERIFICAÇÃO DE CÓDIGO (verify-code.html)
  const verificationForm = document.getElementById("verificationForm");
  if (verificationForm) {
    const codeInputs = document.querySelectorAll(".code-input");

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

    verificationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = Array.from(codeInputs)
        .map((input) => input.value)
        .join("");
      if (code.length === 6) {
        showSuccess("Código verificado com sucesso!", verificationForm);
        setTimeout(() => transitionToPage("new-password.html"), 1500);
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

    newPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let hasError = false;

      if (newPasswordInput.value.length < 6) {
        showError(
          newPasswordInput,
          "A nova senha deve ter pelo menos 6 caracteres."
        );
        hasError = true;
      }

      if (newPasswordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, "As senhas não coincidem.");
        hasError = true;
      }

      if (!hasError) {
        showSuccess("Senha alterada com sucesso!", newPasswordForm);
        setTimeout(() => transitionToPage("login.html"), 1500);
      }
    });
  }

  // 7. PÁGINA DE INTRODUÇÃO DO NIVELAMENTO (intro_nivelamento.html)
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
  const testCard = document.querySelector(".test-card");
  if (testCard && !document.querySelector(".result-card")) {
    const testQuestions = [
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
      {
        question:
          "Qual método é usado para adicionar um elemento ao final de um array?",
        options: [
          { letter: "A", text: "array.add(elemento)", correct: false },
          { letter: "B", text: "array.push(elemento)", correct: true },
          { letter: "C", text: "array.append(elemento)", correct: false },
          { letter: "D", text: "array.insert(elemento)", correct: false },
        ],
      },
      {
        question:
          "Como você acessa o primeiro elemento de um array chamado 'numeros'?",
        options: [
          { letter: "A", text: "numeros[1]", correct: false },
          { letter: "B", text: "numeros.first()", correct: false },
          { letter: "C", text: "numeros[0]", correct: true },
          { letter: "D", text: "numeros.get(0)", correct: false },
        ],
      },
      {
        question: "Qual é a saída de: console.log(typeof null)?",
        options: [
          { letter: "A", text: '"null"', correct: false },
          { letter: "B", text: '"undefined"', correct: false },
          { letter: "C", text: '"object"', correct: true },
          { letter: "D", text: '"boolean"', correct: false },
        ],
      },
      {
        question:
          "Qual operador é usado para comparar valor e tipo em JavaScript?",
        options: [
          { letter: "A", text: "==", correct: false },
          { letter: "B", text: "===", correct: true },
          { letter: "C", text: "=", correct: false },
          { letter: "D", text: "!=", correct: false },
        ],
      },
      {
        question: "Como você cria um loop que executa 5 vezes?",
        options: [
          { letter: "A", text: "for (i = 0; i <= 5; i++) { }", correct: false },
          { letter: "B", text: "for (i = 1; i <= 5; i++) { }", correct: false },
          {
            letter: "C",
            text: "for (let i = 0; i < 5; i++) { }",
            correct: true,
          },
          {
            letter: "D",
            text: "for (let i = 1; i < 5; i++) { }",
            correct: false,
          },
        ],
      },
      {
        question: "Qual método converte uma string em número inteiro?",
        options: [
          { letter: "A", text: "Number.parseInt()", correct: false },
          { letter: "B", text: "parseInt()", correct: true },
          { letter: "C", text: "toInteger()", correct: false },
          { letter: "D", text: "convertInt()", correct: false },
        ],
      },
      {
        question: "Como você verifica se uma variável é um array?",
        options: [
          { letter: "A", text: "typeof variavel === 'array'", correct: false },
          { letter: "B", text: "variavel instanceof Array", correct: false },
          { letter: "C", text: "Array.isArray(variavel)", correct: true },
          { letter: "D", text: "variavel.isArray()", correct: false },
        ],
      },
      {
        question: "Qual é o resultado de: '5' + 3 em JavaScript?",
        options: [
          { letter: "A", text: "8", correct: false },
          { letter: "B", text: '"53"', correct: true },
          { letter: "C", text: '"8"', correct: false },
          { letter: "D", text: "Erro", correct: false },
        ],
      },
    ];

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
        optionElement.innerHTML = `<span class="option-letter">${option.letter}-</span> <span class="option-text">${option.text}</span>`;
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
    displayQuestion();
    updateProgress();
    updateButtons();

    nextBtn.addEventListener("click", window.nextQuestion);
    backBtn.addEventListener("click", window.goBackQuestion);

    testCard.style.opacity = "0";
    testCard.style.transform = "translateY(30px)";
    setTimeout(() => {
      testCard.style.transition = "all 0.6s ease";
      testCard.style.opacity = "1";
      testCard.style.transform = "translateY(0)";
    }, 100);
  }

  // 9. PÁGINA DE RESULTADO DO NIVELAMENTO (resultado_nivelamento.html)
  const resultCard = document.querySelector(".result-card");
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

      setTimeout(() => {
        transitionToPage("intro_criacao-avatar.html");
        advanceBtn.textContent = originalText;
        advanceBtn.disabled = false;
      }, 2500);
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
  const avatarBtn = document.querySelector(".avatar-btn");
  if (avatarBtn) {
    avatarBtn.addEventListener("click", () => {
      // Futuramente, redirecionar para a página de criação de avatar
      transitionToPage("home.html"); // Placeholder
    });
  }

  // 11. LÓGICA DO BOTÃO PULAR (skipBtn)
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
});

// 12. Pagina home.html 
document.getElementById("send-btn").addEventListener("click", sendMessage);
      document
        .getElementById("chat-input")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            sendMessage();
          }
        });

      function sendMessage() {
        const input = document.getElementById("chat-input");
        const message = input.value.trim();

        if (!message) return;

        addMessage("user", message);
        input.value = "";

        setTimeout(() => {
          const responses = [
            "Entendi sua dúvida! Vou te ajudar com isso.",
            "Ótima pergunta! Deixe-me explicar...",
            "Posso te dar algumas dicas sobre isso.",
            "Vou pesquisar mais informações para você!",
          ];
          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];
          addMessage("assistant", randomResponse);
        }, 1000);
      }

      function addMessage(type, content) {
        const messagesContainer = document.getElementById("chat-messages");
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${type}`;

        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }