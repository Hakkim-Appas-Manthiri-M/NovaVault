const mongoose = require("mongoose");

const Order = require("../models/Order");
const { grantOrderOwnership } = require("../services/ownershipService");

// ==========================================
// COMPLETE NOVAVAULT DEMO PAYMENT
// ==========================================
const completeDemoPayment = async (req, res, next) => {
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

    // Only allow the authenticated user to pay their own order.
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // Idempotent behavior:
    // If the order is already paid, don't create duplicate ownership.
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        message: "Order has already been paid.",
        order,
      });
    }

    // Only pending orders can be completed.
    if (order.paymentStatus !== "pending") {
      return res.status(409).json({
        message: "This order cannot be paid.",
      });
    }

    // ------------------------------------------
    // DEMO PAYMENT
    // ------------------------------------------
    // This is intentionally a simulated payment.
    // No real money or payment credentials are processed.
    const transactionId = `NV-DEMO-${Date.now()}-${order._id
      .toString()
      .slice(-6)
      .toUpperCase()}`;

    order.paymentStatus = "paid";
    order.paymentProvider = "demo";
    order.paymentId = transactionId;
    order.transactionId = transactionId;
    order.status = "completed";
    order.paidAt = new Date();

    await order.save();

    // Grant permanent ownership after successful payment.
    await grantOrderOwnership(order);

    return res.status(200).json({
      message: "Demo payment completed successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  completeDemoPayment,
};