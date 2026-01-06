// src/utils/redisKeys.js

module.exports = {
  inventoryKey: (sku) => `inventory:${sku}`,
  reservationKey: (reservationId) => `reservation:${reservationId}`,
  idempotencyKey: (scope, key) => `idem:${scope}:${key}`,

};
