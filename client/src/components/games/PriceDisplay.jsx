function PriceDisplay({
  price,
  originalPrice,
  discount,
  size = 'default',
}) {
  const isLarge = size === 'large'

  return (
    <div className="flex flex-wrap items-center gap-2">
      {discount > 0 && (
        <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 text-[8px] font-bold text-violet-300">
          -{discount}%
        </span>
      )}

      <span
        className={[
          'nv-display font-bold text-white',
          isLarge ? 'text-xl' : 'text-sm',
        ].join(' ')}
      >
        ₹{price.toLocaleString('en-IN')}
      </span>

      {originalPrice && (
        <span className="text-[9px] text-slate-600 line-through">
          ₹{originalPrice.toLocaleString('en-IN')}
        </span>
      )}
    </div>
  )
}

export default PriceDisplay