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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [activeSection, setActiveSection] = useState("acceptance");
  const sectionRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div ref={sectionRef} className="relative">
        {/* ===== BOOK COVER HERO SECTION ===== */}
        <section
          className="relative py-32 px-6 overflow-hidden"
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
              <div className="w-2 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full mr-4"></div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <BookOpen className="w-16 h-16 text-orange-400" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-serif">
                  Terms & Conditions
                </h1>
                <div className="text-xl text-orange-400 font-medium mb-2">
                  A Digital Library Agreement
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-6"></div>
              </div>
              <div className="w-2 h-32 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full ml-4"></div>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <p className="text-xl text-gray-300 leading-relaxed mb-6 font-light">
                "In the vast library of digital experiences, every reader
                deserves a clear understanding of their journey. Welcome to LIT
                ISLE's literary contract."
              </p>
              <div className="flex items-center justify-center space-x-6 text-gray-500">
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

        {/* ===== TABLE OF CONTENTS - BOOK INDEX STYLE ===== */}
        <section
          className="py-16 px-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50"
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
                <FileText className="w-8 h-8 text-orange-400 mr-3" />
                <h2 className="text-3xl font-bold text-white font-serif">
                  Table of Contents
                </h2>
              </div>
              <p className="text-gray-400">
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
                      ? "bg-orange-500/10 border-orange-500/40 text-orange-300 shadow-lg shadow-orange-500/20"
                      : "bg-gray-800/30 border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <section.icon className="w-8 h-8 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1 group-hover:text-orange-300 transition-colors">
                        {section.title}
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {section.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MAIN CONTENT - BOOK CHAPTERS ===== */}
        <section
          className="py-20 px-6"
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
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                    <div className="mx-6">
                      <section.icon className="w-10 h-10 text-orange-400" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
                  </div>

                  {/* Chapter content */}
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-3xl p-10 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 group-hover:bg-gradient-to-br group-hover:from-gray-900/70 group-hover:to-gray-800/50">
                    <div className="mb-6">
                      <h3 className="text-3xl font-bold text-white mb-3 font-serif group-hover:text-orange-300 transition-colors">
                        {section.title}
                      </h3>
                      <div className="text-lg text-orange-400 font-medium mb-4">
                        {section.subtitle}
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg font-light">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT SECTION - LIBRARIAN'S DESK ===== */}
        <section
          className="py-20 px-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60"
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
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-3xl p-12 backdrop-blur-sm">
              <div className="flex justify-center mb-6">
                <Library className="w-16 h-16 text-orange-400" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-6 font-serif">
                Questions About Our Terms?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Like any good librarian, we're here to help you understand our
                collection. Have questions about these terms? We're just a
                message away!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/contact"
                  className="group px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Contact Our Librarians</span>
                  </span>
                </Link>
                <Link
                  to="/privacy"
                  className="group px-10 py-4 border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
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
