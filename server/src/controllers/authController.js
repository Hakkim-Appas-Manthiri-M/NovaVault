const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
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
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please log in.",
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    return res.status(200).json({
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
        message: "Your Google email address is not verified",
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
  login,
  googleLogin,
  logout,
  getCurrentUser,
};