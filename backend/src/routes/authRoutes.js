const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rotas existentes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// NOVAS Rotas de recuperação de senha
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-code", authController.verifyCode);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
