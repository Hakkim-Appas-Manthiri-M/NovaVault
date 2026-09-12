const mongoose = require("mongoose");

const Order = require("../models/Order");
const Game = require("../models/Game");
const GameOwnership = require("../models/GameOwnership");

// ==========================================
// CREATE ORDER
// ==========================================
const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    // A NovaVault account can own a game only once.
    // Prevent duplicate games inside the same order.
    const gameIds = items.map((item) => item.game);
    const uniqueGameIds = [...new Set(gameIds)];

    if (uniqueGameIds.length !== gameIds.length) {
      return res.status(400).json({
        message: "Duplicate games are not allowed in an order.",
      });
    }

    // Validate MongoDB ObjectIds before querying.
    const invalidGameId = uniqueGameIds.find(
      (gameId) => !mongoose.Types.ObjectId.isValid(gameId),
    );

    if (invalidGameId) {
      return res.status(400).json({
        message: "One or more game IDs are invalid.",
      });
    }

    // Always calculate prices from the database.
    // Never trust prices sent by the client.
    const games = await Game.find({
      _id: { $in: uniqueGameIds },
    }).lean();

    if (games.length !== uniqueGameIds.length) {
      return res.status(400).json({
        message: "One or more games could not be found.",
      });
    }

    // Prevent purchasing games already owned by this user.
    const existingOwnerships = await GameOwnership.find({
      user: req.user.userId,
      game: { $in: uniqueGameIds },
    })
      .select("game")
      .lean();

    if (existingOwnerships.length > 0) {
      const ownedGameIds = new Set(
        existingOwnerships.map((ownership) =>
          ownership.game.toString(),
        ),
      );

      const ownedGames = games.filter((game) =>
        ownedGameIds.has(game._id.toString()),
      );

      return res.status(409).json({
        message:
          ownedGames.length === 1
            ? `${ownedGames[0].title} is already in your library.`
            : "One or more selected games are already in your library.",
        ownedGameIds: ownedGames.map((game) =>
          game._id.toString(),
        ),
      });
    }

    const gameMap = new Map(
      games.map((game) => [game._id.toString(), game]),
    );

    let subtotal = 0;
    let discount = 0;

    const orderItems = [];

    for (const item of items) {
      // Each game represents one digital ownership.
      // Multiple copies of the same digital game are not allowed.
      const quantity = Number(item.quantity);

      if (quantity !== 1) {
        return res.status(400).json({
          message:
            "Each game can only be purchased once per NovaVault account.",
        });
      }

      const game = gameMap.get(item.game.toString());

      if (!game) {
        return res.status(400).json({
          message:
            "One or more selected games could not be found.",
        });
      }

      const price = Number(game.price || 0);
      const originalPrice = Number(game.originalPrice || 0);

      const itemSubtotal = price;

      const itemOriginalSubtotal =
        originalPrice > price ? originalPrice : itemSubtotal;

      subtotal += itemSubtotal;

      discount += Math.max(
        0,
        itemOriginalSubtotal - itemSubtotal,
      );

      orderItems.push({
        game: game._id,
        title: game.title,
        slug: game.slug,
        image: game.portraitImage || game.image,
        price,
        originalPrice,
        discount: Number(game.discount || 0),
        quantity: 1,
        subtotal: itemSubtotal,
      });
    }

    // Round money values to two decimal places.
    subtotal = Number(subtotal.toFixed(2));
    discount = Number(discount.toFixed(2));

    const total = subtotal;

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      subtotal,
      discount,
      total,
      currency: "INR",
      status: "pending",
      paymentStatus: "pending",
      paymentProvider: "none",
    });

    return res.status(201).json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET CURRENT USER ORDERS
// ==========================================
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ONE CURRENT USER ORDER
// ==========================================
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};