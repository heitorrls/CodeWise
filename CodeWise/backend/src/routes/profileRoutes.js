const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Rota para atualizar o perfil (ex: nome de usuário)
// Usamos PUT ou PATCH para atualizações
router.put("/profile", profileController.updateUsername);

module.exports = router;