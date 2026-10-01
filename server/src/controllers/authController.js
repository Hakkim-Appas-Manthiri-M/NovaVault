const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/sendEmail");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
);

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("+password +otp +otpExpires");

    /*
     * Existing verified account
     */
    if (existingUser && existingUser.emailVerified === true) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please log in.",
      });
    }

    /*
     * Existing but unverified account
     *
     * Instead of creating another account,
     * update the existing account and send
     * a fresh verification OTP.
     */
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = password;

      const otp = crypto
        .randomInt(100000, 999999)
        .toString();

      existingUser.otp = otp;
      existingUser.otpExpires = new Date(
        Date.now() + 10 * 60 * 1000,
      );

      await existingUser.save();

      let emailSent = true;

      try {
        await sendVerificationEmail(
          existingUser.name,
          existingUser.email,
          otp,
        );
      } catch (emailError) {
        emailSent = false;

        console.error(
          "REGISTRATION OTP EMAIL ERROR:",
          emailError.message,
        );
      }

      return res.status(200).json({
        success: true,
        message: emailSent
          ? "Your account isn't verified yet. We've sent you a new verification code."
          : "Account found, but we couldn't send the verification code. Please try again.",
        emailSent,
        userId: existingUser._id,
      });
    }

    /*
     * New account
     */
    const otp = crypto
      .randomInt(100000, 999999)
      .toString();

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      emailVerified: false,
      otp,
      otpExpires,
    });

    let emailSent = true;

    try {
      await sendVerificationEmail(
        user.name,
        user.email,
        otp,
      );
    } catch (emailError) {
      emailSent = false;

      console.error(
        "REGISTRATION OTP EMAIL ERROR:",
        emailError.message,
      );
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Verification OTP sent to your email."
        : "Account created, but we couldn't send the verification email. Please try again.",
      emailSent,
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please log in.",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message:
          "No verification code found. Please request a new code.",
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired. Please request a new code.",
      });
    }

    if (user.otp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
}


async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+otp +otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please log in.",
      });
    }

    const otp = crypto
      .randomInt(100000, 999999)
      .toString();

    user.otp = otp;
    user.otpExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    await user.save();

    try {
      await sendVerificationEmail(
        user.name,
        user.email,
        otp,
      );
    } catch (emailError) {
      console.error(
        "RESEND OTP EMAIL ERROR:",
        emailError.message,
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification code. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    /*
     * Don't reveal whether an email exists.
     * This prevents account enumeration.
     */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    /*
     * Generate a secure random token.
     *
     * The raw token is sent by email.
     * Only its SHA-256 hash is stored in MongoDB.
     */
    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;

    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000,
    );

    await user.save();

    const clientUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    const resetUrl =
      `${clientUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(
        user.name,
        user.email,
        resetUrl,
      );
    } catch (emailError) {
      /*
       * If email delivery fails, invalidate the token.
       */
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      console.error(
        "PASSWORD RESET EMAIL ERROR:",
        emailError.message,
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send password reset email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token and new password are required.",
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    user.password = password;

    /*
     * Invalidate the reset token immediately.
     * This makes the link single-use.
     */
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.emailVerified === false) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before signing in.",
      });
    }

    const isPasswordValid =
      await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "Google authentication is not configured",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google authentication response",
      });
    }

    const {
      sub: googleId,
      email,
      email_verified: emailVerified,
      name,
      picture,
    } = payload;

    if (!googleId || !email) {
      return res.status(401).json({
        success: false,
        message: "Google account information is incomplete",
      });
    }

    if (!emailVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Your Google email address is not verified",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      googleId,
    });

    if (user) {
      const token = generateToken(user._id);

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        user: formatUser(user),
      });
    }

    user = await User.findOne({
      email: normalizedEmail,
    });

    if (user) {
      
      user.googleId = googleId;
      user.emailVerified = true;

      if (!user.avatar && picture) {
        user.avatar = picture;
      }

      await user.save();

      const token = generateToken(user._id);

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        message: "Google account linked successfully",
        user: formatUser(user),
      });
    }

    user = await User.create({
      name: name || "NovaVault User",
      email: normalizedEmail,
      password: null,
      googleId,
      avatar: picture || "",
      emailVerified: true,
    });

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Google account created successfully",
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Google login error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This Google account is already linked to another NovaVault account.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
}

function logout(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

async function getCurrentUser(req, res, next) {
  if (!req.user) {
    return res.status(200).json({
      success: true,
      user: null,
    });
  }

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
  logout,
  getCurrentUser,
};