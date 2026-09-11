const mongoose = require("mongoose");

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

module.exports = {
  createRazorpayOrder,
};