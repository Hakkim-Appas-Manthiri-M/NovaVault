const mongoose = require("mongoose");

const gameOwnershipSchema = new mongoose.Schema(
  {
    user: {
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

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    acquiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

gameOwnershipSchema.index(
  { user: 1, game: 1 },
  { unique: true },
);

module.exports = mongoose.model(
  "GameOwnership",
  gameOwnershipSchema,
);