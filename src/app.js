// src/app.js
const express = require("express");
const inventoryRoutes = require("./routes/inventory.routes");
const checkoutRoutes = require("./routes/checkout.routes"); 
// const debugRoutes = require("./routes/debug.routes");

const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});




// app.use("/debug", debugRoutes);




app.use("/checkout", checkoutRoutes);


app.use("/inventory", inventoryRoutes);

module.exports = app;
