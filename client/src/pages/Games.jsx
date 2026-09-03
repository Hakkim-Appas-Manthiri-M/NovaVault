import {
  BadgePlus,
  Check,
  ChevronDown,
  Flame,
  LayoutGrid,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import GameGrid from "../components/games/GameGrid";
import {
  featuredGames,
  newReleases,
  trendingGames,
} from "../constants/gameData";

const storeGames = [...featuredGames, ...trendingGames, ...newReleases].filter(
  (game, index, games) =>
    games.findIndex((item) => item.id === game.id) === index,
);

const filterOptions = ["All Games", "Trending", "New Releases"];

const sortOptions = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "rating",
    label: "Rating",
  },
  {
    value: "price-low",
    label: "Price: Low → High",
  },
  {
    value: "price-high",
    label: "Price: High → Low",
  },
  {
    value: "name",
    label: "Name: A → Z",
  },
];

function Games() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Games");
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const games = storeGames.filter((game) => {
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

    return [...games].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        case "price-low":
          return (a.price ?? 0) - (b.price ?? 0);

        case "price-high":
          return (b.price ?? 0) - (a.price ?? 0);

        case "name":
          return a.title.localeCompare(b.title);

        case "featured":
        default:
          return 0;
      }
    });
  }, [searchQuery, activeFilter, sortBy]);

  const activeSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ?? "Featured";

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1536px] min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.18em] text-violet-400">
                NovaVault Store
              </p>

              <h1 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Discover Games
              </h1>

              <p className="mt-1.5 max-w-xl text-[10px] leading-relaxed text-slate-500 sm:text-[13px]">
                Explore the latest releases, trending titles, and games worth
                adding to your vault.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              <span className="text-slate-400">{filteredGames.length}</span>

              <span>Games Available</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div
          className="
            relative z-10
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
            <span className="sr-only">Search games</span>

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
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search games..."
              className="
                h-9 w-full
                rounded-lg
                border border-white/[0.07]
                bg-[#050711]
                pl-9 pr-3
                !text-[13px]
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
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-200"
              >
                <X className="size-3" />
              </button>
            )}
          </label>

          {/* Filters + Sort */}
          <div className="flex min-w-0 max-w-full items-center gap-2">
            {/* Filters */}
            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filterOptions.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={[
                      "flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5",
                      "!text-[11px] font-semibold uppercase tracking-[0.06em] !leading-none",
                      "transition-all duration-200",
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-950/20"
                        : "border border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-slate-300",
                    ].join(" ")}
                  >
                    {filter === "All Games" && (
                      <LayoutGrid className="size-3" />
                    )}

                    {filter === "Trending" && <Flame className="size-3" />}

                    {filter === "New Releases" && (
                      <BadgePlus className="size-3" />
                    )}

                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setSortOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className={[
                  "flex h-8 items-center gap-1.5 rounded-lg px-2.5",
                  "border border-white/[0.06]",
                  "!text-[11px] font-semibold uppercase tracking-[0.04em]",
                  "outline-none transition-all duration-200",
                  "bg-violet-600 text-white shadow-lg shadow-violet-950/20",
                ].join(" ")}
              >
                <Sparkles className="size-3" />

                <span>{activeSortLabel}</span>

                <ChevronDown
                  className={[
                    "size-3 transition-transform duration-200",
                    sortOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {sortOpen && (
                <div
                  className="absolute right-[-3px] top-full z-[100] mt-1.5 w-max overflow-hidden rounded-xl border border-white/[0.07] bg-[#080B15] p-1 shadow-2xl shadow-black/40 backdrop-blur-xl"
                  role="listbox"
                >
                  {sortOptions.map((option) => {
                    const isActive = sortBy === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={[
                          "flex w-full items-center justify-between",
                          "rounded-lg px-3 py-3",
                          "text-left",
                          "!text-[9px] font-semibold uppercase tracking-[0.04em]",
                          "transition-all duration-150",
                          isActive
                            ? "bg-violet-600/15 text-violet-300"
                            : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200",
                        ].join(" ")}
                      >
                        <span>{option.label}</span>

                        {isActive && (
                          <Check className="size-3 text-violet-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store section */}
        <div className="min-w-0">
          <div className="mb-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="nv-display !text-[18px] font-bold text-white">
                  {activeFilter}
                </h2>

                <p className="mt-0.5 !text-[13px] text-slate-600">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Browse the NovaVault collection"}
                </p>
              </div>

              {/* Current sort indicator */}
              <p className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600 sm:block">
                Sort: <span className="text-slate-400">{activeSortLabel}</span>
              </p>
            </div>
          </div>

          <GameGrid games={filteredGames} />
        </div>
      </div>
    </section>
  );
}

export default Games;
