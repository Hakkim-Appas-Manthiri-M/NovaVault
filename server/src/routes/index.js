const express = require("express");

const healthRoutes = require("./healthRoutes");
const authRoutes = require("./authRoutes");
const gameRoutes = require("./gameRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const webhookRoutes = require("./webhookRoutes");

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

router.use("/payments", paymentRoutes);

router.use("/payments", webhookRoutes);

module.exports = router;