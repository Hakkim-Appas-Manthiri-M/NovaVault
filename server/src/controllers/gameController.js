const mongoose = require("mongoose");
const Game = require("../models/Game");

async function createGame(req, res, next) {
  try {
    const game = await Game.create(req.body);

    res.status(201).json({
      success: true,
      message: "Game created successfully",
      game,
    });
  } catch (error) {
    next(error);
  }
}

async function getGames(req, res, next) {
  try {
    const {
      search,
      genre,
      featured,
      trending,
      newRelease,
      sort = "newest",
    } = req.query;

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      50
    );

    const skip = (page - 1) * limit;

    const filter = {};

    if (search?.trim()) {
      const searchTerm = search.trim();

      filter.$or = [
        {
          title: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          genre: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          developer: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          publisher: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    if (genre?.trim()) {
      filter.genre = {
        $regex: `^${genre.trim()}$`,
        $options: "i",
      };
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (trending === "true") {
      filter.trending = true;
    }

    if (newRelease === "true") {
      filter.newRelease = true;
    }

    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "price-low":
        sortOption = { price: 1 };
        break;

      case "price-high":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const [games, totalGames] = await Promise.all([
      Game.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit),

      Game.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalGames / limit);

    res.status(200).json({
      success: true,
      count: games.length,
      pagination: {
        page,
        limit,
        totalGames,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      games,
    });
  } catch (error) {
    next(error);
  }
}

async function getGameById(req, res, next) {
  try {
    const { id } = req.params;

    let game = null;

    // First try MongoDB ObjectId
    if (mongoose.isValidObjectId(id)) {
      game = await Game.findById(id);
    }

    // If not found, try the game slug
    if (!game) {
      game = await Game.findOne({ slug: id });
    }

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      game,
    });
  } catch (error) {
    next(error);
  }
}

async function updateGame(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID",
      });
    }

    const game = await Game.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Game updated successfully",
      game,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteGame(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID",
      });
    }

    const game = await Game.findByIdAndDelete(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
};