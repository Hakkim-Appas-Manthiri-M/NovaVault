require("dotenv").config();

const connectDB = require("./config/db");
const Game = require("./models/Game");
const gameSeedData = require("./data/gameSeedData");

const seedGames = async () => {
  try {
    await connectDB();

    console.log("Updating game seed data...");

    let created = 0;
    let updated = 0;

    for (const gameData of gameSeedData) {
      const existingGame = await Game.findOne({
        slug: gameData.slug,
      });

      if (existingGame) {
        await Game.findByIdAndUpdate(
          existingGame._id,
          gameData,
          {
            returnDocument: "after",
            runValidators: true,
          },
        );

        updated++;
      } else {
        await Game.create(gameData);
        created++;
      }
    }

    console.log(
      `✅ Game seed completed. Updated: ${updated}, Created: ${created}`,
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Game seeding failed:");
    console.error(error);
    process.exit(1);
  }
};

seedGames();