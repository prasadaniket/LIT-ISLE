import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, BookOpen, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useShelf } from "../contexts/ShelfContext";
import { booksData } from "../pages/bookG/data";

const Recommendations = () => {
  const { isAuthenticated, user } = useAuth();
  const { shelf, addToShelf, isInShelf } = useShelf();

  // Get user's favorite genres from profile (if available)
  const userGenres = user?.genres || [];
  
  // Get books from user's shelf to avoid recommending already owned books
  const shelfBooks = useMemo(() => {
    const allShelfBooks = new Set();
    // Add books from all shelf categories
    Object.values(shelf).forEach(books => {
      books.forEach(book => allShelfBooks.add(book.slug));
    });
    return allShelfBooks;
  }, [shelf]);

  // Generate recommendations based on user preferences
  const recommendations = useMemo(() => {
    const allBooks = Object.values(booksData);
    
    // Filter out books already in user's shelf
    const availableBooks = allBooks.filter(book => !shelfBooks.has(book.slug));
    
    // Debug logging (remove in production)
    // console.log('Total books in data:', allBooks.length);
    // console.log('Books in shelf:', shelfBooks.size);
    // console.log('Available books after filtering:', availableBooks.length);
    // console.log('User genres:', userGenres);
    
    // If we don't have enough books after filtering, include some from shelf
    let booksToShow = availableBooks;
    if (availableBooks.length < 8) {
      // Get some books from the shelf to fill up to 8
      const shelfBooksList = [];
      Object.values(shelf).forEach(books => {
        books.forEach(book => shelfBooksList.push(book));
      });
      
      // Add shelf books to reach 8 total
      const needed = 8 - availableBooks.length;
      const additionalBooks = shelfBooksList
        .sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0))
        .slice(0, needed)
        .map(book => ({
          ...book,
          ratingAvg: book.ratingAvg || 4.0, // Default rating if not set
          genres: book.genres || ['Fiction'] // Default genre if not set
        }));
      
      booksToShow = [...availableBooks, ...additionalBooks];
    }
    
    // If we still don't have enough books, show all books (including shelf books)
    if (booksToShow.length < 8) {
      booksToShow = allBooks.map(book => ({
        ...book,
        ratingAvg: book.ratingAvg || 4.0,
        genres: book.genres || ['Fiction']
      }));
    }
    
    // If user has favorite genres, prioritize books in those genres
    if (userGenres.length > 0) {
      const genreBooks = booksToShow.filter(book => 
        book.genres && book.genres.some(genre => userGenres.includes(genre))
      );
      
      // If we have genre matches, use them; otherwise use all books
      if (genreBooks.length > 0) {
        return genreBooks
          .sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0))
          .slice(0, 8);
      }
    }
    
    // Return top-rated books
    const finalRecommendations = booksToShow
      .sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0))
      .slice(0, 8);
    
    // console.log('Final recommendations count:', finalRecommendations.length);
    return finalRecommendations;
  }, [userGenres, shelfBooks, shelf]);

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const RatingStars = ({ value = 0 }) => {
    const fullStars = Math.floor(value);
    const hasHalf = value - fullStars >= 0.5;
    const total = 5;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < fullStars ? "text-yellow-400" : hasHalf && i === fullStars ? "text-yellow-400/60" : "text-gray-600"}`}
            fill={i < fullStars || (hasHalf && i === fullStars) ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
        {/* Section Header - Mobile-Optimized */}
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 xs:mb-4" style={{ color: '#0B6623', fontFamily: "'Playful Display', serif" }}>
            Recommended for You
          </h2>
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto px-2">
            {userGenres.length > 0 
              ? `Based on your interest in ${userGenres.slice(0, 3).join(', ')}${userGenres.length > 3 ? '...' : ''}`
              : 'Discover our top-rated books'
            }
          </p>
        </div>

        {/* Mobile Layout - 2x2 Grid */}
        <div className="lg:hidden">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 xs:py-10 sm:py-12">
              <BookOpen className="w-12 h-12 xs:w-16 xs:h-16 text-gray-300 mx-auto mb-3 xs:mb-4" />
              <h3 className="text-base xs:text-lg font-medium text-gray-500 mb-2">No recommendations available</h3>
              <p className="text-sm xs:text-base text-gray-400">Try adding some books to your shelf or updating your preferences.</p>
            </div>
          ) : (
            <>
              {/* First Row - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8">
                {recommendations.slice(0, 4).map((book) => (
                  <div key={book.slug} className="group">
                    <Link to={`/book/${book.slug}`} className="block">
                      <div className="bg-white border border-gray-200 group-hover:border-[#0B6623]/60 rounded-lg xs:rounded-xl p-2 xs:p-3 transition-all duration-300 group-hover:shadow-lg active:scale-95">
                        {/* Book Cover - Compact */}
                        <div className="aspect-[3/4] overflow-hidden rounded-md xs:rounded-lg bg-gray-100 mb-2 xs:mb-3 flex items-center justify-center">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="h-full w-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Book Info - Compact */}
                        <h3 className="text-xs xs:text-sm font-semibold line-clamp-2 mb-1 xs:mb-2" style={{ color: '#0B6623', fontFamily: "'Playful Display', serif" }}>
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 truncate">{book.author}</p>
                        
                        {/* Rating - Compact */}
                        <div className="flex items-center gap-1 mb-2">
                          <RatingStars value={book.ratingAvg || 0} />
                          <span className="text-xs text-gray-500">
                            {(book.ratingAvg || 0).toFixed(1)}
                          </span>
                        </div>
                        
                        {/* Genre Tags - Compact */}
                        <div className="flex flex-wrap gap-1 mb-2 xs:mb-3">
                          {book.genres?.slice(0, 1).map((genre) => (
                            <span
                              key={genre}
                              className="px-1.5 py-0.5 text-xs font-medium bg-[#0B6623]/10 text-[#0B6623] rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        
                        {/* Action Buttons - Compact */}
                        <div className="flex gap-1">
                          <span className="flex-1 inline-flex items-center justify-center bg-[#0B6623] group-hover:bg-[#0e7a2b] text-white font-semibold text-xs py-1.5 rounded-md transition-colors">
                            View
                          </span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToShelf(book, 'nextUp');
                            }}
                            className={`px-2 py-1.5 border font-semibold text-xs rounded-md transition-colors ${
                              isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                                ? 'border-green-500 text-green-600 bg-green-50'
                                : 'border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white'
                            }`}
                          >
                            {isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                              ? '✓'
                              : <Plus className="w-3 h-3" />
                            }
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Second Row - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                {recommendations.slice(4, 8).map((book) => (
                  <div key={book.slug} className="group">
                    <Link to={`/book/${book.slug}`} className="block">
                      <div className="bg-white border border-gray-200 group-hover:border-[#0B6623]/60 rounded-lg xs:rounded-xl p-2 xs:p-3 transition-all duration-300 group-hover:shadow-lg active:scale-95">
                        {/* Book Cover - Compact */}
                        <div className="aspect-[3/4] overflow-hidden rounded-md xs:rounded-lg bg-gray-100 mb-2 xs:mb-3 flex items-center justify-center">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="h-full w-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Book Info - Compact */}
                        <h3 className="text-xs xs:text-sm font-semibold line-clamp-2 mb-1 xs:mb-2" style={{ color: '#0B6623', fontFamily: "'Playful Display', serif" }}>
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2 truncate">{book.author}</p>
                        
                        {/* Rating - Compact */}
                        <div className="flex items-center gap-1 mb-2">
                          <RatingStars value={book.ratingAvg || 0} />
                          <span className="text-xs text-gray-500">
                            {(book.ratingAvg || 0).toFixed(1)}
                          </span>
                        </div>
                        
                        {/* Genre Tags - Compact */}
                        <div className="flex flex-wrap gap-1 mb-2 xs:mb-3">
                          {book.genres?.slice(0, 1).map((genre) => (
                            <span
                              key={genre}
                              className="px-1.5 py-0.5 text-xs font-medium bg-[#0B6623]/10 text-[#0B6623] rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        
                        {/* Action Buttons - Compact */}
                        <div className="flex gap-1">
                          <span className="flex-1 inline-flex items-center justify-center bg-[#0B6623] group-hover:bg-[#0e7a2b] text-white font-semibold text-xs py-1.5 rounded-md transition-colors">
                            View
                          </span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToShelf(book, 'nextUp');
                            }}
                            className={`px-2 py-1.5 border font-semibold text-xs rounded-md transition-colors ${
                              isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                                ? 'border-green-500 text-green-600 bg-green-50'
                                : 'border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white'
                            }`}
                          >
                            {isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                              ? '✓'
                              : <Plus className="w-3 h-3" />
                            }
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Desktop Layout - 4x2 Grid */}
        <div className="hidden lg:block">
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No recommendations available</h3>
              <p className="text-base text-gray-400">Try adding some books to your shelf or updating your preferences.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {recommendations.map((book) => (
                <div key={book.slug} className="group">
                  <Link to={`/book/${book.slug}`} className="block">
                    <div className="bg-white border border-gray-200 group-hover:border-[#0B6623]/60 rounded-xl p-4 transition-all duration-300 group-hover:shadow-lg">
                      {/* Book Cover */}
                      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-full w-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Book Info */}
                      <h3 className="text-sm font-semibold line-clamp-2 mb-2" style={{ color: '#0B6623', fontFamily: "'Playful Display', serif" }}>
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 truncate">{book.author}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <RatingStars value={book.ratingAvg || 0} />
                        <span className="text-sm text-gray-500">
                          {(book.ratingAvg || 0).toFixed(1)}
                        </span>
                      </div>
                      
                      {/* Genre Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {book.genres?.slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 text-xs font-medium bg-[#0B6623]/10 text-[#0B6623] rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <span className="flex-1 inline-flex items-center justify-center bg-[#0B6623] group-hover:bg-[#0e7a2b] text-white font-semibold text-sm py-2 rounded-lg transition-colors">
                          View
                        </span>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToShelf(book, 'nextUp');
                          }}
                          className={`px-3 py-2 border font-semibold text-sm rounded-lg transition-colors ${
                            isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                              ? 'border-green-500 text-green-600 bg-green-50'
                              : 'border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white'
                          }`}
                        >
                          {isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                            ? '✓'
                            : <Plus className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Books Link - Mobile-Optimized */}
        <div className="text-center mt-6 xs:mt-8 sm:mt-10 md:mt-12">
          <Link 
            to="/allbooks"
            className="inline-flex items-center gap-2 px-4 xs:px-6 py-2.5 xs:py-3 rounded-lg border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition-all duration-200 transform hover:scale-105 active:scale-95 font-semibold text-sm xs:text-base"
          >
            <BookOpen className="w-4 h-4 xs:w-5 xs:h-5" />
            View All Books
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
