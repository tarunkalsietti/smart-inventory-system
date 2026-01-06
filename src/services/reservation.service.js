// create reservation

// confirm reservation

// handle expiry

const { reserveInventory } = require("../repositories/reservation.repo");
const { inventoryKey, reservationKey } = require("../utils/redisKeys");
const crypto = require("crypto");

const RESERVATION_TTL = 300; // 5 minutes

async function createReservation({ sku, userId }) {
  const reservationId = crypto.randomUUID();

  const reservationData = JSON.stringify({
    reservationId,
    sku,
    userId,
    status: "ACTIVE",
    expiresAt: Date.now() + RESERVATION_TTL * 1000,
  });

  const result = await reserveInventory({
    inventoryKey: inventoryKey(sku),
    reservationKey: reservationKey(reservationId),
    reservationData,
    ttlSeconds: RESERVATION_TTL,
  });

  return {
    reservationId,
    status: result,
    expiresIn: RESERVATION_TTL,
  };
}


async function confirmReservation(reservationId) {
  const key = reservationKey(reservationId);
  const data = await redisClient.get(key);

  if (!data) {
    return { status: "EXPIRED_OR_INVALID" };
  }

  const reservation = JSON.parse(data);

  if (reservation.status !== "ACTIVE") {
    return { status: reservation.status };
  }

  reservation.status = "CONFIRMED";

  await redisClient.set(key, JSON.stringify(reservation));
  await redisClient.persist(key); // remove TTL (optional but clean)

  return { status: "CONFIRMED" };
}


async function cancelReservation(reservationId) {
  const key = reservationKey(reservationId);
  const data = await redisClient.get(key);

  if (!data) {
    return { status: "ALREADY_EXPIRED" };
  }

  const reservation = JSON.parse(data);

  if (reservation.status !== "ACTIVE") {
    return { status: reservation.status };
  }

  reservation.status = "CANCELLED";

  await redisClient.multi()
    .incr(inventoryKey(reservation.sku))
    .del(key)
    .exec();

  return { status: "CANCELLED" };
}

module.exports = {
  createReservation,
  confirmReservation,
  cancelReservation,
};
