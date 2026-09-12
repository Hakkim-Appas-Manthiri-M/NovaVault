require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const apiRoutes = require("./routes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const { apiLimiter } = require("./middleware/securityMiddleware");

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(
  "/api/payments/razorpay/webhook",
  express.raw({ type: "application/json" }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/api", apiLimiter);

app.use("/api", apiRoutes);

app.use(notFound);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NovaVault server running on port ${PORT}`);
  });
};

startServer();