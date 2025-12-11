const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Rota para atualizar o perfil (ex: nome de usuário)
// Usamos PUT ou PATCH para atualizações
router.put("/profile", profileController.updateUsername);
router.put("/profile/avatar", profileController.updateAvatar);
router.get("/profile/:userId", profileController.getProfile);
router.put("/profile/coins", profileController.updateCoins);
router.post("/profile/inventory", profileController.addInventoryItem);
router.get("/profile/inventory/:userId", profileController.listInventory);

module.exports = router;
