const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validationMiddleware");
const { createGiftValidation } = require("../middleware/giftValidation");
const { createGift } = require("../controllers/giftController");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  createGiftValidation,
  validateRequest,
  createGift,
);

module.exports = router;