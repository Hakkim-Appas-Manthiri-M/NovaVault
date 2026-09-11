import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  ShoppingCart,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/useStore";

import { getGames } from "../../services/gameApi";

const HERO_INTERVAL = 7000;

function HomeHero() {
  const { toggleWishlist, isWishlisted } = useStore();
  const [featuredGames, setFeaturedGames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeGame = featuredGames[activeIndex];

  useEffect(() => {
    const loadFeaturedGames = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGames({
          featured: true,
          limit: 5,
        });

        const games = (data.games || []).map((game) => ({
          ...game,
          id: game._id,
          slug: game.slug,
        }));

        setFeaturedGames(games);
        setActiveIndex(0);
      } catch (err) {
        setError(err.message || "Failed to load featured games.");
        setFeaturedGames([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedGames();
  }, []);

  useEffect(() => {
    if (isPaused || featuredGames.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % featuredGames.length;
      });
    }, HERO_INTERVAL);

    return () => window.clearInterval(timer);
  }, [isPaused, featuredGames.length]);

  const goNext = () => {
    setActiveIndex((current) => {
      return (current + 1) % featuredGames.length;
    });
  };

  const goPrevious = () => {
    setActiveIndex((current) => {
      return (current - 1 + featuredGames.length) % featuredGames.length;
    });
  };

  if (loading) {
    return (
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div
          className="
          mx-auto max-w-[1536px]
          h-[405px]
          sm:h-[345px]
          md:h-[395px]
          lg:h-[460px]
          animate-pulse
          overflow-hidden rounded-2xl
          border border-white/[0.08]
          bg-[#090D19]
        "
        >
          <div className="h-full w-full bg-white/[0.025]" />
        </div>
      </section>
    );
  }

  if (error || !activeGame) {
    return (
      <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-7">
        <div
          className="
          mx-auto flex max-w-[1536px]
          h-[405px]
          sm:h-[345px]
          md:h-[395px]
          lg:h-[480px]
          items-center justify-center
          rounded-2xl border border-white/[0.08]
          bg-[#090D19]
        "
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
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
          relative
          mx-auto
          max-w-[1436px]
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#090D19]
          shadow-2xl
          shadow-black/30

          h-[415px]

          sm:h-[345px]
          md:h-[400px]
          lg:h-[560px]
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* =====================================================
            HERO BACKGROUND
            ===================================================== */}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame.id}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
            className="absolute inset-0"
          >
            <picture className="absolute inset-0 block">
              <source
                media="(max-width: 499px)"
                srcSet={activeGame.mobileImage || activeGame.image}
              />

              <motion.img
                src={activeGame.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center"
                initial={{
                  scale: 1.03,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 7,
                  ease: "linear",
                }}
              />
            </picture>

            {/* Main cinematic overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-[#050711]/95
                via-[#050711]/50
                to-transparent

                max-sm:via-[#050711]/70
                max-sm:to-[#050711]/15
              "
            />

            {/* Bottom readability */}
            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-[58%]
                bg-gradient-to-t
                from-[#050711]/90
                via-[#050711]/45
                to-transparent
              "
            />

            {/* Subtle purple atmosphere */}
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_72%_35%,rgba(124,58,237,0.16),transparent_38%)]
              "
            />
          </motion.div>
        </AnimatePresence>

        {/* =====================================================
            HERO CONTENT
            ===================================================== */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            z-10

            p-4
            pb-14

            sm:p-6
            sm:pb-12

            lg:p-8
            lg:pb-12
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame.id}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                max-w-[245px]

                sm:max-w-[430px]

                lg:max-w-[560px]
              "
            >
              {/* Featured label */}
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
                    tracking-[0.2em]
                    text-violet-300

                    sm:text-[8px]
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

                    sm:text-[8px]
                  "
                >
                  {activeGame.genre}
                </span>
              </div>

              {/* Subtitle */}
              <p
                className="
                  mt-2
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-violet-300

                  sm:mt-3
                  sm:text-[9px]
                "
              >
                {activeGame.subtitle}
              </p>

              {/* Title */}
              <h1
                className="
                  nv-display
                  mt-1
                  font-bold
                  leading-[0.95]
                  tracking-[-0.04em]
                  text-white

                  text-[29px]

                  sm:text-4xl
                  md:text-5xl
                  lg:text-6xl
                "
              >
                {activeGame.title}
              </h1>

              {/* Description
                  Hidden on mobile to keep the card clean.
              */}
              <p
                className="
                  mt-2
                  hidden
                  max-w-[420px]
                  text-[9px]
                  leading-4
                  text-slate-300/75

                  sm:block
                  sm:text-[10px]
                  sm:leading-5

                  lg:text-[11px]
                "
              >
                {activeGame.description}
              </p>

              {/* Rating / reviews / platforms */}
              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-2
                  text-[8px]
                  text-slate-300

                  sm:mt-3
                "
              >
                <span className="flex items-center gap-1">
                  <Star className="size-2.5 fill-current text-amber-400" />

                  {activeGame.rating}
                </span>

                <span className="text-slate-600">•</span>

                <span className="hidden sm:inline">
                  {activeGame.reviews || "No"} Reviews
                </span>

                <span className="text-slate-600">•</span>

                {(activeGame.platforms || ["PC"])
                  .slice(0, 2)
                  .map((platform) => (
                    <span key={platform}>{platform}</span>
                  ))}
              </div>

              {/* Price */}
              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-2

                  sm:mt-3
                "
              >
                {activeGame.discount > 0 && (
                  <span
                    className="
                      rounded-md
                      bg-violet-600
                      px-2
                      py-1
                      text-[7px]
                      font-bold
                      text-white

                      sm:text-[8px]
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

                    sm:text-lg
                  "
                >
                  ₹{activeGame.price.toLocaleString("en-IN")}
                </span>

                <span
                  className="
                    text-[7px]
                    text-slate-500
                    line-through

                    sm:text-[8px]
                  "
                >
                  ₹{activeGame.originalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* =================================================
                  CTA BUTTONS

                  MOBILE:
                  Small 32px buttons

                  TABLET/DESKTOP:
                  Original larger 40px buttons
                  ================================================= */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2

                  sm:mt-4
                "
              >
                {/* BUY NOW */}

                <Link
                  to={`/games/${activeGame.slug}`}
                  className="
                    inline-flex
                    h-8
                    min-h-8
                    w-auto
                    shrink-0
                    items-center
                    justify-center
                    gap-1.5
                    rounded-md
                    bg-violet-600
                    px-3
                    !text-[8px]
                    font-bold
                    uppercase
                    leading-none
                    tracking-[0.06em]
                    text-white
                    shadow-lg
                    shadow-violet-950/20
                    transition-all
                    duration-200

                    hover:bg-violet-500
                    hover:shadow-violet-900/30

                    active:scale-[0.98]

                    sm:h-10
                    sm:min-h-10
                    sm:gap-2
                    sm:rounded-lg
                    sm:px-4
                    sm:!text-[8px]
                  "
                >
                  <ShoppingCart className="size-3 shrink-0" />

                  <span className="!text-[10px] sm:hidden">Buy</span>

                  <span className="hidden !text-[10px] sm:inline">Buy Now</span>
                </Link>

                {/* VIEW GAME */}

                <Link
                  to={`/games/${activeGame.slug}`}
                  className="
                    inline-flex
                    h-8
                    min-h-8
                    w-auto
                    shrink-0
                    items-center
                    justify-center
                    gap-1.5
                    rounded-md
                    border
                    border-white/10
                    bg-black/20
                    px-3
                    text-[8px]
                    font-bold
                    uppercase
                    leading-none
                    tracking-[0.06em]
                    text-slate-200
                    backdrop-blur-md
                    transition-all
                    duration-200

                    hover:border-white/20
                    hover:bg-white/[0.06]
                    hover:text-white

                    active:scale-[0.98]

                    sm:h-10
                    sm:min-h-10
                    sm:gap-2
                    sm:rounded-lg
                    sm:px-4
                    sm:text-[9px]
                  "
                >
                  <Play className="size-3 shrink-0" />

                  {/* Small label on mobile */}
                  <span className="sm:hidden">View</span>

                  {/* Full label on tablet/desktop */}
                  <span className="hidden sm:inline">View Game</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =====================================================
            WISHLIST
            ===================================================== */}

        <button
          type="button"
          aria-label={
            isWishlisted(activeGame.id)
              ? `Remove ${activeGame.title} from wishlist`
              : `Add ${activeGame.title} to wishlist`
          }
          onClick={() => toggleWishlist(activeGame)}
          className="
            absolute right-3
            top-3 z-20 flex
            size-8 items-center
            justify-center rounded-lg
            border border-white/15
          bg-black/30 text-white/80
            backdrop-blur-md transition
          hover:border-violet-400/40
          hover:bg-violet-500/20
          hover:text-white
            sm:right-5 sm:top-5
            lg:right-7 lg:top-7"
        >
          <Heart
            className={`size-4 ${
              isWishlisted(activeGame.id)
                ? "fill-violet-600 text-violet-600"
                : "text-white/80"
            }`}
          />
        </button>

        {/* =====================================================
            CAROUSEL CONTROLS
            ===================================================== */}

        <div
          className="
            absolute
            bottom-4
            right-3
            z-20
            flex
            items-center
            gap-1

            sm:bottom-5
            sm:right-5
            sm:gap-2

            lg:bottom-7
            lg:right-7
          "
        >
          {/* Previous */}
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
              transition

              hover:border-violet-400/30
              hover:text-white

              sm:size-8
              sm:rounded-lg
            "
          >
            <ChevronLeft className="size-3" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1">
            {featuredGames.map((game, index) => (
              <button
                key={game.id}
                type="button"
                aria-label={`Show ${game.title}`}
                onClick={() => setActiveIndex(index)}
                className="
                  flex
                  h-5
                  items-center
                "
              >
                <span
                  className={[
                    "h-0.5 rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "w-6 bg-violet-400 sm:w-8"
                      : "w-2.5 bg-white/20",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>

          {/* Next */}
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
              transition

              hover:border-violet-400/30
              hover:text-white

              sm:size-8
              sm:rounded-lg
            "
          >
            <ChevronRight className="size-3" />
          </button>
        </div>

        {/* =====================================================
            AUTOPLAY PROGRESS
            ===================================================== */}

        {!isPaused && (
          <motion.div
            key={activeGame.id}
            initial={{
              scaleX: 0,
            }}
            animate={{
              scaleX: 1,
            }}
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
    </section>
  );
}

export default HomeHero;
