const express = require("express");

const healthRoutes = require("./healthRoutes");
const authRoutes = require("./authRoutes");
const gameRoutes = require("./gameRoutes");
const orderRoutes = require("./orderRoutes");
const demoPaymentRoutes = require("./demoPaymentRoutes");
const ownershipRoutes = require("./ownershipRoutes");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "NovaVault API",
  });
});

router.use("/health", healthRoutes);

router.use("/auth", authRoutes);

router.use("/games", gameRoutes);

router.use("/orders", orderRoutes);

router.use("/payments/demo", demoPaymentRoutes);

router.use("/ownership", ownershipRoutes);

module.exports = router;