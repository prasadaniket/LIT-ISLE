// Authors page for LIT ISLE
// Redesigned: dark mode black background, subtle orange accents, book-geek aesthetic

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BookOpen,
  Star,
  Megaphone,
  MessageSquare,
  UserCircle2,
  BadgeCheck,
  Search,
  Mail,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Authors = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set(['hero']));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRef = useRef(null);

  // Mobile helper functions
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

  const benefits = [
    {
      icon: UserCircle2,
      title: "Manage Your Profile",
      description:
        "Update your photo, write a compelling bio, and fix book listings to keep information accurate.",
    },
    {
      icon: Megaphone,
      title: "Promote Your Books",
      description:
        "Run giveaways, share updates, and advertise your work with tools designed for authors.",
    },
    {
      icon: MessageSquare,
      title: "Interact with Readers",
      description:
        "Answer questions, write reviews, and showcase your literary taste to engage your audience.",
    },
    {
      icon: Star,
      title: "Analytics & Insights",
      description:
        "Understand performance with readership insights that help you plan your next launch.",
    },
  ];

  const steps = [
    { icon: UserCircle2, text: "Sign in or create an account on LIT ISLE." },
    { icon: Search, text: "Search for your book by ISBN, ASIN, or title." },
    { icon: BookOpen, text: "On your book page, click your author name." },
    {
      icon: ArrowRight,
      text: "Scroll to the bottom and click: \"Is this you? Claim your author profile.\"",
    },
    { icon: CheckCircle, text: "Complete and submit the application." },
    {
      icon: Mail,
      text: "You’ll receive a confirmation email within 2 business days.",
    },
  ];

  // Mobile collapsible section component
  const MobileSection = ({ id, title, children }) => {
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
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Author Program</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <a href="#benefits" className="block py-2 text-gray-700 hover:text-[#0B6623]">Benefits</a>
              <a href="#steps" className="block py-2 text-gray-700 hover:text-[#0B6623]">How to Claim</a>
              <a href="#resources" className="block py-2 text-gray-700 hover:text-[#0B6623]">Resources</a>
            </div>
          </div>
        </div>
      )}

      <div ref={sectionRef}>
        {/* Mobile Hero */}
        <section className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="bg-gradient-to-br from-[#0B6623]/10 to-white py-6 px-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white shadow-sm"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Author Program</h1>
              <div className="w-10" />
            </div>
            
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 mb-2 text-[#0B6623]">
                <BookOpen className="w-4 h-4" />
                <span className="tracking-wide uppercase text-xs">Lit Isle Author Program</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Become a Lit Isle Author
              </h2>
              <div className="w-12 h-1 bg-[#0B6623] mx-auto rounded" />
            </div>
          </div>
        </section>

        {/* Desktop Hero */}
        <section
          className="hidden lg:block relative py-24 px-6"
          data-scroll-item
          data-index="hero"
          style={{
            opacity: visibleItems.has("hero") ? 1 : 0,
            transform: visibleItems.has("hero") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-3 text-[#0B6623]">
              <BookOpen className="w-6 h-6" />
              <span className="tracking-wide uppercase text-sm">Lit Isle Author Program</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Become a Lit Isle Author</h1>
            <div className="w-24 h-1 bg-[#0B6623] mx-auto rounded" />
            <p className="text-gray-700 max-w-3xl mx-auto mt-6 leading-relaxed">
              Any author, anywhere in the world, can join the Lit Isle Author Program for free.
              The program lets published authors claim their profile, promote books, and engage with readers.
            </p>
            <div className="mt-6 text-gray-600 max-w-2xl mx-auto">
              <ul className="space-y-1">
                <li>• An internet connection</li>
                <li>• A published book (or one about to be published) listed in our library</li>
              </ul>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-[#0B6623]">
              <BadgeCheck className="w-5 h-5" />
              <span className="text-sm">Verified authors receive the Lit Isle Author Badge</span>
            </div>
          </div>
        </section>

        {/* Mobile Content Sections */}
        <div className="lg:hidden px-4 py-4 space-y-4">
          <MobileSection id="overview" title="Program Overview">
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed text-sm">
                Any author, anywhere in the world, can join the Lit Isle Author Program for free.
                The program lets published authors claim their profile, promote books, and engage with readers.
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Requirements:</h4>
                <ul className="text-gray-600 text-xs space-y-1">
                  <li>• An internet connection</li>
                  <li>• A published book (or one about to be published) listed in our library</li>
                </ul>
              </div>
              <div className="flex items-center gap-2 text-[#0B6623] text-sm">
                <BadgeCheck className="w-4 h-4" />
                <span>Verified authors receive the Lit Isle Author Badge</span>
              </div>
            </div>
          </MobileSection>

          <MobileSection id="badge" title="Author Badge">
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0B6623] bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 text-[9px] tracking-wide">AUTHOR</span>
                </div>
                <div className="text-gray-700 text-xs">
                  Clean circular mark with an orange ring, black center, and white "Author" label—instantly recognizable across Lit Isle.
                </div>
              </div>
            </div>
          </MobileSection>

          <MobileSection id="benefits" title="Benefits">
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-[#0B6623]/10 flex items-center justify-center flex-shrink-0">
                      <b.icon className="w-4 h-4 text-[#0B6623]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">{b.title}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>

          <MobileSection id="steps" title="How to Claim Your Profile">
            <div className="space-y-3">
              {steps.map((s, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-lg bg-[#0B6623]/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-3 h-3 text-[#0B6623]" />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{s.text}</p>
                </div>
              ))}
              <p className="text-gray-600 text-xs text-center mt-3">
                Your login and password will remain the same after verification.
              </p>
            </div>
          </MobileSection>

          <MobileSection id="resources" title="Author Resources">
            <div className="text-center space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">Already a Lit Isle Author?</h4>
              <p className="text-gray-700 text-sm">
                Learn how to make the most of the Author Program with our Author Resources Hub.
              </p>
              <button
                type="button"
                onClick={() => alert('Author Resources Hub is coming soon!')}
                className="w-full px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Explore Resources <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </MobileSection>
        </div>

        {/* Desktop Badge design note */}
        <section
          className="hidden lg:block px-6"
          data-scroll-item
          data-index="badge"
          style={{
            opacity: visibleItems.has("badge") ? 1 : 0,
            transform: visibleItems.has("badge") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.05s",
          }}
        >
          <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#0B6623] bg-white flex items-center justify-center">
                <span className="text-gray-900 text-[10px] tracking-wide">AUTHOR</span>
              </div>
              <div className="text-gray-700 text-sm">
                Badge: Clean circular mark with an orange ring, black center, and white "Author" label—instantly recognizable across Lit Isle.
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Benefits */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="benefits"
          style={{
            opacity: visibleItems.has("benefits") ? 1 : 0,
            transform: visibleItems.has("benefits") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Benefits of Claiming Your Author Profile
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 hover:border-[#0B6623]/30 rounded-xl p-6 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0B6623]/10 mb-4 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-[#0B6623]" />
                  </div>
                  <h4 className="text-gray-900 font-semibold mb-2">{b.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Desktop How to claim */}
        <section
          className="hidden lg:block py-20 px-6 bg-gray-50"
          data-scroll-item
          data-index="steps"
          style={{
            opacity: visibleItems.has("steps") ? 1 : 0,
            transform: visibleItems.has("steps") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.15s",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-10">How to Claim Your Author Profile</h3>
            <ol className="space-y-4">
              {steps.map((s, idx) => (
                <li key={idx} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-[#0B6623]/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-4 h-4 text-[#0B6623]" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="text-gray-600 text-sm mt-6 text-center">
              Your login and password will remain the same after verification.
            </p>
          </div>
        </section>

        {/* Desktop Already an author CTA */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="cta"
          style={{
            opacity: visibleItems.has("cta") ? 1 : 0,
            transform: visibleItems.has("cta") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.2s",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10">
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Already a Lit Isle Author?</h4>
              <p className="text-gray-700 mb-6">
                Learn how to make the most of the Author Program with our Author Resources Hub.
              </p>
              <button
                type="button"
                onClick={() => alert('Author Resources Hub is coming soon!')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-xl transition-colors"
              >
                Explore Resources <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Authors;
