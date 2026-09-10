const express = require("express");

const {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
} = require("../controllers/gameController");

const gameValidation = require("../middleware/gameValidation");
const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", getGames);

router.get("/:id", getGameById);

router.post(
  "/",
  gameValidation,
  validateRequest,
  createGame
);

router.put("/:id", updateGame);

router.delete("/:id", deleteGame);

module.exports = router;