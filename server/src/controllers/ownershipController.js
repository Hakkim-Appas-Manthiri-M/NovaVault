const GameOwnership = require("../models/GameOwnership");

const getMyLibrary = async (req, res, next) => {
  try {
    const ownerships = await GameOwnership.find({
      user: req.user.userId,
    })
      .populate("game")
      .sort({ acquiredAt: -1 })
      .lean();

    const games = ownerships
      .filter((ownership) => ownership.game)
      .map((ownership) => ({
        ...ownership.game,
        acquiredAt: ownership.acquiredAt,
        ownershipId: ownership._id,
        orderId: ownership.order,
      }));

    return res.status(200).json({
      success: true,
      games,
      count: games.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyLibrary,
};