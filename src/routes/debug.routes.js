const express = require("express");
const router = express.Router();
const redisClient = require("../config/redis");
const { inventoryKey } = require("../utils/redisKeys");

// Seed inventory
router.post("/seed", async (req, res) => {
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
});

// Reset all data (optional)
router.post("/reset", async (req, res) => {
  await redisClient.flushDb();
  res.json({ message: "Redis cleared" });
});

module.exports = router;
