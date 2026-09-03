function GameGridSkeleton({ count = 10 }) {
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
      aria-label="Loading games"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            aspect-[3/4]
            overflow-hidden
            rounded-xl
            border border-white/[0.06]
            bg-[#080B15]
          "
        >
          <div className="h-full w-full animate-pulse bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
}

export default GameGridSkeleton;