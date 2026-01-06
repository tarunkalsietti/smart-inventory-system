const redisClient = require("../config/redis");
const { inventoryKey } = require("../utils/redisKeys");

exports.seedInventory = async (req, res) => {
  const { sku, quantity } = req.body;

  if (!sku || quantity == null) {
    return res.status(400).json({ error: "sku and quantity required" });
  }

  await redisClient.set(inventoryKey(sku), quantity);

  res.json({
    message: "Inventory seeded",
    sku,
    quantity,
  });
};

exports.getInventory = async (req, res) => {
  const { sku } = req.params;
  const quantity = await redisClient.get(inventoryKey(sku));

  res.json({
    sku,
    available: Number(quantity || 0),
  });
};
