const paymentService = require("../services/payment");

exports.createPremiumCheckout = (req, res) => {
  try {
    const { userId, successUrl, cancelUrl } = req.body;
    const checkout = paymentService.createPremiumCheckout({
      userId,
      successUrl,
      cancelUrl,
    });

    return res.status(201).json({
      message: "Mock checkout created. No real payment was started.",
      checkout,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao criar checkout mock.",
    });
  }
};

exports.getPremiumStatus = (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = paymentService.validatePremiumSubscription({ userId });

    return res.status(200).json({
      message: "Mock subscription status.",
      subscription,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Erro ao validar assinatura mock.",
    });
  }
};

exports.handleWebhook = (req, res) => {
  try {
    // Futuro Stripe: esta rota precisara receber raw body antes de express.json().
    // Futuro Mercado Pago: validar assinatura/notificacao antes de confiar no payload.
    const result = paymentService.handlePaymentWebhook({ payload: req.body });

    return res.status(200).json({
      message: "Mock webhook processed.",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Erro ao processar webhook mock.",
    });
  }
};

exports.mockSetPremiumStatus = (req, res) => {
  const { userId, premium } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId e obrigatorio." });
  }

  const result = paymentService.savePremiumStatus({
    userId,
    premium,
    source: "manual_mock",
  });

  return res.status(200).json({
    message: "Mock premium status updated. Database persistence is not enabled yet.",
    result,
  });
};
