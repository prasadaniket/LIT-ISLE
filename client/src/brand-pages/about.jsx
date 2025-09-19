// About Us page for LIT ISLE - Digital Library
// Dark mode design with book geek vibes

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";

const About = () => {
  // ===== STATE MANAGEMENT =====
  const [visibleItems, setVisibleItems] = useState(new Set()); // Track visible sections for animations
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Current image in rotation
  const [expandedSections, setExpandedSections] = useState(new Set(['hero'])); // Mobile collapsible sections
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const { user, isAuthenticated } = useAuth(); // Get authentication state from context
  const sectionRef = useRef(null); // Reference for scroll animations

  // ===== DATA CONFIGURATION =====
  const readerImages = [
    "/brand-img/reader1.jpeg",
    "/brand-img/reader2.jpeg",
    "/brand-img/reader3.jpeg",
  ];

  // ===== MOBILE HELPER FUNCTIONS =====
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // ===== EFFECTS & ANIMATIONS =====
  
  // Auto-scroll to top when component mounts (Task 1)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll animation setup for section visibility
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

  // Image rotation effect for reader images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === readerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [readerImages.length]);

  // ===== FEATURE DATA =====
  const features = [
    {
      title: "Smart Bookmarks",
      description:
        "Never lose your place with intelligent bookmarking that remembers your reading progress across all devices.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      title: "Personal Notes & Highlights",
      description:
        "Capture your thoughts and mark meaningful passages with our intuitive highlighting and annotation system.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      title: "Community Reviews",
      description:
        "Share your reading experience and discover new perspectives through our vibrant community of readers.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: "Custom Collections",
      description:
        "Organize your reading journey with personalized lists, reading goals, and curated collections.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Discussion Forums",
      description:
        "Engage in meaningful conversations about your favorite books and discover hidden literary gems.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
    {
      title: "Offline Reading",
      description:
        "Download your books for seamless reading anywhere, even without an internet connection.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // ===== VISION DATA =====
  const visionPoints = [
    {
      title: "Universal Access",
      description:
        "Read seamlessly across all devices, anywhere in the world, with synchronized progress and preferences.",
    },
    {
      title: "Community Connection",
      description:
        "Connect with fellow readers, share insights, and discover books through meaningful social interactions.",
    },
    {
      title: "Intelligent Recommendations",
      description:
        "Discover your next favorite book with AI-powered suggestions tailored to your unique reading preferences.",
    },
    {
      title: "Privacy & Focus",
      description:
        "Enjoy distraction-free reading in a secure environment that protects your personal data and reading habits.",
    },
  ];

  // ===== FAQ DATA =====
  const faqs = [
    {
      q: "Is LIT ISLE free to use?",
      a: "Yes, LIT ISLE is free for all readers. You only need to create an account to enjoy all features.",
    },
    {
      q: "Can I access LIT ISLE on my phone?",
      a: "Yes, LIT ISLE works smoothly on mobile browsers and we are working on a dedicated app.",
    },
    {
      q: "Can I suggest new books for LIT ISLE?",
      a: "Absolutely! Readers can submit book requests and we'll do our best to bring them in.",
    },
  ];

  // ===== MOBILE COLLAPSIBLE SECTION COMPONENT =====
  const MobileSection = ({ id, title, children, defaultExpanded = false }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {isExpanded && (
          <div className="px-4 py-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  // ===== MAIN COMPONENT RENDER =====
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">About LIT ISLE</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <Link to="/" className="block py-2 text-gray-700 hover:text-[#0B6623]">Home</Link>
              <Link to="/about" className="block py-2 text-[#0B6623] font-medium">About</Link>
              <Link to="/authors" className="block py-2 text-gray-700 hover:text-[#0B6623]">Authors</Link>
              <Link to="/careers" className="block py-2 text-gray-700 hover:text-[#0B6623]">Careers</Link>
              <Link to="/contact" className="block py-2 text-gray-700 hover:text-[#0B6623]">Contact</Link>
            </div>
          </div>
        </div>
      )}

      <div ref={sectionRef}>
        {/* ===== MOBILE HERO SECTION ===== */}
        <section className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="bg-gradient-to-br from-[#0B6623]/10 to-white py-6 px-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white shadow-sm"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">About LIT ISLE</h1>
              <div className="w-10" />
            </div>
            
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Your Digital Library
              </h2>
              <p className="text-gray-600 text-sm">
                Your Reading Space
              </p>
            </div>
          </div>
        </section>

        {/* ===== MOBILE HERO IMAGE SLIDER ===== */}
        <section className="lg:hidden px-4 py-4">
          <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-lg">
            {readerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Reader ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            ))}
          </div>
        </section>

        {/* ===== DESKTOP HERO SECTION ===== */}
        <section
          className="hidden lg:block relative py-25 px-6"
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
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About LIT ISLE
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 mb-8">
              Your Digital Library. Your Reading Space.
            </h2>
            <p className="text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed">
              LIT ISLE is more than just a digital library. It is a living,
              breathing space for readers who believe that books are not simply
              stories on paper, but entire universes waiting to be explored. We
              are a growing community of book lovers, curious learners, and
              creative minds who share one common belief: the right book, in the
              right hands, at the right time, has the power to change the world.
              At LIT ISLE, we don't just want you to read; we want you to experience
              books. To bookmark the passages that touch your heart, to
              highlight the words that spark ideas, to discuss chapters with a
              community that understands the joy of turning pages, even when
              those pages glow on a screen. Reading here is not passive; it is
              interactive, personal, and deeply human. Launched in September
              2025, LIT ISLE was built with a simple dream: to make reading
              accessible, enjoyable, and endless for everyone, anywhere. Whether
              you are a night-owl reader who loses sleep over thrillers, a
              student chasing knowledge across genres, or a dreamer wandering
              through poetry, LIT ISLE is your digital bookshelf, your study
              companion, and your book club, all in one.
            </p>
          </div>
        </section>

        {/* ===== MOBILE CONTENT SECTIONS ===== */}
        <div className="lg:hidden px-4 py-4 space-y-4">
          <MobileSection id="who-we-are" title="Who We Are">
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed text-sm">
                LIT ISLE is not just another digital library; it feels like
                stepping into a vast, endless bookshelf where every title
                waits to be discovered. It is a gathering place for book
                lovers, learners, and creators who understand the magic that
                words can carry.
              </p>
            </div>
          </MobileSection>

          <MobileSection id="features" title="Our Features">
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 bg-[#0B6623]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-[#0B6623] scale-75">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>

          <MobileSection id="founder" title="Founder's Message">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#0B6623]/20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-6 h-6 bg-[#0B6623] rounded-full"></div>
              </div>
              <blockquote className="text-gray-700 leading-relaxed italic text-sm">
                <p className="mb-2">
                  Books have always been more than ink on paper for me. They
                  have been companions in silence, teachers when I was lost, and
                  windows into worlds I could never have reached on my own.
                </p>
                <p className="mb-2">
                  LIT ISLE was born out of that love. I wanted to build a place
                  where the magic of reading isn't confined to a shelf or a
                  single moment in time, but lives on digitally, socially, and
                  freely.
                </p>
                <p>
                  This platform is built with love for readers like you, who
                  believe that books are not just to be read, but to be lived.
                </p>
              </blockquote>
              <div className="text-center pt-3 border-t border-gray-200">
                <cite className="text-[#0B6623] font-semibold text-sm">
                  ~ Mrs. Muskan Jaiswal
                </cite>
                <p className="text-gray-600 text-xs mt-1">
                  Founder & CEO, LIT ISLE
                </p>
              </div>
            </div>
          </MobileSection>

          <MobileSection id="vision" title="Our Vision">
            <div className="space-y-3">
              {visionPoints.map((point, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <div className="w-5 h-5 bg-[#0B6623] rounded-lg"></div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    {point.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </MobileSection>

          <MobileSection id="faq" title="Frequently Asked Questions">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </MobileSection>
        </div>

        {/* ===== DESKTOP WHO WE ARE SECTION ===== */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="who-we-are"
          style={{
            opacity: visibleItems.has("who-we-are") ? 1 : 0,
            transform: visibleItems.has("who-we-are")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Rotating Reader Images */}
              <div className="p-6 text-center relative overflow-hidden">
                <div className="relative h-80 w-full">
                  {readerImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Reader ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mt-4">Digital Reading Experience</p>
              </div>

              {/* Right - Text content */}
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Who We Are
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  LIT ISLE is not just another digital library; it feels like
                  stepping into a vast, endless bookshelf where every title
                  waits to be discovered. It is a gathering place for book
                  lovers, learners, and creators who understand the magic that
                  words can carry. The vision is simple yet powerful: to make
                  reading accessible, interactive, and enjoyable for anyone who
                  seeks comfort, adventure, or knowledge in the turn of a page.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Born from a love of both books and technology, LIT ISLE bridges
                  the familiar warmth of traditional reading with the
                  possibilities of the digital age. It transforms the act of
                  reading into something more personal, more engaging, and more
                  seamless than ever before. For every reader, there is a book
                  waiting here and for every book, a reader who will finally
                  find it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="features"
          style={{
            opacity: visibleItems.has("features") ? 1 : 0,
            transform: visibleItems.has("features")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Readers
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover the tools that make reading more engaging, organized,
                and social than ever before.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:border-[#0B6623]/30 transition-all duration-300 hover:bg-gray-100"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-12 h-12 bg-[#0B6623]/20 rounded-lg flex items-center justify-center mb-6 text-[#0B6623]">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FOUNDER MESSAGE SECTION ===== */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="founder"
          style={{
            opacity: visibleItems.has("founder") ? 1 : 0,
            transform: visibleItems.has("founder")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-[#0B6623]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-10 h-10 bg-[#0B6623] rounded-full"></div>
              </div>
              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                <p className="mb-6">
                  Books have always been more than ink on paper for me. They
                  have been companions in silence, teachers when I was lost, and
                  windows into worlds I could never have reached on my own.
                  Every chapter I've read has left a mark, shaping the way I see
                  life and the way I dream about the future.
                </p>

                <p className="mb-6">
                  LIT ISLE was born out of that love. I wanted to build a place
                  where the magic of reading isn't confined to a shelf or a
                  single moment in time, but lives on digitally, socially, and
                  freely. A space where a reader in one corner of the world can
                  highlight a line, and another, miles away, can respond to it
                  with the same spark in their heart.
                </p>

                <p className="mb-6">
                  My vision has always been simple: the right book at the right
                  time can change a person's world. LIT ISLE exists to make that
                  encounter possible by making books accessible, by turning
                  reading into an interactive experience, and by connecting
                  readers through their shared passion for stories.
                </p>

                <p>
                  This platform is built with love for readers like you, who
                  believe that books are not just to be read, but to be lived.
                  So keep reading, keep sharing, and keep growing with us.
                  Because every book you open is not just a story it's the
                  beginning of a journey.
                </p>
              </blockquote>
              <div className="border-t border-gray-300 pt-6">
                <cite className="text-lg text-[#0B6623] font-semibold">
                  ~ Mrs. Muskan Jaiswal
                </cite>
                <p className="text-gray-600 text-sm mt-1">
                  Founder & CEO, LIT ISLE
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== VISION SECTION ===== */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="vision"
          style={{
            opacity: visibleItems.has("vision") ? 1 : 0,
            transform: visibleItems.has("vision")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Vision for the Future of Reading
              </h3>
              <p className="text-lg text-gray-600 max-w-6x1 mx-auto">
                LIT ISLE is not just about building a platform, but about opening
                the doors to a vast, shared library where every reader discovers
                the story meant for them. LIT ISLE is shaping a global community
                bound by pages, ideas, and the quiet magic that happens when the
                right book meets the right reader.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {visionPoints.map((point, index) => (
                <div
                  key={index}
                  className="text-center group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-16 h-16 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0B6623]/20 transition-all duration-300">
                    <div className="w-8 h-8 bg-[#0B6623] rounded-lg"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {point.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="faq"
          style={{
            opacity: visibleItems.has("faq") ? 1 : 0,
            transform: visibleItems.has("faq")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-300 pb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MOBILE CTA SECTION ===== */}
        <div className="lg:hidden px-4 py-4">
          <MobileSection id="cta" title="Get Started">
            <div className="text-center space-y-3">
              {isAuthenticated ? (
                <>
                  <h3 className="text-lg font-bold text-gray-900">
                    Welcome back, {user?.name || 'Reader'}!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Continue your reading journey with thousands of books at your fingertips.
                  </p>
                  <div className="space-y-2">
                    <Link 
                      to="/shelf" 
                      className="block w-full px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      My Shelf
                    </Link>
                    <Link 
                      to="/allbooks" 
                      className="block w-full px-6 py-3 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      Discover Books
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-900">
                    Ready to start reading?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Join thousands of readers who have found their next favorite book here.
                  </p>
                  <div className="space-y-2">
                    <Link 
                      to="/allbooks" 
                      className="block w-full px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      Explore Library
                    </Link>
                    <Link 
                      to="/register" 
                      className="block w-full px-6 py-3 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      Create Free Account
                    </Link>
                  </div>
                </>
              )}
            </div>
          </MobileSection>
        </div>

        {/* ===== DESKTOP CTA SECTION - Dynamic based on login status ===== */}
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
            <div className="p-12">
              {isAuthenticated ? (
                // Logged in user content
                <>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                    Welcome back, {user?.name || 'Reader'}!
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-5xl mx-auto">
                    Continue your reading journey with thousands of books at your fingertips. 
                    Your personalized library and reading progress are waiting for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/shelf" 
                      className="px-8 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      My Shelf
                    </Link>
                    <Link 
                      to="/recommendations" 
                      className="px-8 py-4 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Discover Books
                    </Link>
                  </div>
                </>
              ) : (
                // Not logged in user content
                <>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                    Are you ready to turn the first page of your next great adventure?
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-5xl mx-auto">
                    With LIT ISLE, you step into a world where thousands of readers
                    have already found stories that stayed with them long after
                    the last chapter. Your next favorite book might just be
                    waiting for you here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/allbooks" 
                      className="px-8 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Library
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-8 py-4 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Create Free Account
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
