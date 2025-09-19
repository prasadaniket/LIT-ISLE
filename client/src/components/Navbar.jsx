import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Search, BookOpen, User, Menu, X, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input after navigation
      setIsMenuOpen(false); // Close mobile menu after search
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
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

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: '#0B6623cc', borderColor: '#0B6623' }}>
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
                <Link to="/shelf" className="text-white hover:opacity-80 text-[14px] font-medium transition-colors">My Shelf</Link>
                <Link to="/community" className="text-white hover:opacity-80 text-[14px] font-medium transition-colors">Community</Link>
              </div>
            </div>

            {/* Center Search (desktop) */}
            <div className="flex-1 hidden md:flex">
              <div className="w-full ml-auto relative" style={{ maxWidth: '360px' }}>
                <form onSubmit={handleSearch}>
                  <input
                    type="search"
                    placeholder="Search books, authors, genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full pl-11 pr-4 rounded-full border focus:outline-none placeholder-white/80"
                    style={{ backgroundColor: 'transparent', color: '#ffffff', borderColor: '#ffffff', height: '40px' }}
                  />
                </form>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
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
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        {/* Top Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0B6623] px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/logo/Logoq.png"
              alt="LIT ISLE logo"
              className="h-6 w-auto"
            />
          </Link>
          
          <button
            onClick={toggleMenu}
            className="text-white p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMenu}>
            <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <button onClick={toggleMenu} className="p-2">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="search"
                        placeholder="Search books, authors, genres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0B6623] bg-white text-gray-900"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </form>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2 mb-6">
                  <Link 
                    to="/" 
                    onClick={toggleMenu}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive('/') ? 'bg-[#0B6623] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Home
                  </Link>
                  <Link 
                    to="/recommendations" 
                    onClick={toggleMenu}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive('/recommendations') ? 'bg-[#0B6623] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    All Books
                  </Link>
                  <Link 
                    to="/categories" 
                    onClick={toggleMenu}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive('/categories') ? 'bg-[#0B6623] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Menu className="w-5 h-5 mr-3" />
                    Categories
                  </Link>
                  <Link 
                    to="/shelf" 
                    onClick={toggleMenu}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive('/shelf') ? 'bg-[#0B6623] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    My Shelf
                  </Link>
                  <Link 
                    to="/community" 
                    onClick={toggleMenu}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive('/community') ? 'bg-[#0B6623] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Community
                  </Link>
                </nav>

                {/* User Section */}
                {user ? (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={user.avatar || "/brand-img/reader1.jpeg"}
                        alt={user.name || "User Avatar"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link 
                      to="/profile" 
                      onClick={toggleMenu}
                      className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-2"
                    >
                      <User className="w-5 h-5 mr-3" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-6">
                    <Link 
                      to="/login" 
                      onClick={toggleMenu}
                      className="block w-full bg-[#0B6623] text-white text-center py-3 rounded-lg font-medium hover:bg-[#0e7a2b] transition-colors"
                    >
                      Start Reading
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around py-2">
            {/* Home */}
            <Link 
              to="/" 
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/') ? 'text-[#0B6623]' : 'text-gray-500'
              }`}
            >
              <Home className={`w-6 h-6 ${isActive('/') ? 'text-[#0B6623]' : 'text-gray-500'}`} />
              <span className="text-xs mt-1 font-medium">Home</span>
            </Link>

            {/* Search */}
            <Link 
              to="/search" 
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/search') ? 'text-[#0B6623]' : 'text-gray-500'
              }`}
            >
              <Search className={`w-6 h-6 ${isActive('/search') ? 'text-[#0B6623]' : 'text-gray-500'}`} />
              <span className="text-xs mt-1 font-medium">Search</span>
            </Link>

            {/* Books */}
            <Link 
              to="/recommendations" 
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/recommendations') ? 'text-[#0B6623]' : 'text-gray-500'
              }`}
            >
              <BookOpen className={`w-6 h-6 ${isActive('/recommendations') ? 'text-[#0B6623]' : 'text-gray-500'}`} />
              <span className="text-xs mt-1 font-medium">Books</span>
            </Link>

            {/* Shelf */}
            <Link 
              to="/shelf" 
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/shelf') ? 'text-[#0B6623]' : 'text-gray-500'
              }`}
            >
              <BookOpen className={`w-6 h-6 ${isActive('/shelf') ? 'text-[#0B6623]' : 'text-gray-500'}`} />
              <span className="text-xs mt-1 font-medium">Shelf</span>
            </Link>

            {/* Profile */}
            {user ? (
              <Link 
                to="/profile" 
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive('/profile') ? 'text-[#0B6623]' : 'text-gray-500'
                }`}
              >
                <div className={`w-6 h-6 rounded-full overflow-hidden ${
                  isActive('/profile') ? 'ring-2 ring-[#0B6623]' : ''
                }`}>
                  <img
                    src={user.avatar || "/brand-img/reader1.jpeg"}
                    alt={user.name || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs mt-1 font-medium">Profile</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-gray-500"
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default Navbar;