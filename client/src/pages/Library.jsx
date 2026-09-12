import { useEffect, useState } from "react";
import {
  BookOpen,
  Gamepad2,
  LibraryBig,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import PageContainer from "../components/common/PageContainer";
import { getMyLibrary } from "../services/ownershipApi";

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadLibrary = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyLibrary();
      setGames(data.games || []);
    } catch (requestError) {
      setError(
        requestError.message || "Unable to load your library.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let cancelled = false;

  const loadInitialLibrary = async () => {
    setError("");

    try {
      const data = await getMyLibrary();

      if (!cancelled) {
        setGames(data.games || []);
      }
    } catch (requestError) {
      if (!cancelled) {
        setError(
          requestError.message || "Unable to load your library.",
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadInitialLibrary();

  return () => {
    cancelled = true;
  };
}, []);


  const filteredGames = games.filter((game) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      game.title?.toLowerCase().includes(query) ||
      game.genre?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen">
      <PageContainer className="py-6 pb-24 sm:py-8 lg:py-10">
        {/* HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/[0.08] text-violet-400">
                  <LibraryBig className="size-4" />
                </div>

                <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-violet-400">
                  Your Collection
                </p>
              </div>

              <h1 className="nv-display mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Game Library
              </h1>

              <p className="mt-2 max-w-xl text-[9px] leading-5 text-slate-500 sm:text-[10px]">
                Your purchased games, permanently connected to
                your NovaVault account.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <BookOpen className="size-3.5 text-violet-400" />

                <span className="text-[9px] font-semibold text-slate-400">
                  {games.length}{" "}
                  {games.length === 1 ? "Game" : "Games"}
                </span>
              </div>

              <button
                type="button"
                onClick={loadLibrary}
                disabled={loading}
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-lg
                  border border-white/[0.06]
                  bg-white/[0.02]
                  text-slate-500
                  transition
                  hover:border-violet-400/20
                  hover:bg-violet-500/[0.05]
                  hover:text-violet-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Refresh library"
              >
                <RefreshCw
                  className={`size-3.5 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* SEARCH */}
        {games.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mt-6"
          >
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-600" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your library..."
                className="
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-white/[0.07]
                  bg-[#080B15]
                  pl-9
                  pr-3
                  text-[9px]
                  text-white
                  outline-none
                  placeholder:text-slate-700
                  transition
                  focus:border-violet-400/30
                "
              />
            </div>
          </motion.div>
        )}

        {/* ERROR */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mt-6
              rounded-xl
              border border-red-400/15
              bg-red-500/[0.05]
              p-4
            "
          >
            <p className="text-[9px] leading-4 text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={loadLibrary}
              className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-red-400/15
                px-3
                py-2
                text-[8px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-red-300
                transition
                hover:bg-red-500/[0.06]
              "
            >
              <RefreshCw className="size-3" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* LOADING */}
        {loading && !error && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-[#080B15]
                "
              >
                <div className="aspect-[3/4] animate-pulse bg-white/[0.035]" />

                <div className="space-y-2 p-3">
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-white/[0.05]" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-white/[0.035]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && games.length === 0 && (
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
              mt-10
              flex
              min-h-[360px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-white/[0.08]
              bg-white/[0.015]
              px-6
              text-center
            "
          >
            <div className="flex size-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.05] text-violet-400/70">
              <Gamepad2 className="size-6" />
            </div>

            <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.2em] text-violet-400">
              Your Vault Is Empty
            </p>

            <h2 className="nv-display mt-2 text-xl font-bold text-white">
              No games yet
            </h2>

            <p className="mt-2 max-w-md text-[9px] leading-5 text-slate-600">
              Purchase a game from the NovaVault store and it
              will appear here permanently.
            </p>

            <Link
              to="/games"
              className="
                mt-5
                inline-flex
                min-h-9
                items-center
                gap-2
                rounded-lg
                bg-violet-600
                px-4
                text-[8px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-white
                transition
                hover:bg-violet-500
              "
            >
              <Gamepad2 className="size-3.5" />
              Explore Games
            </Link>
          </motion.section>
        )}

        {/* NO SEARCH RESULTS */}
        {!loading &&
          !error &&
          games.length > 0 &&
          filteredGames.length === 0 && (
            <div className="mt-10 flex min-h-[220px] flex-col items-center justify-center text-center">
              <Search className="size-6 text-slate-700" />

              <h2 className="mt-3 text-sm font-semibold text-slate-300">
                No games found
              </h2>

              <p className="mt-1 text-[9px] text-slate-600">
                Try a different game title or genre.
              </p>
            </div>
          )}

        {/* LIBRARY GRID */}
        {!loading &&
          !error &&
          filteredGames.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="mt-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-emerald-400/70" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  Account-owned titles
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(index * 0.04, 0.25),
                    }}
                  >
                    <Link
                      to={`/games/${game.slug}`}
                      className="
                        group
                        block
                        overflow-hidden
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-[#080B15]
                        transition
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-violet-400/20
                      "
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.03]">
                        {game.portraitImage || game.image ? (
                          <img
                            src={game.portraitImage || game.image}
                            alt={game.title}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-500
                              group-hover:scale-[1.04]
                            "
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Gamepad2 className="size-7 text-slate-700" />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080B15] via-[#080B15]/70 to-transparent" />

                        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-emerald-400/15 bg-[#06100c]/80 px-2 py-1 backdrop-blur-sm">
                          <ShieldCheck className="size-2.5 text-emerald-400" />

                          <span className="text-[6px] font-bold uppercase tracking-[0.08em] text-emerald-300">
                            Owned
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="truncate text-[10px] font-bold text-white">
                            {game.title}
                          </p>

                          <div className="mt-1 flex items-center justify-between gap-2">
                            <span className="truncate text-[7px] uppercase tracking-[0.06em] text-slate-500">
                              {game.genre || "Game"}
                            </span>

                            <span className="shrink-0 text-[8px] font-semibold text-slate-400">
                              {formatPrice(game.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
      </PageContainer>
    </div>
  );
}

export default Library;