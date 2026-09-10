const mongoose = require("mongoose");

const gameMediaSchema = new mongoose.Schema(
  {
    trailerType: {
      type: String,
      enum: ["youtube", "mp4"],
      default: "youtube",
    },

    trailer: {
      type: String,
      default: "",
      trim: true,
    },

    trailerThumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    screenshots: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const gameSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: String,
      default: "",
      trim: true,
    },

    accent: {
      type: String,
      default: "violet",
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    mobileImage: {
      type: String,
      default: "",
      trim: true,
    },

    portraitImage: {
      type: String,
      default: "",
      trim: true,
    },

    platforms: {
      type: [String],
      default: [],
    },

    releaseDate: {
      type: Date,
    },

    developer: {
      type: String,
      default: "",
      trim: true,
    },

    publisher: {
      type: String,
      default: "",
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    newRelease: {
      type: Boolean,
      default: false,
    },

    // ============================================================
    // GAME MEDIA
    // ============================================================
    media: {
      type: gameMediaSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;