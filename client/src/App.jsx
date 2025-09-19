/**
 * LIT ISLE - Main Application Component
 * 
 * This is the main landing page component that serves as the homepage for the LIT ISLE digital library platform.
 * It includes a hero section with animated media, features showcase, testimonials, and other key sections.
 * 
 * Key Features:
 * - Responsive hero section with video and image animations
 * - Scroll-based animations for enhanced user experience
 * - Modular component architecture for maintainability
 * - Mobile-first responsive design
 * 
 * @author LIT ISLE Development Team
 * @version 1.0.0
 */

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Features from "./components/Features";
import Testimonials from "./components/Testimonals";
import CTA from "./components/CTA";
import Recommendations from "./components/Recommendations";
import Authors from "./components/Authors";
import FAQ from "./components/FAQ"; // FAQ section
// import Newsettler from "./components/Newsettler"; // Newsletter section - DISABLED
import Footer from "./components/Footer";
import NewUserWelcome from "./components/NewUserWelcome";

/**
 * Main App Component
 * 
 * The root component that renders the homepage with all major sections.
 * Manages scroll-based animations and responsive layout.
 */
function App() {
  // State for tracking scroll position to enable scroll-based animations
  const [scrollY, setScrollY] = useState(0);

  /**
   * Scroll Event Listener
   * 
   * Sets up scroll tracking for animations and cleans up on unmount.
   * This enables the scroll-based animations in the hero section.
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Calculate Video Scale Based on Scroll Position
   * 
   * Creates a smooth scaling effect for the center video as user scrolls.
   * The video scales up from 1x to 2.3x based on scroll position.
   * 
   * @returns {number} Scale factor for the video element
   */
  const getVideoScale = () => {
    const maxScroll = 300; // Maximum scroll distance for animation
    const scale = Math.min(1 + (scrollY / maxScroll) * 0.4, 2.3); // Scale from 1 to 2.3x
    return scale;
  };

  /**
   * Calculate Image Positions Based on Scroll
   * 
   * Creates a parallax effect where side images move in opposite directions
   * as the user scrolls, creating depth and visual interest.
   * 
   * @returns {Object} Object containing left and right offset values
   */
  const getImagePositions = () => {
    const maxScroll = 300;
    const progress = Math.min(scrollY / maxScroll, 1);

    // Left images slide further left (parallax effect)
    const leftOffset = progress * -60; // Move left by up to 60px

    // Right images slide further right (parallax effect)
    const rightOffset = progress * 60; // Move right by up to 60px

    return { leftOffset, rightOffset };
  };

  return (
    <div className="min-h-screen page-bg flex flex-col">
      {/* ===== NAVIGATION SECTION ===== */}
      <Navbar />
      
      {/* ===== NEW USER WELCOME MODAL ===== */}
      {/* Displays welcome modal for first-time users */}
      <NewUserWelcome />

      {/* ===== HERO SECTION ===== */}
      {/* Main landing section with animated media and call-to-action */}
      <header
        id="home"
        className="pt-20 md:pt-42 pb-8 md:pb-20"
        style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}
      >
        {/* ===== HERO TEXT CONTENT ===== */}
        {/* Main headline and description with mobile-first responsive typography */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center mb-6 md:mb-8 lg:mb-16">
          {/* Main Headline - Mobile-First Responsive Typography */}
          <h1
            className="text-black font-semibold mb-3 md:mb-4 text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px]"
            style={{ 
              lineHeight: "1.1",
              fontFamily: "'Dancing Script', cursive",
              fontWeight: "700"
            }}
          >
            Discover Your Next<br className="md:hidden" />
            <span className="hidden md:inline"> </span>Favorite Book
          </h1>
          
          {/* Subtitle - Mobile-Optimized Description */}
          <p
            className="mx-auto mb-4 md:mb-6 text-sm xs:text-base sm:text-lg md:text-xl lg:text-[19px] max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[640px] leading-relaxed"
            style={{ 
              color: "#6B7280", 
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic"
            }}
          >
            A modern digital library to explore, read, and enjoy thousands of
            e-books at your fingertips.
          </p>
          
          {/* Call-to-Action Button - Mobile-Optimized Sizing */}
          <div className="mb-6 md:mb-8">
            <a
              href="#features"
              className="rounded-full inline-flex items-center justify-center w-36 xs:w-40 sm:w-48 md:w-52 lg:w-[200px] h-10 xs:h-11 sm:h-12 md:h-12 lg:h-[48px] text-sm xs:text-base sm:text-base md:text-lg lg:text-[19px] font-semibold sm:font-[600] bg-[#0B6623] hover:bg-[#0e7a2b] text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Dancing Script', cursive"
              }}
            >
              Start Reading
            </a>
          </div>
        </div>

        {/* Media Layout Section - Mobile-First Responsive Design */}
        <div className="w-full min-h-[300px] xs:min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] pt-4 xs:pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-[40px]">
          <div className="max-w-[1400px] mx-auto px-3 xs:px-4 sm:px-6">
            {/* Mobile Layout - Optimized for Touch */}
            <div className="block lg:hidden">
              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                {/* Mobile Video - Enhanced for Mobile */}
                <div className="relative rounded-xl xs:rounded-2xl overflow-hidden mx-auto shadow-lg" style={{ maxWidth: "95vw", aspectRatio: "16/9" }}>
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/home/hero.jpg"
                  >
                    <source src="/home/hero-cen.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                </div>
                
                {/* Mobile Images Grid - Enhanced Layout */}
                <div className="grid grid-cols-2 gap-3 xs:gap-4">
                  <div className="relative group">
                    <img
                      src="/home/img3.jpg"
                      alt="Reading Experience"
                      className="rounded-xl xs:rounded-2xl w-full h-28 xs:h-32 sm:h-36 md:h-40 object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl xs:rounded-2xl"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs xs:text-sm font-medium">Reading</p>
                    </div>
                  </div>
                  <div className="relative group">
                    <img
                      src="/home/img1.jpg"
                      alt="Digital Library"
                      className="rounded-xl xs:rounded-2xl w-full h-28 xs:h-32 sm:h-36 md:h-40 object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl xs:rounded-2xl"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs xs:text-sm font-medium">Digital</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Original Design */}
            <div className="hidden lg:block relative w-full" style={{ height: "500px" }}>
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
                  className="rounded-2xl w-80 xl:w-[400px] h-auto aspect-[16/9] object-cover"
                />
                <img
                  src="/home/img2.jpg"
                  alt="Side Visual 2"
                  className="rounded-2xl ml-10 w-48 xl:w-[200px] h-48 xl:h-[200px] object-cover"
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
                    className="rounded-2xl w-[600px] xl:w-[700px] h-auto aspect-[16/9] object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/home/hero.jpg"
                  >
                    <source src="/home/hero-cen.mp4" type="video/mp4" />
                  </video>
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
                  className="rounded-2xl w-64 xl:w-[280px] h-72 xl:h-[320px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== FEATURES SECTION ===== */}
      {/* Interactive features showcase with tabs and dynamic content */}
      <Features />

      {/* ===== CALL TO ACTION SECTION ===== */}
      {/* Promotional section encouraging user engagement */}
      <CTA />

      {/* ===== RECOMMENDATIONS SECTION ===== */}
      {/* Personalized book recommendations (authenticated users only) */}
      <Recommendations />

      {/* ===== AUTHORS SECTION ===== */}
      {/* Featured authors showcase (authenticated users only) */}
      <Authors />

      {/* ===== TESTIMONIALS SECTION ===== */}
      {/* User testimonials and reviews carousel */}
      <Testimonials />

      {/* ===== NEWSLETTER SECTION ===== */}
      {/* Newsletter signup (currently disabled) */}
      {/* <Newsettler /> */}

      {/* ===== FAQ SECTION ===== */}
      {/* Frequently asked questions with expandable answers */}
      <FAQ />
      
      {/* ===== FOOTER SECTION ===== */}
      {/* Site footer with links, social media, and legal information */}
      <Footer />
    </div>
  );
}

export default App;
