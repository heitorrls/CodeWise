const mockPaymentProvider = require("./mockPaymentProvider");
const { PREMIUM_PLAN, PAYMENT_PROVIDERS, activeProvider } = require("./paymentConfig");

function getProvider() {
  switch (activeProvider) {
    case PAYMENT_PROVIDERS.STRIPE:
      // Futuro: retornar uma implementacao Stripe com a mesma interface do mock.
      return mockPaymentProvider;
    case PAYMENT_PROVIDERS.MERCADO_PAGO:
      // Futuro: retornar uma implementacao Mercado Pago com a mesma interface do mock.
      return mockPaymentProvider;
    case PAYMENT_PROVIDERS.MOCK:
    default:
      return mockPaymentProvider;
  }
}

function createPremiumCheckout({ userId, successUrl, cancelUrl }) {
  if (!userId) {
    const error = new Error("userId is required to create a checkout session.");
    error.statusCode = 400;
    throw error;
  }

  return getProvider().createCheckoutSession({
    userId,
    planId: PREMIUM_PLAN.id,
    successUrl,
    cancelUrl,
  });
}

function validatePremiumSubscription({ userId }) {
  if (!userId) {
    const error = new Error("userId is required to validate a subscription.");
    error.statusCode = 400;
    throw error;
  }

  return getProvider().validateSubscription({ userId });
}

function savePremiumStatus({ userId, premium, source }) {
  // Futuro: salvar status premium no banco de dados.
  // Exemplo esperado:
  // UPDATE users SET premium = ?, premium_provider = ?, premium_updated_at = NOW() WHERE id = ?
  // ou gravar em uma tabela subscriptions para historico completo.
  return {
    userId,
    premium: Boolean(premium),
    source,
    persisted: false,
    note: "Mock only. Premium status is not persisted in the database yet.",
  };
}

function handlePaymentWebhook({ payload }) {
  const event = getProvider().parseWebhookEvent(payload);

  // Futuro: webhooks devem ser idempotentes.
  // Salve o event.id do provedor para evitar processar a mesma notificacao duas vezes.
  if (!event.userId) {
    return {
      received: true,
      ignored: true,
      reason: "Webhook mock without userId.",
      event,
    };
  }

  const premiumStatus = savePremiumStatus({
    userId: event.userId,
    premium: event.premium,
    source: event.provider,
  });

  return {
    received: true,
    ignored: false,
    event,
    premiumStatus,
  };
}

module.exports = {
  createPremiumCheckout,
  validatePremiumSubscription,
  savePremiumStatus,
  handlePaymentWebhook,
};
