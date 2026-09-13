import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  Play,
  ShoppingCart,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/useStore";
import { getGames } from "../../services/gameApi";
import GiftModal from "../common/GiftModal";

const HERO_INTERVAL = 7000;

function HomeHero() {
  const { toggleWishlist, isWishlisted, isGameOwned } = useStore();

  const [featuredGames, setFeaturedGames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  const activeGame = featuredGames[activeIndex];

  const owned = activeGame ? isGameOwned(activeGame.id) : false;

  /*
   * Load featured games
   */
  useEffect(() => {
    let cancelled = false;

    const loadFeaturedGames = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGames({
          featured: true,
          limit: 5,
        });

        if (cancelled) return;

        const games = (data.games || []).map((game) => ({
          ...game,
          id: game._id,
          slug: game.slug,
        }));

        setFeaturedGames(games);
        setActiveIndex(0);
      } catch (err) {
        if (cancelled) return;

        setError(err.message || "Failed to load featured games.");
        setFeaturedGames([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFeaturedGames();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Preload the next slide.
   */
  useEffect(() => {
    if (featuredGames.length <= 1 || !activeGame) {
      return undefined;
    }

    const nextIndex = (activeIndex + 1) % featuredGames.length;

    const nextGame = featuredGames[nextIndex];

    if (!nextGame?.image) {
      return undefined;
    }

    const image = new Image();
    image.decoding = "async";
    image.src = nextGame.image;

    return undefined;
  }, [activeIndex, activeGame, featuredGames]);

  /*
   * Automatic carousel
   */
  useEffect(() => {
    if (isPaused || featuredGames.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % featuredGames.length;
      });
    }, HERO_INTERVAL);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, featuredGames.length]);

  const goNext = () => {
    if (featuredGames.length <= 1) return;

    setActiveIndex((current) => {
      return (current + 1) % featuredGames.length;
    });
  };

  const goPrevious = () => {
    if (featuredGames.length <= 1) return;

    setActiveIndex((current) => {
      return (current - 1 + featuredGames.length) % featuredGames.length;
    });
  };

  /*
   * Format platforms once per active game.
   */
  const platforms = useMemo(() => {
    return (activeGame?.platforms || ["PC"]).slice(0, 2);
  }, [activeGame]);

  /*
   * Initial loading
   */
  if (loading) {
    return (
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div
          className="
            mx-auto
            h-[415px]
            max-w-[1240px]
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#080A14]
            sm:h-[430px]
            lg:h-[500px]
            xl:h-[560px]
          "
        >
          <div
            className="
              h-full
              w-full
              animate-pulse
              bg-gradient-to-br
              from-violet-500/[0.10]
              via-[#0B0D18]
              to-[#050711]
            "
          />
        </div>
      </section>
    );
  }

  /*
   * Error / empty
   */
  if (error || !activeGame) {
    return (
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div
          className="
            mx-auto
            flex
            h-[415px]
            max-w-[1240px]
            items-center
            justify-center
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#080A14]
            sm:h-[430px]
            lg:h-[500px]
            xl:h-[560px]
          "
        >
          <p
            className="
              !text-[9px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-slate-600
            "
          >
            {error || "No featured games available."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
      <div
        className="
          mx-auto
          max-w-[1240px]
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* =====================================================
            DESKTOP / TABLET HERO
            ===================================================== */}

        <div
          className="
            hidden
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#080A14]
            shadow-2xl
            shadow-black/30
            md:grid
            md:grid-cols-[minmax(0,1fr)_148px]
            lg:grid-cols-[minmax(0,1fr)_164px]
          "
        >
          {/* ===================================================
              MAIN FEATURE
              =================================================== */}

          <div
            className="
              relative
              h-[430px]
              overflow-hidden
              lg:h-[500px]
              xl:h-[560px]
            "
          >
            {/* -------------------------------------------------
                FIXED HERO ARTWORK
                ------------------------------------------------- */}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeGame.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}
                className="absolute inset-0"
              >
                <img
                  src={activeGame.image}
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                />

                {/* ------------------------------------------------
                    REDUCED CINEMATIC LEFT OVERLAY
                    ------------------------------------------------ */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#050711]/72
                    via-[#050711]/24
                    to-transparent
                  "
                />

                {/* ------------------------------------------------
                    BOTTOM READABILITY
                    ------------------------------------------------ */}

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-[62%]
                    bg-gradient-to-t
                    from-[#050711]/95
                    via-[#050711]/42
                    to-transparent
                  "
                />

                {/* ------------------------------------------------
                    SOFT NOVAVAULT VIOLET ATMOSPHERE
                    ------------------------------------------------ */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_76%_35%,rgba(139,92,246,0.13),transparent_40%)]
                  "
                />
              </motion.div>
            </AnimatePresence>

            {/* ===================================================
                CONTENT
                =================================================== */}

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${activeGame.id}`}
                initial={{
                  opacity: 0,
                  x: -18,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  z-10
                  max-w-[570px]
                  p-6
                  lg:p-8
                "
              >
                {/* Category */}
                <div className="flex items-center gap-2">
                  <span
                    className="
                      rounded-md
                      bg-violet-500/15
                      px-2
                      py-1
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-violet-300
                    "
                  >
                    Featured
                  </span>

                  <span
                    className="
                      text-[7px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-slate-400
                    "
                  >
                    {activeGame.genre}
                  </span>
                </div>

                {/* Subtitle */}
                <p
                  className="
                    mt-3
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-violet-300
                  "
                >
                  {activeGame.subtitle}
                </p>

                {/* Title */}
                <h1
                  className="
                    nv-display
                    mt-1
                    max-w-[540px]
                    text-4xl
                    font-bold
                    leading-[0.94]
                    tracking-[-0.045em]
                    text-white
                    lg:text-5xl
                  "
                >
                  {activeGame.title}
                </h1>

                {/* Description */}
                <p
                  className="
                    mt-3
                    max-w-[460px]
                    text-[10px]
                    leading-5
                    text-slate-300/75
                  "
                >
                  {activeGame.description}
                </p>

                {/* Meta */}
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-[8px]
                    text-slate-300
                  "
                >
                  <span className="flex items-center gap-1">
                    <Star className="size-2.5 fill-current text-amber-400" />
                    {activeGame.rating}
                  </span>

                  <span className="text-slate-600">•</span>

                  <span>{activeGame.reviews || "No"} Reviews</span>

                  <span className="text-slate-600">•</span>

                  {platforms.map((platform) => (
                    <span key={platform}>{platform}</span>
                  ))}
                </div>

                {/* Price */}
                {!owned && (
                  <div className="mt-3 flex items-center gap-2">
                    {activeGame.discount > 0 && (
                      <span
                        className="
                          rounded-md
                          bg-violet-600
                          px-2
                          py-1
                          !text-[7px]
                          font-bold
                          text-white
                        "
                      >
                        -{activeGame.discount}%
                      </span>
                    )}

                    <span
                      className="
                        nv-display
                        text-lg
                        font-bold
                        text-white
                      "
                    >
                      ₹{activeGame.price.toLocaleString("en-IN")}
                    </span>

                    <span
                      className="
                        !text-[8px]
                        text-slate-500
                        line-through
                      "
                    >
                      ₹{activeGame.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* =================================================
                    ACTIONS
                    ================================================= */}

                <div className="mt-4 flex items-center gap-2">
                  {owned ? (
                    <>
                      <Link
                        to="/library"
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-violet-400/25
                          bg-violet-500/10
                          px-4
                          !text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.07em]
                          text-violet-300
                          backdrop-blur-md
                          transition-all
                          duration-200
                          hover:border-violet-400/40
                          hover:bg-violet-500/15
                          hover:text-violet-200
                        "
                      >
                        <span className="text-[10px]">✓</span>
                        Library
                      </Link>

                      <button
                        type="button"
                        aria-label={`Gift ${activeGame.title}`}
                        onClick={() => setGiftModalOpen(true)}
                        className="
                          flex
                          size-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-white/10
                          bg-black/25
                          text-slate-300
                          backdrop-blur-md
                          transition-all
                          hover:border-violet-400/30
                          hover:bg-violet-500/10
                          hover:text-violet-300
                        "
                      >
                        <Gift className="size-4" />
                      </button>

                      <Link
                        to={`/games/${activeGame.slug}`}
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-white/10
                          bg-black/20
                          px-4
                          !text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.07em]
                          text-slate-200
                          backdrop-blur-md
                          transition-all
                          hover:border-white/20
                          hover:bg-white/[0.06]
                          hover:text-white
                        "
                      >
                        <Play className="size-3" />
                        View Game
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/games/${activeGame.slug}`}
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-lg
                          bg-violet-600
                          px-4
                          !text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.07em]
                          text-white
                          shadow-lg
                          shadow-violet-950/30
                          transition-all
                          hover:bg-violet-500
                        "
                      >
                        <ShoppingCart className="size-3" />
                        Buy Now
                      </Link>

                      <Link
                        to={`/games/${activeGame.slug}`}
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-white/10
                          bg-black/20
                          px-4
                          !text-[8px]
                          font-bold
                          uppercase
                          tracking-[0.07em]
                          text-slate-200
                          backdrop-blur-md
                          transition-all
                          hover:border-white/20
                          hover:bg-white/[0.06]
                          hover:text-white
                        "
                      >
                        <Play className="size-3" />
                        View Game
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ===================================================
                WISHLIST
                =================================================== */}

            {!owned && (
              <button
                type="button"
                aria-label={
                  isWishlisted(activeGame.id)
                    ? `Remove ${activeGame.title} from wishlist`
                    : `Add ${activeGame.title} to wishlist`
                }
                onClick={() => toggleWishlist(activeGame)}
                className="
                  absolute
                  right-5
                  top-5
                  z-20
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/15
                  bg-black/30
                  text-white/80
                  backdrop-blur-md
                  transition-all
                  hover:border-violet-400/40
                  hover:bg-violet-500/15
                  hover:text-white
                "
              >
                <Heart
                  className={`size-4 ${
                    isWishlisted(activeGame.id)
                      ? "fill-violet-500 text-violet-500"
                      : "text-white/80"
                  }`}
                />
              </button>
            )}

            {/* ===================================================
                MAIN NAVIGATION
                =================================================== */}

            <div
              className="
                absolute
                bottom-5
                right-5
                z-20
                flex
                items-center
                gap-2
              "
            >
              <button
                type="button"
                aria-label="Previous featured game"
                onClick={goPrevious}
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-black/30
                  text-slate-300
                  backdrop-blur-md
                  transition
                  hover:border-violet-400/30
                  hover:text-white
                "
              >
                <ChevronLeft className="size-3.5" />
              </button>

              <div className="flex items-center gap-1">
                {featuredGames.map((game, index) => (
                  <button
                    key={game.id}
                    type="button"
                    aria-label={`Show ${game.title}`}
                    onClick={() => setActiveIndex(index)}
                    className="flex h-5 items-center"
                  >
                    <span
                      className={[
                        "h-0.5 rounded-full transition-all duration-300",
                        index === activeIndex
                          ? "w-7 bg-violet-400"
                          : "w-2 bg-white/20",
                      ].join(" ")}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Next featured game"
                onClick={goNext}
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/10
                  bg-black/30
                  text-slate-300
                  backdrop-blur-md
                  transition
                  hover:border-violet-400/30
                  hover:text-white
                "
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>

            {/* Progress */}
            {!isPaused && (
              <motion.div
                key={`progress-${activeGame.id}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 7,
                  ease: "linear",
                }}
                className="
                  absolute
                  bottom-0
                  left-0
                  z-30
                  h-px
                  w-full
                  origin-left
                  bg-violet-400
                "
              />
            )}
          </div>

          {/* ===================================================
              FEATURED GAME RAIL
              =================================================== */}

          <aside
            className="
              relative
              flex
              flex-col
              border-l
              border-white/[0.07]
              bg-[#070914]
            "
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`rail-fade-${activeGame.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-20
                  bg-gradient-to-r
                  from-violet-500/[0.10]
                  via-violet-400/[0.035]
                  to-transparent
                "
                aria-hidden="true"
              />
            </AnimatePresence>
            <div
              className="
                border-b
                border-white/[0.06]
                px-3
                py-3
              "
            >
              <p
                className="
                  !text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-violet-400
                "
              >
                Featured
              </p>

              <p
                className="
                  mt-0.5
                  !text-[8px]
                  font-medium
                  text-slate-500
                "
              >
                Explore the vault
              </p>
            </div>

            <div className="flex flex-1 flex-col">
              {featuredGames.map((game, index) => {
                const isActive = index === activeIndex;

                return (
                  <motion.button
                    key={game.id}
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.025,
                      ease: "easeOut",
                    }}
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "group relative flex min-h-0 flex-1 overflow-hidden border-b border-white/[0.05] text-left transition-all duration-200",
                      isActive
                        ? "bg-violet-500/[0.10]"
                        : "bg-transparent hover:bg-white/[0.035]",
                    ].join(" ")}
                  >
                    {/* Thumbnail */}
                    <img
                      src={game.mobileImage || game.image}
                      alt=""
                      aria-hidden="true"
                      loading={index <= 1 ? "eager" : "lazy"}
                      decoding="async"
                      className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                          opacity-35
                          transition-opacity
                          duration-200
                          group-hover:opacity-50
                        "
                    />

                    {/* Rail overlay */}
                    <div
                      className={[
                        "absolute inset-0",
                        isActive
                          ? "bg-gradient-to-r from-violet-950/70 via-violet-950/35 to-black/50"
                          : "bg-gradient-to-r from-black/75 via-black/55 to-black/45",
                      ].join(" ")}
                    />

                    {/* Active indicator */}
                    {isActive && (
                      <span
                        className="
                            absolute
                            left-0
                            top-0
                            bottom-0
                            w-0.5
                            bg-violet-400
                            shadow-[0_0_12px_rgba(139,92,246,0.8)]
                          "
                      />
                    )}

                    {/* Rail content */}
                    <div
                      className="
                          relative
                          z-10
                          flex
                          w-full
                          flex-col
                          justify-end
                          p-3
                        "
                    >
                      <span
                        className="
                            mb-1
                            !text-[6px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-violet-300
                          "
                      >
                        {game.genre}
                      </span>

                      <span
                        className={[
                          "line-clamp-2 text-[8px] font-bold leading-[1.15] transition-colors",
                          isActive
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white",
                        ].join(" ")}
                      >
                        {game.title}
                      </span>

                      <span
                        className="
                            mt-1
                            !text-[7px]
                            text-slate-500
                          "
                      >
                        {game.price > 0
                          ? `₹${game.price.toLocaleString("en-IN")}`
                          : "Free"}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </aside>
        </div>

        {/* =====================================================
            MOBILE HERO
            ===================================================== */}

        <div
          className="
            relative
            h-[415px]
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#080A14]
            shadow-2xl
            shadow-black/30
            md:hidden
          "
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Fixed artwork */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-image-${activeGame.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="absolute inset-0"
            >
              <img
                src={activeGame.mobileImage || activeGame.image}
                alt=""
                aria-hidden="true"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />

              {/* Reduced dark overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-[#050711]/15
                  via-transparent
                  to-[#050711]/95
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#050711]/50
                  via-transparent
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_72%_35%,rgba(139,92,246,0.12),transparent_40%)]
                "
              />
            </motion.div>
          </AnimatePresence>

          {/* Mobile content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-content-${activeGame.id}`}
              initial={{
                opacity: 0,
                x: -12,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -8,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                inset-x-0
                bottom-0
                z-10
                p-4
                pb-14
              "
            >
              {/* Category */}
              <div className="flex items-center gap-2">
                <span
                  className="
                    rounded-md
                    bg-violet-500/15
                    px-2
                    py-1
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-violet-300
                  "
                >
                  Featured
                </span>

                <span
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.1em]
                    text-slate-400
                  "
                >
                  {activeGame.genre}
                </span>
              </div>

              <p
                className="
                  mt-2
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-violet-300
                "
              >
                {activeGame.subtitle}
              </p>

              <h1
                className="
                  nv-display
                  mt-1
                  max-w-[310px]
                  text-[28px]
                  font-bold
                  leading-[0.94]
                  tracking-[-0.045em]
                  text-white
                "
              >
                {activeGame.title}
              </h1>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-2
                  text-[7px]
                  text-slate-300
                "
              >
                <span className="flex items-center gap-1">
                  <Star className="size-2.5 fill-current text-amber-400" />
                  {activeGame.rating}
                </span>

                <span className="text-slate-600">•</span>

                {platforms.map((platform) => (
                  <span key={platform}>{platform}</span>
                ))}
              </div>

              {!owned && (
                <div className="mt-2 flex items-center gap-2">
                  {activeGame.discount > 0 && (
                    <span
                      className="
                        rounded-md
                        bg-violet-600
                        px-2
                        py-1
                        !text-[7px]
                        font-bold
                        text-white
                      "
                    >
                      -{activeGame.discount}%
                    </span>
                  )}

                  <span
                    className="
                      nv-display
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    ₹{activeGame.price.toLocaleString("en-IN")}
                  </span>

                  <span
                    className="
                      !text-[7px]
                      text-slate-500
                      line-through
                    "
                  >
                    ₹{activeGame.originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Mobile actions */}
              <div className="mt-3 flex items-center gap-2">
                {owned ? (
                  <>
                    <Link
                      to="/library"
                      className="
                        inline-flex
                        h-8
                        items-center
                        gap-1.5
                        rounded-md
                        border
                        border-violet-400/25
                        bg-violet-500/10
                        px-3
                        !text-[8px]
                        font-bold
                        uppercase
                        text-violet-300
                      "
                    >
                      ✓ Library
                    </Link>

                    <button
                      type="button"
                      aria-label={`Gift ${activeGame.title}`}
                      onClick={() => {
                        console.log(`Gift ${activeGame.title}`);
                      }}
                      className="
                        flex
                        size-8
                        items-center
                        justify-center
                        rounded-md
                        border
                        border-white/10
                        bg-black/25
                        text-slate-300
                      "
                    >
                      <Gift className="size-3.5" />
                    </button>

                    <Link
                      to={`/games/${activeGame.slug}`}
                      className="
                        inline-flex
                        h-8
                        items-center
                        gap-1.5
                        rounded-md
                        border
                        border-white/10
                        bg-black/20
                        px-3
                        !text-[8px]
                        font-bold
                        uppercase
                        text-slate-200
                      "
                    >
                      <Play className="size-3" />
                      View
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/games/${activeGame.slug}`}
                      className="
                        inline-flex
                        h-8
                        items-center
                        gap-1.5
                        rounded-md
                        bg-violet-600
                        px-3
                        !text-[8px]
                        font-bold
                        uppercase
                        text-white
                      "
                    >
                      <ShoppingCart className="size-3" />
                      Buy
                    </Link>

                    <Link
                      to={`/games/${activeGame.slug}`}
                      className="
                        inline-flex
                        h-8
                        items-center
                        gap-1.5
                        rounded-md
                        border
                        border-white/10
                        bg-black/20
                        px-3
                        !text-[8px]
                        font-bold
                        uppercase
                        text-slate-200
                      "
                    >
                      <Play className="size-3" />
                      View
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile wishlist */}
          {!owned && (
            <button
              type="button"
              aria-label={
                isWishlisted(activeGame.id)
                  ? `Remove ${activeGame.title} from wishlist`
                  : `Add ${activeGame.title} to wishlist`
              }
              onClick={() => toggleWishlist(activeGame)}
              className="
                absolute
                right-3
                top-3
                z-20
                flex
                size-8
                items-center
                justify-center
                rounded-lg
                border
                border-white/15
                bg-black/30
                text-white/80
                backdrop-blur-md
              "
            >
              <Heart
                className={`size-3.5 ${
                  isWishlisted(activeGame.id)
                    ? "fill-violet-500 text-violet-500"
                    : ""
                }`}
              />
            </button>
          )}

          {/* Mobile controls */}
          <div
            className="
              absolute
              bottom-4
              right-3
              z-20
              flex
              items-center
              gap-1
            "
          >
            <button
              type="button"
              aria-label="Previous featured game"
              onClick={goPrevious}
              className="
                flex
                size-7
                items-center
                justify-center
                rounded-md
                border
                border-white/10
                bg-black/30
                text-slate-300
                backdrop-blur-md
              "
            >
              <ChevronLeft className="size-3" />
            </button>

            <div className="flex items-center gap-1">
              {featuredGames.map((game, index) => (
                <button
                  key={game.id}
                  type="button"
                  aria-label={`Show ${game.title}`}
                  onClick={() => setActiveIndex(index)}
                  className="flex h-4 items-center"
                >
                  <span
                    className={[
                      "h-0.5 rounded-full transition-all duration-300",
                      index === activeIndex
                        ? "w-6 bg-violet-400"
                        : "w-2 bg-white/20",
                    ].join(" ")}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next featured game"
              onClick={goNext}
              className="
                flex
                size-7
                items-center
                justify-center
                rounded-md
                border
                border-white/10
                bg-black/30
                text-slate-300
                backdrop-blur-md
              "
            >
              <ChevronRight className="size-3" />
            </button>
          </div>

          {/* Mobile progress */}
          {!isPaused && (
            <motion.div
              key={`mobile-progress-${activeGame.id}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 7,
                ease: "linear",
              }}
              className="
                absolute
                bottom-0
                left-0
                z-30
                h-px
                w-full
                origin-left
                bg-violet-400
              "
            />
          )}
        </div>
        <GiftModal
          open={giftModalOpen}
          game={activeGame}
          onClose={() => setGiftModalOpen(false)}
          onSubmit={(recipient) => {
            console.log("Gift recipient:", recipient);

            setGiftModalOpen(false);
          }}
        />
      </div>
    </section>
  );
}

export default HomeHero;
