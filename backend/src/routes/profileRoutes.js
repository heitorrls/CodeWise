const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Rota para atualizar o perfil (ex: nome de usuário)
// Usamos PUT ou PATCH para atualizações
router.put("/profile", profileController.updateUsername);
router.put("/profile/photo", profileController.updateProfilePhoto);
router.get("/profile/:userId", profileController.getProfile);
router.post("/profile/rewards/lesson", profileController.rewardLesson);
router.post("/profile/inventory/purchase", profileController.purchaseInventoryItem);
router.get("/profile/inventory/:userId", profileController.listInventory);
router.post("/profile/inventory/consume", profileController.consumeInventoryItem);
router.post(
  "/profile/inventory/use-life-refill",
  profileController.useLifeRefillItem
);
router.put("/profile/decoration", profileController.equipProfileDecoration);
router.get("/profile/lives/:userId", profileController.getLives);
router.post("/profile/lives/consume", profileController.consumeLife);

module.exports = router;
