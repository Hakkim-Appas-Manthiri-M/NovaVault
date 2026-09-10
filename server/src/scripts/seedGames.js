require("dotenv").config();

const connectDB = require("../config/db");
const Game = require("../models/Game");
const gameSeedData = require("../data/gameSeedData");

async function seedGames() {
  try {
    await connectDB();

    console.log("Preparing NovaVault game catalog...");

    const operations = gameSeedData.map((game) => ({
      updateOne: {
        filter: { slug: game.slug },
        update: { $set: game },
        upsert: true,
      },
    }));

    const result = await Game.bulkWrite(operations);

    console.log("\nNovaVault game catalog seeded successfully.");
    console.log(`Games in seed data: ${gameSeedData.length}`);
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);
    console.log(`Matched: ${result.matchedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("\nGame seed failed:");
    console.error(error.message);

    process.exit(1);
  }
}

seedGames();