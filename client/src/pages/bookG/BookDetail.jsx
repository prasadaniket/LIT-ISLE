import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { booksData } from "./data";
import { authorsData } from "./authors";
import { Star, Heart, Share2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShelf } from "../../contexts/ShelfContext";

const StarsRow = ({ value = 0, size = 18, color = "#facc15" }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className=""
          style={{
            width: size,
            height: size,
            color: i < full || (half && i === full) ? color : "#4b5563",
          }}
          fill={i < full || (half && i === full) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

const BookDetail = () => {
  const { slug } = useParams();
  const book = useMemo(() => booksData[slug], [slug]);
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToShelf, removeFromShelf, isInShelf } = useShelf();
  const [showFullDesc, setShowFullDesc] = useState(false);

  const isFavorite = isInShelf(slug, "favorites");

  const toggleFavorite = () => {
    if (!book) return;
    const minimalBook = {
      slug,
      title: book.title,
      author: book.author,
      cover: book.cover,
    };
    if (isFavorite) {
      removeFromShelf(slug, "favorites");
    } else {
      addToShelf(minimalBook, "favorites");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${book?.title || "Book"} - LIT-ISLE`;
  const shareText = `Check out this book on LIT-ISLE: ${book?.title || ""}${
    book?.author ? ` by ${book.author}` : ""
  }`;

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }
    } catch (err) {
      // fall back to popover
    }
    setIsShareOpen((v) => !v);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="h-16" />
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-2xl font-bold">Book not found</h1>
          <Link to="/recommendations" className="text-[#0B6623] underline">
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="h-16" />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <aside className="md:col-span-1">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => navigate(`/book/${slug}/read`)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold transition-colors"
              >
                Read Now
              </button>
              <button
                onClick={() => {
                  if (!book) return;
                  if (isInShelf(slug, "nextUp")) {
                    navigate("/shelf");
                    return;
                  }
                  addToShelf(
                    {
                      slug,
                      title: book.title,
                      author: book.author,
                      cover: book.cover,
                    },
                    "nextUp"
                  );
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition-colors"
              >
                {isInShelf(slug, "nextUp") ? "Go to Shelf" : "Add to Shelf"}
              </button>
            </div>
            {/* Rating moved to Reviews & Comments */}
          </aside>

          {/* Right column */}
          <main className="md:col-span-2">
            {/* Title + Author */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                  {book.title}
                </h1>
                <div className="text-gray-600 mt-1">by {book.author}</div>
              </div>
              <div className="relative flex flex-col gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-lg border border-gray-200 hover:bg-gray-50 ${
                    isFavorite ? "text-red-500" : "text-gray-600"
                  }`}
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                  aria-pressed={isFavorite}
                  title={
                    isFavorite ? "Remove from Favorites" : "Add to Favorites"
                  }
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </button>
                <div className="relative">
                  <button
                    onClick={handleShareClick}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 inline-flex items-center gap-2"
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="sr-only">Share</span>
                  </button>
                  {isShareOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg p-3">
                      <div className="text-sm font-semibold text-gray-800">
                        Share this book
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          readOnly
                          value={shareUrl}
                          className="flex-1 px-2 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 bg-gray-50"
                          onFocus={(e) => e.currentTarget.select()}
                        />
                        <button
                          onClick={handleCopy}
                          className="px-2 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            shareText + " " + shareUrl
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`mailto:?subject=${encodeURIComponent(
                            shareTitle
                          )}&body=${encodeURIComponent(
                            shareText + "\n" + shareUrl
                          )}`}
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          Email
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            shareText
                          )}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          Twitter
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Average rating */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <StarsRow value={book.ratingAvg || 4} size={16} />
              <span>{(book.ratingAvg || 4).toFixed(1)}</span>
              <span>·</span>
              <span>{book.ratingsCount?.toLocaleString() || 0} ratings</span>
              <span>·</span>
              <span>{book.reviewsCount?.toLocaleString() || 0} reviews</span>
            </div>

            {/* Synopsis */}
            <div className="mt-6 text-gray-700 leading-relaxed">
              <div className={`relative overflow-hidden transition-[max-height] duration-500 ease-in-out`} style={{ maxHeight: showFullDesc ? 800 : 96 }}>
                <p>{book.description}</p>
                {!showFullDesc && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              <button
                onClick={() => setShowFullDesc((v) => !v)}
                className="mt-2 text-[#0B6623] font-semibold"
              >
                {showFullDesc ? "Show less" : "Show more"}
              </button>
            </div>

            {/* Metadata */}
            <div className="mt-6">
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {book.genres?.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-700"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Publication details */}
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                {book.series && <div>Series: {book.series}</div>}
                {book.isbn && <div>ISBN: {book.isbn}</div>}
                {book.asin && <div>ASIN: {book.asin}</div>}
                {book.language && <div>Edition Language: {book.language}</div>}
                {book.publicationDate && (
                  <div>Publication Date: {book.publicationDate}</div>
                )}
              </div>

              {/* Editions */}
              <EditionsList current={book} />
            </div>

            {/* Social stats */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i + 1}`}
                      className="w-8 h-8 rounded-full border border-white"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  231 people are currently reading
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i + 5}`}
                      className="w-8 h-8 rounded-full border border-white"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  1,102 people want to read
                </div>
              </div>
            </div>

            {/* Author info */}
            <AboutAuthor book={book} />
          </main>
        </div>

        {/* Recommendations */}
        <Recommendations current={book} />

        {/* Reviews / comments placeholder */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Reviews & Comments</h3>
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-2">Rate this book</div>
            <StarsRow value={0} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">
            Coming soon: reader reviews and discussion threads.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookDetail;

// Inline helper components
const EditionsList = ({ current }) => {
  const [open, setOpen] = useState(false);
  const titleKey = (current?.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const sameAuthor = current?.author;
  const editions = Object.values(booksData).filter((b) => {
    if (!b || b.slug === current.slug) return false;
    const t = (b.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    return (
      t === titleKey ||
      (b.author === sameAuthor &&
        (b.series || "")
          .toLowerCase()
          .includes((current.series || "").toLowerCase()))
    );
  });

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[#0B6623] font-semibold"
      >
        {open ? "Hide editions" : "All editions"}
      </button>
      {open && (
        <div className="mt-3">
          {editions.length === 0 ? (
            <div className="text-sm text-gray-600 italic">
              No edition available that a devoted reader would treasure for this
              title.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editions.map((e) => (
                <Link
                  key={e.slug}
                  to={`/book/${e.slug}`}
                  className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <img
                    src={e.cover}
                    alt={e.title}
                    className="w-12 h-16 object-cover rounded border border-gray-200"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {e.title}
                    </div>
                    <div className="text-xs text-gray-600">{e.author}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AboutAuthor = ({ book }) => {
  const authorKey = book.authorInfo?.name || book.author;
  const author = authorsData[authorKey] || { name: authorKey };
  const isAuthorVerifiedAndLoggedIn = false; // placeholder: gate based on auth state when available

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">About the author</h3>
      <div className="flex items-start gap-4">
        <img
          src={author.image || `https://i.pravatar.cc/80?u=${authorKey}`}
          className="w-16 h-16 rounded-full border border-gray-200 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">{author.name}</div>
              {isAuthorVerifiedAndLoggedIn && (
                <div className="text-sm text-gray-600">
                  {book.authorInfo?.booksCount || 0} books ·{" "}
                  {(book.authorInfo?.followers || 0).toLocaleString()} followers
                </div>
              )}
            </div>
            {isAuthorVerifiedAndLoggedIn ? (
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white">
                <UserPlus className="w-4 h-4" /> Follow
              </button>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-gray-400 cursor-not-allowed"
                title="Only the verified author can enable following"
              >
                Verify yourself if you are the author
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 mt-3 leading-relaxed">
            {author.about || book.authorInfo?.bio}
          </p>
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            {author.born && <div>Born: {author.born}</div>}
            {author.died && <div>Died: {author.died}</div>}
            {author.numberOfBooks && (
              <div>Number of books: {author.numberOfBooks}</div>
            )}
            {author.popularWorks && (
              <div>Most popular: {author.popularWorks}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Recommendations = ({ current }) => {
  const currentGenres = new Set(current.genres || []);
  const items = Object.values(booksData)
    .filter((b) => b && b.slug !== current.slug)
    .map((b) => ({
      b,
      score: (b.genres || []).reduce(
        (acc, g) => acc + (currentGenres.has(g) ? 1 : 0),
        0
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.b);

  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">You might also like</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((bk) => (
          <Link
            key={bk.slug}
            to={`/book/${bk.slug}`}
            className="group rounded-xl border border-gray-200 hover:border-[#0B6623]/40 p-3"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-md bg-white border border-gray-200 mb-2">
              <img
                src={bk.cover}
                alt={bk.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
              />
            </div>
            <div
              className="text-sm font-medium line-clamp-2"
              style={{ color: "#0B6623" }}
            >
              {bk.title}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">{bk.author}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
