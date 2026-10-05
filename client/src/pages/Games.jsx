import {
  ArrowDownAZ,
  ArrowDownUp,
  Check,
  Search,
  Star,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getGames } from "../services/gameApi";

import GameGrid from "../components/games/GameGrid";
import GameGridSkeleton from "../components/common/GameGridSkeleton";
import GameGridError from "../components/common/GameGridError";

const sortOptions = [
  {
    value: "name",
    label: "Name: A–Z",
    icon: ArrowDownAZ,
  },
  {
    value: "rating",
    label: "Rating",
    icon: Star,
  },
  {
    value: "price-low",
    label: "Price: Low → High",
    icon: ArrowDownUp,
  },
  {
    value: "price-high",
    label: "Price: High → Low",
    icon: ArrowDownUp,
  },
];

function Games({ mode = "all" }) {
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const [sortBy, setSortBy] = useState("rating");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGames = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getGames();

      const mappedGames = (data.games || []).map((game) => ({
        ...game,
        id: game._id,
      }));

      setGames(mappedGames);
    } catch (err) {
      setError(err.message || "Failed to load games.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchGames = async () => {
      try {
        const data = await getGames();

        if (cancelled) return;

        const mappedGames = (data.games || []).map((game) => ({
          ...game,
          id: game._id,
        }));

        setGames(mappedGames);
      } catch (err) {
        if (cancelled) return;

        setError(err.message || "Failed to load games.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGames();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = games.filter((game) => {
      const title = game.title?.toLowerCase() || "";
      const genre = game.genre?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        genre.includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (mode === "trending" && !game.trending) {
        return false;
      }

      if (mode === "new-releases" && !game.newRelease) {
        return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        case "price-low":
          return (a.price ?? 0) - (b.price ?? 0);

        case "price-high":
          return (b.price ?? 0) - (a.price ?? 0);

        case "name":
          return (a.title || "").localeCompare(b.title || "");

        default:
          return (b.rating ?? 0) - (a.rating ?? 0);
      }
    });
  }, [games, searchQuery, mode, sortBy]);

  const pageTitle =
    mode === "trending"
      ? "Trending Games"
      : mode === "new-releases"
        ? "New Releases"
        : "Discover Games";

  const sectionTitle =
    mode === "trending"
      ? "Trending Games"
      : mode === "new-releases"
        ? "New Releases"
        : "All Games";

  const pageDescription =
    mode === "trending"
      ? "Discover the games everyone is playing right now."
      : mode === "new-releases"
        ? "Explore the latest games added to NovaVault."
        : "Explore the latest releases, trending titles, and games worth adding to your vault.";

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1536px] min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 !text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400">
                NovaVault Store
              </p>

              <h1 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                {pageTitle}
              </h1>

              <p className="mt-1.5 max-w-xl !text-[10px] leading-relaxed text-slate-500 sm:!text-[13px]">
                {pageDescription}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 !text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              <span className="text-slate-400">
                {filteredGames.length}
              </span>

              <span>Games Available</span>
            </div>
          </div>
        </div>

        {/* Search + Sorting */}
        <div
          className="
            relative z-10 mb-6
            rounded-xl
            border border-white/[0.06]
            bg-[#080B15]/80
            p-3
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex min-w-0
              flex-col gap-2.5
              lg:flex-row
              lg:items-center
            "
          >
            {/* Search */}
            <label className="relative block w-full shrink-0 sm:w-[550px] lg:w-[400px]">
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
                  pl-9 pr-9
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
                  className="
                    absolute right-2.5 top-1/2
                    flex size-5
                    -translate-y-1/2
                    items-center justify-center
                    rounded-md
                    text-slate-500
                    transition-colors duration-200
                    hover:bg-white/[0.06]
                    hover:text-slate-200
                  "
                >
                  <X className="size-3" />
                </button>
              )}
            </label>

            {/* Sorting Options */}
            <div
              className="
                min-w-0 flex-1
                overflow-x-auto
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <div className="flex min-w-max items-center gap-1.5">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = sortBy === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSortBy(option.value)}
                      aria-pressed={isActive}
                      className={[
                        "flex h-9 shrink-0 items-center gap-1.5",
                        "rounded-lg px-3",
                        "border",
                        "!text-[10px]",
                        "font-semibold uppercase",
                        "tracking-[0.045em]",
                        "outline-none",
                        "transition-all duration-200",
                        isActive
                          ? "border-violet-500/30 bg-violet-600 text-white shadow-lg shadow-violet-950/20"
                          : "border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.11] hover:bg-white/[0.04] hover:text-slate-200",
                      ].join(" ")}
                    >
                      <Icon className="size-3 shrink-0" />

                      <span>{option.label}</span>

                      {isActive && (
                        <Check className="size-3 shrink-0 text-white/80" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Games */}
        <div className="min-w-0">
          <div className="mb-5">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h2 className="nv-display !text-[18px] font-bold text-white">
                  {sectionTitle}
                </h2>

                <p className="mt-0.5 !text-[13px] text-slate-600">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Browse the NovaVault collection"}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <GameGridSkeleton />
          ) : error ? (
            <GameGridError
              message={error}
              onRetry={loadGames}
            />
          ) : (
            <GameGrid games={filteredGames} />
          )}
        </div>
      </div>
    </section>
  );
}

export default Games;