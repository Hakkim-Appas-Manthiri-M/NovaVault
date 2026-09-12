const GameOwnership = require("../models/GameOwnership");

const grantOrderOwnership = async (order) => {
  if (!order) {
    throw new Error("Order is required.");
  }

  if (order.paymentStatus !== "paid") {
    throw new Error("Ownership can only be granted for paid orders.");
  }

  const userId = order.user;

  if (!userId) {
    throw new Error("Order user is required.");
  }

  const ownerships = [];

  for (const item of order.items) {
    if (!item.game) {
      continue;
    }

    try {
      const ownership = await GameOwnership.findOneAndUpdate(
        {
          user: userId,
          game: item.game,
        },
        {
          $setOnInsert: {
            user: userId,
            game: item.game,
            order: order._id,
            acquiredAt: new Date(),
          },
        },
        {
          new: true,
          upsert: true,
        },
      );

      ownerships.push(ownership);
    } catch (error) {
      if (error?.code === 11000) {
        const existingOwnership =
          await GameOwnership.findOne({
            user: userId,
            game: item.game,
          });

        if (existingOwnership) {
          ownerships.push(existingOwnership);
          continue;
        }
      }

      throw error;
    }
  }

  return ownerships;
};

const userOwnsGame = async (userId, gameId) => {
  if (!userId || !gameId) {
    return false;
  }

  const ownership = await GameOwnership.exists({
    user: userId,
    game: gameId,
  });

  return Boolean(ownership);
};

module.exports = {
  grantOrderOwnership,
  userOwnsGame,
};