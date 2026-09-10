const gameSeedData = require("./gameSeedData");

const requiredFields = [
  "slug",
  "title",
  "genre",
  "description",
  "price",
  "rating",
  "image",
];

const errors = [];

// Check required fields
gameSeedData.forEach((game, index) => {
  requiredFields.forEach((field) => {
    if (
      game[field] === undefined ||
      game[field] === null ||
      game[field] === ""
    ) {
      errors.push(
        `Game ${index + 1} (${game.slug || "unknown"}): missing ${field}`
      );
    }
  });

  // Validate price
  if (typeof game.price !== "number" || game.price < 0) {
    errors.push(`Game ${game.slug}: invalid price`);
  }

  // Validate rating
  if (
    typeof game.rating !== "number" ||
    game.rating < 0 ||
    game.rating > 5
  ) {
    errors.push(`Game ${game.slug}: invalid rating`);
  }

  // Validate flags
  ["featured", "trending", "newRelease"].forEach((flag) => {
    if (typeof game[flag] !== "boolean") {
      errors.push(`Game ${game.slug}: ${flag} must be boolean`);
    }
  });
});

// Check duplicate slugs
const slugs = gameSeedData.map((game) => game.slug);
const duplicateSlugs = slugs.filter(
  (slug, index) => slugs.indexOf(slug) !== index
);

duplicateSlugs.forEach((slug) => {
  errors.push(`Duplicate slug: ${slug}`);
});

// Final result
if (errors.length > 0) {
  console.error("\nNovaVault game seed validation failed:\n");

  errors.forEach((error) => {
    console.error(`- ${error}`);
  });

  process.exit(1);
}

console.log("\nNovaVault game seed validation passed.");
console.log(`Unique games: ${gameSeedData.length}`);

const featuredCount = gameSeedData.filter(
  (game) => game.featured
).length;

const trendingCount = gameSeedData.filter(
  (game) => game.trending
).length;

const newReleaseCount = gameSeedData.filter(
  (game) => game.newRelease
).length;

console.log(`Featured: ${featuredCount}`);
console.log(`Trending: ${trendingCount}`);
console.log(`New Releases: ${newReleaseCount}`);