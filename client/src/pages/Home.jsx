import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import HomeHero from "../components/hero/HomeHero";
import GameCard from "../components/games/GameCard";
import PageContainer from "../components/common/PageContainer";
import SectionHeader from "../components/common/SectionHeader";
import gameCategories from "../constants/categoryData";
import {
  getNewReleaseGames,
  getTrendingGames,
} from "../services/gameApi";

function GameCollection({ games }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);

  /*
   * Responsive number of visible cards
   *
   * Mobile  : 2
   * Tablet  : 3
   * Laptop  : 4
   * Desktop : 4
   */
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setVisibleCount(4);
      } else if (width >= 640) {
        setVisibleCount(3);
      } else {
        setVisibleCount(2);
      }
    };

    updateVisibleCount();

    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);


  if (!games.length) {
    return null;
  }

  const safeIndex = Math.min(currentIndex, Math.max(games.length - 1, 0));
  const maxIndex = Math.max(games.length - visibleCount, 0);

  const safeCurrentIndex = Math.min(safeIndex, maxIndex);

  const canGoPrevious = safeCurrentIndex > 0;
  const canGoNext = safeCurrentIndex < maxIndex;

  const visibleGames = games.slice(
    safeCurrentIndex,
    safeCurrentIndex + visibleCount,
  );

  const goPrevious = () => {
    setCurrentIndex((current) => Math.max(current - 1, 0));
  };

  const goNext = () => {
    setCurrentIndex(Math.min(safeCurrentIndex + 1, maxIndex));
  };

  return (
    <div className="w-full min-w-0">
      {/* =====================================================
          GAME CARDS

          No horizontal scrolling.
          No swipe.
          No snap.
          Cards change only with arrow buttons.
          ===================================================== */}

      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-2
          gap-3
          sm:grid-cols-3
          lg:grid-cols-4
          xl:gap-4
        "
      >
        {visibleGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* =====================================================
          CAROUSEL CONTROLS

          Always at bottom-right.
          Works on mobile / tablet / laptop / desktop.
          ===================================================== */}

      <div
        className="
          mt-3
          flex
          h-8
          items-center
          justify-end
          gap-1.5
        "
      >
        {/* Previous */}
        <button
          type="button"
          aria-label="Previous games"
          onClick={goPrevious}
          disabled={!canGoPrevious}
          className="
            flex
            size-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-white/[0.08]
            bg-[#090D19]
            text-slate-400
            shadow-sm
            shadow-black/20
            transition-all
            duration-200

            hover:border-violet-400/30
            hover:bg-violet-500/10
            hover:text-violet-300

            disabled:cursor-not-allowed
            disabled:opacity-25

            active:scale-95
          "
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page indicator */}
        <div
          className="
            flex
            h-8
            items-center
            rounded-lg
            border
            border-white/[0.06]
            bg-[#090D19]
            px-2.5
          "
        >
          <span
            className="
              !text-[7px]
              font-bold
              uppercase
              tracking-[0.1em]
              text-slate-500
            "
          >
            {safeCurrentIndex + 1} / {maxIndex + 1}
          </span>
        </div>

        {/* Next */}
        <button
          type="button"
          aria-label="Next games"
          onClick={goNext}
          disabled={!canGoNext}
          className="
            flex
            size-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-white/[0.08]
            bg-[#090D19]
            text-slate-400
            shadow-sm
            shadow-black/20
            transition-all
            duration-200

            hover:border-violet-400/30
            hover:bg-violet-500/10
            hover:text-violet-300

            disabled:cursor-not-allowed
            disabled:opacity-25

            active:scale-95
          "
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/*
 * NovaVault umbrella genres.
 *
 * These are presentation-level categories.
 * Individual MongoDB genres can belong to more than one
 * umbrella category.
 *
 * Examples:
 *
 * Fantasy Action RPG
 * → Action + RPG
 *
 * Survival Horror
 * → Survival + Horror
 *
 * Open World Action RPG
 * → Action + RPG
 *
 * Ocean Survival
 * → Survival
 */

function Home() {
  const [trendingGames, setTrendingGames] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [gamesError, setGamesError] = useState("");

  useEffect(() => {
    const loadHomeGames = async () => {
      try {
        setLoadingGames(true);
        setGamesError("");

        const [trendingData, newReleaseData] = await Promise.all([
          getTrendingGames(),
          getNewReleaseGames(),
        ]);

        setTrendingGames(
          (trendingData.games || []).map((game) => ({
            ...game,
            id: game._id,
          })),
        );

        setNewReleases(
          (newReleaseData.games || []).map((game) => ({
            ...game,
            id: game._id,
          })),
        );
      } catch (error) {
        setGamesError(error.message || "Failed to load home games.");
      } finally {
        setLoadingGames(false);
      }
    };

    loadHomeGames();
  }, []);

  return (
    <div className="min-h-screen bg-[#050711]">
      {/* Hero */}
      <HomeHero/>

      <PageContainer className="py-8 sm:py-10 lg:py-12">
        {/* =====================================================
            TRENDING
            ===================================================== */}

        <section>
          <SectionHeader
            eyebrow="Discover"
            title="Trending Now"
            description="The games NovaVault players are playing right now."
            link={{
              label: "View All",
              to: "/games",
            }}
          />

          {loadingGames ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[5/6] animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.03]"
                />
              ))}
            </div>
          ) : gamesError ? (
            <p className="py-8 text-center !text-[10px] text-slate-600">
              {gamesError}
            </p>
          ) : (
            <GameCollection games={trendingGames} />
          )}
        </section>

        {/* =====================================================
            CATEGORIES
            ===================================================== */}

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <SectionHeader
            eyebrow="Explore"
            title="Browse by Genre"
            description="Find the experience that fits your mood."
            link={{
              label: "View All",
              to: "/categories",
            }}
          />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {gameCategories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to={`/categories?genre=${encodeURIComponent(category.name)}`}
                  className="
                    group
                    relative
                    min-h-[94px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-[#090D19]
                    p-3
                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:border-violet-400/25
                    hover:bg-violet-500/[0.045]
                  "
                >
                  {/* Icon */}
                  <div
                    className="
                      flex
                      size-8
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-violet-400/10
                      bg-violet-500/10
                      text-violet-300
                      transition-all
                      duration-200

                      group-hover:border-violet-400/20
                      group-hover:bg-violet-500/15
                      group-hover:text-violet-200
                    "
                  >
                    <Icon className="size-3.5" strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <div className="mt-3 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3
                        className="
                          nv-display
                          truncate
                          !text-[11px]
                          font-bold
                          uppercase
                          tracking-[0.06em]
                          text-slate-200
                        "
                      >
                        {category.name}
                      </h3>

                      <ChevronRight
                        className="
                          size-3
                          shrink-0
                          text-slate-700
                          transition-all
                          duration-200

                          group-hover:translate-x-0.5
                          group-hover:text-violet-300
                        "
                      />
                    </div>

                    <p
                      className="
                        mt-1
                        !text-[9px]
                        leading-3
                        text-slate-600
                      "
                    >
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            NEW RELEASES
            ===================================================== */}

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <SectionHeader
            eyebrow="Fresh From The Vault"
            title="New Releases"
            description="Discover the latest additions to NovaVault."
            link={{
              label: "All Releases",
              to: "/new-releases",
            }}
          />

          {loadingGames ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[5/6] animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.03]"
                />
              ))}
            </div>
          ) : gamesError ? (
            <p className="py-8 text-center !text-[10px] text-slate-600">
              {gamesError}
            </p>
          ) : (
            <GameCollection games={newReleases} />
          )}
        </section>

        {/* =====================================================
            DEALS
            ===================================================== */}

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-violet-400/15 bg-violet-500/[0.045] p-5 sm:p-7">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="!text-[7px] font-bold uppercase tracking-[0.25em] text-violet-400 sm:!text-[8px]">
                  Limited Time
                </p>

                <h2 className="nv-display mt-2 text-xl font-bold tracking-tight text-white sm:text-3xl">
                  Vault Deals
                </h2>

                <p className="mt-2 max-w-lg !text-[9px] leading-4 text-slate-500 sm:!text-[10px] sm:leading-5">
                  Premium titles, exceptional worlds, and limited-time prices.
                </p>
              </div>

              <Link
                to="/deals"
                className="
                  inline-flex
                  min-h-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-violet-600
                  px-4
                  !text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-white
                  transition
                  hover:bg-violet-500

                  sm:min-h-10
                  sm:px-5
                  sm:!text-[9px]
                "
              >
                Explore Deals
              </Link>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}

export default Home;