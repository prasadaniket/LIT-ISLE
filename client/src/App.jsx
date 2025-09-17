import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Features from "./components/Features";
import Testimonials from "./components/Testimonals";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ"; // FAQ section
import Newsettler from "./components/Newsettler"; // Newsletter section
import Footer from "./components/Footer";

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate video scale based on scroll position
  const getVideoScale = () => {
    const maxScroll = 300; // Maximum scroll distance for animation
    const scale = Math.min(1 + (scrollY / maxScroll) * 0.4, 2.3); // Scale from 1 to 1.4 (more conservative)
    return scale;
  };

  // Calculate image positions based on scroll
  const getImagePositions = () => {
    const maxScroll = 300;
    const progress = Math.min(scrollY / maxScroll, 1);

    // Left images slide further left (more conservative)
    const leftOffset = progress * -60; // Move left by up to 60px

    // Right images slide further right (more conservative)
    const rightOffset = progress * 60; // Move right by up to 60px

    return { leftOffset, rightOffset };
  };

  return (
    <div className="min-h-screen page-bg flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <header
        id="home"
        className="pt-42 pb-20"
        style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}
      >
        {/* Text Content Section - Fixed Position */}
        <div className="max-w-[1200px] mx-auto px-6 text-center mb-16">
          <h1
            className="text-black font-semibold mb-4"
            style={{ 
              fontSize: "72px", 
              lineHeight: "1.2",
              fontFamily: "'Dancing Script', cursive",
              fontWeight: "700"
            }}
          >
            Discover Your Next Favorite Book
          </h1>
          <p
            className="mx-auto mb-6"
            style={{ 
              color: "#6B7280", 
              maxWidth: "640px", 
              fontSize: "19px",
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic"
            }}
          >
            A modern digital library to explore, read, and enjoy thousands of
            e-books at your fingertips.
          </p>
          <div className="mb-8">
            <a
              href="#features"
              className="rounded-full"
              style={{
                width: "200px",
                height: "48px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "19px",
                fontFamily: "'Dancing Script', cursive",
                fontWeight: "600",
                backgroundColor: "#0B6623",
                color: "white",
                textDecoration: "none",
                transition: "background-color 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#0e7a2b"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#0B6623"}
            >
              Start Reading
            </a>
          </div>
        </div>

        {/* Media Layout Section - Separate Container */}
        <div
          className="w-full"
          style={{ minHeight: "700px", paddingTop: "40px" }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="relative w-full" style={{ height: "500px" }}>
              {/* Left Images Container */}
              <div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-6 transition-transform duration-300 ease-out z-10"
                style={{
                  transform: `translateY(-30%) translateX(${
                    getImagePositions().leftOffset
                  }px)`,
                }}
              >
                <img
                  src="/home/img3.jpg"
                  alt="Side Visual 1"
                  className="rounded-2xl"
                  style={{
                    width: "400px",
                    maxWidth: "90vw",
                    height: "auto",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                  }}
                />
                <img
                  src="/home/img2.jpg"
                  alt="Side Visual 2"
                  className="rounded-2xl ml-10"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Center Video Container */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div
                  className="relative rounded-2xl overflow-hidden transition-transform duration-300 ease-out"
                  style={{
                    transform: `scale(${getVideoScale()})`,
                    transformOrigin: "center center",
                  }}
                >
                  <video
                    className="rounded-2xl"
                    style={{
                      /* Maintain responsive 16:9 aspect ratio across resolutions (240p–4320p) */
                      width: "700px",
                      maxWidth: "90vw",
                      height: "auto",
                      aspectRatio: "16 / 9",
                      objectFit: "cover",
                    }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/home/hero.jpg"
                  >
                    <source src="/home/hero-cen.mp4" type="video/mp4" />
                  </video>
                  {/* Video overlay for better visual effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Right Image Container */}
              <div
                className="absolute right-0 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ease-out z-10"
                style={{
                  transform: `translateY(-50%) translateX(${
                    getImagePositions().rightOffset
                  }px)`,
                }}
              >
                <img
                  src="/home/img1.jpg"
                  alt="Side Visual 3"
                  className="rounded-2xl"
                  style={{
                    width: "280px",
                    height: "320px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <Features />

      {/* Call To Action */}
      <CTA />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section - placed after FAQ */}
      <Newsettler />

      {/* FAQ Section - placed after CTA */}
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
