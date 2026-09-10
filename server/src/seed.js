require("dotenv").config();

const connectDB = require("./config/db");
const Game = require("./models/Game");
const gameSeedData = require("./data/gameSeedData");

const seedGames = async () => {
  try {
    await connectDB();

    console.log("Clearing existing games...");
    await Game.deleteMany({});

    console.log("Inserting game seed data...");
    const games = await Game.insertMany(gameSeedData);

    console.log(`✅ ${games.length} games seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Game seeding failed:");
    console.error(error);
    process.exit(1);
  }
};

seedGames();