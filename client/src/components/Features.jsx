import { Badge } from "./ui/badge";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { booksData } from "../pages/bookG/data";

const Features = () => {
  useEffect(() => {
    if (!document.getElementById('font-dancing-script')) {
      const link = document.createElement('link');
      link.id = 'font-dancing-script';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);
  const [activeTab, setActiveTab] = useState("Books");

  const tabs = ["Books", "Audio", "Genres", "Reviews", "Community", "All Features"];

  // Sample 6 random books on each mount/refresh
  const randomBooks = useMemo(() => {
    const list = Object.values(booksData);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  // Build unique genres from booksData and sample 6
  const randomGenres = useMemo(() => {
    const set = new Set();
    Object.values(booksData).forEach((b) => b.genres?.forEach((g) => set.add(g)));
    const genres = Array.from(set);
    const shuffled = [...genres].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  // Trust badges now use logo images from /public/trust
  // Per-logo target heights are tuned so the visual size appears uniform
  const trustBadges = [
    { name: "BookBub", src: "/trust/bookbub.png", h: 38 },
    { name: "Goodreads", src: "/trust/goodreads.png", h: 76 },
    { name: "LibraryThing", src: "/trust/librarything.png", h: 38 },
    { name: "Spotify", src: "/trust/spotify.png", h: 38 }
  ];

  return (
    <section id="features" style={{ backgroundColor: '#ffffff', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-black font-semibold mb-4" style={{ fontSize: '47px', lineHeight: '1.2', fontFamily: '\'Playful Display\', serif' }}>
            You bring the curiosity. <span className="text-[#0B6623]">LIT ISLE</span> brings the stories to life.
          </h1>
          <p className="text-gray-600 text-lg mb-3" style={{ fontSize: '25px', fontFamily: '\'Playful Display\', serif' }}>
            Join readers worldwide in turning pages into journeys
          </p>
          
          {/* Trust Badges */}
          <div className="flex justify-center items-center gap-35 flex-wrap mb-12">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                style={{ width: '150px', height: '50px' }}
                aria-label={badge.name}
                title={badge.name}
              >
                <img
                  src={badge.src}
                  alt={badge.name}
                  className="object-contain max-h-full max-w-full"
                  style={{
                    filter: 'grayscale(100%) brightness(0)',
                    height: `${badge.h}px`,
                    width: 'auto'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-black font-semibold" style={{ fontSize: '30px', letterSpacing: '0.5px', fontFamily: '\'Playful Display\', serif' }}>
            The features you need, the simplicity you want.
          </h2>
          {/*<button 
            className="text-white text-sm px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
            style={{ fontSize: '14px', padding: '6px 12px' }}
          >
            How to start with AI
          </button>*/}
        </div>

        {/* Layout with Sidebar and Content */}
        <div className="flex gap-8">
          {/* Left Sidebar - Navigation Tabs */}
          <div className="flex-shrink-0" style={{ width: '200px' }}>
            <div className="space-y-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left w-full px-4 py-2 rounded-full transition-colors ${
                    activeTab === tab
                      ? 'bg-[#0B6623] text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                  style={{ 
                    fontSize: '16px',
                    padding: '8px 16px',
                    borderRadius: '9999px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Dynamic */}
          <div className="flex-1">
            {/* Books */}
            {activeTab === "Books" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {randomBooks.map((b) => (
                  <Link key={b.slug} to={`/book/${b.slug}`} className="group" style={{ width: '320px', height: '420px', display: 'block' }}>
                    <div
                      className="relative w-full h-full bg-cover bg-center rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
                      style={{ backgroundImage: `url(${b.cover})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold mb-1" style={{ fontSize: '18px' }}>{b.title}</h3>
                        <p className="text-gray-300 text-sm">{b.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Audio - Coming soon */}
            {activeTab === "Audio" && (
              <div className="rounded-2xl border border-gray-300 bg-gray-100 p-8 text-center text-gray-600">Audio features are coming soon.</div>
            )}

            {/* Genres (from Collections) */}
            {activeTab === "Genres" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {randomGenres.map((g, idx) => (
                  <Link key={idx} to="/categories" className="group" style={{ width: '320px', height: '160px', display: 'block' }}>
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-300 bg-gray-50 hover:border-[#0B6623]/40 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <h3 className="text-black font-semibold" style={{ fontSize: '20px' }}>{g}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Reviews - Coming soon */}
            {activeTab === "Reviews" && (
              <div className="rounded-2xl border border-gray-300 bg-gray-100 p-8 text-center text-gray-600">Reviews are coming soon.</div>
            )}

            {/* Community - Coming soon */}
            {activeTab === "Community" && (
              <div className="rounded-2xl border border-gray-300 bg-gray-100 p-8 text-center text-gray-600">Community features are coming soon.</div>
            )}

            {/* All Features */}
            {activeTab === "All Features" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Books",
                  "Audio",
                  "Genres",
                  "Reviews",
                  "Author",
                  "Community",
                ].map((feat, i) => (
                  <div key={i} className="rounded-2xl border border-gray-300 bg-gray-50 p-6 text-black">
                    {feat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
