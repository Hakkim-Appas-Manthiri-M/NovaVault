const express = require("express");

const {
  handleRazorpayWebhook,
} = require("../controllers/webhookController");

const router = express.Router();

router.post("/razorpay/webhook", handleRazorpayWebhook);

module.exports = router;