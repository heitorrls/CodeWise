const PAYMENT_PROVIDERS = {
  MOCK: "mock",
  STRIPE: "stripe",
  MERCADO_PAGO: "mercado_pago",
};

const PREMIUM_PLAN = {
  id: "codewise_premium_monthly",
  name: "CodeWise Premium",
  priceInCents: 1490,
  currency: "BRL",
  interval: "month",
};

module.exports = {
  PAYMENT_PROVIDERS,
  PREMIUM_PLAN,
  activeProvider: process.env.PAYMENT_PROVIDER || PAYMENT_PROVIDERS.MOCK,
};
