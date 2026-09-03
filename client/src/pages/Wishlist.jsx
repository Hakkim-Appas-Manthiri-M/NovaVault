import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import GameGrid from "../components/games/GameGrid";
import { useStore } from "../context/useStore";

function Wishlist() {
  const { wishlist, wishlistCount, clearWishlist } = useStore();

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1536px] min-w-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
                <Heart className="size-3" />
                Your Collection
              </p>

              <h1 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Wishlist
              </h1>

              <p className="mt-1.5 max-w-xl text-[10px] leading-relaxed text-slate-500 sm:text-[13px]">
                Keep track of the games you want to add to your vault.
              </p>
            </div>

            {wishlistCount > 0 && (
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {wishlistCount}{" "}
                  {wishlistCount === 1 ? "Game" : "Games"}
                </span>

                <button
                  type="button"
                  onClick={clearWishlist}
                  className="
                    flex h-8 items-center gap-1.5
                    rounded-lg
                    border border-white/[0.06]
                    bg-white/[0.02]
                    px-2.5
                    !text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.05em]
                    text-slate-500
                    transition-all duration-200
                    hover:border-red-500/20
                    hover:bg-red-500/[0.06]
                    hover:text-red-400
                  "
                >
                  <Trash2 className="size-3" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist */}
        {wishlistCount > 0 ? (
          <GameGrid games={wishlist} />
        ) : (
          <div
            className="
              flex min-h-[320px]
              flex-col items-center justify-center
              rounded-xl
              border border-dashed border-white/[0.07]
              bg-[#080B15]/50
              px-6
              text-center
            "
          >
            <div
              className="
                mb-4 flex size-12
                items-center justify-center
                rounded-xl
                border border-white/[0.06]
                bg-white/[0.02]
                text-slate-600
              "
            >
              <Heart className="size-5" />
            </div>

            <h2 className="nv-display text-[15px] font-bold text-slate-300">
              Your wishlist is empty
            </h2>

            <p className="mt-1.5 max-w-sm text-[10px] leading-relaxed text-slate-600">
              Save games you want to play later and they’ll appear here.
            </p>

            <Link
              to="/games"
              className="
                mt-5 flex h-8 items-center
                rounded-lg
                bg-violet-600
                px-3
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.06em]
                text-white
                shadow-lg shadow-violet-950/20
                transition-all duration-200
                hover:bg-violet-500
              "
            >
              Explore Games
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;