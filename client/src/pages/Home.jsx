import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import HomeHero from '../components/hero/HomeHero'
import GameCard from '../components/games/GameCard'
import PageContainer from '../components/common/PageContainer'
import SectionHeader from '../components/common/SectionHeader'

import {
  categories,
  newReleases,
  trendingGames,
} from '../constants/gameData'

function GameCollection({
  games,
  onAddToCart,
  onWishlist,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(2)

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
      const width = window.innerWidth

      if (width >= 1024) {
        setVisibleCount(4)
      } else if (width >= 640) {
        setVisibleCount(3)
      } else {
        setVisibleCount(2)
      }
    }

    updateVisibleCount()

    window.addEventListener(
      'resize',
      updateVisibleCount,
    )

    return () => {
      window.removeEventListener(
        'resize',
        updateVisibleCount,
      )
    }
  }, [])

  /*
   * Reset position when screen size changes.
   */
  useEffect(() => {
    setCurrentIndex(0)
  }, [visibleCount])

  /*
   * Keep current position valid when the
   * number of games changes.
   */
  useEffect(() => {
    const maxIndex = Math.max(
      games.length - visibleCount,
      0,
    )

    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [
    games.length,
    visibleCount,
    currentIndex,
  ])

  if (!games.length) {
    return null
  }

  const maxIndex = Math.max(
    games.length - visibleCount,
    0,
  )

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  const visibleGames = games.slice(
    currentIndex,
    currentIndex + visibleCount,
  )

  const goPrevious = () => {
    setCurrentIndex((current) =>
      Math.max(current - 1, 0),
    )
  }

  const goNext = () => {
    setCurrentIndex((current) =>
      Math.min(current + 1, maxIndex),
    )
  }

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
          <GameCard
            key={game.id}
            game={game}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
          />
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
              text-[7px]
              font-bold
              uppercase
              tracking-[0.1em]
              text-slate-500
            "
          >
            {Math.min(
              currentIndex + 1,
              Math.max(games.length, 1),
            )}{' '}
            / {games.length}
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
  )
}

function Home() {
  const handleAddToCart = (game) => {
    console.log('Add to cart:', game.title)
  }

  const handleWishlist = (game) => {
    console.log('Wishlist:', game.title)
  }

  return (
    <div className="min-h-screen bg-[#050711]">
      {/* Hero */}
      <HomeHero />

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
              label: 'View All',
              to: '/games',
            }}
          />

          <GameCollection
            games={trendingGames}
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
          />
        </section>

        {/* =====================================================
            CATEGORIES
            ===================================================== */}

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <SectionHeader
            eyebrow="Explore"
            title="Browse Categories"
            description="Find your next world by genre."
            link={{
              label: 'View All',
              to: '/categories',
            }}
          />

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:grid lg:grid-cols-8 lg:overflow-visible">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.slug}`}
                className="
                  group
                  min-w-[108px]
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.018]
                  p-3
                  transition-all
                  duration-200

                  hover:-translate-y-1
                  hover:border-violet-400/20
                  hover:bg-violet-500/[0.05]

                  sm:min-w-[120px]
                  sm:p-4

                  lg:min-w-0
                "
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300 sm:size-9">
                  {category.icon}
                </div>

                <h3 className="mt-2.5 text-[8px] font-bold uppercase tracking-[0.04em] text-slate-200 sm:mt-3 sm:text-[9px]">
                  {category.name}
                </h3>

                <p className="mt-1 text-[7px] text-slate-600 sm:text-[8px]">
                  {category.count}
                </p>
              </Link>
            ))}
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
              label: 'All Releases',
              to: '/new-releases',
            }}
          />

          <GameCollection
            games={newReleases}
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
          />
        </section>

        {/* =====================================================
            DEALS
            ===================================================== */}

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-violet-400/15 bg-violet-500/[0.045] p-5 sm:p-7">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-violet-400 sm:text-[8px]">
                  Limited Time
                </p>

                <h2 className="nv-display mt-2 text-xl font-bold tracking-tight text-white sm:text-3xl">
                  Vault Deals
                </h2>

                <p className="mt-2 max-w-lg text-[9px] leading-4 text-slate-500 sm:text-[10px] sm:leading-5">
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
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-white
                  transition
                  hover:bg-violet-500

                  sm:min-h-10
                  sm:px-5
                  sm:text-[9px]
                "
              >
                Explore Deals
              </Link>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  )
}

export default Home