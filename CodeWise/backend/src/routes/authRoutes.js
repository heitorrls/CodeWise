const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rotas existentes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Rotas existentes de recuperação de senha
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-code", authController.verifyCode);
router.post("/reset-password", authController.resetPassword);

// --- NOVA ROTA DE EXCLUSÃO DE CONTA ---
router.post("/delete-account", authController.deleteAccount);
// (Usando POST por simplicidade, para manter o padrão. Poderia ser DELETE)

module.exports = router;