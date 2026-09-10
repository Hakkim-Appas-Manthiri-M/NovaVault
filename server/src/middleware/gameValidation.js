const { body } = require("express-validator");

const gameValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Game title is required")
    .isLength({ max: 120 })
    .withMessage("Game title cannot exceed 120 characters"),

  body("genre")
    .trim()
    .notEmpty()
    .withMessage("Game genre is required")
    .isLength({ max: 50 })
    .withMessage("Game genre cannot exceed 50 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Game description is required"),

  body("subtitle")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Subtitle must be at most 200 characters."),

  body("price")
    .notEmpty()
    .withMessage("Game price is required")
    .isFloat({ min: 0 })
    .withMessage("Game price must be a positive number"),  

  body("originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be a non-negative number."),

  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100."),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),  

  body("reviews")
    .optional()
    .isString()
    .trim()
    .withMessage("Reviews must be a string."),

  body("accent")
    .optional()
    .isString()
    .trim()
    .withMessage("Accent must be a string."),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Game image is required"),

  body("mobileImage")
    .optional()
    .isString()
    .withMessage("Mobile image must be a string"),

  body("portraitImage")
    .optional()
    .isString()
    .withMessage("Portrait image must be a string"),

  body("platforms")
    .optional()
    .isArray()
    .withMessage("Platforms must be an array"),

  body("releaseDate")
    .optional()
    .isISO8601()
    .withMessage("Release date must be a valid date"),

  body("developer")
    .optional()
    .isString()
    .withMessage("Developer must be a string"),

  body("publisher")
    .optional()
    .isString()
    .withMessage("Publisher must be a string"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),

  body("trending")
    .optional()
    .isBoolean()
    .withMessage("Trending must be a boolean"),

  body("newRelease")
    .optional()
    .isBoolean()
    .withMessage("New release must be a boolean"),
];

module.exports = gameValidation;