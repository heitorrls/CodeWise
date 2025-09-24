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

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let hasError = false;

      if (!emailInput.value.trim()) {
        showError(emailInput, "Por favor, digite seu email");
        hasError = true;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, "Por favor, digite um email válido");
        hasError = true;
      }

      if (!passwordInput.value.trim()) {
        showError(passwordInput, "Por favor, digite sua senha");
        hasError = true;
      }

      if (!hasError) {
        console.log("Login submetido com sucesso!");
        // Lógica de login aqui...
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

    signupForm.addEventListener("submit", (e) => {
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
        console.log("Cadastro submetido com sucesso!");
        showSuccess("Conta criada com sucesso!", signupForm);
        setTimeout(() => transitionToPage("login.html"), 1500);
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
});
