const crypto = require("crypto");

const Order = require("../models/Order");
const WebhookEvent = require("../models/WebhookEvent");

const verifyWebhookSignature = (rawBody, signature, secret) => {
  if (!rawBody || !signature || !secret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature),
  );
};

const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"];

    if (!webhookSecret) {
      return res.status(500).json({
        message: "Razorpay webhook secret is not configured.",
      });
    }

    if (!signature) {
      return res.status(400).json({
        message: "Razorpay webhook signature is missing.",
      });
    }

    if (!eventId) {
      return res.status(400).json({
        message: "Razorpay webhook event ID is missing.",
      });
    }

    const rawBody = req.body;

    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid Razorpay webhook signature.",
      });
    }

    const payload = JSON.parse(rawBody.toString());

    const event = payload.event;

    if (!event) {
      return res.status(400).json({
        message: "Webhook event is missing.",
      });
    }

    const existingEvent = await WebhookEvent.findOne({
      eventId,
    });

    if (existingEvent) {
      console.log(`Razorpay webhook already processed: ${eventId}`);

      return res.status(200).json({
        success: true,
        message: "Webhook event already processed.",
      });
    }

    console.log(`Razorpay webhook received: ${event} (${eventId})`);

    if (event === "payment.captured") {
      await handlePaymentCaptured(payload);
    } else if (event === "payment.failed") {
      await handlePaymentFailed(payload);
    } else if (event === "order.paid") {
      await handleOrderPaid(payload);
    }

    try {
      await WebhookEvent.create({
        eventId,
        event,
      });
    } catch (error) {
      if (error?.code === 11000) {
        console.log(`Razorpay webhook already recorded: ${eventId}`);

        return res.status(200).json({
          success: true,
          message: "Webhook event already processed.",
        });
      }

      throw error;
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const handlePaymentCaptured = async (payload) => {
  const payment = payload?.payload?.payment?.entity;

  if (!payment) {
    return;
  }

  const razorpayOrderId = payment.order_id;
  const razorpayPaymentId = payment.id;

  if (!razorpayOrderId || !razorpayPaymentId) {
    return;
  }

  const order = await Order.findOne({
    transactionId: razorpayOrderId,
  });

  if (!order) {
    console.warn(
      `NovaVault order not found for Razorpay order ${razorpayOrderId}`,
    );
    return;
  }

  if (order.paymentStatus === "paid") {
    return;
  }

  const expectedAmount = Math.round(Number(order.total) * 100);

  if (Number(payment.amount) !== expectedAmount) {
    console.warn(`Payment amount mismatch for NovaVault order ${order._id}`);
    return;
  }

  if (payment.currency !== order.currency) {
    console.warn(`Payment currency mismatch for NovaVault order ${order._id}`);
    return;
  }

  if (payment.status !== "captured") {
    return;
  }

  order.paymentProvider = "razorpay";
  order.paymentStatus = "paid";
  order.paymentId = razorpayPaymentId;
  order.status = "completed";
  order.paidAt = order.paidAt || new Date();

  await order.save();

  console.log(`NovaVault order ${order._id} marked as paid via webhook.`);
};

const handlePaymentFailed = async (payload) => {
  const payment = payload?.payload?.payment?.entity;

  if (!payment) {
    return;
  }

  const razorpayOrderId = payment.order_id;

  if (!razorpayOrderId) {
    return;
  }

  const order = await Order.findOne({
    transactionId: razorpayOrderId,
  });

  if (!order) {
    return;
  }

  if (order.paymentStatus === "paid") {
    return;
  }

  order.paymentProvider = "razorpay";
  order.paymentStatus = "failed";

  await order.save();

  console.log(`NovaVault order ${order._id} payment marked as failed.`);
};

const handleOrderPaid = async (payload) => {
  const razorpayOrder = payload?.payload?.order?.entity;

  if (!razorpayOrder) {
    return;
  }

  const razorpayOrderId = razorpayOrder.id;

  if (!razorpayOrderId) {
    return;
  }

  const order = await Order.findOne({
    transactionId: razorpayOrderId,
  });

  if (!order) {
    return;
  }

  if (order.paymentStatus === "paid") {
    return;
  }

  order.paymentProvider = "razorpay";
  order.paymentStatus = "paid";
  order.status = "completed";
  order.paidAt = order.paidAt || new Date();

  await order.save();

  console.log(
    `NovaVault order ${order._id} marked paid from order.paid webhook.`,
  );
};

module.exports = {
  handleRazorpayWebhook,
};
