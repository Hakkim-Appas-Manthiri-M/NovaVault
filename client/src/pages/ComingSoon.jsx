import { Construction } from 'lucide-react'
import { Link } from 'react-router-dom'

function ComingSoon({ title }) {
  return (
    <main className="nv-grid min-h-[calc(100vh-4rem)]">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
            <Construction className="size-5" />
          </div>

          <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-violet-400">
            NovaVault
          </p>

          <h1 className="nv-display mt-2 text-3xl font-bold text-white">
            {title}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            This section will be built in its dedicated milestone.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-10 items-center rounded-lg bg-violet-600 px-5 text-[10px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-violet-500"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ComingSoon