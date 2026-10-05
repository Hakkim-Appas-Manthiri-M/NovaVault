import {
  CalendarDays,
  Download,
  DownloadCloud,
  HardDriveDownload,
  Megaphone,
  MoreHorizontal,
  Pause,
  Play,
  Settings,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

const INITIAL_DOWNLOAD = {
  id: 1,
  title: "Grand Theft Auto V",
  edition: "Enhanced Edition",
  size: 106.8,
  downloaded: 30.6,
  progress: 30.8,
  remaining: "12 min remaining",
  status: "Installing",
  speed: 30.37,
  read: 0,
  write: 25.33,
};

function formatSize(value) {
  return `${value.toFixed(2)} GB`;
}

function formatSpeed(value) {
  return `${value.toFixed(2)} Mbps`;
}

function Downloads() {
  const [activeSection, setActiveSection] = useState("overview");
  const [download, setDownload] = useState(INITIAL_DOWNLOAD);
  const [isPaused, setIsPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setDownload((current) => {
        if (!current) return current;

        const nextDownloaded = Math.min(
          current.downloaded + 0.08,
          current.size,
        );

        const nextProgress = (nextDownloaded / current.size) * 100;

        if (nextDownloaded >= current.size) {
          return {
            ...current,
            downloaded: current.size,
            progress: 100,
            remaining: "Completed",
            status: "Completed",
            speed: 0,
            read: 0,
            write: 0,
          };
        }

        return {
          ...current,
          downloaded: nextDownloaded,
          progress: nextProgress,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const togglePause = () => {
    if (!download || download.progress >= 100) {
      return;
    }

    setIsPaused((current) => !current);

    setDownload((current) => {
      if (!current) return current;

      return {
        ...current,
        status: isPaused ? "Installing" : "Paused",
      };
    });
  };

  const cancelDownload = () => {
    setDownload(null);
    setIsPaused(false);
    setMenuOpen(false);
  };

  const resetDownload = () => {
    setDownload(INITIAL_DOWNLOAD);
    setIsPaused(false);
  };

  const renderContent = () => {
    if (activeSection === "scheduled") {
      return (
        <section className="nv-download-empty">
          <CalendarDays className="size-7 text-violet-400" />

          <h2>Scheduled Downloads</h2>

          <p>Games scheduled for download will appear here.</p>
        </section>
      );
    }

    if (activeSection === "recent") {
      return (
        <section className="nv-download-empty">
          <DownloadCloud className="size-7 text-violet-400" />

          <h2>Recently Updated</h2>

          <p>Recently downloaded and updated games will appear here.</p>
        </section>
      );
    }

    if (activeSection === "settings") {
      return (
        <section className="nv-download-settings">
          <div>
            <p className="nv-download-eyebrow">Downloads</p>

            <h2>Download Settings</h2>

            <p>Manage how NovaVault handles your game downloads.</p>
          </div>

          <div className="nv-setting-card">
            <div>
              <strong>Download location</strong>

              <span>Choose where your games are installed.</span>
            </div>

            <button type="button">Change</button>
          </div>

          <div className="nv-setting-card">
            <div>
              <strong>Download speed</strong>

              <span>Use the fastest available connection.</span>
            </div>

            <button type="button">Unlimited</button>
          </div>
        </section>
      );
    }

    return (
      <>
        <div className="mb-7">
          <p className="nv-download-eyebrow">Downloads</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="nv-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Latest Activity
              </h1>

              <p className="mt-1 !text-[12px] text-slate-500">
                Manage your active game downloads and updates.
              </p>
            </div>

            <div className="hidden items-center gap-2 !text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:flex">
              <Download className="size-3" />
              <span>Download Manager</span>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-violet-400" />

            <span className="!text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Active
            </span>
          </div>

          {download ? (
            <article className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#101019]/90 shadow-2xl shadow-black/20">
              {/* Main download row */}
              <div className="p-3.5 sm:p-4">
                <div className="flex items-center gap-3">
                  {/* Game cover */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-950 shadow-lg shadow-violet-950/20 sm:h-16 sm:w-16">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.25),transparent_35%)]" />

                    <div className="relative flex h-full flex-col justify-end p-2">
                      <span className="!text-[7px] font-black uppercase tracking-[0.1em] text-white/70">
                        NovaVault
                      </span>

                      <span className="!text-[9px] font-black leading-tight text-white">
                        FORZA
                      </span>

                      <span className="!text-[7px] font-bold text-violet-200">
                        HORIZON 5
                      </span>
                    </div>
                  </div>

                  {/* Title + progress */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate !text-[14px] font-bold text-white sm:!text-[16px]">
                          {download.title}
                        </h2>

                        <p className="truncate !text-[10px] text-slate-500 sm:!text-[11px]">
                          {download.edition}
                        </p>
                      </div>

                      <div className="hidden shrink-0 text-right sm:block">
                        <span className="!text-[10px] font-semibold text-slate-400">
                          {formatSize(download.downloaded)}
                        </span>

                        <span className="!text-[10px] text-slate-600">
                          {" "}
                          / {formatSize(download.size)}
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-400 transition-all duration-500"
                        style={{
                          width: `${download.progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <span className="!text-[10px] text-slate-500">
                        {isPaused ? "Download paused" : download.status}
                        {" · "}
                        {download.remaining}
                      </span>

                      <span className="shrink-0 !text-[10px] font-semibold text-slate-400 sm:hidden">
                        {formatSize(download.downloaded)} /{" "}
                        {formatSize(download.size)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                    <button
                      type="button"
                      onClick={togglePause}
                      aria-label={
                        isPaused ? "Resume download" : "Pause download"
                      }
                      className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.05] text-slate-400 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      {isPaused ? (
                        <Play className="size-3.5" />
                      ) : (
                        <Pause className="size-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={cancelDownload}
                      aria-label="Cancel download"
                      className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.05] text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <X className="size-4" />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuOpen((current) => !current)}
                        aria-label="More download actions"
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>

                      {menuOpen && (
                        <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c0d15] p-1.5 shadow-2xl">
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              setIsPaused(true);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left !text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <Pause className="size-3.5" />
                            Pause download
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              cancelDownload();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left !text-[8px] font-semibold text-red-400 transition hover:bg-red-500/10"
                          >
                            <Trash2 className="size-3.5" />
                            Cancel download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile action */}
                  <button
                    type="button"
                    onClick={togglePause}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-slate-400 sm:hidden"
                    aria-label={isPaused ? "Resume download" : "Pause download"}
                  >
                    {isPaused ? (
                      <Play className="size-3" />
                    ) : (
                      <Pause className="size-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Transfer statistics */}
              <div className="grid grid-cols-1 border-t border-white/[0.06] sm:grid-cols-3">
                <div className="min-w-0 border-b border-white/[0.06] p-4 sm:border-b-0 sm:border-r">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="!text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Download
                    </span>

                    <DownloadCloud className="size-3.5 text-violet-400" />
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <span className="!text-[12px] font-semibold text-slate-400">
                      {formatSpeed(isPaused ? 0 : download.speed)}
                    </span>

                    <div className="h-8 w-1/2 overflow-hidden">
                      <svg
                        viewBox="0 0 180 40"
                        className="h-full w-full"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 29 L15 29 L25 23 L38 26 L52 21 L65 23 L80 19 L96 23 L110 17 L128 20 L145 18 L160 21 L180 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-violet-400"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 border-b border-white/[0.06] p-4 sm:border-b-0 sm:border-r">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="!text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Read
                    </span>

                    <HardDriveDownload className="size-3.5 text-slate-500" />
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <span className="!text-[12px] font-semibold text-slate-400">
                      {formatSpeed(download.read)}
                    </span>

                    <div className="h-8 w-1/2 overflow-hidden">
                      <svg
                        viewBox="0 0 180 40"
                        className="h-full w-full"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 29 L180 29"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-violet-500/60"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="!text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      Write
                    </span>

                    <HardDriveDownload className="size-3.5 text-fuchsia-400" />
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <span className="!text-[12px] font-semibold text-slate-400">
                      {formatSpeed(isPaused ? 0 : download.write)}
                    </span>

                    <div className="h-8 w-1/2 overflow-hidden">
                      <svg
                        viewBox="0 0 180 40"
                        className="h-full w-full"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 17 L18 21 L35 20 L51 23 L68 18 L84 21 L103 19 L121 23 L137 18 L154 21 L170 17 L180 18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-fuchsia-400/70"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile cancel */}
              <div className="flex border-t border-white/[0.06] p-2 sm:hidden">
                <button
                  type="button"
                  onClick={cancelDownload}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 !text-[10px] font-semibold text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <X className="size-3" />
                  Cancel Download
                </button>
              </div>
            </article>
          ) : (
            <div className="nv-download-empty">
              <DownloadCloud className="size-7 text-violet-400" />

              <h2>No Active Downloads</h2>

              <p>Your active downloads will appear here.</p>

              <button
                type="button"
                onClick={resetDownload}
                className="mt-2 rounded-lg bg-violet-600 px-4 py-2 !text-[10px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-violet-500"
              >
                Demo Download
              </button>
            </div>
          )}
        </section>
      </>
    );
  };

  return (
    <section className="min-h-screen min-w-0 bg-[#07080D] text-white">
      <div className="flex min-h-[calc(100vh-0px)] flex-col lg:flex-row">
        {/* Downloads Sidebar */}
        <aside className="w-full shrink-0 border-b border-white/[0.06] bg-[#0A0B10] lg:w-[230px] lg:border-b-0 lg:border-r">
          <div className="sticky top-0 p-4 lg:p-5">
            <div className="mb-5 flex items-center gap-2 px-1">
              <div className="flex size-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                <Download className="size-4 text-violet-400" />
              </div>

              <div>
                <p className="!text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  Downloads
                </p>

                <p className="!text-[9px] text-slate-600">NovaVault Manager</p>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => setActiveSection("overview")}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left",
                  "transition-all duration-200",
                  activeSection === "overview"
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300",
                ].join(" ")}
              >
                <DownloadCloud className="size-4" />

                <span className="!text-[11px] font-semibold">Overview</span>

                {download && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-white/[0.08] text-[9px] text-slate-400">
                    1
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("scheduled")}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left",
                  "transition-all duration-200",
                  activeSection === "scheduled"
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300",
                ].join(" ")}
              >
                <CalendarDays className="size-4" />

                <span className="!text-[11px] font-semibold">Scheduled</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("recent")}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left",
                  "transition-all duration-200",
                  activeSection === "recent"
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300",
                ].join(" ")}
              >
                <Megaphone className="size-4" />

                <span className="!text-[11px] font-semibold">
                  Recently Updated
                </span>
              </button>

              <div className="hidden h-px bg-white/[0.07] lg:block lg:my-2" />

              <button
                type="button"
                onClick={() => setActiveSection("settings")}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left",
                  "transition-all duration-200",
                  activeSection === "settings"
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300",
                ].join(" ")}
              >
                <Settings className="size-4" />

                <span className="!text-[11px] font-semibold">
                  Download Settings
                </span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1280px]">{renderContent()}</div>
        </main>
      </div>

      <style>{`
        .nv-download-eyebrow {
          margin-bottom: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgb(167 139 250);
        }

        .nv-download-empty {
          display: flex;
          min-height: 360px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgb(255 255 255 / 0.06);
          border-radius: 16px;
          background: rgb(16 17 25 / 0.72);
          text-align: center;
        }

        .nv-download-empty h2 {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: white;
        }

        .nv-download-empty p {
          max-width: 360px;
          margin: 0;
          font-size: 11px;
          line-height: 1.6;
          color: rgb(100 116 139);
        }

        .nv-download-settings {
          display: flex;
          max-width: 760px;
          flex-direction: column;
          gap: 12px;
        }

        .nv-download-settings h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .nv-download-settings > div:first-child > p:last-child {
          margin-top: 5px;
          font-size: 12px;
          color: rgb(100 116 139);
        }

        .nv-setting-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgb(255 255 255 / 0.06);
          border-radius: 12px;
          background: rgb(16 17 25 / 0.8);
          padding: 16px;
        }

        .nv-setting-card div {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 4px;
        }

        .nv-setting-card strong {
          font-size: 12px;
          color: rgb(226 232 240);
        }

        .nv-setting-card span {
          font-size: 10px;
          color: rgb(100 116 139);
        }

        .nv-setting-card button {
          flex-shrink: 0;
          border: 1px solid rgb(139 92 246 / 0.2);
          border-radius: 8px;
          background: rgb(139 92 246 / 0.1);
          padding: 8px 12px;
          font-size: 9px;
          font-weight: 700;
          color: rgb(196 181 253);
        }

        @media (max-width: 639px) {
          .nv-download-settings h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default Downloads;
