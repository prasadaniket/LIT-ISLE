import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  ShoppingBag, 
  Newspaper, 
  Search, 
  ChevronRight,
  User,
  Eye,
  Menu,
  X,
  Filter,
  Grid3X3,
  List,
  Plus
} from "lucide-react";
import { useShelf } from "../contexts/ShelfContext";
import { useAuth } from "../contexts/AuthContext";
import { booksData } from "./bookG/data";
import { Progress } from "../components/ui/progress";

const MyShelf = () => {
  const [activeTab, setActiveTab] = useState("shelves");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showSearch, setShowSearch] = useState(false);
  const { shelf, moveBook, updateProgress, removeFromShelf } = useShelf();
  const { user, isAuthenticated } = useAuth();

  const removeBookFromWishlist = (slug) => {
    removeFromShelf(slug, 'wishlist');
  };

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    if (!searchQuery) return shelf;
    
    const filterBooks = (books) => 
      books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return {
      currentlyReading: filterBooks(shelf.currentlyReading),
      nextUp: filterBooks(shelf.nextUp),
      finished: filterBooks(shelf.finished),
      favorites: filterBooks(shelf.favorites)
    };
  }, [shelf, searchQuery]);

  // Get the most recent book for "Continue reading"
  const continueReadingBook = shelf.currentlyReading.length > 0 
    ? shelf.currentlyReading[0] 
    : null;

  const BookCard = ({ book, showProgress = false, onMove, onUpdateProgress, onRemove, shelfType, viewMode = "grid" }) => {
    const handleProgressClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newProgress = book.progress >= 100 ? 0 : book.progress + 10;
      onUpdateProgress?.(newProgress);
    };

    if (viewMode === "list") {
      return (
        <div className="group relative bg-white rounded-lg p-3 border border-gray-200 hover:border-[#0B6B4D]/30 transition-all">
          <div className="flex gap-3">
            <Link to={`/book/${book.slug}`} className="flex-shrink-0">
              <div className="w-12 h-16 rounded-md overflow-hidden shadow-sm">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/book/${book.slug}`} className="block">
                <h4 className="font-medium text-gray-900 truncate text-sm">{book.title}</h4>
                <p className="text-xs text-gray-600 truncate">{book.author}</p>
              </Link>
              {showProgress && book.progress !== undefined && (
                <div className="mt-2">
                  <div 
                    className="bg-gray-200 rounded-full h-1.5 cursor-pointer hover:scale-105 transition-transform"
                    onClick={handleProgressClick}
                    title={`Click to update progress (${book.progress}%)`}
                  >
                    <Progress 
                      value={book.progress} 
                      className="h-full bg-gray-200"
                      style={{
                        '--progress-background': '#0B6B4D'
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{book.progress}% complete</span>
                </div>
              )}
            </div>
            {(shelfType === 'favorites' || shelfType === 'nextUp') && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove?.(); }}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                title={shelfType === 'favorites' ? 'Remove from favorites' : 'Remove from next up'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="group relative">
        <Link to={`/book/${book.slug}`} className="block">
          <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:shadow-[#0B6B4D]/20">
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        {(shelfType === 'favorites' || shelfType === 'nextUp') && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove?.(); }}
            className="absolute -top-1 -right-1 p-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow hover:bg-gray-50"
            title={shelfType === 'favorites' ? 'Remove from favorites' : 'Remove from next up'}
          >
            <X className="w-3 h-3" />
          </button>
        )}
        {showProgress && book.progress !== undefined && (
          <div className="absolute -bottom-1 left-0 right-0">
            <div 
              className="bg-white rounded-full h-1 shadow-sm p-0.5 cursor-pointer hover:scale-105 transition-transform"
              onClick={handleProgressClick}
              title={`Click to update progress (${book.progress}%)`}
            >
              <Progress 
                value={book.progress} 
                className="h-full bg-gray-200"
                style={{
                  '--progress-background': '#0B6B4D'
                }}
              />
            </div>
            <div className="absolute -bottom-4 left-0 right-0 text-center">
              <span className="text-xs text-gray-600 bg-white px-1 rounded">{book.progress}%</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ShelfSection = ({ title, books, showProgress = false, showFullShelf = true, shelfType }) => {
    if (books.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[#222222]">{title}</h3>
           {showFullShelf && (
             <Link to={`/shelf/${shelfType}`} className="text-[#0B6B4D] text-sm font-medium hover:text-[#0B6B4D]/80 transition-colors">
               View all <ChevronRight className="inline w-3 h-3" />
             </Link>
           )}
        </div>
        {viewMode === "list" ? (
          <div className="space-y-2">
            {books.slice(0, 5).map((book) => (
              <BookCard 
                key={book.slug} 
                book={book} 
                showProgress={showProgress}
                onMove={(toShelf) => moveBook(book.slug, shelfType, toShelf)}
                onUpdateProgress={(progress) => updateProgress(book.slug, progress)}
                onRemove={() => removeFromShelf(book.slug, shelfType)}
                shelfType={shelfType}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#F8F9FA] rounded-lg p-3 border border-gray-200 hover:border-[#0B6B4D]/30 transition-colors">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {books.map((book) => (
                <BookCard 
                  key={book.slug} 
                  book={book} 
                  showProgress={showProgress}
                  onMove={(toShelf) => moveBook(book.slug, shelfType, toShelf)}
                  onUpdateProgress={(progress) => updateProgress(book.slug, progress)}
                  onRemove={() => removeFromShelf(book.slug, shelfType)}
                  shelfType={shelfType}
                  viewMode={viewMode}
              />
            ))}
          </div>
        </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#0B6B4D]" />
              </div>
              <img
                src="/logo/Logob.png"
                alt="LIT ISLE logo"
                className="h-6 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {viewMode === "grid" ? <List className="w-5 h-5 text-gray-700" /> : <Grid3X3 className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in My library"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6B4D]/20 focus:border-[#0B6B4D] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("shelves")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "shelves"
                ? "text-[#0B6B4D] border-[#0B6B4D]"
                : "text-gray-500 border-transparent"
            }`}
          >
            Shelves
          </button>
          <button
            onClick={() => setActiveTab("all-books")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all-books"
                ? "text-[#0B6B4D] border-[#0B6B4D]"
                : "text-gray-500 border-transparent"
            }`}
          >
            All Books
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#0B6B4D]" />
                  </div>
                  <img
                    src="/logo/Logob.png"
                    alt="LIT ISLE logo"
                    className="h-6 w-auto"
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <div className="flex items-center space-x-3 px-3 py-2 bg-[#0B6B4D] text-white rounded-lg font-medium">
                    <BookOpen className="w-5 h-5" />
                    <span>My library</span>
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => alert('This feature is coming soon!')}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>My Downloads</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert('This feature is coming soon!')}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
                  >
                    <Newspaper className="w-5 h-5" />
                    <span>News</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Continue Reading */}
            {continueReadingBook && (
              <div className="p-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Continue reading</h4>
                <div className="bg-white rounded-lg p-3 border border-[#0B6B4D]/20 hover:border-[#0B6B4D]/40 transition-colors">
                  <div className="flex space-x-3">
                    <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={continueReadingBook.cover} 
                        alt={continueReadingBook.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-[#222222] truncate">{continueReadingBook.title}</h5>
                      <div 
                        className="mt-2 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          const newProgress = continueReadingBook.progress >= 100 ? 0 : continueReadingBook.progress + 10;
                          updateProgress(continueReadingBook.slug, newProgress);
                        }}
                        title={`Click to update progress (${continueReadingBook.progress}%)`}
                      >
                        <Progress 
                          value={continueReadingBook.progress || 0} 
                          className="h-1 bg-gray-200"
                          style={{
                            '--progress-background': '#0B6B4D'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{continueReadingBook.progress}% complete</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              {isAuthenticated ? (
                 <div className="flex items-center space-x-3 cursor-pointer" onClick={() => (window.location.href = '/profile')}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User Avatar"}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#0B6B4D] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#222222]">{user?.name || "User"}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">You are not logged in.</div>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-[#0B6B4D] hover:text-[#0B6B4D] text-center"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="px-3 py-2 text-sm rounded-lg bg-[#0B6B4D] text-white hover:bg-[#0a5c3f] text-center"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center leading-none">
            <div className="w-8 h-8 flex items-center justify-center">
            </div>
              <img
                src="/logo/Logob.png"
                alt="LIT ISLE logo"
                className="object-contain hover:scale-105 transition-transform duration-200"
                style={{ height: '32px', width: 'auto' }}
              />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <div className="flex items-center space-x-3 px-3 py-2 bg-[#0B6B4D] text-white rounded-lg font-medium">
                <BookOpen className="w-5 h-5" />
                <span>My library</span>
              </div>
            </li>
            <li>
              <button
                onClick={() => alert('This feature is coming soon!')}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>My Downloads</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => alert('This feature is coming soon!')}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
              >
                <Newspaper className="w-5 h-5" />
                <span>News</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Continue Reading */}
        {continueReadingBook && (
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-3">Continue reading</h4>
            <div className="bg-white rounded-lg p-3 border border-[#0B6B4D]/20 hover:border-[#0B6B4D]/40 transition-colors">
              <div className="flex space-x-3">
                <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={continueReadingBook.cover} 
                    alt={continueReadingBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-[#222222] truncate">{continueReadingBook.title}</h5>
                  <div 
                    className="mt-2 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      const newProgress = continueReadingBook.progress >= 100 ? 0 : continueReadingBook.progress + 10;
                      updateProgress(continueReadingBook.slug, newProgress);
                    }}
                    title={`Click to update progress (${continueReadingBook.progress}%)`}
                  >
                    <Progress 
                      value={continueReadingBook.progress || 0} 
                      className="h-1 bg-gray-200"
                      style={{
                        '--progress-background': '#0B6B4D'
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{continueReadingBook.progress}% complete</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          {isAuthenticated ? (
             <div className="flex items-center space-x-3 cursor-pointer" onClick={() => (window.location.href = '/profile')}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User Avatar"}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 bg-[#0B6B4D] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-[#222222]">{user?.name || "User"}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">You are not logged in.</div>
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:border-[#0B6B4D] hover:text-[#0B6B4D]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm rounded-lg bg-[#0B6B4D] text-white hover:bg-[#0a5c3f]"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Desktop Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("shelves")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "shelves"
                    ? "text-[#0B6B4D] border-[#0B6B4D]"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Shelves
              </button>
              <button
                onClick={() => setActiveTab("all-books")}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "all-books"
                    ? "text-[#0B6B4D] border-[#0B6B4D]"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                All Books
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in My library"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6B4D]/20 focus:border-[#0B6B4D] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "shelves" ? (
              <div>
                <ShelfSection 
                  title="Currently reading" 
                  books={filteredBooks.currentlyReading} 
                  showProgress={true}
                  showFullShelf={false}
                  shelfType="currentlyReading"
                />
                <ShelfSection 
                  title="Next up" 
                  books={filteredBooks.nextUp} 
                  showProgress={false}
                  showFullShelf={true}
                  shelfType="nextUp"
                />
                <ShelfSection 
                  title="Finished" 
                  books={filteredBooks.finished} 
                  showProgress={false}
                  showFullShelf={true}
                  shelfType="finished"
                />
                {filteredBooks.favorites.length > 0 && (
                  <ShelfSection 
                    title="Favorite Books" 
                    books={filteredBooks.favorites} 
                    showProgress={false}
                    showFullShelf={true}
                    shelfType="favorites"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">All Books view coming soon</h3>
                <p className="text-gray-400 mt-2">This will show all your books in a grid layout</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <div className="p-4">
          {activeTab === "shelves" ? (
            <div>
              <ShelfSection 
                title="Currently reading" 
                books={filteredBooks.currentlyReading} 
                showProgress={true}
                showFullShelf={false}
                shelfType="currentlyReading"
              />
              <ShelfSection 
                title="Next up" 
                books={filteredBooks.nextUp} 
                showProgress={false}
                showFullShelf={true}
                shelfType="nextUp"
              />
              <ShelfSection 
                title="Finished" 
                books={filteredBooks.finished} 
                showProgress={false}
                showFullShelf={true}
                shelfType="finished"
              />
              {filteredBooks.favorites.length > 0 && (
                <ShelfSection 
                  title="Favorite Books" 
                  books={filteredBooks.favorites} 
                  showProgress={false}
                  showFullShelf={true}
                  shelfType="favorites"
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500">All Books view coming soon</h3>
              <p className="text-gray-400 mt-2">This will show all your books in a grid layout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyShelf;

