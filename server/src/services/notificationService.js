const Notification = require("../models/Notification");

const createGiftNotification = async ({
  recipientId,
  senderId,
  gameId,
  giftId,
  senderName,
  gameTitle,
}) => {
  if (!recipientId) {
    throw new Error("Notification recipient is required.");
  }

  if (!senderId) {
    throw new Error("Notification sender is required.");
  }

  if (!gameId) {
    throw new Error("Notification game is required.");
  }

  if (!giftId) {
    throw new Error("Gift ID is required.");
  }

  const senderDisplayName =
    senderName?.trim() || "A NovaVault user";

  const title = "You received a gift";

  const message = `${senderDisplayName} sent you ${gameTitle}.`;

  return Notification.create({
    recipient: recipientId,
    type: "gift_received",
    title,
    message,
    gift: giftId,
    game: gameId,
    sender: senderId,
    read: false,
  });
};

module.exports = {
  createGiftNotification,
};