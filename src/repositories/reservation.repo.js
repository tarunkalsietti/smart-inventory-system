// src/repositories/reservation.repo.js
const fs = require("fs");
const path = require("path");
const redisClient = require("../config/redis");

const luaScript = fs.readFileSync(
  path.join(__dirname, "../utils/reserve.lua"),
  "utf8"
);

async function reserveInventory({
  inventoryKey,
  reservationKey,
  reservationData,
  ttlSeconds,
}) {
  return redisClient.eval(luaScript, {
    keys: [inventoryKey, reservationKey],
    arguments: [reservationData, ttlSeconds],
  });
}

module.exports = {
  reserveInventory,
};
