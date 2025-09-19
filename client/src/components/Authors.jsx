import { useMemo } from "react";
import { BookOpen, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authorsData } from "../pages/bookG/authors";
import { booksData } from "../pages/bookG/data";

const Authors = () => {
  const { isAuthenticated } = useAuth();

  // Get top 4 authors based on book count and popularity (excluding Chris Sasaki)
  const topAuthors = useMemo(() => {
    const authorStats = {};
    
    // Count books and calculate average ratings for each author
    Object.values(booksData).forEach(book => {
      const authorName = book.author;
      
      // Exclude Chris Sasaki
      if (authorName === 'Chris Sasaki') return;
      
      if (!authorStats[authorName]) {
        authorStats[authorName] = {
          name: authorName,
          bookCount: 0,
          totalRating: 0,
          ratingCount: 0,
          books: []
        };
      }
      
      authorStats[authorName].bookCount++;
      authorStats[authorName].totalRating += (book.ratingAvg || 0) * (book.ratingsCount || 0);
      authorStats[authorName].ratingCount += (book.ratingsCount || 0);
      authorStats[authorName].books.push(book);
    });
    
    // Calculate average ratings and sort by popularity
    const authorsWithStats = Object.values(authorStats).map(author => ({
      ...author,
      avgRating: author.ratingCount > 0 ? author.totalRating / author.ratingCount : 0,
      authorInfo: authorsData[author.name] || { name: author.name },
      // Google-style rating (1-5 stars) - more realistic distribution
      googleRating: Math.min(5, Math.max(1, Math.round(
        author.ratingCount > 0 
          ? Math.min(5, Math.max(1, (author.totalRating / author.ratingCount) * 0.7 + 2.5))
          : 4.0
      )))
    }));
    
    // Sort by book count and average rating, then take top 4
    return authorsWithStats
      .sort((a, b) => {
        // Primary sort by book count, secondary by average rating
        if (b.bookCount !== a.bookCount) {
          return b.bookCount - a.bookCount;
        }
        return b.avgRating - a.avgRating;
      })
      .slice(0, 4);
  }, []);


  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
        {/* Section Header - Mobile-Optimized */}
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 xs:mb-4 text-gray-800" style={{ fontFamily: "'Playful Display', serif" }}>
            Featured Authors
          </h2>
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto px-2">
            Discover the most popular authors in our collection
          </p>
        </div>

        {/* Mobile Layout - 2x2 Grid */}
        <div className="lg:hidden grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
          {topAuthors.map((author, index) => (
            <div key={author.name} className="group">
              <div className="relative w-full h-65 xs:h-36 sm:h-40 md:h-48 rounded-lg xs:rounded-xl overflow-hidden shadow-md bg-white cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95">
                {/* Author Image */}
                <img
                  src={author.authorInfo.image || `https://i.pravatar.cc/300?u=${author.name}`}
                  alt={author.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                />

                {/* Hover Overlay - Mobile-Optimized */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 xs:p-3 sm:p-4">
                  <h3 className="text-sm xs:text-base sm:text-lg font-bold text-center mb-1 xs:mb-2" style={{ fontFamily: "'Playful Display', serif" }}>{author.name}</h3>
                  <p className="text-xs xs:text-sm text-center mb-2 xs:mb-3 line-clamp-2">
                    {author.authorInfo.about || 'Renowned author with a rich literary legacy.'}
                  </p>
                  
                  {/* Google-style Rating - Compact */}
                  <div className="flex items-center gap-1 xs:gap-2 mb-2 xs:mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-400 text-sm xs:text-base ${
                            i < author.googleRating ? 'opacity-100' : 'opacity-30'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs xs:text-sm font-medium">{author.googleRating}.0</span>
                  </div>
                  
                  {/* Stats - Compact */}
                  <div className="flex items-center gap-2 xs:gap-4 mb-2 xs:mb-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{author.ratingCount.toLocaleString()} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Default Info - Mobile-Optimized */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 xs:p-3 sm:p-4 text-white group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-sm xs:text-base sm:text-lg font-semibold" style={{ fontFamily: "'Playful Display', serif" }}>{author.name}</h3>
                  <div className="flex items-center gap-1 xs:gap-2 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-400 text-xs xs:text-sm ${
                            i < author.googleRating ? 'opacity-100' : 'opacity-30'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-medium">{author.googleRating}.0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout - 4x1 Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {topAuthors.map((author, index) => (
            <div key={author.name} className="group">
              <div className="relative w-full h-95 rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer transform transition-all duration-300 hover:scale-105">
                {/* Author Image */}
                <img
                  src={author.authorInfo.image || `https://i.pravatar.cc/300?u=${author.name}`}
                  alt={author.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                />

                {/* Hover Overlay - Desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                  <h3 className="text-xl font-bold text-center mb-3" style={{ fontFamily: "'Playful Display', serif" }}>{author.name}</h3>
                  <p className="text-sm text-center mb-4 line-clamp-3">
                    {author.authorInfo.about || 'Renowned author with a rich literary legacy.'}
                  </p>
                  
                  {/* Google-style Rating - Desktop */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-400 text-lg ${
                            i < author.googleRating ? 'opacity-100' : 'opacity-30'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium">{author.googleRating}.0</span>
                  </div>
                  
                  {/* Stats - Desktop */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{author.ratingCount.toLocaleString()} reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{author.bookCount} books</span>
                    </div>
                  </div>
                </div>

                {/* Default Info - Desktop */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playful Display', serif" }}>{author.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-400 text-sm ${
                            i < author.googleRating ? 'opacity-100' : 'opacity-30'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium">{author.googleRating}.0</span>
                  </div>
                  <p className="text-sm text-gray-200">{author.bookCount} books</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Authors;
