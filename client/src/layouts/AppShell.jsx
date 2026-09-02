import { Outlet } from 'react-router-dom'

import MobileBottomNav from '../components/navigation/MobileBottomNav'
import Sidebar from '../components/navigation/Sidebar'
import TopNavbar from '../components/navigation/TopNavbar'

function AppShell() {
  return (
    <div className="min-h-screen bg-[#050711] text-slate-100">
      <TopNavbar />

      <Sidebar />

      <main className="min-h-screen pt-[70px] pb-[70px] lg:ml-[152px] lg:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  )
}

export default AppShell