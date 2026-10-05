const express = require("express");

const {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/authValidation");

const validateRequest = require("../middleware/validationMiddleware");

const {
  optionalAuth,
} = require("../middleware/authMiddleware");

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

router.post("/google", googleLogin);

router.post("/logout", logout);

router.get("/me", optionalAuth, getCurrentUser);

module.exports = router;