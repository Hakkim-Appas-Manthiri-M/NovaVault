const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["gift_received", "system"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    gift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameGift",
      default: null,
      index: true,
    },

    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      default: null,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  recipient: 1,
  read: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema,
);