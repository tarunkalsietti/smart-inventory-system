const { createReservation } = require("../services/reservation.service");

exports.reserve = async (req, res, next) => {
  try {
    const { sku, userId } = req.body;

    if (!sku || !userId) {
      return res.status(400).json({ error: "sku and userId required" });
    }

    const result = await createReservation({ sku, userId });

    if (result.status?.err === "OUT_OF_STOCK") {
      return res.status(409).json({ error: "Out of stock" });
    }

    res.json({
      reservationId: result.reservationId,
      expiresIn: result.expiresIn,
    });
  } catch (err) {
    next(err);
  }
};
