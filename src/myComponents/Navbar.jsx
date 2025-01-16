import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScaleIcon, LayoutDashboardIcon, UsersIcon, TrophyIcon, LogOutIcon, FileTextIcon } from 'lucide-react';
import { toast } from 'sonner'
import Logo from "../assets/logoImg.jpg"
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/slices/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src={Logo} className='h-10' alt="Logo" />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          {token ? (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Dashboard Link - Always visible when logged in */}
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

                {/* Client-specific links */}
                {user?.accountType === "Client" && (
                  <NavLink
                    to="/create-case"
                    className={({ isActive }) =>
                      isActive
                        ? 'text-primary opacity-100 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                        : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                    }
                  >
                    <FileTextIcon className="h-4 w-4 mr-1" />
                    Create Case
                  </NavLink>
                )}

                {/* Provider-specific links */}
                {user?.accountType === "Provider" && (
                  <NavLink
                    to="/accept-case"
                    className={({ isActive }) =>
                      isActive
                        ? 'text-primary opacity-100 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                        : 'text-gray-800 opacity-50 hover:opacity-100 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                    }
                  >
                    <ScaleIcon className="h-4 w-4 mr-1" />
                    Case Management
                  </NavLink>
                )}

                {/* Common links for all logged-in users */}
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

                {/* Logout Button */}
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOutIcon className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            // Show these when not logged in
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/login">
                <Button variant="outline">Login</Button>
              </NavLink>
              <NavLink to="/signup">
                <Button>Sign Up</Button>
              </NavLink>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" className="inline-flex items-center justify-center p-2">
              <span className="sr-only">Open main menu</span>
              <svg 
                className="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - You can add state to show/hide this */}
      <div className="md:hidden">
        {token ? (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-800 opacity-50 hover:opacity-100 block px-3 py-2 rounded-md text-base font-medium'
              }
            >
              Dashboard
            </NavLink>

            {user?.accountType === "Client" && (
              <NavLink
                to="/create-case"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                    : 'text-gray-800 opacity-50 hover:opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                }
              >
                Create Case
              </NavLink>
            )}

            {user?.accountType === "Provider" && (
              <NavLink
                to="/accept-case"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                    : 'text-gray-800 opacity-50 hover:opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                }
              >
                Case Management
              </NavLink>
            )}

            <NavLink
              to="/providers"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-800 opacity-50 hover:opacity-100 block px-3 py-2 rounded-md text-base font-medium'
              }
            >
              Providers
            </NavLink>

            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary opacity-100 block px-3 py-2 rounded-md text-base font-medium'
                  : 'text-gray-800 opacity-50 hover:opacity-100 block px-3 py-2 rounded-md text-base font-medium'
              }
            >
              Leaderboard
            </NavLink>

            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full mt-2"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/login">
              <Button variant="outline" className="w-full">Login</Button>
            </NavLink>
            <NavLink to="/signup">
              <Button className="w-full mt-2">Sign Up</Button>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}