const express = require("express");
const router = express.Router();

const debugController = require("../controllers/debug.controller");

router.post("/seed-inventory", debugController.seedInventory);
router.get("/inventory/:sku", debugController.getInventory);

module.exports = router;
