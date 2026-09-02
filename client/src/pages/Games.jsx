import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import GameGrid from "../components/games/GameGrid";
import {
  newReleases,
  trendingGames,
} from "../constants/gameData";

const storeGames = [
  ...trendingGames,
  ...newReleases,
];

function Games() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Games");

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return storeGames.filter((game) => {
      const matchesSearch =
        !query ||
        game.title.toLowerCase().includes(query) ||
        game.genre.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "All Games" ||
        (activeFilter === "Trending" &&
          trendingGames.some((item) => item.id === game.id)) ||
        (activeFilter === "New Releases" &&
          newReleases.some((item) => item.id === game.id));

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1536px] min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
                NovaVault Store
              </p>

              <h1 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Discover Games
              </h1>

              <p className="mt-1.5 max-w-xl text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
                Explore the latest releases, trending titles, and games
                worth adding to your vault.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              <span className="text-slate-400">
                {filteredGames.length}
              </span>

              <span>Games Available</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div
          className="
            mb-6
            flex flex-col gap-3
            rounded-xl
            border border-white/[0.06]
            bg-[#080B15]/80
            p-3
            backdrop-blur-xl

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Search */}
          <label className="relative w-full sm:max-w-[320px]">
            <span className="sr-only">
              Search games
            </span>

            <Search
              className="
                pointer-events-none
                absolute left-3 top-1/2
                size-3
                -translate-y-1/2
                text-slate-600
              "
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search games..."
              className="
                h-9 w-full
                rounded-lg
                border border-white/[0.07]
                bg-[#050711]
                pl-9 pr-3
                text-[9px]
                text-white
                outline-none
                transition-all duration-200
                placeholder:text-[14px]
                placeholder:text-slate-600
                hover:border-white/[0.11]
                focus:border-violet-500/40
                focus:ring-1
                focus:ring-violet-500/10
              "
            />
          </label>

          {/* Filters */}
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["All Games", "Trending", "New Releases"].map(
              (filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={[
                      "flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3",
                      "text-[7px] font-bold uppercase tracking-[0.06em]",
                      "transition-all duration-200",
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-950/20"
                        : "border border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-slate-300",
                    ].join(" ")}
                  >
                    {filter === "All Games" && (
                      <SlidersHorizontal className="size-3" />
                    )}

                    {filter === "Trending" && (
                      <Filter className="size-3" />
                    )}

                    {filter === "New Releases" && (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}

                    {filter}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Store section */}
        <div className="min-w-0">
          <div className="mb-5">
            <h2 className="nv-display text-[18px] font-bold text-white">
              {activeFilter}
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-600">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Browse the NovaVault collection"}
            </p>
          </div>

          <GameGrid games={filteredGames} />
        </div>
      </div>
    </section>
  );
}

export default Games;