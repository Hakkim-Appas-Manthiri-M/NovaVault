const express = require("express");

const {
  register,
  login,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
  googleLogin,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  verifyEmailValidation,
  resendOtpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../middleware/authValidation");

const validateRequest = require("../middleware/validationMiddleware");

const {
  protect,
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
  "/verify-email",
  verifyEmailValidation,
  validateRequest,
  verifyEmail
);

router.post(
  "/resend-otp",
  resendOtpValidation,
  validateRequest,
  resendOtp
);

router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validateRequest,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPasswordValidation,
  validateRequest,
  resetPassword
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