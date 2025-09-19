// Terms & Conditions page for LIT ISLE
// Book geek aesthetic with cozy library vibes and literary elements

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  CreditCard,
  Library,
  PenTool,
  MessageCircle,
  Gift,
  Shield,
  LogOut,
  FileText,
  Calendar,
  BookMarked,
  Building,
  Mail,
  Lock,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [activeSection, setActiveSection] = useState("acceptance");
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

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // ===== BOOK-THEMED TERMS CONTENT =====
  const sections = [
    {
      id: "acceptance",
      title: "Chapter I: The Agreement",
      subtitle: "Acceptance of Terms",
      icon: BookOpen,
      content:
        "Welcome, fellow book lover! By opening this digital tome and creating your account, you're agreeing to join our literary community. Think of this as signing the guest book at your favorite library. If these terms don't resonate with your reading soul, we understand - but you won't be able to access our shelves.",
    },
    {
      id: "eligibility",
      title: "Chapter II: The Readers",
      subtitle: "Eligibility Requirements",
      icon: Users,
      content:
        "Our library welcomes readers of all ages, but you must be at least 13 to create an account. If you're under 18, we'll need your parent or guardian's blessing - just like getting permission to check out that advanced novel from the adult section.",
    },
    {
      id: "accounts",
      title: "Chapter III: Your Library Card",
      subtitle: "User Account Responsibilities",
      icon: CreditCard,
      content:
        "Your account is like your personal library card - keep it safe and secure! Provide accurate information when registering (we need to know who's borrowing our books), and remember: you're responsible for all the reading activity under your name.",
    },
    {
      id: "content",
      title: "Chapter IV: The Collection",
      subtitle: "Content & Usage Guidelines",
      icon: Library,
      content:
        "LIT ISLE is your digital library filled with books, reviews, highlights, reading lists, and community discussions. Use it to discover new worlds, share your thoughts, and connect with fellow readers. Just remember: no illegal activities, spam, or harassment - we're all here for the love of books.",
    },
    {
      id: "intellectual",
      title: "Chapter V: The Authors' Rights",
      subtitle: "Intellectual Property",
      icon: PenTool,
      content:
        "Every book in our collection belongs to its author and publisher - we're just the librarians! Our platform design and features are our own creation. Please respect copyright laws and don't copy, distribute, or misuse content without proper permission.",
    },
    {
      id: "community",
      title: "Chapter VI: The Reading Circle",
      subtitle: "Community Guidelines",
      icon: MessageCircle,
      content:
        "Our community is like a book club where everyone's opinion matters. Share constructive reviews, meaningful highlights, and thoughtful comments. We foster respectful discussions - abusive behavior will result in being asked to leave our reading circle.",
    },
    {
      id: "payments",
      title: "Chapter VII: The Free Library",
      subtitle: "Access & Future Features",
      icon: Gift,
      content:
        "LIT ISLE is currently free for all readers - no membership fees required! In the future, we might introduce premium features (like exclusive book clubs or advanced reading tools), but we'll always communicate clearly before any changes.",
    },
    {
      id: "privacy",
      title: "Chapter VIII: Your Reading Privacy",
      subtitle: "Data Protection",
      icon: Shield,
      content:
        "Your reading habits and personal information are sacred to us. We protect your data according to our Privacy Policy and never sell your information to third parties. Your reading list stays private unless you choose to share it.",
    },
    {
      id: "termination",
      title: "Chapter IX: The Farewell",
      subtitle: "Account Termination",
      icon: LogOut,
      content:
        "We hope you'll stay with us forever, but we may need to suspend accounts that violate our community guidelines. You can also delete your account anytime - though we'll be sad to see you go from our reading community.",
    },
    {
      id: "changes",
      title: "Chapter X: The Updates",
      subtitle: "Terms Evolution",
      icon: FileText,
      content:
        "Like a good book series, our terms may evolve over time. We'll update these chapters periodically to reflect our growing community. Continued use of LIT ISLE means you're okay with the new editions of our terms.",
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
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

      <div ref={sectionRef} className="relative">
        {/* Mobile Hero */}
        <section className="lg:hidden relative py-16 px-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
            <div className="w-10" />
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-12 h-12 text-[#0B6623]" />
            </div>
            <div className="w-16 h-1 bg-[#0B6623] mx-auto rounded mb-4" />
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              "In the vast library of digital experiences, every reader deserves a clear understanding of their journey."
            </p>
            <div className="flex items-center justify-center space-x-4 text-gray-600 text-xs">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Sep 2025</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookMarked className="w-3 h-3" />
                <span>v1.0</span>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Hero */}
        <section
          className="hidden lg:block relative py-32 px-6 overflow-hidden"
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
          {/* Book-themed background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Book spine effect */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-2 h-32 bg-[#0B6623] rounded-full mr-4"></div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <BookOpen className="w-16 h-16 text-[#0B6623]" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 font-serif">
                  Terms & Conditions
                </h1>
                <div className="text-xl text-[#0B6623] font-medium mb-2">
                  A Digital Library Agreement
                </div>
                <div className="w-32 h-1 bg-[#0B6623] mx-auto mb-6"></div>
              </div>
              <div className="w-2 h-32 bg-[#0B6623] rounded-full ml-4"></div>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-6 font-light">
                "In the vast library of digital experiences, every reader
                deserves a clear understanding of their journey. Welcome to LIT
                ISLE's literary contract."
              </p>
              <div className="flex items-center justify-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Last Updated: September 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookMarked className="w-4 h-4" />
                  <span className="text-sm">Version 1.0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span className="text-sm">Digital Library</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Table of Contents */}
        <section className="lg:hidden py-8 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-[#0B6623] mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Table of Contents</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Navigate through our literary agreement
              </p>
            </div>

            <div className="space-y-3">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 border ${
                    activeSection === section.id
                      ? "bg-[#0B6623]/10 border-[#0B6623]/40 text-gray-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#0B6623]/30"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <section.icon className="w-5 h-5 text-[#0B6623] mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">
                        {section.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {section.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop Table of Contents */}
        <section
          className="hidden lg:block py-16 px-6 bg-gray-50"
          data-scroll-item
          data-index="toc"
          style={{
            opacity: visibleItems.has("toc") ? 1 : 0,
            transform: visibleItems.has("toc")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-[#0B6623] mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 font-serif">
                  Table of Contents
                </h2>
              </div>
              <p className="text-gray-600">
                Navigate through our literary agreement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
                    activeSection === section.id
                      ? "bg-[#0B6623]/10 border-[#0B6623]/40 text-gray-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-[#0B6623]/30"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <section.icon className="w-8 h-8 text-[#0B6623]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">
                        {section.title}
                      </div>
                      <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        {section.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile Main Content */}
        <section className="lg:hidden py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {sections.map((section, index) => (
                <MobileSection key={section.id} id={section.id} title={section.title}>
                  <div className="flex items-center gap-3 mb-3">
                    <section.icon className="w-5 h-5 text-[#0B6623]" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.subtitle}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {section.content}
                  </p>
                </MobileSection>
              ))}

              {/* Mobile Contact Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Library className="w-12 h-12 text-[#0B6623]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Questions About Our Terms?
                </h3>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  Like any good librarian, we're here to help you understand our collection. Have questions about these terms? We're just a message away!
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Contact Our Librarians</span>
                    </span>
                  </Link>
                  <Link
                    to="/privacy"
                    className="px-6 py-3 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Privacy Policy</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Main Content */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="sections"
          style={{
            opacity: visibleItems.has("sections") ? 1 : 0,
            transform: visibleItems.has("sections")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.2s",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="space-y-16">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="relative group"
                >
                  {/* Chapter divider */}
                  <div className="flex items-center mb-8">
                    <div className="flex-1 h-px bg-[#0B6623]/20"></div>
                    <div className="mx-6">
                      <section.icon className="w-10 h-10 text-[#0B6623]" />
                    </div>
                    <div className="flex-1 h-px bg-[#0B6623]/20"></div>
                  </div>

                  {/* Chapter content */}
                  <div className="bg-white border border-gray-200 rounded-3xl p-10 hover:border-[#0B6623]/30 transition-all duration-300">
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-gray-900 mb-3 font-serif">
                        {section.title}
                      </h3>
                      <div className="text-lg text-[#0B6623] font-medium mb-4">
                        {section.subtitle}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg font-light">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop Contact Section */}
        <section
          className="hidden lg:block py-20 px-6 bg-gray-50"
          data-scroll-item
          data-index="contact"
          style={{
            opacity: visibleItems.has("contact") ? 1 : 0,
            transform: visibleItems.has("contact")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.4s",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white border border-gray-200 rounded-3xl p-12">
              <div className="flex justify-center mb-6">
                <Library className="w-16 h-16 text-[#0B6623]" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
                Questions About Our Terms?
              </h3>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Like any good librarian, we're here to help you understand our
                collection. Have questions about these terms? We're just a
                message away!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/contact"
                  className="group px-10 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Contact Our Librarians</span>
                  </span>
                </Link>
                <Link
                  to="/privacy"
                  className="group px-10 py-4 border-2 border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-gray-900 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Privacy Policy</span>
                  </span>
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

export default Terms;
