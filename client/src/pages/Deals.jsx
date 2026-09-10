import {
  ArrowRight,
  Flame,
  Percent,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import GameGrid from "../components/games/GameGrid";
import { getGames } from "../services/gameApi";

function Deals() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGames({ limit: 50 });

        const normalizedGames = (data.games || [])
          .map((game) => ({
            ...game,
            id: game._id,
          }))
          .filter((game) => Number(game.discount) > 0);

        setGames(normalizedGames);
      } catch (err) {
        setError(err.message || "Failed to load deals.");
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  const bestDeals = useMemo(() => {
    return [...games].sort(
      (a, b) => Number(b.discount || 0) - Number(a.discount || 0)
    );
  }, [games]);

  const averageDiscount = useMemo(() => {
    if (!games.length) {
      return 0;
    }

    const total = games.reduce(
      (sum, game) => sum + Number(game.discount || 0),
      0
    );

    return Math.round(total / games.length);
  }, [games]);

  const biggestDiscount = bestDeals[0]?.discount || 0;

  return (
    <section className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1536px] min-w-0">
        {/* Header */}
        <div className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-500/10 text-violet-400">
                  <Percent className="size-3.5" />
                </span>

                <p className="!text-[9px] font-bold uppercase tracking-[0.2em] text-violet-400">
                  Limited Time Offers
                </p>
              </div>

              <h1 className="nv-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Deals
              </h1>

              <p className="mt-1.5 max-w-xl !text-[10px] leading-relaxed text-slate-500 sm:!text-[13px]">
                Upgrade your vault for less. Discover the biggest discounts
                currently available across NovaVault.
              </p>
            </div>

            {/* Stats */}
            {!loading && !error && games.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                <div className="rounded-xl border border-white/[0.06] bg-[#080B15]/70 px-3 py-2.5">
                  <p className="!text-[8px] uppercase tracking-[0.12em] text-slate-600">
                    Deals
                  </p>
                  <p className="mt-0.5 !text-[14px] font-bold text-violet-400">
                    {games.length}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#080B15]/70 px-3 py-2.5">
                  <p className="!text-[8px] uppercase tracking-[0.12em] text-slate-600">
                    Average
                  </p>
                  <p className="mt-0.5 !text-[14px] font-bold text-yellow-300">
                    -{averageDiscount}%
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#080B15]/70 px-3 py-2.5">
                  <p className="!text-[8px] uppercase tracking-[0.12em] text-slate-600">
                    Best
                  </p>
                  <p className="mt-0.5 !text-[14px] font-bold text-green-400">
                    -{biggestDiscount}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <>
            <div className="mb-8 h-40 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025] sm:h-48" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.025]"
                />
              ))}
            </div>
          </>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-red-500/10 bg-[#080B15]/60 px-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/[0.05] text-red-400">
              <Flame className="size-5" />
            </div>

            <h2 className="nv-display !text-[15px] font-bold text-slate-300">
              Unable to load deals
            </h2>

            <p className="mt-1.5 max-w-sm !text-[10px] leading-relaxed text-slate-600">
              {error}
            </p>
          </div>
        )}

        {/* Deals */}
        {!loading && !error && games.length > 0 && (
          <>
            {/* Featured deal banner */}
            <div className="relative mb-9 overflow-hidden rounded-2xl border border-violet-400/10 bg-[#080B15]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.16),transparent_45%)]" />

              <div className="relative flex min-h-30 flex-col justify-between gap-5 p-5 sm:min-h-38 sm:p-7 lg:flex-row lg:items-end">
                <div className="max-w-xl">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                      <Flame className="size-3.5" />
                    </span>

                    <span className="!text-[8px] font-bold uppercase tracking-[0.18em] text-violet-300">
                      Best Current Offer
                    </span>
                  </div>

                  <h2 className="nv-display text-xl font-bold text-white sm:text-2xl">
                    Save up to {biggestDiscount}%
                  </h2>

                  <p className="mt-1.5 max-w-lg text-[10px] leading-relaxed text-slate-500 sm:text-[12px]">
                    The biggest discounts in the NovaVault catalog are waiting
                    for you.
                  </p>
                </div>

                <Link
                  to="/games"
                  className="
                    inline-flex h-9 w-fit shrink-0
                    items-center gap-1.5
                    rounded-lg
                    bg-violet-600
                    px-3.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.06em]
                    text-white
                    shadow-lg
                    shadow-violet-950/20
                    transition-all
                    hover:bg-violet-500
                  "
                >
                  Browse Store
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Best discounts */}
            <div className="mb-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.17em] text-violet-400">
                    <Sparkles className="size-3" />
                    Top Offers
                  </p>

                  <h2 className="nv-display text-xl font-bold text-white sm:text-2xl">
                    Best Discounts
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Highest savings currently available.
                  </p>
                </div>

                <Link
                  to="/games"
                  className="hidden items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-600 transition hover:text-violet-300 sm:flex"
                >
                  View Store
                  <ArrowRight className="size-3" />
                </Link>
              </div>

              <GameGrid games={bestDeals} />
            </div>

            {/* Shopping CTA */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#080B15]/70 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-violet-400">
                  <ShoppingCart className="size-3" />
                  Build Your Vault
                </p>

                <p className="mt-1 text-[10px] text-slate-600 sm:text-[11px]">
                  Find more games in the full NovaVault store.
                </p>
              </div>

              <Link
                to="/games"
                className="
                  flex h-8 shrink-0
                  items-center gap-1.5
                  rounded-lg
                  border border-white/[0.07]
                  bg-white/[0.02]
                  px-3
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.06em]
                  text-slate-400
                  transition
                  hover:border-violet-400/20
                  hover:bg-violet-500/[0.06]
                  hover:text-white
                "
              >
                Explore Games
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </>
        )}

        {/* Empty */}
        {!loading && !error && games.length === 0 && (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] bg-[#080B15]/50 px-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-600">
              <Percent className="size-5" />
            </div>

            <h2 className="nv-display text-[15px] font-bold text-slate-300">
              No active deals
            </h2>

            <p className="mt-1.5 max-w-sm text-[10px] leading-relaxed text-slate-600">
              There are currently no discounted games available.
            </p>

            <Link
              to="/games"
              className="mt-5 flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[9px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-violet-500"
            >
              Explore Games
              <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Deals;