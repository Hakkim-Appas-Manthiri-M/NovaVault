const mongoose = require("mongoose");

function getHealth(_req, res) {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "NovaVault API is healthy"
      : "NovaVault API is running but database is unavailable",
    services: {
      api: "up",
      database: databaseConnected ? "up" : "down",
    },
  });
}

module.exports = {
  getHealth,
};