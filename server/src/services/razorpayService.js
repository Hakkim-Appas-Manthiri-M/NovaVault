const Razorpay = require("razorpay");

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error(
    "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured.",
  );
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

module.exports = razorpay;