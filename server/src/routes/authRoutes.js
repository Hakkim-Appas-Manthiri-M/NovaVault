const express = require("express");

const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/authValidation");

const validateRequest = require("../middleware/validationMiddleware");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidation,
  validateRequest,
  login
);

router.post("/logout", logout);

router.get("/me", protect, getCurrentUser);

module.exports = router;