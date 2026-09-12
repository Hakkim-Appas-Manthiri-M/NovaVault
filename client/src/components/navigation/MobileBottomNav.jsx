import {
  Heart,
  Home,
  Library,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  {
    label: 'Home',
    to: '/',
    icon: Home,
  },
  {
    label: 'Store',
    to: '/games',
    icon: ShoppingBag,
  },
  {
    label: 'Library',
    to: '/library',
    icon: Library,
  },
  {
    label: 'Wishlist',
    to: '/wishlist',
    icon: Heart,
  },
  {
    label: 'Profile',
    to: '/profile',
    icon: UserRound,
  },
]

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-[#060914]/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1.5 transition-colors duration-150',
                  isActive
                    ? 'text-violet-300'
                    : 'text-slate-600 hover:text-slate-300',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-[17px]" />

                  <span className="text-[7px] font-semibold uppercase tracking-[0.05em]">
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="h-0.5 w-3 rounded-full bg-violet-400" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav