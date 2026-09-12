const mongoose = require("mongoose");
const crypto = require("crypto");

const Order = require("../models/Order");
const razorpay = require("../services/razorpayService");

// CREATE RAZORPAY ORDER
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This order has already been paid.",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be paid.",
      });
    }

    const amount = Number(order.total);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Order total must be greater than zero.",
      });
    }

    // Razorpay expects the amount in the smallest currency unit.
    // INR 1 = 100 paise.
    const amountInPaise = Math.round(amount * 100);

    // Prevent creating another Razorpay order if one
    // has already been created for this NovaVault order.
    if (order.transactionId) {
      return res.status(200).json({
        message: "Razorpay order already exists.",
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: order.transactionId,
        amount: amountInPaise,
        currency: order.currency,
        novaVaultOrderId: order._id,
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: order.currency || "INR",
      receipt: `nv_${order._id.toString().slice(-24)}`,
      notes: {
        novaVaultOrderId: order._id.toString(),
        userId: req.user.userId.toString(),
      },
    });

    order.paymentProvider = "razorpay";
    order.transactionId = razorpayOrder.id;
    order.paymentStatus = "pending";

    await order.save();

    return res.status(201).json({
      message: "Razorpay order created successfully.",
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      novaVaultOrderId: order._id,
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY RAZORPAY PAYMENT
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      novaVaultOrderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (
      !novaVaultOrderId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(novaVaultOrderId)) {
      return res.status(400).json({
        message: "Invalid NovaVault order ID.",
      });
    }

    // Find the NovaVault order belonging to the authenticated user.
    const order = await Order.findOne({
      _id: novaVaultOrderId,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // Already paid = idempotent success response.
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        message: "Payment is already verified.",
        order,
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be verified.",
      });
    }

    // The Razorpay order ID must match the one created by our server.
    if (
      !order.transactionId ||
      order.transactionId !== razorpay_order_id
    ) {
      return res.status(400).json({
        message: "Razorpay order does not match the NovaVault order.",
      });
    }

    // Generate the expected signature on the server.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.transactionId}|${razorpay_payment_id}`)
      .digest("hex");

    // Timing-safe comparison prevents subtle comparison attacks.
    const signaturesMatch =
      generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature),
      );

    if (!signaturesMatch) {
      return res.status(400).json({
        message: "Payment signature verification failed.",
      });
    }

    // Fetch the payment directly from Razorpay.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id,
    );

    // Make sure Razorpay reports the same order.
    if (payment.order_id !== order.transactionId) {
      return res.status(400).json({
        message: "Razorpay payment does not match the order.",
      });
    }

    // Our current checkout is configured for INR.
    if (payment.currency !== order.currency) {
      return res.status(400).json({
        message: "Payment currency does not match the order.",
      });
    }

    // Confirm the amount matches the server-side order total.
    const expectedAmount = Math.round(Number(order.total) * 100);

    if (Number(payment.amount) !== expectedAmount) {
      return res.status(400).json({
        message: "Payment amount does not match the order total.",
      });
    }

    // Razorpay's captured status confirms the payment was captured.
    if (payment.status !== "captured") {
      return res.status(400).json({
        message: `Payment is not captured. Current status: ${payment.status}.`,
      });
    }

    // Payment is now verified.
    order.paymentProvider = "razorpay";
    order.paymentStatus = "paid";
    order.paymentId = razorpay_payment_id;
    order.status = "completed";
    order.paidAt = new Date();

    await order.save();

    return res.status(200).json({
      message: "Payment verified successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};