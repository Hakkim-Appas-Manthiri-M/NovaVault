import GameCard from "./GameCard";

function GameGrid({
  games = [],
  emptyTitle = "No games found",
  emptyDescription = "Try changing your search or filters.",
}) {
  if (!games.length) {
    return (
      <div
        className="
          flex min-h-[320px]
          items-center justify-center
          rounded-2xl
          border border-dashed border-white/[0.08]
          bg-[#080B15]/60
          px-6
          text-center
        "
      >
        <div>
          <p className="!text-[16px] font-semibold text-slate-300">
            {emptyTitle}
          </p>

          <p className="mt-1 !text-[13px] text-slate-600">
            {emptyDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-3 sm:gap-4
        lg:grid-cols-4 lg:gap-5
        xl:grid-cols-5
      "
    >
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
        />
      ))}
    </div>
  );
}

export default GameGrid;