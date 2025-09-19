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

  const tabs = ["Books", "Audio", "Genres", "Community"];

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
    <section id="features" className="bg-white py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-[80px] px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Hero Section - Mobile-First Responsive */}
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h1 className="text-black font-semibold mb-3 xs:mb-4 text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[47px] leading-tight px-2" style={{ fontFamily: '\'Playful Display\', serif' }}>
            You bring the curiosity.<br className="xs:hidden" />
            <span className="text-[#0B6623]">LIT ISLE</span> brings the stories to life.
          </h1>
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[25px] mb-4 xs:mb-6 px-2 leading-relaxed" style={{ fontFamily: '\'Playful Display\', serif' }}>
            Join readers worldwide in turning pages into journeys
          </p>
          
          {/* Trust Badges - Mobile-Optimized */}
          <div className="flex justify-center items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-35 flex-wrap mb-6 xs:mb-8 sm:mb-10 md:mb-12">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center w-16 xs:w-20 sm:w-24 md:w-28 lg:w-[150px] h-6 xs:h-8 sm:h-10 md:h-12 lg:h-[50px]"
                aria-label={badge.name}
                title={badge.name}
              >
                <img
                  src={badge.src}
                  alt={badge.name}
                  className="object-contain max-h-full max-w-full"
                  style={{
                    filter: 'grayscale(100%) brightness(0)',
                    height: `${Math.min(badge.h, 32)}px`,
                    width: 'auto'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Section - Mobile-First Responsive */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 xs:mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-black font-semibold text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[30px] mb-3 xs:mb-4 lg:mb-0 px-2 leading-tight text-center lg:text-left" style={{ letterSpacing: '0.5px', fontFamily: '\'Playful Display\', serif' }}>
            The features you need,<br className="xs:hidden" />
            <span className="hidden xs:inline"> </span>the simplicity you want.
          </h2>
        </div>

        {/* Layout with Sidebar and Content - Mobile-First Responsive */}
        <div className="flex flex-col lg:flex-row gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Navigation Tabs - Mobile-Optimized */}
          <div className="flex-shrink-0 w-full lg:w-[200px]">
            <div className="flex flex-wrap lg:flex-col gap-2 xs:gap-3 lg:gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left w-full sm:w-auto lg:w-full px-3 xs:px-4 py-2 xs:py-2.5 rounded-full transition-all duration-200 text-sm xs:text-base font-medium ${
                    activeTab === tab
                      ? 'bg-[#0B6623] text-white shadow-md'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                  style={{ 
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    minHeight: '40px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Mobile-Optimized Dynamic Content */}
          <div className="flex-1">
            {/* Books - Mobile-First Responsive Grid */}
            {activeTab === "Books" && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                {randomBooks.map((b) => (
                  <Link key={b.slug} to={`/book/${b.slug}`} className="group block w-full">
                    <div
                      className="relative w-full h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 bg-cover bg-center rounded-xl xs:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                      style={{ backgroundImage: `url(${b.cover})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4">
                        <h3 className="text-white font-semibold mb-1 text-xs xs:text-sm sm:text-base lg:text-lg leading-tight">{b.title}</h3>
                        <p className="text-gray-300 text-xs xs:text-sm truncate">{b.author}</p>
                      </div>
                      {/* Mobile touch indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-6 h-6 xs:w-8 xs:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[4px] xs:border-l-[6px] border-l-white border-y-[3px] xs:border-y-[4px] border-y-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Audio - Mobile-Optimized Coming Soon */}
            {activeTab === "Audio" && (
              <div className="rounded-xl xs:rounded-2xl border border-gray-300 bg-gray-100 p-6 xs:p-8 text-center text-gray-600">
                <div className="w-12 h-12 xs:w-16 xs:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 xs:w-8 xs:h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <p className="text-sm xs:text-base font-medium">Audio features are coming soon.</p>
                <p className="text-xs xs:text-sm text-gray-500 mt-2">Stay tuned for immersive audio experiences!</p>
              </div>
            )}

            {/* Genres - Mobile-First Responsive Grid */}
            {activeTab === "Genres" && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
                {randomGenres.map((g, idx) => (
                  <Link key={idx} to={`/genres/${encodeURIComponent(g)}`} className="group block w-full">
                    <div className="relative w-full h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 rounded-xl xs:rounded-2xl overflow-hidden border border-gray-300 bg-gray-50 hover:border-[#0B6623]/40 hover:bg-gray-100 transition-all duration-200 active:scale-95">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-3 xs:p-4 sm:p-6">
                        <h3 className="text-black font-semibold text-xs xs:text-sm sm:text-base lg:text-lg xl:text-[20px] text-center leading-tight">{g}</h3>
                      </div>
                      {/* Mobile touch indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-5 h-5 xs:w-6 xs:h-6 bg-[#0B6623]/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[3px] xs:border-l-[4px] border-l-[#0B6623] border-y-[2px] xs:border-y-[3px] border-y-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Community - Mobile-Optimized */}
            {activeTab === "Community" && (
              <div className="rounded-xl xs:rounded-2xl border border-gray-300 bg-gray-100 p-6 xs:p-8 text-center text-gray-600">
                <div className="w-12 h-12 xs:w-16 xs:h-16 bg-[#0B6623]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 xs:w-8 xs:h-8 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 13.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.5l-2.54 7.63A1.5 1.5 0 0 1 18.54 16H16v6h4z"/>
                  </svg>
                </div>
                <p className="text-sm xs:text-base font-medium mb-3 xs:mb-4">Join our vibrant community of readers!</p>
                <Link 
                  to="/community?tab=communities" 
                  className="inline-flex items-center px-4 xs:px-6 py-2.5 xs:py-3 rounded-lg bg-[#0B6623] text-white hover:bg-[#0e7a2b] transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm xs:text-base font-medium"
                >
                  Explore Community
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
