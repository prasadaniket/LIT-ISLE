import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, SlidersHorizontal, Star, BookOpen, Plus } from "lucide-react";
import { useShelf } from "../contexts/ShelfContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../components/ui/pagination";

const fullCategories = [
  "All",
  "Mythology",
  "Historical",
  "Comics",
  "Manga",
  "Poetry",
  "Classics",
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Horror",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Health",
  "Travel",
  "Cooking",
  "Art",
  "Drama",
  "Comedy",
  "Adventure",
  "Crime",
  "Philosophy",
  "Religion",
  "Education",
  "Technology",
  "Science",
  "Nature",
  "Sports",
  "Music",
  "Photography",
];

const allBooksSeed = [
  { slug: "thirty-nine-steps", title: "The Thirty-Nine Steps (Richard Hannay, #1)", author: "John Buchan", cover: "/Books/covers/The-Thirty-Nine-Steps-Richard-Hannay-1.jpg", category: "Adventure", rating: 4.2 },
  { slug: "mountains-of-madness", title: "At the Mountains of Madness", author: "H. P. Lovecraft", cover: "/Books/covers/At-the-Mountains-of-Madness.jpg", category: "Horror", rating: 4.4 },
  { slug: "vindication-of-rights-of-woman", title: "A Vindication of the Rights of Woman", author: "Mary Wollstonecraft", cover: "/Books/covers/A-Vindication-of-the-Rights-of-Woman.jpg", category: "Philosophy", rating: 4.1 },
  { slug: "art-of-war", title: "Art of War", author: "Petros Triantafyllou", cover: "/Books/covers/Art-of-War.jpg", category: "Fantasy", rating: 4.6 },
  { slug: "walden", title: "Walden; or, Life in the Woods", author: "Henry David Thoreau", cover: "/Books/covers/Walden.jpg", category: "Philosophy", rating: 4.0 },
  { slug: "origin-of-species", title: "On the Origin of Species and Other Stories", author: "Bo-young Kim", cover: "/Books/covers/On-the-Origin-of-Species-and-Other-Stories.jpg", category: "Science Fiction", rating: 4.3 },
  { slug: "shakespeare-works-vol1", title: "The Complete Works of William Shakespeare, Volume 1 of 2", author: "William Shakespeare", cover: "/Books/covers/The-Complete-Works-of-William-Shakespeare,-Volume-1-of-2.jpg", category: "Drama", rating: 4.7 },
  { slug: "alice-in-wonderland", title: "Alice's Adventures in Wonderland and Other Tales", author: "Lewis Carroll", cover: "/Books/covers/Alices-Adventures-in-Wonderland-and-Other-Tales.jpg", category: "Fantasy", rating: 4.5 },
  { slug: "sherlock-holmes", title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", cover: "/Books/covers/The-Adventures-of-Sherlock-Holmes.jpg", category: "Mystery", rating: 4.6 },
  { slug: "the-great-gatsby", title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "/Books/covers/The-Great-Gatsby.jpg", category: "Fiction", rating: 4.4 },
  { slug: "moby-dick", title: "Moby-Dick", author: "Herman Melville", cover: "/Books/covers/moby-dick.jpg", category: "Adventure", rating: 4.0 },
  { slug: "dracula", title: "Dracula", author: "Bram Stoker", cover: "/Books/covers/dracula.jpg", category: "Horror", rating: 4.3 },
  { slug: "frankenstein", title: "Frankenstein", author: "Deanna McFadden", cover: "/Books/covers/frankensrein.jpg", category: "Science Fiction", rating: 4.2 },
];

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

const AllBooks = () => {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { addToShelf, isInShelf } = useShelf();
  
  const booksPerPage = 12;

  const filtered = useMemo(() => {
    return allBooksSeed.filter((b) => {
      const matchesQuery = `${b.title} ${b.author}`.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCat === "All" ? true : b.category === activeCat;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCat]);

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const visibleBooks = filtered.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newCategory) => {
    setActiveCat(newCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (newQuery) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  // Only show categories that have at least one book (plus All)
  const availableCategorySet = useMemo(() => {
    const set = new Set();
    allBooksSeed.forEach((b) => set.add(b.category));
    return set;
  }, []);
  const categoriesToShow = fullCategories.filter((c, idx) => c === "All" || availableCategorySet.has(c));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Spacer between navbar and page */}
      <div className="h-16" />

      {/* Title section */}
      <section className="pt-6 pb-2 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold inline-flex items-center gap-3 justify-center" style={{ color: '#0B6623' }}>
          <span>All Books</span>
        </h1>
        <p className="text-gray-700 mt-2">Explore, discover, and read your next favorite book.</p>
        
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

      {/* Filters bar */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {categoriesToShow.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  activeCat === cat
                    ? "border-[#0B6623] text-[#0B6623]"
                    : "border-gray-300 text-gray-700 hover:border-[#0B6623]/60 hover:text-[#0B6623]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        {/* Results info */}
        <div className="max-w-7xl mx-auto mb-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length} books
            {activeCat !== "All" && ` in ${activeCat}`}
            {query && ` matching "${query}"`}
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {visibleBooks.map((b) => (
            <Link key={b.title} to={`/book/${b.slug}`} className="block group">
              <div className="bg-white border border-gray-200 group-hover:border-[#0B6623]/60 rounded-xl p-3 transition-colors shadow-[0_0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_20px_-6px_rgba(11,102,35,0.25)] cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white border border-gray-200 mb-3 flex items-center justify-center">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="h-full w-auto object-cover"
                  />
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]" style={{ color: '#0B6623' }}>{b.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{b.author}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-[#0B6623]/10 text-[#0B6623] rounded-full">
                    {b.category}
                  </span>
                </div>
                <div className="mt-2">
                  <RatingStars value={b.rating} />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="flex-1 inline-flex items-center justify-center bg-[#0B6623] group-hover:bg-[#0e7a2b] text-white font-semibold text-xs py-2 rounded-lg transition-colors">
                    View Details
                  </span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToShelf(b, 'nextUp');
                    }}
                    className={`flex-1 inline-flex items-center justify-center border font-semibold text-xs py-2 rounded-lg transition-colors ${
                      isInShelf(b.slug, 'favorites') || isInShelf(b.slug, 'currentlyReading') || isInShelf(b.slug, 'nextUp') || isInShelf(b.slug, 'finished')
                        ? 'border-green-500 text-green-600 bg-green-50'
                        : 'border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white'
                    }`}
                  >
                    {isInShelf(b.slug, 'favorites') || isInShelf(b.slug, 'currentlyReading') || isInShelf(b.slug, 'nextUp') || isInShelf(b.slug, 'finished')
                      ? 'In Shelf'
                      : 'Add to Shelf'
                    }
                  </button>
                </div>
            </div>
            </Link>
          ))}
        </div>

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

export default AllBooks;

