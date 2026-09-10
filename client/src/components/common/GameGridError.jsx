import { AlertTriangle, RotateCcw } from "lucide-react";

function GameGridError({
  title = "Unable to load games",
  description = "Something went wrong while loading the game collection.",
  onRetry,
}) {
  return (
    <div
      className="
        flex min-h-[320px]
        items-center justify-center
        rounded-2xl
        border border-dashed border-red-500/[0.12]
        bg-[#080B15]/60
        px-6
        text-center
      "
      role="alert"
    >
      <div>
        <div
          className="
            mx-auto mb-4
            flex size-11
            items-center justify-center
            rounded-xl
            border border-red-500/[0.10]
            bg-red-500/[0.04]
            text-red-400
          "
        >
          <AlertTriangle className="size-5" />
        </div>

        <p className="text-[16px] font-semibold text-slate-300">
          {title}
        </p>

        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate-600">
          {description}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="
              mt-5
              inline-flex h-8
              items-center gap-1.5
              rounded-lg
              border border-white/[0.06]
              bg-white/[0.02]
              px-3
              !text-[9px]
              font-semibold
              uppercase
              tracking-[0.06em]
              text-slate-400
              transition-all duration-200
              hover:border-white/[0.10]
              hover:bg-white/[0.04]
              hover:text-white
            "
          >
            <RotateCcw className="size-3" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default GameGridError;