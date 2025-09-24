function continuar() {
  // Animação de transição
  document.body.style.transition = "opacity 0.5s ease";
  document.body.style.opacity = "0";

  setTimeout(() => {
    // Aqui você pode adicionar o redirecionamento real
    window.location.href = "login.html"; // Exemplo de redirecionamento
    document.body.style.opacity = "1";
  }, 500);
}

// Adicionar efeito de paralaxe sutil ao mover o mouse
document.addEventListener("mousemove", (e) => {
  const mascot = document.querySelector(".mascot");
  const x = (e.clientX / window.innerWidth) * 20 - 10;
  const y = (e.clientY / window.innerHeight) * 20 - 10;

  if (mascot) {
    mascot.style.transform = `translateX(${x}px) translateY(${y}px)`;
  }
});

// Elementos do DOM
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const forgotPasswordLink = document.getElementById("forgotPassword");
const signupLink = document.getElementById("signupLink");
const mascotContainer = document.querySelector(".mascot-container");

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para mostrar mensagem de erro
function showError(input, message) {
  input.classList.add("error");

  // Remove mensagem de erro anterior se existir
  const existingError = input.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Adiciona nova mensagem de erro
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
  input.parentNode.appendChild(errorDiv);

  // Adiciona animação de shake
  input.parentNode.classList.add("shake");
  setTimeout(() => {
    input.parentNode.classList.remove("shake");
  }, 500);
}

// Função para remover erro
function clearError(input) {
  input.classList.remove("error");
  const errorMessage = input.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
  // Remove mensagem anterior se existir
  const existingSuccess = document.querySelector(".success-message");
  if (existingSuccess) {
    existingSuccess.remove();
  }

  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  successDiv.style.display = "block";

  const formTitle = document.querySelector(".form-title");
  formTitle.parentNode.insertBefore(successDiv, formTitle.nextSibling);
}

// Event listeners para limpar erros quando o usuário começar a digitar
if (emailInput) {
  emailInput.addEventListener("input", () => {
    clearError(emailInput);
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    clearError(passwordInput);
  });
}

// Manipulador do formulário de login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let hasError = false;

    // Validação do email
    if (!email) {
      showError(emailInput, "Por favor, digite seu email");
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError(emailInput, "Por favor, digite um email válido");
      hasError = true;
    }

    // Validação da senha
    if (!password) {
      showError(passwordInput, "Por favor, digite sua senha");
      hasError = true;
    } else if (password.length < 6) {
      showError(passwordInput, "A senha deve ter pelo menos 6 caracteres");
      hasError = true;
    }

    // Se não há erros, simular login
    if (!hasError) {
      // Desabilitar botão temporariamente
      const loginBtn = document.querySelector(".login-btn");
      const originalText = loginBtn.textContent;
      loginBtn.textContent = "Entrando...";
      loginBtn.disabled = true;

      // Simular processo de login
      setTimeout(() => {
        // Simular resposta do servidor (aqui você faria a requisição real)
        const loginSuccess = Math.random() > 0.3; // 70% chance de sucesso

        if (loginSuccess) {
          showSuccess("Login realizado com sucesso!");

          // Animação de transição
          setTimeout(() => {
            document.body.style.transition = "opacity 0.5s ease";
            document.body.style.opacity = "0";

            setTimeout(() => {
              // window.location.href = 'dashboard.html';
              document.body.style.opacity = "1";
            }, 500);
          }, 1000);
        } else {
          showError(passwordInput, "Email ou senha incorretos");
        }

        // Reabilitar botão
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
      }, 1500);
    }
  });
}

// // Link "Esqueci a senha"
// if (forgotPasswordLink) {
//   forgotPasswordLink.addEventListener("click", (e) => {
//     e.preventDefault();

//     const email = emailInput.value.trim();

//     if (!email) {
//       showError(emailInput, "Digite seu email primeiro para recuperar a senha");
//       return;
//     }

//     if (!isValidEmail(email)) {
//       showError(emailInput, "Digite um email válido para recuperar a senha");
//       return;
//     }

//     // Simular envio de email de recuperação
//     showSuccess(`Instruções de recuperação enviadas para ${email}`);
//   });
// }

// Link "Cadastre-se"
if (signupLink) {
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();

    // Animação de transição
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = "signup.html";
      document.body.style.opacity = "1";
    }, 500);
  });
}

// Efeito de paralaxe sutil no mascote
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 15 - 7.5;
  const y = (e.clientY / window.innerHeight) * 15 - 7.5;

  if (mascotContainer) {
    mascotContainer.style.transform = `translateX(${x}px) translateY(${y}px)`;
  }
});

// Adicionar efeito de foco nos inputs
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.parentNode.style.transform = "scale(1.02)";
    input.parentNode.style.transition = "transform 0.2s ease";
  });

  input.addEventListener("blur", () => {
    input.parentNode.style.transform = "scale(1)";
  });
});

// Função para detectar Enter nos inputs
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && document.activeElement.tagName === "INPUT") {
    if (loginForm) {
      loginForm.dispatchEvent(new Event("submit"));
    } else if (signupForm) {
      signupForm.dispatchEvent(new Event("submit"));
    }
  }
});

// CÓDIGO ESPECÍFICO DA PÁGINA DE CADASTRO

// Elementos específicos do cadastro
const signupForm = document.getElementById("signupForm");
const confirmPasswordInput = document.getElementById("confirmPassword");
const loginLink = document.getElementById("loginLink");

// Função para verificar força da senha
function getPasswordStrength(password) {
  let strength = 0;
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];

  strength = checks.filter(Boolean).length;

  if (strength <= 2) return { level: "weak", text: "Senha fraca" };
  if (strength <= 3) return { level: "medium", text: "Senha média" };
  return { level: "strong", text: "Senha forte" };
}

// Função para mostrar indicador de força da senha
function showPasswordStrength(input, strength) {
  // Remove indicador anterior se existir
  const existingStrength = input.parentNode.querySelector(".password-strength");
  if (existingStrength) {
    existingStrength.remove();
  }

  if (input.value.length > 0) {
    const strengthDiv = document.createElement("div");
    strengthDiv.className = `password-strength strength-${strength.level}`;
    strengthDiv.textContent = strength.text;
    input.parentNode.appendChild(strengthDiv);
  }
}

// Event listeners específicos do cadastro
if (passwordInput && confirmPasswordInput) {
  passwordInput.addEventListener("input", () => {
    clearError(passwordInput);
    const strength = getPasswordStrength(passwordInput.value);
    showPasswordStrength(passwordInput, strength);

    // Verificar se as senhas coincidem quando há confirmação
    if (confirmPasswordInput.value) {
      clearError(confirmPasswordInput);
      if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, "As senhas não coincidem");
      }
    }
  });

  confirmPasswordInput.addEventListener("input", () => {
    clearError(confirmPasswordInput);
    if (
      passwordInput.value !== confirmPasswordInput.value &&
      confirmPasswordInput.value
    ) {
      showError(confirmPasswordInput, "As senhas não coincidem");
    }
  });
}

// Manipulador do formulário de cadastro
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    let hasError = false;

    // Validação do email
    if (!email) {
      showError(emailInput, "Por favor, digite seu email");
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError(emailInput, "Por favor, digite um email válido");
      hasError = true;
    }

    // Validação da senha
    if (!password) {
      showError(passwordInput, "Por favor, digite sua senha");
      hasError = true;
    } else if (password.length < 6) {
      showError(passwordInput, "A senha deve ter pelo menos 6 caracteres");
      hasError = true;
    }

    // Validação da confirmação de senha
    if (!confirmPassword) {
      showError(confirmPasswordInput, "Por favor, confirme sua senha");
      hasError = true;
    } else if (password !== confirmPassword) {
      showError(confirmPasswordInput, "As senhas não coincidem");
      hasError = true;
    }

    // Se não há erros, simular cadastro
    if (!hasError) {
      // Desabilitar botão temporariamente
      const signupBtn = document.querySelector(".signup-btn");
      const originalText = signupBtn.textContent;
      signupBtn.textContent = "Criando conta...";
      signupBtn.disabled = true;

      // Simular processo de cadastro
      setTimeout(() => {
        // Simular resposta do servidor (aqui você faria a requisição real)
        const signupSuccess = Math.random() > 0.2; // 80% chance de sucesso

        if (signupSuccess) {
          showSuccess("Conta criada com sucesso!");

          // Limpar formulário
          signupForm.reset();

          // Remover indicadores de força da senha
          const strengthIndicators =
            document.querySelectorAll(".password-strength");
          strengthIndicators.forEach((indicator) => indicator.remove());

          // Animação de transição
          setTimeout(() => {
            document.body.style.transition = "opacity 0.5s ease";
            document.body.style.opacity = "0";

            setTimeout(() => {
              window.location.href = "login.html";
              document.body.style.opacity = "1";
            }, 500);
          }, 1500);
        } else {
          showError(emailInput, "Este email já está cadastrado");
        }

        // Reabilitar botão
        signupBtn.textContent = originalText;
        signupBtn.disabled = false;
      }, 2000);
    }
  });
}

// Link "Entrar" (voltar para login)
if (loginLink) {
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();

    // Animação de transição
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = "login.html";
      document.body.style.opacity = "1";
    }, 500);
  });
}

// Verificação de email em tempo real (simulada)
let emailCheckTimeout;
if (emailInput) {
  emailInput.addEventListener("input", () => {
    clearTimeout(emailCheckTimeout);

    if (isValidEmail(emailInput.value)) {
      emailCheckTimeout = setTimeout(() => {
        // Simular verificação de disponibilidade do email
        const isAvailable = Math.random() > 0.3; // 70% chance de estar disponível

        if (!isAvailable) {
          showError(emailInput, "Este email já está cadastrado");
        }
      }, 1000);
    }
  });
}
// CÓDIGO ESPECÍFICO DA PÁGINA DE CONFIRMAÇÃO DE EMAIL

// Elementos específicos da confirmação
const confirmationForm = document.getElementById("confirmationForm");

// Função para voltar à página anterior
function goBack() {
  // Animação de transição
  document.body.style.transition = "opacity 0.5s ease";
  document.body.style.opacity = "0";

  setTimeout(() => {
    // Voltar para a página anterior ou para signup se não houver histórico
    if (document.referrer) {
      window.history.back();
    } else {
      window.location.href = "login.html";
    }
  }, 500);
}

// Event listener para o formulário de confirmação
if (confirmationForm) {
  confirmationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    let hasError = false;

    // Validação do email
    if (!email) {
      showError(emailInput, "Por favor, digite seu email");
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError(emailInput, "Por favor, digite um email válido");
      hasError = true;
    }

    // Se não há erros, simular envio do código
    if (!hasError) {
      // Desabilitar botão e mostrar loading
      const sendBtn = document.querySelector(".send-btn");
      const originalText = sendBtn.textContent;

      sendBtn.innerHTML = `
        <div class="loading">
          <div class="spinner"></div>
          Enviando...
        </div>
      `;
      sendBtn.disabled = true;

      // Simular processo de envio
      setTimeout(() => {
        // Simular resposta do servidor
        const sendSuccess = Math.random() > 0.1; // 90% chance de sucesso

        if (sendSuccess) {
          showSuccess(`Código de confirmação enviado para ${email}`);

          // Animação de transição para próxima página
          setTimeout(() => {
            document.body.style.transition = "opacity 0.5s ease";
            document.body.style.opacity = "0";

            setTimeout(() => {
              // Redirecionar para página de inserir código
              // alert("Redirecionando para inserir código de confirmação...");
              window.location.href = "verify-code.html";
              document.body.style.opacity = "1";
            }, 500);
          }, 2000);
        } else {
          showError(emailInput, "Erro ao enviar código. Tente novamente.");
        }

        // Reabilitar botão
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
      }, 2500);
    }
  });
}

// Verificação de email em tempo real para página de confirmação
if (confirmationForm && emailInput) {
  let emailCheckTimeout;

  emailInput.addEventListener("input", () => {
    clearTimeout(emailCheckTimeout);
    clearError(emailInput);

    if (isValidEmail(emailInput.value)) {
      emailCheckTimeout = setTimeout(() => {
        // Simular verificação se email existe no sistema
        const emailExists = Math.random() > 0.2; // 80% chance de existir

        if (!emailExists) {
          showError(emailInput, "Email não encontrado no sistema");
        }
      }, 1500);
    }
  });
}

// Animação de entrada da página de confirmação
document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".confirmation-card");
  if (card) {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100);
  }
});
// CÓDIGO ESPECÍFICO DA PÁGINA DE VERIFICAÇÃO DE CÓDIGO

// Elementos específicos da verificação
const verificationForm = document.getElementById("verificationForm");
const codeInputs = document.querySelectorAll(".code-input");
const resendLink = document.getElementById("resendCode");

// Função para voltar à página anterior
function goBack() {
  // Animação de transição
  document.body.style.transition = "opacity 0.5s ease";
  document.body.style.opacity = "0";

  setTimeout(() => {
    // Voltar para a página anterior
    if (document.referrer) {
      window.history.back();
    } else {
      window.location.href = "email-confirmation.html";
    }
  }, 500);
}

// Função para mostrar mensagem de erro
function showError(message) {
  // Remove mensagem anterior se existir
  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  const title = document.querySelector(".title");
  title.parentNode.insertBefore(errorDiv, title.nextSibling);

  // Adicionar classe de erro aos inputs
  codeInputs.forEach((input) => {
    input.classList.add("error");
  });
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
  // Remove mensagem anterior se existir
  const existingSuccess = document.querySelector(".success-message");
  if (existingSuccess) {
    existingSuccess.remove();
  }

  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  successDiv.style.display = "block";

  const title = document.querySelector(".title");
  title.parentNode.insertBefore(successDiv, title.nextSibling);
}

// Função para limpar erros
function clearErrors() {
  const errorMessage = document.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }

  codeInputs.forEach((input) => {
    input.classList.remove("error");
  });
}

// Função para obter o código completo
function getCodeValue() {
  return Array.from(codeInputs)
    .map((input) => input.value)
    .join("");
}

// Função para limpar todos os inputs
function clearCode() {
  codeInputs.forEach((input) => {
    input.value = "";
    input.classList.remove("filled");
  });
  codeInputs[0].focus();
}

// Configurar comportamento dos inputs de código
if (codeInputs.length > 0) {
  codeInputs.forEach((input, index) => {
    // Permitir apenas números
    input.addEventListener("input", (e) => {
      clearErrors();

      const value = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = value;

      if (value) {
        e.target.classList.add("filled");

        // Mover para próximo input
        if (index < codeInputs.length - 1) {
          codeInputs[index + 1].focus();
        }
      } else {
        e.target.classList.remove("filled");
      }
    });

    // Navegação com backspace
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        codeInputs[index - 1].focus();
        codeInputs[index - 1].value = "";
        codeInputs[index - 1].classList.remove("filled");
      }

      // Permitir navegação com setas
      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        codeInputs[index - 1].focus();
      }

      if (e.key === "ArrowRight" && index < codeInputs.length - 1) {
        e.preventDefault();
        codeInputs[index + 1].focus();
      }
    });

    // Selecionar input ao clicar
    input.addEventListener("focus", () => {
      input.select();
    });

    // Colar código
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData(
        "text"
      );
      const digits = pastedText.replace(/[^0-9]/g, "").slice(0, 6);

      digits.split("").forEach((digit, idx) => {
        if (codeInputs[idx]) {
          codeInputs[idx].value = digit;
          codeInputs[idx].classList.add("filled");
        }
      });

      // Focar no próximo input vazio ou último
      const nextEmptyIndex = Math.min(digits.length, codeInputs.length - 1);
      codeInputs[nextEmptyIndex].focus();
    });
  });

  // Focar no primeiro input ao carregar
  codeInputs[0].focus();
}

// Event listener para o formulário de verificação
if (verificationForm) {
  verificationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const code = getCodeValue();

    // Validação do código
    if (code.length < 6) {
      showError("Por favor, digite o código completo de 6 dígitos");
      return;
    }

    // Simular verificação do código
    const confirmBtn = document.querySelector(".confirm-btn");
    const originalText = confirmBtn.textContent;

    confirmBtn.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        Verificando...
      </div>
    `;
    confirmBtn.disabled = true;

    // Simular processo de verificação
    setTimeout(() => {
      // Código correto simulado: 123456
      const correctCode = "123456";
      const isValidCode = code === correctCode || Math.random() > 0.3; // 70% chance de sucesso

      if (isValidCode) {
        showSuccess("Código verificado com sucesso!");

        // Animação de transição
        setTimeout(() => {
          document.body.style.transition = "opacity 0.5s ease";
          document.body.style.opacity = "0";

          setTimeout(() => {
            alert("Redirecionando para o login...");
            window.location.href = "login.html";
            document.body.style.opacity = "1";
          }, 500);
        }, 1500);
      } else {
        showError("Código incorreto. Tente novamente.");
        clearCode();
      }

      // Reabilitar botão
      confirmBtn.textContent = originalText;
      confirmBtn.disabled = false;
    }, 2000);
  });
}

// Funcionalidade de reenvio de código
if (resendLink) {
  let resendTimeout;
  let countdownInterval;

  resendLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (resendLink.classList.contains("disabled")) {
      return;
    }

    // Desabilitar link temporariamente
    resendLink.classList.add("disabled");
    resendLink.textContent = "Reenviando...";

    // Simular reenvio
    setTimeout(() => {
      showSuccess("Novo código enviado para seu e-mail!");

      // Countdown de 60 segundos
      let countdown = 60;
      resendLink.textContent = `Reenviar (${countdown}s)`;

      countdownInterval = setInterval(() => {
        countdown--;
        resendLink.textContent = `Reenviar (${countdown}s)`;

        if (countdown <= 0) {
          clearInterval(countdownInterval);
          resendLink.textContent = "Reenviar";
          resendLink.classList.remove("disabled");
        }
      }, 1000);
    }, 1500);
  });
}

// Animação de entrada da página
document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".verification-card");
  if (card) {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100);
  }
});
