const { createGameGift } = require("../services/giftService");

const createGift = async (req, res, next) => {
  try {
    const { recipient, gameId } = req.body;

    const gift = await createGameGift({
      senderId: req.user.userId,
      recipientIdentifier: recipient,
      gameId,
    });

    return res.status(201).json({
      success: true,
      message: "Gift sent successfully.",
      gift,
    });
  } catch (error) {
    const message = error.message || "Unable to send gift.";

    /*
     * Client/input/business-rule errors
     */
    const badRequestMessages = [
      "Sender is required.",
      "Recipient is required.",
      "Game is required.",
      "Invalid sender.",
      "Invalid game.",
      "You must own this game before gifting it.",
      "You cannot gift a game to yourself.",
    ];

    if (badRequestMessages.includes(message)) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    /*
     * Resource not found
     */
    const notFoundMessages = [
      "Sender account not found.",
      "No NovaVault account was found for that email.",
      "Game not found.",
    ];

    if (notFoundMessages.includes(message)) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    /*
     * Existing ownership / duplicate pending gift
     */
    if (
      message === "The recipient already owns this game." ||
      message ===
        "A pending gift for this game has already been sent to this recipient."
    ) {
      return res.status(409).json({
        success: false,
        message,
      });
    }

    next(error);
  }
};

module.exports = {
  createGift,
};