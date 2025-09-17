// About Us page for LIT ISLE - Digital Library
// Dark mode design with book geek vibes

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  // ===== STATE MANAGEMENT =====
  const [visibleItems, setVisibleItems] = useState(new Set()); // Track visible sections for animations
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Current image in rotation
  const [isLoggedIn, setIsLoggedIn] = useState(false); // User authentication state
  const sectionRef = useRef(null); // Reference for scroll animations

  // ===== DATA CONFIGURATION =====
  const readerImages = [
    "/brand-img/reader1.jpeg",
    "/brand-img/reader2.jpeg",
    "/brand-img/reader3.jpeg",
  ];

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

  // ===== MAIN COMPONENT RENDER =====
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div ref={sectionRef}>
        {/* ===== HERO SECTION ===== */}
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
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About LIT ISLE
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300 mb-8">
              Your Digital Library. Your Reading Space.
            </h2>
            <p className="text-lg text-gray-400 max-w-5xl mx-auto leading-relaxed">
              LIT ISLE is more than just a digital library. It is a living,
              breathing space for readers who believe that books are not simply
              stories on paper, but entire universes waiting to be explored. We
              are a growing community of book lovers, curious learners, and
              creative minds who share one common belief: the right book, in the
              right hands, at the right time, has the power to change the world.
              At LIT ISLE, we don’t just want you to read; we want you to experience
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

        {/* ===== WHO WE ARE SECTION ===== */}
        <section
          className="py-20 px-6"
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
                <p className="text-gray-400 mt-4">Digital Reading Experience</p>
              </div>

              {/* Right - Text content */}
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Who We Are
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  LIT ISLE is not just another digital library; it feels like
                  stepping into a vast, endless bookshelf where every title
                  waits to be discovered. It is a gathering place for book
                  lovers, learners, and creators who understand the magic that
                  words can carry. The vision is simple yet powerful: to make
                  reading accessible, interactive, and enjoyable for anyone who
                  seeks comfort, adventure, or knowledge in the turn of a page.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
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
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Powerful Features for Modern Readers
              </h3>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Discover the tools that make reading more engaging, organized,
                and social than ever before.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-orange-500/30 transition-all duration-300 hover:bg-gray-900/70"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 text-orange-500">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
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
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-10 h-10 bg-orange-500 rounded-full"></div>
              </div>
              <blockquote className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 italic">
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
              <div className="border-t border-gray-700 pt-6">
                <cite className="text-lg text-orange-400 font-semibold">
                  ~ Mrs. Muskan Jaiswal
                </cite>
                <p className="text-gray-500 text-sm mt-1">
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
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Vision for the Future of Reading
              </h3>
              <p className="text-lg text-gray-400 max-w-6x1 mx-auto">
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
                  <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/20 transition-all duration-300">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4">
                    {point.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
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
            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-700 pb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {faq.q}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION - Conditional based on login status ===== */}
        {!isLoggedIn && (
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
              <div className="p-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-5">
                  Are you ready to turn the first page of your next great
                  adventure?
                </h3>
                <p className="text-lg text-gray-400 mb-8 max-w-5xl mx-auto">
                  With LIT ISLE, you step into a world where thousands of readers
                  have already found stories that stayed with them long after
                  the last chapter. Your next favorite book might just be
                  waiting for you here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Task 3: Link to library page */}
                  <Link 
                    to="/library" 
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Library
                  </Link>
                  {/* Task 3: Link to register page */}
                  <Link 
                    to="/register" 
                    className="px-8 py-4 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default About;
