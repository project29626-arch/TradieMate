import { Outlet, NavLink } from 'react-router-dom';
import { Home, FileText, UserCircle } from 'lucide-react';

export default function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-gray-50 md:flex-row">
      {/* Mobile Header */}
      <header className="bg-graphite border-b-4 border-hi-vis px-4 py-4 md:hidden sticky top-0 z-10 flex items-center justify-center shadow-md">
        <h1 className="text-2xl font-display uppercase tracking-tight text-white">Tradie<span className="text-hi-vis">Mate</span></h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) & Sidebar (Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-graphite border-t-4 border-hi-vis px-6 py-3 md:relative md:w-64 md:border-t-0 md:border-r-4 md:px-4 md:py-6 flex md:flex-col justify-between md:justify-start gap-2 z-10 text-white shadow-xl">
        <div className="hidden md:block mb-8 px-2 text-center">
          <h1 className="text-3xl font-display uppercase tracking-tight text-white">Tradie<span className="text-hi-vis">Mate</span></h1>
        </div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex md:w-full flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-md transition-all ${
              isActive 
                ? 'text-graphite bg-hi-vis font-bold shadow-sm' 
                : 'text-gray-400 hover:text-white hover:bg-concrete/20'
            }`
          }
        >
          <Home className="h-6 w-6 md:h-5 md:w-5" />
          <span className="text-[10px] md:text-sm font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/quotes"
          className={({ isActive }) =>
            `flex md:w-full flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-md transition-all ${
              isActive 
                ? 'text-graphite bg-hi-vis font-bold shadow-sm' 
                : 'text-gray-400 hover:text-white hover:bg-concrete/20'
            }`
          }
        >
          <FileText className="h-6 w-6 md:h-5 md:w-5" />
          <span className="text-[10px] md:text-sm font-medium">Quotes</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex md:w-full flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-md transition-all ${
              isActive 
                ? 'text-graphite bg-hi-vis font-bold shadow-sm' 
                : 'text-gray-400 hover:text-white hover:bg-concrete/20'
            }`
          }
        >
          <UserCircle className="h-6 w-6 md:h-5 md:w-5" />
          <span className="text-[10px] md:text-sm font-medium">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
