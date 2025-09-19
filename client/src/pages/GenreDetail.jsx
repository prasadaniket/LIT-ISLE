import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Star, BookOpen, Plus } from "lucide-react";
import { useShelf } from "../contexts/ShelfContext";
import { booksData } from "./bookG/data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../components/ui/pagination";

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

const GenreDetail = () => {
  const { genreName } = useParams();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { addToShelf, isInShelf } = useShelf();
  
  const booksPerPage = 12;

  // Decode the genre name from URL
  const decodedGenreName = decodeURIComponent(genreName || "");

  // Filter books by genre
  const genreBooks = useMemo(() => {
    return Object.values(booksData).filter((book) => 
      book.genres && book.genres.some(genre => 
        genre.toLowerCase() === decodedGenreName.toLowerCase()
      )
    );
  }, [decodedGenreName]);

  // Filter books by search query
  const filteredBooks = useMemo(() => {
    if (!query) return genreBooks;
    return genreBooks.filter((book) => 
      `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [genreBooks, query]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const visibleBooks = filteredBooks.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (newQuery) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  if (!decodedGenreName) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="h-16" />
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-2xl font-bold">Genre not found</h1>
          <Link to="/categories" className="text-[#0B6623] underline">
            Go back to categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Spacer between navbar and page */}
      <div className="h-16" />

      {/* Title section */}
      <section className="pt-6 pb-2 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold inline-flex items-center gap-3 justify-center" style={{ color: '#0B6623' }}>
          <BookOpen className="w-8 h-8" />
          <span>{decodedGenreName}</span>
        </h1>
        <p className="text-gray-700 mt-2">
          Discover amazing books in the {decodedGenreName} genre
        </p>
        
        {/* Search bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6623]/20 focus:border-[#0B6623] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Books grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        {/* Results info */}
        <div className="max-w-7xl mx-auto mb-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} books
            {query && ` matching "${query}"`}
          </p>
        </div>
        
        {visibleBooks.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">
              {query ? `No books found matching "${query}" in ${decodedGenreName}` : `No books available in ${decodedGenreName} genre`}
            </p>
            <Link 
              to="/categories" 
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#0B6623] text-white hover:bg-[#0e7a2b] transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {visibleBooks.map((book) => (
              <Link key={book.slug} to={`/book/${book.slug}`} className="block group">
                <div className="bg-white border border-gray-200 group-hover:border-[#0B6623]/60 rounded-xl p-3 transition-colors shadow-[0_0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_20px_-6px_rgba(11,102,35,0.25)] cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white border border-gray-200 mb-3 flex items-center justify-center">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-auto object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]" style={{ color: '#0B6623' }}>{book.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-[#0B6623]/10 text-[#0B6623] rounded-full">
                      {decodedGenreName}
                    </span>
                  </div>
                  <div className="mt-2">
                    <RatingStars value={book.ratingAvg || 4} />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="flex-1 inline-flex items-center justify-center bg-[#0B6623] group-hover:bg-[#0e7a2b] text-white font-semibold text-xs py-2 rounded-lg transition-colors">
                      View Details
                    </span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToShelf(book, 'nextUp');
                      }}
                      className={`flex-1 inline-flex items-center justify-center border font-semibold text-xs py-2 rounded-lg transition-colors ${
                        isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                          ? 'border-green-500 text-green-600 bg-green-50'
                          : 'border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white'
                      }`}
                    >
                      {isInShelf(book.slug, 'favorites') || isInShelf(book.slug, 'currentlyReading') || isInShelf(book.slug, 'nextUp') || isInShelf(book.slug, 'finished')
                        ? 'In Shelf'
                        : 'Add to Shelf'
                      }
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current page
                  const shouldShow = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!shouldShow) {
                    // Show ellipsis for gaps
                    if (page === 2 && currentPage > 4) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 3) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default GenreDetail;
