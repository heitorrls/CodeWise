const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rotas existentes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Rotas de recuperação de senha
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-code", authController.verifyCode);
router.post("/reset-password", authController.resetPassword);

// Rota de exclusão de conta (da etapa anterior)
router.post("/delete-account", authController.deleteAccount);

// --- NOVAS ROTAS DE PERFIL ---
router.get("/profile", authController.getProfile); // Para carregar os dados
router.post("/profile", authController.updateProfile); // Para salvar os dados

module.exports = router;