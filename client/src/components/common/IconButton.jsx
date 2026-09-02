function IconButton({
  children,
  label,
  active = false,
  className = '',
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={[
        'flex size-9 shrink-0 items-center justify-center rounded-lg',
        'border border-white/[0.07]',
        'bg-white/[0.025]',
        'text-slate-400',
        'transition-all duration-200',
        'hover:border-violet-400/25 hover:bg-violet-500/[0.08] hover:text-white',
        'active:scale-95',
        active
          ? 'border-violet-400/30 bg-violet-500/10 text-violet-300'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default IconButton