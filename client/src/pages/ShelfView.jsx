import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShelf } from "../contexts/ShelfContext";

const ShelfView = () => {
  const { type } = useParams();
  const { shelf } = useShelf();

  const title = useMemo(() => {
    if (type === "nextUp") return "Next up";
    if (type === "favorites") return "Favorite Books";
    if (type === "currentlyReading") return "Currently reading";
    if (type === "finished") return "Finished";
    return "Shelf";
  }, [type]);

  const books = shelf[type] || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#004225" }}>{title}</h1>
          <Link to="/shelf" className="text-sm text-[#004225]">Back to My library</Link>
        </div>

        {books.length === 0 ? (
          <div className="text-gray-600">No books here yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map((b) => (
              <Link key={b.slug} to={`/book/${b.slug}`} className="block group">
                <div className="bg-white border border-gray-200 group-hover:border-[#004225]/60 rounded-xl p-3 transition-colors">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white border border-gray-200 mb-3 flex items-center justify-center">
                    <img src={b.cover} alt={b.title} className="h-full w-auto object-cover" />
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]" style={{ color: "#004225" }}>{b.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{b.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShelfView;


