import {
  CheckCircle2,
  Download,
  DownloadCloud,
  HardDrive,
  LibraryBig,
  MoreHorizontal,
  Pause,
  Play,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getGameById } from "../services/gameApi";

function formatSize(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `${number.toFixed(2)} GB`;
}

function formatSpeed(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return "0.00 Mbps";
  }

  return `${number.toFixed(2)} Mbps`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "Calculating...";
  }

  const totalSeconds = Math.ceil(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s remaining`;
  }

  return `${remainingSeconds}s remaining`;
}

function Downloads() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gameId = searchParams.get("gameId");

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [downloaded, setDownloaded] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  const [browseLocation, setBrowseLocation] = useState("D:\\NovaVault\\Games");

  const simulationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastDownloadedRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const loadGame = async () => {
      if (!gameId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getGameById(gameId);

        if (cancelled) {
          return;
        }

        if (!data?.game) {
          throw new Error("Game not found.");
        }

        setGame({
          ...data.game,
          id: data.game._id || data.game.id,
        });
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Unable to load the selected game.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGame();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  const downloadSize = useMemo(() => {
    if (!game) {
      return 0;
    }

    return Number(game.download?.downloadSize ?? 0);
  }, [game]);

  const installSize = useMemo(() => {
    if (!game) {
      return 0;
    }

    return Number(game.download?.installSize ?? 0);
  }, [game]);

  const progress =
    downloadSize > 0 ? Math.min((downloaded / downloadSize) * 100, 100) : 0;

  const isCompleted = progress >= 100;

  const speed = isPaused || isCompleted ? 0 : downloadSpeed;

  const remainingBytes = Math.max(downloadSize - downloaded, 0);

  const remainingSeconds =
    speed > 0
      ? (remainingBytes * 1024 * 1024 * 1024) / ((speed * 1024 * 1024) / 8)
      : 0;

  const stopSimulation = useCallback(() => {
    if (simulationRef.current) {
      window.clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  const createSimulation = useCallback(() => {
    if (!game || downloadSize <= 0 || isCompleted) {
      return;
    }

    stopSimulation();

    lastTimeRef.current = performance.now();
    lastDownloadedRef.current = downloaded;

    simulationRef.current = window.setInterval(() => {
      setDownloaded((current) => {
        if (current >= downloadSize) {
          stopSimulation();
          setDownloadSpeed(0);
          return downloadSize;
        }

        const now = performance.now();
        const elapsed = (now - lastTimeRef.current) / 1000;

        const simulatedSpeedMbps = 35 + Math.random() * 30;

        const bytesPerSecond = (simulatedSpeedMbps * 1024 * 1024) / 8;

        const increase =
          (bytesPerSecond * Math.max(elapsed, 0.1)) / (1024 * 1024 * 1024);

        const nextValue = Math.min(current + increase, downloadSize);

        const actualElapsed = (now - lastTimeRef.current) / 1000;

        if (actualElapsed >= 0.4) {
          const actualIncrease = nextValue - lastDownloadedRef.current;

          const actualSpeed =
            actualElapsed > 0
              ? (actualIncrease * 1024 * 1024 * 1024 * 8) /
                actualElapsed /
                (1024 * 1024)
              : 0;

          setDownloadSpeed(
            Number(Math.max(actualSpeed, simulatedSpeedMbps).toFixed(2)),
          );

          lastTimeRef.current = now;
          lastDownloadedRef.current = nextValue;
        }

        if (nextValue >= downloadSize) {
          stopSimulation();
          setDownloadSpeed(0);
          return downloadSize;
        }

        return Number(nextValue.toFixed(4));
      });
    }, 250);
  }, [game, downloadSize, isCompleted, downloaded, stopSimulation]);

  const startSimulation = () => {
    if (!game || downloadSize <= 0 || isCompleted) {
      return;
    }

    setIsPaused(false);
    createSimulation();
  };

  useEffect(() => {
    if (!game || downloadSize <= 0 || isCompleted) {
      return;
    }

    createSimulation();

    return () => {
      stopSimulation();
    };
  }, [game, downloadSize, isCompleted, createSimulation, stopSimulation]);

  const togglePause = () => {
    if (!game || isCompleted) {
      return;
    }

    if (isPaused) {
      startSimulation();
    } else {
      stopSimulation();
      setIsPaused(true);
      setDownloadSpeed(0);
    }

    setMenuOpen(false);
  };

  const cancelDownload = () => {
    stopSimulation();

    setDownloaded(0);
    setDownloadSpeed(0);
    setIsPaused(true);
    setMenuOpen(false);
    setIsCancelled(true);
  };

  const changeLocation = () => {
    const nextLocation = window.prompt(
      "Enter your NovaVault game installation location:",
      browseLocation,
    );

    if (nextLocation?.trim()) {
      setBrowseLocation(nextLocation.trim());
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090D] px-4 py-8 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="h-5 w-24 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-3 h-8 w-64 animate-pulse rounded bg-white/[0.06]" />
          <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-white/[0.04]" />
          <div className="mt-8 h-52 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.025]" />
        </div>
      </main>
    );
  }

  if (isCancelled || !gameId) {
    return (
      <main className="min-h-screen bg-[#09090D] text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center px-4 py-10">
          <section className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#111117] p-7 text-center shadow-2xl shadow-black/20">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.08] text-violet-400">
              <DownloadCloud className="size-5" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-white">
              No active downloads
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              There are currently no active game downloads.
            </p>

            <button
              type="button"
              onClick={() => navigate("/library")}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-5 !text-[10px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-violet-500"
            >
              <LibraryBig className="size-3.5" />
              Go to Library
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090D] px-5 text-slate-100">
        <section className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-[#111117] p-7 text-center shadow-2xl shadow-black/30">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.08] text-violet-400">
            <DownloadCloud className="size-5" />
          </div>

          <h1 className="mt-4 text-xl font-bold text-white">
            Download unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "The selected game could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/library")}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-5 !text-[10px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-violet-500"
          >
            <LibraryBig className="size-3.5" />
            Go to Library
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090D] text-slate-100">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <header className="mb-7">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/[0.08] text-violet-400">
              <Download className="size-4" />
            </div>

            <p className="!text-[8px] font-bold uppercase tracking-[0.2em] text-violet-400">
              NovaVault
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Download Manager
              </h1>

              <p className="mt-1 !text-[11px] leading-5 text-slate-500 sm:text-xs">
                Manage your NovaVault game download and installation.
              </p>
            </div>

            <div className="hidden items-center gap-2 !text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:flex">
              <HardDrive className="size-3.5" />
              <span>{browseLocation}</span>
            </div>
          </div>
        </header>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <span
              className={[
                "size-1.5 rounded-full",
                isCompleted
                  ? "bg-emerald-400"
                  : isPaused
                    ? "bg-amber-400"
                    : "bg-violet-400",
              ].join(" ")}
            />

            <span className="!text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
              {isCompleted ? "Completed" : isPaused ? "Paused" : "Active"}
            </span>
          </div>

          <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111117] shadow-2xl shadow-black/20">
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B0D16] sm:size-[72px]">
                    <img
                      src={game.portraitImage || game.image || ""}
                      alt={game.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white sm:text-base">
                      {game.title}
                    </p>

                    <p className="mt-1 truncate !text-[9px] uppercase tracking-[0.08em] text-slate-600">
                      {game.genre || "Game"} •{" "}
                      {game.platforms?.join(" • ") || "PC"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={[
                          "!text-[9px] font-semibold",
                          isCompleted
                            ? "text-emerald-400"
                            : isPaused
                              ? "text-amber-400"
                              : "text-slate-400",
                        ].join(" ")}
                      >
                        {isCompleted
                          ? "Installation complete"
                          : isPaused
                            ? "Download paused"
                            : "Downloading"}
                      </span>

                      <span className="text-slate-700">•</span>

                      <span className="!text-[9px] text-slate-600">
                        v{game.download?.version || "1.0.0"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative flex shrink-0 items-center gap-2">
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={togglePause}
                      aria-label={
                        isPaused ? "Resume download" : "Pause download"
                      }
                      className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-slate-400 transition hover:border-violet-400/20 hover:bg-violet-500/[0.08] hover:text-violet-300"
                    >
                      {isPaused ? (
                        <Play className="size-4 fill-current" />
                      ) : (
                        <Pause className="size-4" />
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setMenuOpen((current) => !current)}
                    aria-label={
                      menuOpen ? "Close download options" : "Download options"
                    }
                    aria-expanded={menuOpen}
                    className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-slate-400 transition-colors duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.08] hover:text-violet-300"
                  >
                    <span
                      className={[
                        "flex items-center justify-center transition-transform duration-[700ms] ease-in-out",
                        menuOpen ? "rotate-[180deg]" : "rotate-0",
                      ].join(" ")}
                    >
                      {menuOpen ? (
                        <X className="size-4" />
                      ) : (
                        <MoreHorizontal className="size-4" />
                      )}
                    </span>
                  </button>

                  <div
                    className={[
                      "absolute right-0 top-11 z-50 w-40 origin-top-right overflow-hidden rounded-xl border border-white/[0.08] bg-[#101017] p-1.5 shadow-2xl shadow-black/50",
                      "transition-all duration-600 ease-out",
                      menuOpen && !isCompleted
                        ? "visible translate-y-0 scale-100 opacity-100"
                        : "invisible -translate-y-2 scale-95 opacity-0 pointer-events-none",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={cancelDownload}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left !text-[8px] font-bold uppercase tracking-[0.08em] text-red-400 transition-colors duration-200 hover:bg-red-500/[0.08] hover:text-red-300"
                    >
                      <Trash2 className="size-3 shrink-0" />

                      <span className="leading-none">Cancel download</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={[
                          "h-full rounded-full transition-[width] duration-500",
                          isCompleted ? "bg-emerald-500" : "bg-violet-600",
                        ].join(" ")}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="shrink-0 !text-[10px] font-bold text-slate-400">
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="!text-[9px] text-slate-600">
                    {formatSize(downloaded)} of {formatSize(downloadSize)}
                  </span>

                  <span className="!text-[9px] text-slate-600">
                    {isCompleted
                      ? "Ready to play"
                      : isPaused
                        ? "Paused"
                        : formatTime(remainingSeconds)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid border-t border-white/[0.06] sm:grid-cols-3">
              <div className="border-b border-white/[0.06] p-4 sm:border-b-0 sm:border-r">
                <p className="!text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
                  Download
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {formatSpeed(speed)}
                </p>
              </div>

              <div className="border-b border-white/[0.06] p-4 sm:border-b-0 sm:border-r">
                <p className="!text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
                  Read
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {isCompleted ? "0.00 Mbps" : "18.42 Mbps"}
                </p>
              </div>

              <div className="p-4">
                <p className="!text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
                  Write
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {isCompleted ? "0.00 Mbps" : "24.18 Mbps"}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-5">
            <div className="flex items-center gap-2">
              <HardDrive className="size-4 text-violet-400" />

              <h2 className="text-xs font-bold text-white">Storage</h2>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="!text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
                  Download Size
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {formatSize(downloadSize)}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="!text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
                  Install Size
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  {formatSize(installSize)}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="!text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
                Installation Location
              </p>

              <p className="mt-1 truncate !text-[10px] font-medium text-slate-300">
                {browseLocation}
              </p>
            </div>

            <button
              type="button"
              onClick={changeLocation}
              className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] !text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 transition hover:border-violet-400/20 hover:bg-violet-500/[0.06] hover:text-violet-300"
            >
              <Settings className="size-3.5" />
              Change Location
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-5">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <CheckCircle2 className="size-4 text-emerald-400" />
              ) : (
                <DownloadCloud className="size-4 text-violet-400" />
              )}

              <h2 className="text-xs font-bold text-white">Download Status</h2>
            </div>

            <div className="mt-5">
              <p className="!text-[8px] font-bold uppercase tracking-[0.1em] text-slate-600">
                Current Status
              </p>

              <p
                className={[
                  "mt-1 text-lg font-bold",
                  isCompleted
                    ? "text-emerald-400"
                    : isPaused
                      ? "text-amber-400"
                      : "text-white",
                ].join(" ")}
              >
                {isCompleted
                  ? "Completed"
                  : isPaused
                    ? "Paused"
                    : "Downloading"}
              </p>
            </div>

            <div className="mt-4 h-px bg-white/[0.05]" />

            <div className="mt-4 flex items-center justify-between">
              <span className="!text-[9px] text-slate-600">Game</span>

              <span className="max-w-[60%] truncate !text-[9px] font-semibold text-slate-300">
                {game.title}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="!text-[9px] text-slate-600">Platform</span>

              <span className="!text-[9px] font-semibold text-slate-300">
                {game.platforms?.join(" • ") || "PC"}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="!text-[9px] text-slate-600">Version</span>

              <span className="!text-[9px] font-semibold text-slate-300">
                {game.download?.version || "1.0.0"}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Downloads;
