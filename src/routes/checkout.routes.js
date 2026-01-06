const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkout.controller");
const idempotency = require("../middlewares/idempotency.middleware");

router.post("/confirm", idempotency("confirm"), checkoutController.confirm);
router.post("/cancel", checkoutController.cancel);

module.exports = router;
