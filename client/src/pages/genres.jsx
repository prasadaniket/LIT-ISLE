import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { booksData } from "./bookG/data";
import { useShelf } from "../contexts/ShelfContext";
import { Bookmark, BookOpen, Coffee, Trophy, Glasses } from "lucide-react";

const ROYAL_GREEN = "#004225";
const AMBER = "#F5B700";
const BEIGE = "#FDF6EC";
const OFF_WHITE = "#FAFAFA";

const fullGenres = [
  "Library",
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

const bestsellers = [
  {
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "/Books/covers/The-Great-Gatsby.jpg",
  },
  {
    slug: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    cover: "/Books/covers/moby-dick.jpg",
  },
  {
    slug: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    cover: "/Books/covers/dracula.jpg",
  },
  {
    slug: "sherlock-holmes",
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    cover: "/Books/covers/The-Adventures-of-Sherlock-Holmes.jpg",
  },
];

const interesting = [
  {
    slug: "walden",
    title: "Walden",
    cover: "/Books/covers/Walden.jpg",
    author: "H. D. Thoreau",
  },
  {
    slug: "art-of-war",
    title: "Art of War",
    cover: "/Books/covers/Art-of-War.jpg",
    author: "Sun Tzu",
  },
  {
    slug: "alice-in-wonderland",
    title: "Alice in Wonderland",
    cover: "/Books/covers/Alices-Adventures-in-Wonderland-and-Other-Tales.jpg",
    author: "Lewis Carroll",
  },
];

const curated = [
  { title: "Books to Read Before 30", icon: BookOpen },
  { title: "Award Winning Titles", icon: Trophy },
  { title: "Geeky Picks", icon: Glasses },
  { title: "Weekend Chill Reads", icon: Coffee },
];

const topAuthors = [
  {
    name: "William Shakespeare",
    image: "/Books/author img/William Shakespeare.jpg",
    booksCount: 39,
    followers: "900K",
  },
  {
    name: "Arthur Conan Doyle",
    image: "/Books/author img/Arthur Conan Doyle.jpg",
    booksCount: 50,
    followers: "450K",
  },
  {
    name: "F. Scott Fitzgerald",
    image: "/Books/author img/F.-Scott-Fitzgerald.jpg",
    booksCount: 5,
    followers: "260K",
  },
  {
    name: "H. P. Lovecraft",
    image: "/Books/author img/H._P._Lovecraft.jpg",
    booksCount: 100,
    followers: "330K",
  },
];

// no sidebar/topbar on this page per design

const ShelfCard = ({ item, size = "md" }) => {
  const sizes = {
    lg: "w-32 h-44",
    md: "w-28 h-40",
    sm: "w-24 h-36",
  };
  return (
    <div className="group">
      <div
        className={`rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center ${sizes[size]} shadow-sm group-hover:shadow-lg transition-all duration-200 group-hover:-translate-y-0.5`}
      >
        <img
          src={item.cover}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
        />
      </div>
      <div className="mt-2">
        <div
          className="text-sm font-semibold line-clamp-2"
          style={{ color: ROYAL_GREEN }}
        >
          {item.title}
        </div>
        {item.author && (
          <div className="text-xs text-gray-600">{item.author}</div>
        )}
      </div>
    </div>
  );
};

const Categories = () => {
  const [activeTab, setActiveTab] = useState("Library");
  const filteredBest = useMemo(() => bestsellers, []);
  const filteredInteresting = useMemo(() => interesting, []);
  const allBooks = useMemo(() => Object.values(booksData || {}), []);
  const { addToShelf, isInShelf } = useShelf();
  const sidebarGenresOrdered = useMemo(() => {
    // Count books per genre
    const counts = new Map();
    allBooks.forEach((b) =>
      (b.genres || []).forEach((g) => counts.set(g, (counts.get(g) || 0) + 1))
    );
    // Map our displayed names to counts (Library stays on top)
    const items = fullGenres.map((g) => ({
      name: g,
      count: g === "Library" ? Infinity : counts.get(g) || 0,
    }));
    // Sort descending by count, Library first (Infinity)
    items.sort((a, b) =>
      b.count === a.count ? a.name.localeCompare(b.name) : b.count - a.count
    );
    return items.map((i) => i.name);
  }, [allBooks]);
  const genreResults = useMemo(() => {
    if (activeTab === "Library") return [];
    const target = (activeTab || "").toLowerCase();
    return allBooks.filter((b) =>
      (b.genres || []).some((g) => (g || "").toLowerCase() === target)
    );
  }, [activeTab, allBooks]);

  return (
    <div className="min-h-screen page-bg flex flex-col bg-white">
      <Navbar />
      {/* Content area */}
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
            {/* Sidebar genres */}
            <aside className="md:sticky md:top-24 self-start">
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <div
                  className="text-sm font-semibold mb-2"
                  style={{ color: ROYAL_GREEN }}
                >
                  Genres
                </div>
                <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-auto pr-1">
                  {sidebarGenresOrdered.map((g) => {
                    const isActive = activeTab === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setActiveTab(g)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          isActive
                            ? "border-[#004225] text-[#004225] bg-[#0042250F]"
                            : "border-gray-200 hover:border-[#004225] hover:text-[#004225]"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Right content */}
            <section>
              {activeTab === "Library" ? (
                <>
                  {/* Hero Shelf */}
                  <Card className="relative">
                    <CardHeader className="p-6 md:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-1">
                          <div
                            className="text-xs uppercase tracking-widest"
                            style={{ color: ROYAL_GREEN }}
                          >
                            Popular
                          </div>
                          <CardTitle>
                            <span
                              className="block text-2xl md:text-3xl font-serif font-extrabold"
                              style={{ color: ROYAL_GREEN }}
                            >
                              POPULAR BESTSELLERS
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Curated by taste and trends. Updated weekly.
                          </CardDescription>
                          <div className="mt-4">
                            <Link
                              to="/recommendations"
                              className="inline-flex items-center px-5 py-2.5 rounded-xl text-white font-semibold transition-colors"
                              style={{ backgroundColor: ROYAL_GREEN }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = AMBER)
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  ROYAL_GREEN)
                              }
                            >
                              See Full List
                            </Link>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_30px_-20px_rgba(0,0,0,0.25)]">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {filteredBest.map((b) => (
                                <Link key={b.title} to={`/book/${b.slug}`}>
                                  <ShelfCard item={b} size="lg" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Secondary Shelf */}
                  <div
                    className="mt-10 rounded-2xl border border-gray-200"
                    style={{ backgroundColor: BEIGE }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8 items-start">
                      <div>
                        <div
                          className="text-xs uppercase tracking-widest"
                          style={{ color: ROYAL_GREEN }}
                        >
                          Discover
                        </div>
                        <h3
                          className="text-2xl font-serif font-extrabold"
                          style={{ color: ROYAL_GREEN }}
                        >
                          CAN BE INTERESTING
                        </h3>
                        <p className="text-sm text-gray-700 mt-1">
                          Thoughtful picks handpicked for curious minds.
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-3 gap-4">
                          {filteredInteresting.map((b) => (
                            <div key={b.title} className="relative">
                              <Link to={`/book/${b.slug}`}>
                                <ShelfCard item={b} />
                              </Link>
                              <button
                                className="absolute -top-1 right-9 p-2 rounded-full border bg-white hover:bg-amber-50"
                                title="Add to Next up"
                                aria-label="Add to Next up"
                                style={{ borderColor: "#e5e7eb" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const minimal = {
                                    slug: b.slug,
                                    title: b.title,
                                    author: b.author,
                                    cover: b.cover,
                                  };
                                  addToShelf(minimal, "nextUp");
                                }}
                              >
                                <Bookmark
                                  className="w-4 h-4"
                                  style={{
                                    color: isInShelf?.(b.slug, "nextUp")
                                      ? "#22c55e"
                                      : AMBER,
                                  }}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2
                    className="text-2xl font-serif font-bold mb-4"
                    style={{ color: ROYAL_GREEN }}
                  >
                    {activeTab}
                  </h2>
                  {genreResults.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      No books found for this genre.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                      {genreResults.map((b) => (
                        <Link
                          key={b.slug}
                          to={`/book/${b.slug}`}
                          className="block group"
                        >
                          <div className="bg-white border border-gray-200 group-hover:border-[#0B6623]/60 rounded-xl p-3 transition-colors">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white border border-gray-200 mb-3 flex items-center justify-center">
                              <img
                                src={b.cover}
                                alt={b.title}
                                className="h-full w-auto object-cover"
                              />
                            </div>
                            <h3
                              className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]"
                              style={{ color: ROYAL_GREEN }}
                            >
                              {b.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {b.author}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Top Authors */}
          <Card className="relative">
            <CardHeader className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                  <div
                    className="text-xs uppercase tracking-widest"
                    style={{ color: ROYAL_GREEN }}
                  >
                    Featured
                  </div>
                  <CardTitle>
                    <span
                      className="block text-2xl md:text-3xl font-serif font-extrabold"
                      style={{ color: ROYAL_GREEN }}
                    >
                      TOP AUTHORS
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Discover the literary masters behind timeless classics.
                  </CardDescription>
                </div>
                <div className="md:col-span-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_30px_-20px_rgba(0,0,0,0.25)]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {topAuthors.map((author) => (
                        <div key={author.name} className="group text-center">
                          <div className="w-30 h-40 mx-auto overflow-hidden border-2 border-gray-200 group-hover:border-[#0B6623]/60 transition-colors mb-3">
                            <img
                              src={author.image}
                              alt={author.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4
                            className="text-sm font-semibold"
                            style={{ color: ROYAL_GREEN }}
                          >
                            {author.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {author.booksCount} books
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Curated Shelves (Coming soon) */}
          <div className="mt-10">
            <h3
              className="text-xl font-serif font-bold mb-4"
              style={{ color: ROYAL_GREEN }}
            >
              Curated for You{" "}
              <span className="text-sm font-normal text-gray-600">
                (Coming soon)
              </span>
            </h3>
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
              We’re crafting hand-picked collections you’ll love. Check back
              soon!
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
