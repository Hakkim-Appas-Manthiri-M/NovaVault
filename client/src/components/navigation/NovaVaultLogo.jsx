function NovaVaultLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 40 40"
        className="size-8 shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nova-logo-gradient" x1="4" y1="4" x2="36" y2="36">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        <path
          d="M20 3 35 11.5v17L20 37 5 28.5v-17L20 3Z"
          fill="none"
          stroke="url(#nova-logo-gradient)"
          strokeWidth="2.2"
        />

        <path
          d="m11 25 5-9 4 5 4-8 5 12"
          fill="none"
          stroke="url(#nova-logo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="20"
          cy="20"
          r="2.4"
          fill="#A855F7"
        />
      </svg>

      {!compact && (
        <span className="nv-display text-[15px] font-bold tracking-[-0.02em] text-white">
          NOVA<span className="text-violet-400">VAULT</span>
        </span>
      )}
    </div>
  )
}

export default NovaVaultLogo