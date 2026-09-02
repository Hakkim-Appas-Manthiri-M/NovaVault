import { useEffect, useState } from "react";

import NovaVaultLogo from "../navigation/NovaVaultLogo";

function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setClosing(true);
    }, 900);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 1250);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-[#050711]",
        "transition-opacity duration-300 ease-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[90px]" />

      {/* Loader */}
      <div
        className={[
          "relative flex flex-col items-center",
          "transition-all duration-500 ease-out",
          closing
            ? "translate-y-[-6px] scale-[0.98]"
            : "translate-y-0 scale-100",
        ].join(" ")}
      >
        {/* Existing NovaVault logo + wordmark */}
        <div className="relative">
          <div className="absolute inset-0 scale-125 rounded-2xl bg-violet-500/10 blur-xl" />

          <div className="relative">
            <NovaVaultLogo />
          </div>
        </div>

        {/* Loading bar */}
        <div className="mt-7 h-[2px] w-28 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-1/2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.9)] animate-[novaLoader_1s_ease-in-out_infinite]" />
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
      `}</style>
    </div>
  );
}

export default PageLoader;