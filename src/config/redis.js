// Lua script →
// “I give Redis a recipe and Redis finishes it without interruption”

// src/config/redis.js
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error(" Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log(" Redis connected");
});

module.exports = redisClient;
