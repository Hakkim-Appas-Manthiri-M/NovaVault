import { ArrowRight, Gamepad2, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import GameGrid from "../components/games/GameGrid";
import gameCategories from "../constants/categoryData";
import { getGames } from "../services/gameApi";

function gameMatchesCategory(game, category) {
  const genre = game.genre?.toLowerCase().trim() || "";

  return category.keywords.some((keyword) =>
    genre.includes(keyword.toLowerCase()),
  );
}

function Categories() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedGenre = searchParams.get("genre") || "";

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGames({ limit: 50 });

        const normalizedGames = (data.games || []).map((game) => ({
          ...game,
          id: game._id,
        }));

        setGames(normalizedGames);
      } catch (err) {
        setError(err.message || "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const categories = useMemo(() => {
    return gameCategories.map((category) => {
      const matchingGames = games.filter((game) =>
        gameMatchesCategory(game, category),
      );

      return {
        ...category,
        count: matchingGames.length,
        image: matchingGames[0]?.image || "",
      };
    });
  }, [games]);

  const selectedCategory = useMemo(() => {
    return gameCategories.find(
      (category) => category.name.toLowerCase() === selectedGenre.toLowerCase(),
    );
  }, [selectedGenre]);

  const filteredGames = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return games.filter((game) => gameMatchesCategory(game, selectedCategory));
  }, [games, selectedCategory]);

  const selectCategory = (genre) => {
    setSearchParams({ genre });
  };

  const clearCategory = () => {
    setSearchParams({});
  };

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1536px] min-w-0">
        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-500/10 text-violet-400">
              <Gamepad2 className="size-3.5" />
            </span>

            <p className="!text-[9px] font-bold uppercase tracking-[0.2em] text-violet-400">
              Explore the Vault
            </p>
          </div>

          <h1 className="nv-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Browse Categories
          </h1>

          <p className="mt-1.5 max-w-xl !text-[10px] leading-relaxed text-slate-500 sm:!text-[13px]">
            Explore NovaVault by experience, from action and RPGs to horror,
            survival, racing, and multiplayer worlds.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.025] sm:h-40"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-red-500/10 bg-[#080B15]/60 px-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/[0.05] text-red-400">
              <Zap className="size-5" />
            </div>

            <h2 className="nv-display !text-[15px] font-bold text-slate-300">
              Unable to load categories
            </h2>

            <p className="mt-1.5 max-w-sm !text-[10px] leading-relaxed text-slate-600">
              {error}
            </p>
          </div>
        )}

        {/* Categories */}
        {!loading && !error && (
          <>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="!text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                  Browse by genre
                </p>

                <p className="mt-1 !text-[11px] text-slate-500">
                  {categories.length} experiences
                </p>
              </div>

              {selectedCategory && (
                <button
                  type="button"
                  onClick={clearCategory}
                  className="
                    rounded-lg
                    border border-white/[0.06]
                    bg-white/[0.02]
                    px-3
                    py-2
                    !text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.06em]
                    text-slate-500
                    transition-all
                    hover:border-violet-400/20
                    hover:text-white
                  "
                >
                  Show All
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {categories.map((category) => {
                const Icon = category.icon;

                const active =
                  selectedGenre.toLowerCase() === category.name.toLowerCase();

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => selectCategory(category.name)}
                    className={[
                      "group relative h-40 overflow-hidden rounded-xl border text-left transition-all duration-300",
                      active
                        ? "border-violet-400/40 shadow-lg shadow-violet-950/20"
                        : "border-white/[0.07] hover:border-violet-400/25",
                    ].join(" ")}
                  >
                    {/* Background image */}
                    {category.image ? (
                      <img
                        src={category.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-45"
                      />
                    ) : null}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050711] via-[#050711]/75 to-[#050711]/25" />

                    {/* Accent */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.18),transparent_45%)]" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-3.5">
                      <div
                        className={[
                          "mb-2 flex size-8 items-center justify-center rounded-lg border backdrop-blur-md transition",
                          active
                            ? "border-violet-400/30 bg-violet-500/20 text-violet-300"
                            : "border-white/10 bg-black/30 text-slate-300 group-hover:border-violet-400/20 group-hover:text-violet-300",
                        ].join(" ")}
                      >
                        <Icon className="size-4" strokeWidth={1.8} />
                      </div>

                      <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="nv-display truncate !text-[13px] font-bold text-white">
                            {category.name}
                          </h2>

                          <p className="mt-0.5 truncate !text-[9px] leading-3 text-slate-500">
                            {category.description}
                          </p>

                          <p className="mt-1 !text-[8px] font-semibold uppercase tracking-[0.08em] text-violet-300/70">
                            {category.count}{" "}
                            {category.count === 1 ? "Game" : "Games"}
                          </p>
                        </div>

                        <ArrowRight
                          className="
                            size-3.5
                            shrink-0
                            text-slate-600
                            transition-all
                            group-hover:translate-x-0.5
                            group-hover:text-violet-300
                          "
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Selected category */}
        {!loading && !error && selectedCategory && (
          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 flex items-center gap-1.5 !text-[10px] font-bold uppercase tracking-[0.17em] text-violet-400">
                  {(() => {
                    const Icon = selectedCategory.icon;

                    return <Icon className="size-4" />;
                  })()}
                  {selectedCategory.description}
                </p>

                <h2 className="nv-display text-xl font-bold text-white sm:text-2xl">
                  {selectedCategory.name}
                </h2>

                <p className="mt-1 !text-[10px] text-slate-600">
                  Showing all games related to{" "}
                  {selectedCategory.name.toLowerCase()}.
                </p>
              </div>
            </div>

            {filteredGames.length > 0 ? (
              <GameGrid games={filteredGames} />
            ) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-white/[0.07] bg-[#080B15]/50">
                <div className="text-center">
                  <Sparkles className="mx-auto mb-3 size-5 text-slate-700" />

                  <p className="!text-[10px] uppercase tracking-[0.12em] text-slate-600">
                    No games found in this category.
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Empty */}
        {!loading && !error && games.length === 0 && (
          <div className="mt-5 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] bg-[#080B15]/50 text-center">
            <Gamepad2 className="mb-4 size-6 text-slate-700" />

            <h2 className="nv-display !text-[15px] font-bold text-slate-300">
              No games available
            </h2>

            <p className="mt-1.5 !text-[10px] text-slate-600">
              Categories will appear when games are available.
            </p>

            <Link
              to="/games"
              className="mt-5 flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 !text-[9px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-violet-500"
            >
              Explore Games
              <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
