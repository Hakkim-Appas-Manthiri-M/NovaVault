import { useEffect, useState } from "react";

function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setClosing(true);
    }, 1100);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999]",
        "flex items-center justify-center",
        "overflow-hidden",
        "bg-[#050711]",
        "transition-opacity duration-400 ease-out",
        closing
          ? "pointer-events-none opacity-0"
          : "opacity-100",
      ].join(" ")}
    >
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute left-1/2 top-1/2
          size-[280px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-violet-600/[0.08]
          blur-[100px]
        "
      />

      {/* Secondary glow */}
      <div
        className="
          pointer-events-none
          absolute left-1/2 top-1/2
          size-[150px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-violet-500/[0.06]
          blur-[60px]
        "
      />

      <div
        className={[
          "relative flex flex-col items-center",
          "transition-all duration-500 ease-out",
          closing
            ? "-translate-y-2 scale-[0.96]"
            : "translate-y-0 scale-100",
        ].join(" ")}
      >
        {/* Logo system */}
        <div className="relative flex size-24 items-center justify-center">
          {/* Outer rotating ring */}
          <div
            className="
              absolute inset-0
              rounded-[28px]
              border border-violet-400/10
              animate-[novaRotate_7s_linear_infinite]
            "
          />

          {/* Energy ring */}
          <div
            className="
              absolute inset-2
              rounded-[24px]
              border border-white/[0.05]
              border-t-violet-400/60
              border-r-violet-400/20
              animate-[novaRotateReverse_3s_linear_infinite]
            "
          />

          {/* Logo container */}
          <div
            className="
              relative
              flex size-16
              items-center justify-center
              overflow-hidden
              rounded-[20px]
              border border-violet-400/20
              bg-[#080B15]
              shadow-[0_0_45px_rgba(139,92,246,0.14)]
            "
          >
            {/* Logo glow */}
            <div
              className="
                absolute inset-0
                bg-violet-500/[0.06]
              "
            />

            {/* NovaVault N mark */}
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="relative size-9"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="loaderNova"
                  x1="10"
                  y1="10"
                  x2="54"
                  y2="54"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#C4B5FD" />
                  <stop offset="0.5" stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#6D28D9" />
                </linearGradient>
              </defs>

              <path
                d="M32 5L54 17.5V46.5L32 59L10 46.5V17.5L32 5Z"
                stroke="url(#loaderNova)"
                strokeWidth="3"
              />

              <path
                d="M21 42V22L32 38V22L43 42V22"
                stroke="url(#loaderNova)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="32"
                cy="32"
                r="2"
                fill="#DDD6FE"
              />
            </svg>
          </div>

          {/* Orbit dot */}
          <div
            className="
              absolute
              left-1/2 top-0
              size-1.5
              -translate-x-1/2
              rounded-full
              bg-violet-300
              shadow-[0_0_10px_rgba(167,139,250,0.9)]
            "
          />
        </div>

        {/* Brand */}
        <div className="mt-7 text-center">
          <div
            className="
              !text-[13px]
              font-semibold
              tracking-[0.34em]
              text-slate-200
            "
          >
            NOVA
            <span className="text-violet-400"> // </span>
            VAULT
          </div>

          <div
            className="
              mt-2
              !text-[8px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-slate-600
            "
          >
            Initializing
          </div>
        </div>

        {/* Loading line */}
        <div
          className="
            mt-7
            h-[2px]
            w-32
            overflow-hidden
            rounded-full
            bg-white/[0.05]
          "
        >
          <div
            className="
              h-full
              w-1/2
              rounded-full
              bg-violet-400
              shadow-[0_0_12px_rgba(139,92,246,0.9)]
              animate-[novaLoader_1.2s_ease-in-out_infinite]
            "
          />
        </div>

        {/* Status */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="
              size-1
              animate-pulse
              rounded-full
              bg-violet-400
            "
          />

          <span
            className="
              !text-[7px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-slate-700
            "
          >
            Secure Game Network
          </span>
        </div>
      </div>

      <style>{`
        @keyframes novaLoader {
          0% {
            transform: translateX(-140%);
          }

          50% {
            transform: translateX(80%);
          }

          100% {
            transform: translateX(240%);
          }
        }

        @keyframes novaRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes novaRotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}

export default PageLoader;