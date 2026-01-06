const { createReservation } = require("../services/reservation.service");

exports.reserve = async (req, res, next) => {
  try {
    const { sku, userId } = req.body;

    if (!sku || !userId) {
      return res.status(400).json({ error: "sku and userId required" });
    }

    const result = await createReservation({ sku, userId });

    // ✅ FIX: correct OUT_OF_STOCK handling
    if (result.status === "OUT_OF_STOCK") {
      return res.status(409).json({ error: "Out of stock" });
    }

    // ✅ success case
    return res.json({
      reservationId: result.reservationId,
      expiresIn: result.expiresIn,
    });
  } catch (err) {
    next(err);
  }
};

