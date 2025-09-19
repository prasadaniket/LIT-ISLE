// Privacy Policy page for LIT ISLE
// Minimal, calm, bookish dark theme with teal accents

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Shield,
  Cookie,
  Users,
  Lock,
  Mail,
  FileText,
  Baby,
  RefreshCcw,
  Info,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Privacy = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [openToc, setOpenToc] = useState(true);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRef = useRef(null);

  const toggleSection = (id) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Scroll to top on mount for best UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Intersection-based reveal animations
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
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const items = sectionRef.current?.querySelectorAll("[data-scroll-item]");
    items?.forEach((item) => observer.observe(item));

    return () => {
      items?.forEach((item) => observer.unobserve(item));
    };
  }, []);

  // Structured sections with icons (orange-only accent)
  const sections = [
    {
      id: "info-we-collect",
      title: "1. Information We Collect",
      icon: <Info className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <div className="space-y-3 text-gray-700">
          <p>
            At LIT ISLE, your privacy matters to us. This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our digital library and community features.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="text-gray-900">Account Information:</span> Name,
              email, and password when you register.
            </li>
            <li>
              <span className="text-gray-900">Activity Data:</span> Books you read,
              highlights, reviews, bookmarks, and community interactions.
            </li>
            <li>
              <span className="text-gray-900">Device Data:</span> Browser type,
              operating system, and general location (non-specific).
            </li>
            <li>
              <span className="text-gray-900">Optional:</span> If you choose to
              connect social accounts or upload a profile picture.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "how-we-use",
      title: "2. How We Use Your Information",
      icon: <Users className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>To personalize your reading recommendations.</li>
          <li>To save your bookmarks, highlights, and playlists.</li>
          <li>To enable community features like reviews and comments.</li>
          <li>To improve LIT ISLE’s performance, features, and security.</li>
          <li>To contact you with important updates or new features.</li>
        </ul>
      ),
    },
    {
      id: "sharing",
      title: "3. Sharing of Information",
      icon: <FileText className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>We do not sell your data to advertisers or third parties.</li>
          <li>
            We may share anonymized reading trends for research and platform
            improvement.
          </li>
          <li>Legal disclosure may occur if required by law.</li>
        </ul>
      ),
    },
    {
      id: "cookies",
      title: "4. Cookies & Tracking",
      icon: <Cookie className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>LIT ISLE uses cookies to remember your login and preferences.</li>
          <li>
            Analytics cookies help us understand user behavior and improve our
            services.
          </li>
          <li>You can manage or disable cookies in your browser settings.</li>
        </ul>
      ),
    },
    {
      id: "security",
      title: "5. Data Security",
      icon: <Shield className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Passwords are stored securely using encryption.</li>
          <li>Regular monitoring to prevent unauthorized access.</li>
          <li>
            Despite best practices, no system is 100% secure, so users should
            also protect their accounts.
          </li>
        </ul>
      ),
    },
    {
      id: "your-rights",
      title: "6. Your Rights",
      icon: <Lock className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>You can access, update, or delete your account at any time.</li>
          <li>You can request a copy of your data by contacting us.</li>
          <li>You may opt out of non-essential communication emails.</li>
        </ul>
      ),
    },
    {
      id: "children",
      title: "7. Children’s Privacy",
      icon: <Baby className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>LIT ISLE is not directed at children under 13.</li>
          <li>
            If we learn a child has provided personal information, we will
            delete it immediately.
          </li>
        </ul>
      ),
    },
    {
      id: "changes",
      title: "8. Changes to This Policy",
      icon: <RefreshCcw className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <p className="text-gray-700">
          We may update this Privacy Policy from time to time. Continued use of
          LIT ISLE after updates means you accept the revised policy.
        </p>
      ),
    },
    {
      id: "contact",
      title: "9. Contact Us",
      icon: <Mail className="w-5 h-5 text-[#0B6623]" />,
      content: (
        <div className="text-gray-700">
          <p className="mb-2">For privacy-related questions, contact us at:</p>
          <p className="text-gray-900">privacy.lit.isle@honeys.be</p>
        </div>
      ),
    },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Mobile Section Component
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
            <h1 className="text-2xl font-bold text-gray-900" style={{ letterSpacing: '0.5px', fontFamily: '\'Playful Display\', serif' }}>Privacy Policy</h1>
            <div className="w-10" />
          </div>
          <div className="text-center">
            <div className="w-16 h-1 bg-[#0B6623] mx-auto rounded mb-4" />
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              How we collect, use, and protect your information across the LIT ISLE platform.
            </p>
            <div className="text-xs text-gray-600">
              Last Updated: September 2025
            </div>
          </div>
        </section>

        {/* Desktop Hero */}
        <section
          className="hidden lg:block relative pt-32 pb-2 px-6"
          data-scroll-item
          data-index="hero"
          style={{
            opacity: visibleItems.has("hero") ? 1 : 0,
            transform: visibleItems.has("hero")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight" style={{ letterSpacing: '0.5px', fontFamily: '\'Playful Display\', serif' }}>
                Privacy Policy
              </h1>
              <div className="w-28 h-1 bg-[#0B6623] mx-auto rounded mt-5" />
              <p className="text-gray-700 max-w-2xl mx-auto mt-6 leading-relaxed">
                How we collect, use, and protect your information across the LIT
                ISLE platform.
              </p>
              <div className="text-sm text-gray-600 mt-4">
                Last Updated: September 2025
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Content */}
        <section className="lg:hidden py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Mobile TOC */}
            <div className="mb-6">
              <button
                onClick={() => setOpenToc((v) => !v)}
                className="w-full text-left bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Table of Contents</span>
                  <span className="text-[#0B6623] text-sm">
                    {openToc ? "Hide" : "Show"}
                  </span>
                </div>
              </button>
              {openToc && (
                <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4">
                  <div className="space-y-2">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => scrollTo(s.id)}
                        className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="text-sm font-medium">
                          {s.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Sections */}
            <div className="space-y-4">
              {sections.map((s) => (
                <MobileSection key={s.id} id={s.id} title={s.title}>
                  <div className="flex items-center gap-3 mb-3">
                    {s.icon}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {s.title}
                    </h3>
                  </div>
                  {s.content}
                </MobileSection>
              ))}

              {/* Mobile Footer CTA */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Have questions?
                </h4>
                <p className="text-gray-700 mb-4 text-sm">
                  Contact our Privacy Team and we'll get back to you as soon as possible.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" /> Contact Privacy Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Layout: sticky TOC + content */}
        <section
          className="hidden lg:block py-8 px-6"
          data-scroll-item
          data-index="sections"
          style={{
            opacity: visibleItems.has("sections") ? 1 : 0,
            transform: visibleItems.has("sections")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* TOC - sticky on desktop */}
            <aside className="lg:col-span-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 lg:sticky lg:top-24">
                <button
                  onClick={() => setOpenToc((v) => !v)}
                  className="w-full text-left bg-gray-100 border border-gray-200 hover:border-[#0B6623]/40 rounded-xl p-3 text-gray-900 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Table of Contents</span>
                    <span className="text-[#0B6623] text-sm">
                      {openToc ? "Hide" : "Show"}
                    </span>
                  </div>
                </button>
                {openToc && (
                  <ul className="mt-3 space-y-2">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => scrollTo(s.id)}
                          className="w-full text-left group bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-[#0B6623]/30 rounded-lg p-3 text-gray-700 transition-colors"
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="text-gray-900">
                              {s.title.split(":")[0]}:
                            </span>
                            <span className="text-sm">
                              {s.title.split(": ")[1]}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-8 space-y-6">
              {sections.map((s) => (
                <article
                  key={s.id}
                  id={s.id}
                  className="bg-gray-50 border border-gray-200 hover:border-[#0B6623]/30 rounded-2xl p-6 transition-colors"
                >
                  <header className="flex items-center gap-3 mb-3">
                    {s.icon}
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                      {s.title}
                    </h3>
                  </header>
                  {s.content}
                </article>
              ))}

              {/* Footer CTA */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Have questions?
                </h4>
                <p className="text-gray-700 mb-6">
                  Contact our Privacy Team and we'll get back to you as soon as
                  possible.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-gray-900 font-semibold rounded-xl transition-colors"
                >
                  <Mail className="w-5 h-5" /> Contact Privacy Team
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

export default Privacy;
