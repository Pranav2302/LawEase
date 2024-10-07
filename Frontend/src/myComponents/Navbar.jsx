import { NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScaleIcon, LayoutDashboardIcon, UsersIcon, TrophyIcon, StarIcon } from 'lucide-react';
import { toast } from 'sonner'
import Logo from "../assets/logoImg.jpg"
export default function Navbar() {


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg shadow-sm">

    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src={Logo} className='h-10'></img>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary opacity-100 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                    : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                }
              >
                <LayoutDashboardIcon className="h-4 w-4 mr-1" />
                Dashboard
              </NavLink>
              <NavLink
                to="/providers"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary opacity-100 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                    : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                }
              >
                <UsersIcon className="h-4 w-4 mr-1" />
                Providers
              </NavLink>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary opacity-100 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                    : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                }
              >
                <TrophyIcon className="h-4 w-4 mr-1" />
                Leaderboard
              </NavLink>
            </div>
          </div>
          <NavLink to={"/login"}>
          <div className="hidden md:block" >
            <Button variant="outline" className="ml-4" >
              Login
            </Button>
          </div>
          </NavLink>
          <div className="md:hidden">
            {/* Mobile menu button */}
            <Button variant="ghost" className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 block px-3 py-2 rounded-md text-base font-medium'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/providers"
            className={({ isActive }) =>
              isActive
                ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 block px-3 py-2 rounded-md text-base font-medium'
            }
          >
            Providers
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive
                ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 block px-3 py-2 rounded-md text-base font-medium'
            }
          >
            Leaderboard
          </NavLink>
          <Button variant="outline" className="w-full mt-4">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
