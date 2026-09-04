function NovaVaultLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* NovaVault original mark */}
      <svg
        viewBox="0 0 64 64"
        className="size-8 shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="novavault-logo-gradient"
            x1="8"
            y1="8"
            x2="56"
            y2="56"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>

        {/* Outer vault frame */}
        <path
          d="M32 4L55 17V47L32 60L9 47V17L32 4Z"
          fill="#080B15"
          stroke="url(#novavault-logo-gradient)"
          strokeWidth="3"
        />

        {/* Inner vault frame */}
        <path
          d="M32 12L48 21V43L32 52L16 43V21L32 12Z"
          fill="#0B1020"
          stroke="#A78BFA"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />

        {/* Stylized N */}
        <path
          d="M20 42V22L32 38V22L44 42V22"
          stroke="url(#novavault-logo-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Core */}
        <circle
          cx="32"
          cy="32"
          r="2.5"
          fill="#C4B5FD"
        />
      </svg>

      {/* NovaVault wordmark */}
      {!compact && (
        <span className="nv-display !text-[16px] font-bold tracking-[-0.02em] text-white">
          NOVA<span className="text-violet-400">VAULT</span>
        </span>
      )}
    </div>
  );
}

export default NovaVaultLogo;