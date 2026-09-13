const { body } = require("express-validator");

const createGiftValidation = [
  body("recipient")
    .trim()
    .notEmpty()
    .withMessage("Recipient email is required.")
    .isEmail()
    .withMessage("Enter a valid recipient email address.")
    .normalizeEmail(),

  body("gameId")
    .trim()
    .notEmpty()
    .withMessage("Game ID is required.")
    .isMongoId()
    .withMessage("Invalid game ID."),
];

module.exports = {
  createGiftValidation,
};