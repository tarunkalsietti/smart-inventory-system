const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");
const idempotency = require("../middlewares/idempotency.middleware");

router.get("/:sku", inventoryController.getInventory);

router.post(
  "/reserve",
  idempotency("reserve"),
  inventoryController.reserve
);

module.exports = router;
