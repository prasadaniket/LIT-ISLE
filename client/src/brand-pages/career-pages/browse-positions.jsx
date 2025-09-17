// Browse Positions page for LIT ISLE - Career Pages
// Dark mode design for job browsing and notifications

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BrowsePositions = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Check if user is logged in (simulate)
  useEffect(() => {
    // In a real app, this would check localStorage or make an API call
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleNotifyMe = async () => {
    if (!isLoggedIn) {
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
    <div className="min-h-screen bg-black">
      <Navbar />
      <div ref={sectionRef}>
        {/* Hero Section */}
        <section
          className="relative py-25 px-6"
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Browse Positions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Explore career opportunities at LIT ISLE
            </p>
          </div>
        </section>

        {/* No Openings Section */}
        <section
          className="py-20 px-6"
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
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                No Open Positions Currently
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                We're not actively hiring at the moment, but we're always interested in connecting 
                with talented individuals who share our passion for books and technology.
              </p>

              {/* Notification Section */}
              {isLoggedIn ? (
                <div className="max-w-md mx-auto">
                  {!isSubscribed ? (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Get Notified About New Openings
                      </h3>
                      <p className="text-gray-400 mb-6">
                        We'll send you an email whenever we have new job opportunities that match your interests.
                      </p>
                      <button
                        onClick={handleNotifyMe}
                        disabled={isLoading}
                        className="px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
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
                    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-green-400 mb-2">
                        You're All Set!
                      </h3>
                      <p className="text-gray-300">
                        We'll notify you via email when new positions become available.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Want to Get Notified About New Jobs?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Sign up for job notifications and be the first to know about new opportunities at LIT ISLE.
                  </p>
                  
                  <div className="space-y-4">
                    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-all duration-300"
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </button>
                    </form>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-3">Already have an account?</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                          to="/login"
                          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="px-6 py-3 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition-all duration-300"
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

        {/* Why Join LIT ISLE Section */}
        <section
          className="py-20 px-6 bg-gray-900/30"
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Join LIT ISLE?
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Even though we're not hiring right now, here's what makes LIT ISLE a great place to work.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Mission-Driven Work
                </h3>
                <p className="text-gray-400">
                  Be part of a team that's making knowledge and stories accessible to everyone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 13.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.5l-2.54 7.63A1.5 1.5 0 0 1 18.54 16H16v6h4z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Collaborative Culture
                </h3>
                <p className="text-gray-400">
                  Work with passionate readers, writers, and technologists who share your values.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Growth Opportunities
                </h3>
                <p className="text-gray-400">
                  Continuous learning, skill development, and career advancement in a growing company.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-20 px-6"
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
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Stay Connected
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Follow us on social media to stay updated on company news, new features, 
                and future job opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/careers"
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Back to Careers
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
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
