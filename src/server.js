// src/server.js
require("dotenv").config();

const app = require("./app");
const redisClient = require("./config/redis");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await redisClient.connect();
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
