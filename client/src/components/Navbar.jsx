import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: '#0B6623cc', borderColor: '#0B6623' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center" style={{ height: '64px', gap: '24px' }}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center leading-none">
              <img
                src="/logo/Logoq.png"
                alt="LIT ISLE logo"
                className="object-contain hover:scale-105 transition-transform duration-200"
                style={{ height: '32px', width: 'auto' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-2 flex items-baseline" style={{ columnGap: '32px' }}>
              <Link to="/recommendations" className="text-white hover:opacity-80 text-[14px] font-medium transition-colors">All Books</Link>
              <Link to="/categories" className="text-white hover:opacity-80 text-[14px] font-medium transition-colors">Genres</Link>
              <Link to="/collections" className="text-white hover:opacity-80 text-[14px] font-medium transition-colors">Library</Link>
              <Link to="/shelf" className="text-white hover:opacity-80 text-[14px] font-medium transition-colors">My Shelf</Link>
              <Link to="/community" className="text-white hover:opacity-80 text-[14px] font-medium transition-colors">Community</Link>
            </div>
          </div>

          {/* Center Search (desktop) */}
          <div className="flex-1 hidden md:flex">
            <div className="w-full ml-auto relative" style={{ maxWidth: '360px' }}>
              <input
                type="search"
                placeholder="Search books, authors, genres..."
                className="w-full pl-11 pr-4 rounded-full border focus:outline-none placeholder-white/80"
                style={{ backgroundColor: 'transparent', color: '#ffffff', borderColor: '#ffffff', height: '40px' }}
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#ffffff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
          </div>

          {/* Desktop CTA Button / User Avatar */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user.avatar || "/brand-img/reader1.jpeg"}
                    alt={user.name || "User Avatar"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20 hover:border-white/40 transition-colors"
                  />
                  <span className="text-sm font-medium">{user.name || "User"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/help"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Support
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="transition-colors text-white"
                style={{ fontSize: '14px', paddingInline: '12px' }}
              >
                Start Reading
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" style={{ backgroundColor: '#0B6623', borderTop: '1px solid #0B6623' }}>
              <Link to="/categories" className="block px-3 py-2 text-base font-medium text-white">
                Categories
              </Link>
              <Link to="/collections" className="block px-3 py-2 text-base font-medium text-white">
                Collections
              </Link>
              <Link to="/recommendations" className="block px-3 py-2 text-base font-medium text-white">
                Recommendations
              </Link>
              <Link to="/shelf" className="block px-3 py-2 text-base font-medium text-white">
                My Shelf
              </Link>
              <div className="pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <img
                        src={user.avatar || "/brand-img/reader1.jpeg"}
                        alt={user.name || "User Avatar"}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                      />
                      <span className="text-white font-medium">{user.name || "User"}</span>
                    </div>
                    <Link to="/profile" className="block px-3 py-2 text-base font-medium text-white">
                      Profile/Dashboard
                    </Link>
                    <Link to="/help" className="block px-3 py-2 text-base font-medium text-white">
                      Support
                    </Link>
                    <Link to="/settings" className="block px-3 py-2 text-base font-medium text-white">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-300 hover:text-red-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="w-full text-center block text-white">
                    Start Reading
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
