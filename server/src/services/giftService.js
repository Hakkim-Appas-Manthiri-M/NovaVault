const mongoose = require("mongoose");

const User = require("../models/User");
const Game = require("../models/Game");
const GameGift = require("../models/GameGift");
const GameOwnership = require("../models/GameOwnership");

const { createGiftNotification } = require("./notificationService");

const createGameGift = async ({ senderId, recipientIdentifier, gameId }) => {
  if (!senderId) {
    throw new Error("Sender is required.");
  }

  if (!recipientIdentifier) {
    throw new Error("Recipient is required.");
  }

  if (!gameId) {
    throw new Error("Game is required.");
  }

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    throw new Error("Invalid sender.");
  }

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    throw new Error("Invalid game.");
  }

  const normalizedRecipient = recipientIdentifier.trim().toLowerCase();

  /*
   * Find sender
   */
  const sender = await User.findById(senderId).select("_id email name");

  if (!sender) {
    throw new Error("Sender account not found.");
  }

  /*
   * Find recipient by registered email.
   *
   * A dedicated username field does not currently exist
   * in the verified account data, so email is the reliable
   * identifier for this first implementation.
   */
  const recipient = await User.findOne({
    email: normalizedRecipient,
  }).select("_id email name");

  if (!recipient) {
    throw new Error("No NovaVault account was found for that email.");
  }

  /*
   * Prevent gifting to yourself
   */
  if (sender._id.equals(recipient._id)) {
    throw new Error("You cannot gift a game to yourself.");
  }

  /*
   * Verify game exists
   */
  const game = await Game.findById(gameId).select(
    "_id title slug image portraitImage price originalPrice discount",
  );

  if (!game) {
    throw new Error("Game not found.");
  }

  /*
   * Verify sender owns the game.
   *
   * This is the most important authorization check.
   */
  const senderOwnership = await GameOwnership.findOne({
    user: sender._id,
    game: game._id,
  }).select("_id order");

  if (!senderOwnership) {
    throw new Error("You must own this game before gifting it.");
  }

  /*
   * Recipient must not already own the game.
   */
  const recipientOwnership = await GameOwnership.exists({
    user: recipient._id,
    game: game._id,
  });

  if (recipientOwnership) {
    throw new Error("The recipient already owns this game.");
  }

  /*
   * Prevent duplicate pending gifts.
   */
  const existingPendingGift = await GameGift.findOne({
    sender: sender._id,
    recipient: recipient._id,
    game: game._id,
    status: "pending",
  }).select("_id");

  if (existingPendingGift) {
    throw new Error(
      "A pending gift for this game has already been sent to this recipient.",
    );
  }

  /*
   * Create the pending gift.
   *
   * IMPORTANT:
   * No ownership is granted here.
   * The recipient only receives ownership after
   * accepting the gift in the later step.
   */
  const gift = await GameGift.create({
    sender: sender._id,
    recipient: recipient._id,
    game: game._id,
    sourceOrder: senderOwnership.order || null,
    status: "pending",
    sentAt: new Date(),
  });

  await createGiftNotification({
    recipientId: recipient._id,
    senderId: sender._id,
    gameId: game._id,
    giftId: gift._id,
    senderName: sender.name,
    gameTitle: game.title,
  });

  /*
   * Return useful populated data to the controller.
   */
  return GameGift.findById(gift._id)
    .populate("sender", "_id name email")
    .populate("recipient", "_id name email")
    .populate(
      "game",
      "_id title slug image portraitImage price originalPrice discount",
    );
};

module.exports = {
  createGameGift,
};
