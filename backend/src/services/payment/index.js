const paymentConfig = require("./paymentConfig");
const subscriptionService = require("./subscriptionService");

module.exports = {
  paymentConfig,
  ...subscriptionService,
};
