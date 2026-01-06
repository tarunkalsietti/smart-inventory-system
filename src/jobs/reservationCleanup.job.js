// This job will:

// Run every 30 seconds

// Scan reservations

// Restore inventory for expired ones


const redisClient = require("../config/redis");
const { inventoryKey } = require("../utils/redisKeys");

const CLEANUP_INTERVAL_MS = 30 * 1000; // 30 seconds

async function cleanupExpiredReservations() {
  try {
    let cursor = "0";

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: "reservation:*",
        COUNT: 100,
      });

      cursor = reply.cursor;
      const keys = reply.keys;

      for (const key of keys) {
        const data = await redisClient.get(key);
        if (!data) continue;

        const reservation = JSON.parse(data);

        if (
          reservation.status === "ACTIVE" &&
          Date.now() > reservation.expiresAt
        ) {
          // Restore inventory
          await redisClient.incr(inventoryKey(reservation.sku));

          // Mark reservation expired
          reservation.status = "EXPIRED";
          await redisClient.set(key, JSON.stringify(reservation));

          // Optional: set short TTL so it disappears later
          await redisClient.expire(key, 60);
        }
      }
    } while (cursor !== "0");
  } catch (err) {
    console.error("Reservation cleanup error:", err);
  }
}

function startReservationCleanupJob() {
  setInterval(cleanupExpiredReservations, CLEANUP_INTERVAL_MS);
}

module.exports = startReservationCleanupJob;
