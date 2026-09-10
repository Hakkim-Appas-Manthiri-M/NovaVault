import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function SectionHeader({
  eyebrow,
  title,
  description,
  link,
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 !text-[8px] font-bold uppercase tracking-[0.25em] text-violet-400">
            {eyebrow}
          </p>
        )}

        <h2 className="nv-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 max-w-xl !text-[10px] leading-5 text-slate-600">
            {description}
          </p>
        )}
      </div>

      {link && (
        <Link
          to={link.to}
          className="group flex shrink-0 items-center gap-1.5 !text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500 transition hover:text-violet-300"
        >
          {link.label}

          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

export default SectionHeader