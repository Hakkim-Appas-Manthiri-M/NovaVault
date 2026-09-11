const express = require("express");

const { createRazorpayOrder } = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/razorpay/order", createRazorpayOrder);

module.exports = router;