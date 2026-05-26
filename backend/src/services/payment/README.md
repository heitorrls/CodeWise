# Payment service

Camada preparada para integrar pagamentos sem acoplar o restante do sistema ao gateway.

## Estrutura

- `paymentConfig.js`: plano Premium, moeda, provedor ativo e IDs internos.
- `mockPaymentProvider.js`: provider simulado com a mesma interface esperada para Stripe ou Mercado Pago.
- `subscriptionService.js`: caso de uso da assinatura Premium, validacao e tratamento de webhooks.
- `index.js`: export publico da camada de payment.

## Pontos de integracao futura

- Checkout: substituir `mockPaymentProvider.createCheckoutSession` por `stripe.checkout.sessions.create` ou preference do Mercado Pago.
- Validacao de assinatura: substituir `validateSubscription` por consulta segura ao provider no backend.
- Status Premium: implementar persistencia em `savePremiumStatus`, preferencialmente em `users.premium` ou tabela `subscriptions`.
- Webhooks: implementar assinatura/verificacao do provider antes de processar eventos. Stripe exige raw body; Mercado Pago exige validar a notificacao consultando a API oficial.

Esta pasta nao executa pagamento real. Ela existe apenas para organizar a arquitetura e facilitar a integracao futura.
