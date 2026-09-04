import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Monitor,
  Pause,
  Play,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageContainer from "../components/common/PageContainer";
import GameCard from "../components/games/GameCard";

import {
  featuredGames,
  gameMedia,
  newReleases,
  trendingGames,
} from "../constants/gameData";

import { useStore } from "../context/useStore";

const allGames = [...featuredGames, ...trendingGames, ...newReleases];

function getYouTubeVideoId(url = "") {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "").split("/")[0];
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v") || "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || "";
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      }
    }
  } catch {
    return "";
  }

  return "";
}

function GameDetails() {
  const { toggleWishlist, isWishlisted, addToCart, isInCart } = useStore();

  const { gameId } = useParams();

  const navigate = useNavigate();

  const game = allGames.find((item) => item.id === gameId);

  const mediaData = gameMedia?.[gameId];

  const screenshots = mediaData?.screenshots || (game ? [game.image] : []);

  const trailer = mediaData?.trailer || null;

  const trailerUrl = typeof trailer === "string" ? trailer : trailer?.url || "";

  const trailerType =
    typeof trailer === "string"
      ? trailer.includes("youtube.com") || trailer.includes("youtu.be")
        ? "youtube"
        : "mp4"
      : trailer?.type || "mp4";

  const youtubeVideoId =
    trailerType === "youtube" ? getYouTubeVideoId(trailerUrl) : "";

  const [activeMedia, setActiveMedia] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeReady, setYoutubeReady] = useState(false);
  const isTrailerActive = activeMedia === 0;

  const videoRef = useRef(null);
  const youtubeContainerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const thumbnailContainerRef = useRef(null);

  /*
   * ============================================================
   * YOUTUBE IFRAME PLAYER API
   * ============================================================
   */

  useEffect(() => {
    if (!isTrailerActive || trailerType !== "youtube" || !youtubeVideoId) {
      return undefined;
    }

    let cancelled = false;

    const createPlayer = () => {
      if (
        cancelled ||
        !window.YT ||
        !window.YT.Player ||
        !youtubeContainerRef.current
      ) {
        return;
      }

      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch {
          // Ignore cleanup errors.
        }

        youtubePlayerRef.current = null;
      }

      youtubeContainerRef.current.innerHTML = "";

      const playerHost = document.createElement("div");

      playerHost.className = "h-full w-full";

      youtubeContainerRef.current.appendChild(playerHost);

      youtubePlayerRef.current = new window.YT.Player(playerHost, {
        videoId: youtubeVideoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            if (!cancelled) {
              setYoutubeReady(true);
              setIsPlaying(false);
            }
          },

          onStateChange: (event) => {
            if (cancelled) return;

            /*
             * YouTube player states:
             * 1 = playing
             * 2 = paused
             * 0 = ended
             */
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }

            if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    const loadYouTubeApi = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }

      const existingScript = document.getElementById("youtube-iframe-api");

      if (existingScript) {
        const previousCallback = window.onYouTubeIframeAPIReady;

        window.onYouTubeIframeAPIReady = () => {
          if (typeof previousCallback === "function") {
            previousCallback();
          }

          createPlayer();
        };

        return;
      }

      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousCallback === "function") {
          previousCallback();
        }

        createPlayer();
      };

      const script = document.createElement("script");

      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      document.body.appendChild(script);
    };

    loadYouTubeApi();

    return () => {
      cancelled = true;

      setYoutubeReady(false);
      setIsPlaying(false);

      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch {
          // Ignore cleanup errors.
        }

        youtubePlayerRef.current = null;
      }
    };
  }, [isTrailerActive, trailerType, youtubeVideoId]);

  /*
   * ============================================================
   * CLEANUP HTML5 VIDEO WHEN SWITCHING MEDIA
   * ============================================================
   */

  useEffect(() => {
    if (activeMedia !== 0) {
      videoRef.current?.pause();

      if (videoRef.current) {
        videoRef.current.pause();
      }

      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.pauseVideo();
        } catch {
          // Ignore player state errors.
        }
      }
    }
  }, [activeMedia]);

  /*
   * ============================================================
   * NOT FOUND
   * ============================================================
   */

  if (!game) {
    return (
      <PageContainer className="py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-violet-400">
            NovaVault
          </p>

          <h1 className="nv-display mt-3 text-3xl font-bold text-white">
            Game Not Found
          </h1>

          <p className="mt-2 max-w-md text-[10px] leading-5 text-slate-500">
            The game you're looking for doesn't exist in the NovaVault
            collection.
          </p>

          <Link
            to="/games"
            className="
              mt-6 inline-flex min-h-10 items-center gap-2
              rounded-lg bg-violet-600 px-5
              !text-[10px] font-bold uppercase tracking-[0.08em]
              text-white transition hover:bg-violet-500
            "
          >
            <ArrowLeft className="size-3.5" />
            Back to Store
          </Link>
        </div>
      </PageContainer>
    );
  }

  const hasDiscount =
    Number(game.discount) > 0 &&
    Number(game.originalPrice) > Number(game.price);

  const relatedGames = allGames
    .filter((item) => item.id !== game.id)
    .slice(0, 4);

  const mediaCount = screenshots.length + 1;

  /*
   * ============================================================
   * PLAY / PAUSE
   * ============================================================
   */

  const toggleVideo = async () => {
    /*
     * YouTube trailer
     */
    if (trailerType === "youtube") {
      const player = youtubePlayerRef.current;

      if (!player || !youtubeReady) return;

      try {
        const playerState = player.getPlayerState();

        if (playerState === window.YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      } catch {
        // Ignore player interaction errors.
      }

      return;
    }

    /*
     * Normal MP4 trailer
     */
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  /*
   * ============================================================
   * CAROUSEL NAVIGATION
   * ============================================================
   */

  const selectPrevious = () => {
    setIsPlaying(false);

    setActiveMedia((current) => (current === 0 ? mediaCount - 1 : current - 1));
  };

  const selectNext = () => {
    setIsPlaying(false);

    setActiveMedia((current) => (current === mediaCount - 1 ? 0 : current + 1));
  };

  const scrollThumbnails = (direction) => {
    thumbnailContainerRef.current?.scrollBy({
      left: direction * 180,
      behavior: "smooth",
    });
  };


  const handleWishlist = () => {
    if (!game) return;

    toggleWishlist(game);
  };

  const handleAddToCart = () => {
    if (!game) return;

    addToCart(game);
  };

  const handleBuyNow = () => {
    if (!game) return;

    addToCart(game);
    navigate("/cart");
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen">
      {/* =========================================================
          TOP GAME CONTENT
      ========================================================== */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <img
            src={game.image}
            alt=""
            className="h-full w-full object-cover opacity-20 blur-[2px]"
          />

          <div className="absolute inset-0 bg-[#050711]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050711] via-[#050711]/70 to-[#050711]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050711] via-[#050711]/70 to-transparent" />
        </div>

        <PageContainer className="relative py-6 sm:py-8 lg:py-10">
          {/* Back */}
          <Link
            to="/games"
            className="
              inline-flex items-center gap-2
              !text-[10px] font-bold uppercase tracking-[0.08em]
              text-slate-500 transition-colors
              hover:text-white
            "
          >
            <ArrowLeft className="size-3.5" />
            Back to Store
          </Link>

          <div className="mt-7 grid gap-7 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-end xl:grid-cols-[320px_minmax(0,1fr)]">
            {/* Artwork */}
            <div className="relative mx-auto w-full max-w-[260px] lg:mx-0 lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#090D19] shadow-2xl shadow-black/40">
                <img
                  src={game.portraitImage || game.image}
                  alt={game.title}
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </div>

              {hasDiscount && (
                <span
                  className="
                    absolute left-3 top-3
                    rounded-md bg-violet-600
                    px-2 py-1
                    text-[8px] font-bold text-white
                    shadow-lg shadow-violet-950/30
                  "
                >
                  -{game.discount}%
                </span>
              )}
            </div>

            {/* Game Information */}
            <div className="min-w-0 -translate-y-4">
              <p className="!text-[10px] font-bold uppercase tracking-[0.25em] text-violet-400">
                NovaVault Game
              </p>

              <h1 className="nv-display mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-4xl">
                {game.title}
              </h1>

              <p className="mt-2 !text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">
                {game.genre || "Action"} · PC
              </p>

              {/* Rating */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Star className="size-3.5 fill-current text-amber-400" />

                  <span className="!text-[9px] font-bold text-white">
                    {game.rating}
                  </span>
                </div>

                {game.reviews && (
                  <>
                    <span className="text-slate-700">•</span>

                    <span className="!text-[10px] text-slate-500">
                      {game.reviews} reviews
                    </span>
                  </>
                )}
              </div>

              <p className="mt-4 max-w-2xl !text-[12px] leading-5 text-slate-400 sm:!text-[11px] sm:leading-6">
                {game.description ||
                  "Enter a new world filled with discovery, challenge, and unforgettable moments."}
              </p>

              {/* Purchase */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-[11px] text-slate-600 line-through">
                      ₹{Number(game.originalPrice).toLocaleString("en-IN")}
                    </span>
                  )}

                  <span className="nv-display text-1xl font-bold text-white">
                    ₹{Number(game.price).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="
                      inline-flex min-h-6 items-center justify-center gap-2
                      rounded-lg bg-violet-600 px-3
                      !text-[12px] font-bold uppercase tracking-[0.06em]
                      text-white shadow-lg shadow-violet-950/20
                      transition-all hover:bg-violet-500
                      active:scale-[0.98]
                    "
                  >
                    <Play className="size-2.5 fill-current" />
                    Buy Now
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    aria-label={`Add ${game.title} to cart`}
                    className="
                      flex size-9 items-center justify-center
                      rounded-lg border border-white/[0.08]
                      bg-white/[0.04] text-slate-300
                      transition-all hover:border-violet-400/30
                      hover:bg-violet-500/10 hover:text-violet-300
                      active:scale-95
                    "
                  >
                    <ShoppingCart
                      className={`size-4 ${isInCart(game.id) ? "fill-current" : ""}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={handleWishlist}
                    aria-label={`Add ${game.title} to wishlist`}
                    className="
                      flex size-9 items-center justify-center
                      rounded-lg border border-white/[0.08]
                      bg-white/[0.04] text-slate-300
                      transition-all hover:border-violet-400/30
                      hover:bg-violet-500/10 hover:text-violet-300
                      active:scale-95
                    "
                  >
                    <Heart
                      className={`size-4 ${isWishlisted(game.id) ? "fill-current" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Platforms */}
              <div className="mt-5 flex flex-wrap gap-2">
                {(game.platforms || ["PC"]).map((platform) => (
                  <span
                    key={platform}
                    className="
                      inline-flex items-center gap-1.5
                      rounded-md border border-white/[0.07]
                      bg-white/[0.025] px-2.5 py-1.5
                      text-[7px] font-bold uppercase
                      tracking-[0.08em] text-slate-500
                    "
                  >
                    <Monitor className="size-3" />
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* =========================================================
          PREMIUM MEDIA + GAME INFO
      ========================================================== */}
      <PageContainer className="py-8 sm:py-10 lg:py-12">
        <section>
          <div className="mb-5">
            <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-violet-400">
              Inside The World
            </p>

            <h2 className="nv-display mt-2 text-xl font-bold text-white sm:text-2xl">
              Media & Details
            </h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.75fr)]">
            {/* =====================================================
                LEFT — MEDIA
            ====================================================== */}
            <div className="min-w-0">
              {/* Main media */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090D19] shadow-xl shadow-black/20">
                {isTrailerActive ? (
                  <div className="relative aspect-video w-full bg-black">
                    {trailerType === "youtube" && youtubeVideoId ? (
                      <>
                        <div
                          ref={youtubeContainerRef}
                          className="absolute inset-0 h-full w-full"
                        />

                        {/* Center Play / Pause */}
                        <button
                          type="button"
                          onClick={toggleVideo}
                          disabled={!youtubeReady}
                          aria-label={
                            isPlaying ? "Pause trailer" : "Play trailer"
                          }
                          className="
                            absolute left-1/2 top-1/2 z-20
                            flex size-14
                            -translate-x-1/2 -translate-y-1/2
                            items-center justify-center
                            rounded-full
                            border border-white/20
                            bg-black/45
                            text-white
                            shadow-2xl shadow-black/30
                            backdrop-blur-md
                            transition-all duration-200
                            hover:scale-105
                            hover:bg-violet-600
                            active:scale-95
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          {isPlaying ? (
                            <Pause className="size-5 fill-current" />
                          ) : (
                            <Play className="ml-0.5 size-5 fill-current" />
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          key={trailerUrl}
                          src={trailerUrl}
                          poster={game.image}
                          playsInline
                          controls
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                          className="h-full w-full object-cover"
                        />

                        {/* Center Play / Pause */}
                        <button
                          type="button"
                          onClick={toggleVideo}
                          aria-label={
                            isPlaying ? "Pause trailer" : "Play trailer"
                          }
                          className="
                            absolute left-1/2 top-1/2 z-20
                            flex size-14
                            -translate-x-1/2 -translate-y-1/2
                            items-center justify-center
                            rounded-full border border-white/20
                            bg-black/45 text-white
                            shadow-2xl shadow-black/30
                            backdrop-blur-md
                            transition-all duration-200
                            hover:scale-105
                            hover:bg-violet-600
                            active:scale-95
                          "
                        >
                          {isPlaying ? (
                            <Pause className="size-5 fill-current" />
                          ) : (
                            <Play className="ml-0.5 size-5 fill-current" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <img
                    src={screenshots[activeMedia - 1]}
                    alt={`${game.title} screenshot ${activeMedia}`}
                    className="aspect-video w-full object-cover"
                  />
                )}

                {/* Media label */}
                <div
                  className="
                    pointer-events-none absolute left-3 top-3
                    z-30 rounded-md border border-white/10
                    bg-black/50 px-2.5 py-1.5
                    text-[7px] font-bold uppercase
                    tracking-[0.12em] text-white
                    backdrop-blur-md
                  "
                >
                  {isTrailerActive ? "Official Trailer" : "Screenshot"}
                </div>

                {/* Navigation */}
                {mediaCount > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={selectPrevious}
                      aria-label="Previous media"
                      className="
                        absolute left-3 top-1/2 z-40
                        flex size-9 -translate-y-1/2
                        items-center justify-center
                        rounded-lg border border-white/10
                        bg-black/45 text-slate-300
                        backdrop-blur-md transition
                        hover:border-violet-400/30
                        hover:bg-violet-600
                        hover:text-white
                      "
                    >
                      <ChevronLeft className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={selectNext}
                      aria-label="Next media"
                      className="
                        absolute right-3 top-1/2 z-40
                        flex size-9 -translate-y-1/2
                        items-center justify-center
                        rounded-lg border border-white/10
                        bg-black/45 text-slate-300
                        backdrop-blur-md transition
                        hover:border-violet-400/30
                        hover:bg-violet-600
                        hover:text-white
                      "
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </>
                )}

                {/* Counter */}
                <div
                  className="
                    absolute bottom-3 right-3 z-30
                    rounded-md border border-white/10
                    bg-black/50 px-2 py-1
                    text-[7px] font-bold text-slate-300
                    backdrop-blur-md
                  "
                >
                  {activeMedia + 1} / {mediaCount}
                </div>
              </div>

              {/* =================================================
                  LANDSCAPE THUMBNAILS
              ================================================== */}
              <div className="relative mt-3">
                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {/* Trailer thumbnail */}
                  <button
                    type="button"
                    onClick={() => setActiveMedia(0)}
                    className={`
                    group relative w-[120px] min-w-[120px]
                    overflow-hidden rounded-lg border
                    transition-all duration-200
                    sm:w-[140px] sm:min-w-[140px]
                    ${
                      isTrailerActive
                        ? "border-violet-400/60 ring-1 ring-violet-400/20"
                        : "border-white/[0.07] hover:border-white/20"
                    }
                  `}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={mediaData?.trailerThumbnail ?? game.image}
                        alt={`${game.title} trailer preview`}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/40" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex size-7 items-center justify-center rounded-full bg-white/90 text-black">
                          <Play className="ml-0.5 size-3 fill-current" />
                        </span>
                      </div>

                      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-1 text-[6px] font-bold uppercase tracking-wide text-white">
                        Trailer
                      </span>
                    </div>
                  </button>

                  {/* Screenshot thumbnails */}
                  {screenshots.map((image, index) => {
                    const mediaIndex = index + 1;

                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveMedia(mediaIndex)}
                        className={`
                        group relative w-[120px] min-w-[120px]
                        overflow-hidden rounded-lg border
                        transition-all duration-200
                        sm:w-[140px] sm:min-w-[140px]
                        ${
                          activeMedia === mediaIndex
                            ? "border-violet-400/60 ring-1 ring-violet-400/20"
                            : "border-white/[0.07] hover:border-white/20"
                        }
                      `}
                      >
                        <img
                          src={image}
                          alt={`${game.title} screenshot ${index + 1}`}
                          className="
                          aspect-video h-full w-full object-cover
                          transition-transform duration-300
                          group-hover:scale-105
                        "
                        />

                        {activeMedia === mediaIndex && (
                          <div className="absolute inset-0 bg-violet-500/10" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => scrollThumbnails(-1)}
                  aria-label="Scroll thumbnails left"
                  className="absolute left-1 top-1/2 z-20 hidden size-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-slate-300 shadow-lg backdrop-blur-md transition hover:border-violet-400/30 hover:bg-violet-600 hover:text-white lg:flex"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollThumbnails(1)}
                  aria-label="Scroll thumbnails right"
                  className="absolute right-1 top-1/2 z-20 hidden size-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-slate-300 shadow-lg backdrop-blur-md transition hover:border-violet-400/30 hover:bg-violet-600 hover:text-white lg:flex"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* =====================================================
                RIGHT — GAME INFO
            ====================================================== */}
            <aside className="min-w-0">
              <div className="h-full rounded-2xl border border-white/[0.07] bg-[#090D19] p-5 shadow-xl shadow-black/10">
                {/* Header */}
                <div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-violet-400">
                    Game Info
                  </p>

                  <h3 className="nv-display mt-2 text-lg font-bold text-white">
                    {game.title}
                  </h3>
                </div>

                {/* Basic info */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[8px] text-slate-600">Genre</span>

                    <span className="text-right text-[8px] font-semibold text-slate-300">
                      {game.genre || "Action"}
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.05]" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[8px] text-slate-600">Platform</span>

                    <span className="text-[8px] font-semibold text-slate-300">
                      {(game.platforms || ["PC"]).join(" · ")}
                    </span>
                  </div>

                  <div className="h-px bg-white/[0.05]" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[8px] text-slate-600">Rating</span>

                    <span className="flex items-center gap-1 text-[8px] font-semibold text-slate-300">
                      <Star className="size-3 fill-current text-amber-400" />
                      {game.rating}
                    </span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-violet-400">
                    System Requirements
                  </p>

                  {/* Minimum */}
                  <div className="mt-4">
                    <p className="text-[8px] font-bold uppercase tracking-[0.06em] text-slate-300">
                      Minimum
                    </p>

                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">OS</span>

                        <span className="text-right text-[7px] text-slate-400">
                          Windows 10
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">
                          Processor
                        </span>

                        <span className="text-right text-[7px] text-slate-400">
                          Intel Core i5
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">
                          Memory
                        </span>

                        <span className="text-right text-[7px] text-slate-400">
                          8 GB RAM
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">
                          Graphics
                        </span>

                        <span className="text-right text-[7px] text-slate-400">
                          GTX 1060
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended */}
                  <div className="mt-5">
                    <p className="text-[8px] font-bold uppercase tracking-[0.06em] text-slate-300">
                      Recommended
                    </p>

                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">OS</span>

                        <span className="text-right text-[7px] text-slate-400">
                          Windows 11
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">
                          Processor
                        </span>

                        <span className="text-right text-[7px] text-slate-400">
                          Intel Core i7
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">
                          Memory
                        </span>

                        <span className="text-right text-[7px] text-slate-400">
                          16 GB RAM
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-[7px] text-slate-600">
                          Graphics
                        </span>

                        <span className="text-right text-[7px] text-slate-400">
                          RTX 3060
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="mt-5 rounded-lg border border-violet-400/10 bg-violet-500/[0.035] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Storage
                      </span>

                      <span className="text-[8px] font-bold text-violet-300">
                        70 GB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* =========================================================
            ABOUT
        ========================================================== */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section>
            <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-violet-400">
              Experience
            </p>

            <h2 className="nv-display mt-2 text-xl font-bold text-white sm:text-2xl">
              About This Game
            </h2>

            <p className="mt-4 max-w-3xl text-[10px] leading-5 text-slate-500 sm:text-[11px] sm:leading-6">
              {game.description ||
                "Discover a carefully crafted gaming experience built around exploration, action, and immersive worlds."}
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {[
                "Immersive World",
                "Premium Experience",
                "Controller Support",
              ].map((feature) => (
                <div
                  key={feature}
                  className="
                    rounded-xl border border-white/[0.06]
                    bg-white/[0.018] p-4
                  "
                >
                  <Check className="size-4 text-violet-400" />

                  <p className="mt-3 !text-[8px] font-bold uppercase tracking-[0.06em] text-slate-300">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* =========================================================
            RELATED GAMES
        ========================================================== */}
        {relatedGames.length > 0 && (
          <section className="mt-12 sm:mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="!text-[8px] font-bold uppercase tracking-[0.25em] text-violet-400">
                  You May Like
                </p>

                <h2 className="nv-display mt-2 text-xl font-bold text-white sm:text-2xl">
                  More From The Vault
                </h2>
              </div>

              <Link
                to="/games"
                className="
                  shrink-0 text-[8px] font-bold uppercase
                  tracking-[0.08em] text-slate-500
                  transition hover:text-violet-300
                "
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {relatedGames.map((relatedGame) => (
                <GameCard key={relatedGame.id} game={relatedGame} />
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}

export default GameDetails;
