/**
 * LIT ISLE - Search Results Page
 * 
 * This page handles search functionality across books, authors, genres, and users.
 * It provides a unified search experience with filtering and pagination.
 * 
 * @author LIT ISLE Development Team
 * @version 1.0.0
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { booksData } from './bookG/data';
import { useShelf } from '../contexts/ShelfContext';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeTab, setActiveTab] = useState('books');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToShelf, isInShelf } = useShelf();
  
  const itemsPerPage = 12;

  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Get all books data
  const allBooks = useMemo(() => Object.values(booksData), []);

  // Search function
  const searchItems = (items, searchTerm) => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      const searchableText = `${item.title} ${item.author} ${item.genres?.join(' ')}`.toLowerCase();
      return searchableText.includes(term);
    });
  };

  // Search results
  const searchResults = useMemo(() => {
    const results = {
      books: searchItems(allBooks, searchQuery),
      authors: [],
      genres: [],
      users: []
    };

    // Extract unique authors
    const authorSet = new Set();
    results.books.forEach(book => {
      if (book.author) authorSet.add(book.author);
    });
    results.authors = Array.from(authorSet).map(author => ({
      name: author,
      bookCount: results.books.filter(book => book.author === author).length
    }));

    // Extract unique genres
    const genreSet = new Set();
    results.books.forEach(book => {
      if (book.genres) {
        book.genres.forEach(genre => genreSet.add(genre));
      }
    });
    results.genres = Array.from(genreSet).map(genre => ({
      name: genre,
      bookCount: results.books.filter(book => book.genres?.includes(genre)).length
    }));

    return results;
  }, [allBooks, searchQuery]);

  // Get current tab results
  const currentResults = searchResults[activeTab] || [];
  const totalPages = Math.ceil(currentResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleResults = currentResults.slice(startIndex, endIndex);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setCurrentPage(1);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Book card component
  const BookCard = ({ book }) => (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/book/${book.slug}`} className="block">
        <div className="aspect-[2/3] rounded-t-lg overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          <div className="flex flex-wrap gap-1">
            {book.genres?.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );

  // Author card component
  const AuthorCard = ({ author }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-[#0B6623] rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{author.name}</h3>
          <p className="text-sm text-gray-600">{author.bookCount} book{author.bookCount !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );

  // Genre card component
  const GenreCard = ({ genre }) => (
    <Link to={`/genres/${encodeURIComponent(genre.name)}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#0B6623] rounded-full flex items-center justify-center">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{genre.name}</h3>
            <p className="text-sm text-gray-600">{genre.bookCount} book{genre.bookCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-16" />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6623]/20 focus:border-[#0B6623] transition-colors"
              />
            </div>
          </form>

          {/* Results Summary */}
          {query && (
            <p className="mt-4 text-gray-600">
              {searchResults.books.length + searchResults.authors.length + searchResults.genres.length} results for "{query}"
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'books', label: 'Books', count: searchResults.books.length },
              { id: 'authors', label: 'Authors', count: searchResults.authors.length },
              { id: 'genres', label: 'Genres', count: searchResults.genres.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#0B6623] text-[#0B6623]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!query ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
            <p className="text-gray-600">Enter a search term to find books, authors, and genres.</p>
          </div>
        ) : currentResults.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {visibleResults.map((item, index) => (
                <div key={index}>
                  {activeTab === 'books' && <BookCard book={item} />}
                  {activeTab === 'authors' && <AuthorCard author={item} />}
                  {activeTab === 'genres' && <GenreCard genre={item} />}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'bg-[#0B6623] text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
