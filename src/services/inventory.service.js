// check availability

// atomic reserve

// increment on cancel
const redisClient = require("../config/redis");
const { inventoryKey } = require("../utils/redisKeys");

async function getInventory(sku) {
  const value = await redisClient.get(inventoryKey(sku));
  return Number(value || 0);
}

module.exports = {
  getInventory,
};
