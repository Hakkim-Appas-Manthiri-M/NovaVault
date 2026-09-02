import { LoaderCircle } from 'lucide-react'

const variants = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-950/20',
  secondary:
    'border border-white/10 bg-white/[0.025] text-slate-200 hover:border-violet-400/30 hover:bg-white/[0.05]',
  ghost:
    'text-slate-400 hover:bg-white/[0.04] hover:text-white',
}

const sizes = {
  sm: 'min-h-9 px-3 text-[10px]',
  md: 'min-h-10 px-4 text-[11px]',
  lg: 'min-h-11 px-5 text-xs',
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-[0.06em]',
        'transition-all duration-200',
        'active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
    >
      {loading && <LoaderCircle className="size-3.5 animate-spin" />}

      {children}
    </button>
  )
}

export default Button