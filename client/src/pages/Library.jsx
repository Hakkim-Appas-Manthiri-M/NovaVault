import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  Download,
  FolderOpen,
  Gamepad2,
  HardDrive,
  LibraryBig,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import PageContainer from "../components/common/PageContainer";
import { getMyLibrary } from "../services/ownershipApi";

function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [storageGame, setStorageGame] = useState(null);
  const [installingGame, setInstallingGame] = useState(null);
  const [browseLocation, setBrowseLocation] = useState("D:\\NovaVault\\Games");

  const loadLibrary = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyLibrary();
      setGames(data.games || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load your library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialLibrary = async () => {
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-library-menu]")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
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

  const handleInstall = (game) => {
    setOpenMenu(null);
    setInstallingGame(game);

    window.setTimeout(() => {
      setInstallingGame(null);
    }, 1500);
  };

  const handleStorage = (game) => {
    setOpenMenu(null);
    setStorageGame(game);
  };

  const handleBrowseLocation = () => {
    const nextLocation = window.prompt(
      "Enter your NovaVault game installation location:",
      browseLocation,
    );

    if (nextLocation?.trim()) {
      setBrowseLocation(nextLocation.trim());
    }
  };

  return (
    <div className="min-h-screen">
      <PageContainer className="py-6 pb-24 sm:py-8 lg:py-10">
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
                <p className="!text-[8px] font-bold uppercase tracking-[0.22em] text-violet-400">
                  Your Collection
                </p>
              </div>

              <h1 className="nv-display mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Game Library
              </h1>

              <p className="mt-2 max-w-xl !text-[9px] leading-5 text-slate-500 sm:!text-[10px]">
                Your purchased games, permanently connected to your NovaVault account.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <BookOpen className="size-3.5 text-violet-400" />
                <span className="!text-[9px] font-semibold text-slate-400">
                  {games.length} {games.length === 1 ? "Game" : "Games"}
                </span>
              </div>

              <button
                type="button"
                onClick={loadLibrary}
                disabled={loading}
                className="flex size-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-slate-500 transition hover:border-violet-400/20 hover:bg-violet-500/[0.05] hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Refresh library"
              >
                <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </motion.section>

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
                className="h-9 w-full rounded-lg border border-white/[0.07] bg-[#080B15] pl-9 pr-3 !text-[12px] text-white outline-none placeholder:text-slate-700 transition focus:border-violet-400/30"
              />
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-red-400/15 bg-red-500/[0.05] p-4"
          >
            <p className="!text-[9px] leading-4 text-red-300">{error}</p>
            <button
              type="button"
              onClick={loadLibrary}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-400/15 px-3 py-2 !text-[8px] font-bold uppercase tracking-[0.08em] text-red-300 transition hover:bg-red-500/[0.06]"
            >
              <RefreshCw className="size-3" />
              Try Again
            </button>
          </motion.div>
        )}

        {loading && !error && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#080B15]"
              >
                <div className="aspect-[3/4] animate-pulse bg-white/[0.035]" />
                <div className="space-y-2 p-3">
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-white/[0.05]" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-white/[0.035]" />
                  <div className="h-7 animate-pulse rounded bg-white/[0.035]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.05] text-violet-400/70">
              <Gamepad2 className="size-6" />
            </div>

            <p className="mt-5 !text-[8px] font-bold uppercase tracking-[0.2em] text-violet-400">
              Your Vault Is Empty
            </p>

            <h2 className="nv-display mt-2 text-xl font-bold text-white">
              No games yet
            </h2>

            <p className="mt-2 max-w-md !text-[9px] leading-5 text-slate-600">
              Purchase a game from the NovaVault store and it will appear here permanently.
            </p>

            <Link
              to="/games"
              className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg bg-violet-600 px-4 !text-[8px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-violet-500"
            >
              <Gamepad2 className="size-3.5" />
              Explore Games
            </Link>
          </motion.section>
        )}

        {!loading && !error && games.length > 0 && filteredGames.length === 0 && (
          <div className="mt-10 flex min-h-[220px] flex-col items-center justify-center text-center">
            <Search className="size-6 text-slate-700" />
            <h2 className="mt-3 text-sm font-semibold text-slate-300">
              No games found
            </h2>
            <p className="mt-1 !text-[9px] text-slate-600">
              Try a different game title or genre.
            </p>
          </div>
        )}

        {!loading && !error && filteredGames.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-emerald-400/70" />
              <p className="!text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Account-owned titles
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {filteredGames.map((game, index) => (
                <motion.article
                  key={game._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(index * 0.04, 0.25),
                  }}
                  className="overflow-visible rounded-xl border border-white/[0.06] bg-[#080B15] transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/20"
                >
                  <Link to={`/games/${game.slug}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-white/[0.03]">
                      {game.portraitImage || game.image ? (
                        <img
                          src={game.portraitImage || game.image}
                          alt={game.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Gamepad2 className="size-7 text-slate-700" />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#080B15] via-[#080B15]/50 to-transparent" />

                      <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md border border-emerald-400/15 bg-[#06100c]/80 px-2 py-1 backdrop-blur-sm">
                        <Check className="size-2.5 text-emerald-400" />
                        <span className="!text-[6px] font-bold uppercase tracking-[0.08em] text-emerald-300">
                          Owned
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link to={`/games/${game.slug}`} className="block min-w-0">
                      <p className="truncate !text-[10px] font-bold text-white transition hover:text-violet-300">
                        {game.title}
                      </p>
                      <p className="mt-1 truncate !text-[7px] uppercase tracking-[0.06em] text-slate-600">
                        {game.genre || "Game"}
                      </p>
                    </Link>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInstall(game)}
                        className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-2 !text-[8px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-violet-500 active:scale-[0.98]"
                      >
                        <Download className="size-3" />
                        {installingGame?._id === game._id ? "Starting..." : "Install"}
                      </button>

                      <div className="relative" data-library-menu>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(openMenu === game._id ? null : game._id)
                          }
                          aria-label={`More options for ${game.title}`}
                          aria-expanded={openMenu === game._id}
                          className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-slate-500 transition hover:border-violet-400/20 hover:bg-violet-500/[0.08] hover:text-violet-300"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>

                        {openMenu === game._id && (
                          <div className="absolute bottom-full right-0 z-50 mb-2 w-40 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B0D16] p-1.5 shadow-2xl shadow-black/50">
                            <button
                              type="button"
                              onClick={() => handleInstall(game)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left !text-[9px] font-semibold text-slate-400 transition hover:bg-violet-500/[0.08] hover:text-violet-300"
                            >
                              <Download className="size-3.5" />
                              Install
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStorage(game)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left !text-[9px] font-semibold text-slate-400 transition hover:bg-violet-500/[0.08] hover:text-violet-300"
                            >
                              <HardDrive className="size-3.5" />
                              Storage
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </PageContainer>

      {storageGame && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setStorageGame(null);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0D16] shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/[0.08]">
                  <HardDrive className="size-4 text-violet-400" />
                </div>

                <div className="min-w-0">
                  <p className="!text-[8px] font-bold uppercase tracking-[0.15em] text-violet-400">
                    Storage
                  </p>
                  <h2 className="mt-0.5 truncate text-sm font-bold text-white">
                    {storageGame.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStorageGame(null)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                aria-label="Close storage"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="!text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    Required Storage
                  </span>
                  <span className="text-sm font-bold text-white">
                    {storageGame.storageSize
                      ? `${storageGame.storageSize} GB`
                      : "99.8 GB"}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400" />
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="!text-[8px] text-slate-600">
                    Game files
                  </span>
                  <span className="!text-[8px] text-slate-500">
                    68% allocated
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="!text-[8px] uppercase tracking-[0.08em] text-slate-600">
                    Game Size
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-300">
                    {storageGame.storageSize
                      ? `${storageGame.storageSize} GB`
                      : "99.8 GB"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="!text-[8px] uppercase tracking-[0.08em] text-slate-600">
                    Free Space
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-400">
                    148.2 GB
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="!text-[8px] uppercase tracking-[0.08em] text-slate-600">
                    Installation Location
                  </p>
                  <p className="mt-1 truncate text-[10px] font-medium text-slate-300">
                    {browseLocation}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBrowseLocation}
                className="flex w-full items-center justify-between rounded-xl border border-violet-400/15 bg-violet-500/[0.05] px-4 py-3 text-left transition hover:border-violet-400/30 hover:bg-violet-500/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="size-4 text-violet-400" />
                  <div>
                    <p className="!text-[9px] font-bold text-slate-300">
                      Change Browse Location
                    </p>
                    <p className="mt-0.5 !text-[8px] text-slate-600">
                      Choose where games will be installed
                    </p>
                  </div>
                </div>

                <span className="!text-[8px] font-bold uppercase tracking-[0.08em] text-violet-400">
                  Change
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Library;