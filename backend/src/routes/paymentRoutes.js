const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Cria checkout simulado do Premium.
// Futuro: retornar URL real do Stripe Checkout ou Mercado Pago.
router.post("/checkout/premium", paymentController.createPremiumCheckout);

// Consulta status simulado de assinatura.
// Futuro: validar assinatura ativa no provider e/ou banco.
router.get("/subscription/:userId", paymentController.getPremiumStatus);

// Alterna status Premium manualmente para testes de interface.
// Futuro: remover ou proteger esta rota em ambiente real.
router.post("/mock/premium-status", paymentController.mockSetPremiumStatus);

// Recebe webhook simulado.
// Futuro: Stripe/Mercado Pago chamarao esta rota para atualizar status premium.
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
