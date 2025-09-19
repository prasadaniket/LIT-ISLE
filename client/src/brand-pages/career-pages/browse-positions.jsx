// Browse Positions page for LIT ISLE - Career Pages
// Dark mode design for job browsing and notifications

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X } from "lucide-react";

const BrowsePositions = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const { user, isAuthenticated } = useAuth(); // Use authentication context
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll animation setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    const items = sectionRef.current?.querySelectorAll("[data-scroll-item]");
    items?.forEach((item) => observer.observe(item));

    return () => {
      items?.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // No need to check login status manually - useAuth provides it

  const handleNotifyMe = async () => {
    if (!isAuthenticated) {
      return; // This shouldn't happen due to UI logic, but safety check
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Home</Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">About</Link>
              <Link to="/authors" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Authors</Link>
              <Link to="/careers" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Careers</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Contact</Link>
              <Link to="/help" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Help Center</Link>
            </nav>
          </div>
        </div>
      )}

      <div ref={sectionRef}>
        {/* Mobile Hero */}
        <section className="lg:hidden relative py-16 px-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Browse Positions</h1>
            <div className="w-10" />
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm leading-relaxed">
              Explore career opportunities at LIT ISLE
            </p>
          </div>
        </section>

        {/* Desktop Hero */}
        <section
          className="hidden lg:block relative pt-32 pb-1 px-6"
          data-scroll-item
          data-index="hero"
          style={{
            opacity: visibleItems.has("hero") ? 1 : 0,
            transform: visibleItems.has("hero")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Browse Positions
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Explore career opportunities at LIT ISLE
            </p>
          </div>
        </section>

        {/* Mobile No Openings Section */}
        <section className="lg:hidden py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-[#0B6623]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                No Open Positions Currently
              </h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                We're not actively hiring at the moment, but we're always interested in connecting 
                with talented individuals who share our passion for books and technology.
              </p>

              {/* Mobile Notification Section */}
              {isAuthenticated ? (
                <div className="max-w-md mx-auto">
                  {!isSubscribed ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Get Notified About New Openings
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        We'll send you an email whenever we have new job opportunities that match your interests.
                      </p>
                      <button
                        onClick={handleNotifyMe}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] disabled:bg-[#0B6623]/50 text-white font-semibold rounded-lg transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Setting up notifications...
                          </div>
                        ) : (
                          "Notify Me About Jobs"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        You're All Set!
                      </h3>
                      <p className="text-gray-600 text-sm">
                        We'll notify you via email when new positions become available.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Want to Get Notified About New Jobs?
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Sign up for job notifications and be the first to know about new opportunities at LIT ISLE.
                  </p>
                  
                  <div className="space-y-3">
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0B6623] text-sm"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] disabled:bg-[#0B6623]/50 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </button>
                    </form>
                    
                    <div className="text-center">
                      <p className="text-gray-600 text-xs mb-3">Already have an account?</p>
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/login"
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="px-4 py-2 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Desktop No Openings Section */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="no-openings"
          style={{
            opacity: visibleItems.has("no-openings") ? 1 : 0,
            transform: visibleItems.has("no-openings")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-[#0B6623]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Open Positions Currently
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're not actively hiring at the moment, but we're always interested in connecting 
                with talented individuals who share our passion for books and technology.
              </p>

              {/* Desktop Notification Section */}
              {isAuthenticated ? (
                <div className="max-w-md mx-auto">
                  {!isSubscribed ? (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Get Notified About New Openings
                      </h3>
                      <p className="text-gray-600 mb-6">
                        We'll send you an email whenever we have new job opportunities that match your interests.
                      </p>
                      <button
                        onClick={handleNotifyMe}
                        disabled={isLoading}
                        className="px-8 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] disabled:bg-[#0B6623]/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Setting up notifications...
                          </div>
                        ) : (
                          "Notify Me About Jobs"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        You're All Set!
                      </h3>
                      <p className="text-gray-600">
                        We'll notify you via email when new positions become available.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Want to Get Notified About New Jobs?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Sign up for job notifications and be the first to know about new opportunities at LIT ISLE.
                  </p>
                  
                  <div className="space-y-4">
                    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0B6623]"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] disabled:bg-[#0B6623]/50 text-white font-semibold rounded-lg transition-all duration-300"
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </button>
                    </form>
                    
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-3">Already have an account?</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          to="/login"
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all duration-300"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="px-6 py-3 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-lg transition-all duration-300"
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mobile Why Join LIT ISLE Section */}
        <section className="lg:hidden py-8 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Why Join LIT ISLE?
              </h2>
              <p className="text-gray-600 text-sm max-w-3xl mx-auto">
                Even though we're not hiring right now, here's what makes LIT ISLE a great place to work.
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mission-Driven Work
                </h3>
                <p className="text-gray-600 text-sm">
                  Be part of a team that's making knowledge and stories accessible to everyone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 13.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.5l-2.54 7.63A1.5 1.5 0 0 1 18.54 16H16v6h4z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Collaborative Culture
                </h3>
                <p className="text-gray-600 text-sm">
                  Work with passionate readers, writers, and technologists who share your values.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Growth Opportunities
                </h3>
                <p className="text-gray-600 text-sm">
                  Continuous learning, skill development, and career advancement in a growing company.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile CTA Section */}
        <section className="lg:hidden py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Connected
              </h2>
              <p className="text-gray-600 mb-6 text-sm max-w-2xl mx-auto">
                Follow us on social media to stay updated on company news, new features, 
                and future job opportunities.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/careers"
                  className="px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                >
                  Back to Careers
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-lg transition-all duration-300 text-sm"
                >
                  Learn About LIT ISLE
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Why Join LIT ISLE Section */}
        <section
          className="hidden lg:block py-20 px-6 bg-gray-50"
          data-scroll-item
          data-index="why-join"
          style={{
            opacity: visibleItems.has("why-join") ? 1 : 0,
            transform: visibleItems.has("why-join")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Join LIT ISLE?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Even though we're not hiring right now, here's what makes LIT ISLE a great place to work.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Mission-Driven Work
                </h3>
                <p className="text-gray-600">
                  Be part of a team that's making knowledge and stories accessible to everyone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 13.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.5l-2.54 7.63A1.5 1.5 0 0 1 18.54 16H16v6h4z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Collaborative Culture
                </h3>
                <p className="text-gray-600">
                  Work with passionate readers, writers, and technologists who share your values.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#0B6623]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Growth Opportunities
                </h3>
                <p className="text-gray-600">
                  Continuous learning, skill development, and career advancement in a growing company.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop CTA Section */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="cta"
          style={{
            opacity: visibleItems.has("cta") ? 1 : 0,
            transform: visibleItems.has("cta")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Stay Connected
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Follow us on social media to stay updated on company news, new features, 
                and future job opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/careers"
                  className="px-8 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Back to Careers
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Learn About LIT ISLE
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default BrowsePositions;
