const mongoose = require("mongoose");

const gameGiftSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      index: true,
    },

    // The order through which the sender originally acquired the game.
    sourceOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "expired",
      ],
      default: "pending",
      index: true,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * Prevent multiple active gifts for the same
 * sender → recipient → game combination.
 *
 * This is handled at the application level because
 * MongoDB partial indexes are more appropriate here
 * than a normal unique index across all historical gifts.
 */
gameGiftSchema.index(
  {
    sender: 1,
    recipient: 1,
    game: 1,
    status: 1,
  },
  {
    name: "gift_sender_recipient_game_status",
  },
);

module.exports = mongoose.model("GameGift", gameGiftSchema);