const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  completeDemoPayment,
} = require("../controllers/demoPaymentController");

const router = express.Router();

// All demo payment actions require authentication.
router.use(protect);

router.post("/complete", completeDemoPayment);

module.exports = router;