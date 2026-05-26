const { PREMIUM_PLAN } = require("./paymentConfig");

function createCheckoutSession({ userId, planId, successUrl, cancelUrl }) {
  // Futuro Stripe: chamar stripe.checkout.sessions.create(...) aqui.
  // Futuro Mercado Pago: criar preference via SDK do Mercado Pago aqui.
  return {
    provider: "mock",
    checkoutId: `mock_checkout_${Date.now()}`,
    planId: planId || PREMIUM_PLAN.id,
    userId,
    checkoutUrl: successUrl || "/monetizacao?checkout=mock-success",
    cancelUrl: cancelUrl || "/monetizacao?checkout=mock-cancel",
    status: "created",
  };
}

function validateSubscription({ userId }) {
  // Futuro: consultar Stripe/Mercado Pago e confirmar status ativo da assinatura.
  // Nunca confie apenas no frontend para liberar Premium em producao.
  return {
    provider: "mock",
    userId,
    active: false,
    status: "mock_not_subscribed",
  };
}

function parseWebhookEvent(payload) {
  // Futuro Stripe: validar assinatura com stripe.webhooks.constructEvent(rawBody, signature, secret).
  // Futuro Mercado Pago: validar headers/notificacoes e consultar o pagamento na API oficial.
  return {
    provider: "mock",
    type: payload?.type || "mock.subscription.updated",
    userId: payload?.userId || null,
    premium: Boolean(payload?.premium),
    raw: payload,
  };
}

module.exports = {
  createCheckoutSession,
  validateSubscription,
  parseWebhookEvent,
};
