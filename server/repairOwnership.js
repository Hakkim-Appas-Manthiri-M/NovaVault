require("dotenv").config();

const connectDB = require("./src/config/db");
const Order = require("./src/models/Order");
const Game = require("./src/models/Game");
const GameOwnership = require("./src/models/GameOwnership");

const repairOwnership = async () => {
  try {
    await connectDB();

    console.log("Starting GameOwnership repair...");

    const ownerships = await GameOwnership.find({}).sort({ createdAt: 1 });

    let repaired = 0;
    let alreadyCorrect = 0;
    let duplicatesRemoved = 0;
    let skipped = 0;

    for (const ownership of ownerships) {
      const order = await Order.findById(ownership.order).lean();

      if (!order) {
        console.log(
          `⚠️ Order not found for ownership ${ownership._id}`,
        );
        skipped++;
        continue;
      }

      const orderItem = order.items.find(
        (item) =>
          item.game?.toString() === ownership.game?.toString(),
      );

      if (!orderItem || !orderItem.slug) {
        console.log(
          `⚠️ Game slug not found for ownership ${ownership._id}`,
        );
        skipped++;
        continue;
      }

      const currentGame = await Game.findOne({
        slug: orderItem.slug,
      });

      if (!currentGame) {
        console.log(
          `⚠️ Current game not found: ${orderItem.slug}`,
        );
        skipped++;
        continue;
      }

      if (
        ownership.game.toString() ===
        currentGame._id.toString()
      ) {
        alreadyCorrect++;
        continue;
      }

      const duplicate = await GameOwnership.findOne({
        user: ownership.user,
        game: currentGame._id,
        _id: { $ne: ownership._id },
      });

      if (duplicate) {
        await GameOwnership.findByIdAndDelete(ownership._id);

        console.log(
          `🗑️ Removed duplicate ownership: ${orderItem.title}`,
        );

        duplicatesRemoved++;
        continue;
      }

      ownership.game = currentGame._id;
      await ownership.save();

      console.log(`✅ Repaired: ${orderItem.title}`);

      repaired++;
    }

    console.log("");
    console.log("=================================");
    console.log("GameOwnership repair completed");
    console.log("=================================");
    console.log(`✅ Repaired: ${repaired}`);
    console.log(`✔️ Already correct: ${alreadyCorrect}`);
    console.log(`🗑️ Duplicates removed: ${duplicatesRemoved}`);
    console.log(`⚠️ Skipped: ${skipped}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Ownership repair failed:");
    console.error(error);
    process.exit(1);
  }
};

repairOwnership();