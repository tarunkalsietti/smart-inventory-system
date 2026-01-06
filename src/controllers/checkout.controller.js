    const {
  confirmReservation,
  cancelReservation,
} = require("../services/reservation.service");

exports.confirm = async (req, res, next) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "reservationId required" });
    }

    const result = await confirmReservation(reservationId);

    if (result.status === "EXPIRED_OR_INVALID") {
      return res.status(410).json({ error: "Reservation expired" });
    }

    res.json({ status: result.status });
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "reservationId required" });
    }

    const result = await cancelReservation(reservationId);

    res.json({ status: result.status });
  } catch (err) {
    next(err);
  }
};
