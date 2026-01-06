// src/server.js
require("dotenv").config();

const app = require("./app");
const redisClient = require("./config/redis");
const startReservationCleanupJob = require("./jobs/reservationCleanup.job");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {

    //  Connect to Redis first
    await redisClient.connect();

    //  Start background cleanup job
    startReservationCleanupJob();


    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
