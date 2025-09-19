// Help Center page for LIT ISLE
// Book geek aesthetic with comprehensive help and support

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  FileText,
  Users,
  Settings,
  CreditCard,
  Shield,
  Library,
  BookMarked,
  Star,
  ChevronRight,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HelpCenter = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  // ===== HELP CATEGORIES =====
  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      description: "New to LIT ISLE? Start your reading journey here.",
      articles: [
        {
          q: "How to create your account",
          a: "Click Register, enter your name, email, and a secure password, then confirm via the verification email we send.",
        },
        {
          q: "Setting up your reading profile",
          a: "Open Profile > Edit Profile to add a bio, preferred genres, and a profile image to personalize recommendations.",
        },
        {
          q: "Finding your first book",
          a: "Use the search bar or explore the All Books and Genres pages. Add books to My Shelf to start reading quickly.",
        },
        {
          q: "Understanding the interface",
          a: "Navigation includes Home, Genres, Library, My Shelf, and Community. Each page focuses on discovery, reading, or social features.",
        },
      ],
    },
    {
      id: "reading",
      title: "Reading & Books",
      icon: Library,
      description: "Everything about reading, books, and your digital library.",
      articles: [
        {
          q: "How to read books online",
          a: "Open a book and press Read. Use the reader toolbar to change font size, theme, and navigate chapters.",
        },
        {
          q: "Creating reading lists",
          a: "From a book card, click Add to List. Create custom lists like 'Weekend Reads' to organize your queue.",
        },
        {
          q: "Bookmarking and highlights",
          a: "In the reader, tap the bookmark icon to save your spot and select text to create highlights with optional notes.",
        },
        {
          q: "Downloading books for offline reading",
          a: "Click Download on a book page. The title is saved for offline access in your device storage.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: Users,
      description: "Manage your account, profile, and personal settings.",
      articles: [
        {
          q: "Updating your profile",
          a: "Go to Profile > Edit Profile to update your name, bio, website, social links, and preferred genres.",
        },
        {
          q: "Changing your password",
          a: "Open Settings > Security, enter your current password and a new strong password, then save.",
        },
        {
          q: "Privacy settings",
          a: "Under Settings > Privacy, control what is visible publicly (lists, reviews) and download your data if needed.",
        },
        {
          q: "Account security",
          a: "Use a unique password, log out from shared devices, and review active sessions in Settings > Security.",
        },
      ],
    },
    {
      id: "community",
      title: "Community & Social",
      icon: MessageCircle,
      description: "Connect with other readers and share your thoughts.",
      articles: [
        {
          q: "Writing book reviews",
          a: "Visit a book page and select Write Review. Share your thoughts respectfully and add a star rating.",
        },
        {
          q: "Joining reading groups",
          a: "Go to Community to find active groups by genre or theme, then tap Join to participate.",
        },
        {
          q: "Sharing highlights",
          a: "From your highlights list, choose Share to post to Community with optional commentary.",
        },
        {
          q: "Community guidelines",
          a: "Be kind, cite spoilers, avoid harassment, and follow local laws. Violations may lead to content removal or suspension.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: Settings,
      description: "Technical issues, bugs, and troubleshooting.",
      articles: [
        {
          q: "Browser compatibility",
          a: "We support the latest Chrome, Firefox, Edge, and Safari. Update your browser and clear cache if issues persist.",
        },
        {
          q: "Mobile app issues",
          a: "Ensure you have the latest version. If problems continue, reinstall the app or contact support with device details.",
        },
        {
          q: "Login problems",
          a: "Use Forgot password on the login page. If email doesn’t arrive, check spam or try another email address.",
        },
        {
          q: "Performance optimization",
          a: "Close unused tabs, disable heavy extensions, and enable hardware acceleration for smoother reading.",
        },
      ],
    },
    {
      id: "billing",
      title: "Billing & Premium",
      icon: CreditCard,
      description: "Questions about payments and premium features.",
      articles: [
        {
          q: "Premium features overview",
          a: "Premium unlocks advanced annotations, deeper recommendations, and priority support. Core reading remains free.",
        },
        {
          q: "Payment methods",
          a: "We accept major cards and UPI (where available). Payments are processed securely via our provider.",
        },
        {
          q: "Subscription management",
          a: "Manage or cancel anytime in Settings > Billing. Changes take effect at the end of the current cycle.",
        },
        {
          q: "Refund policy",
          a: "Contact support within 14 days of purchase for eligibility. Refunds follow our Terms and local regulations.",
        },
      ],
    },
  ];

  // ===== FAQ DATA =====
  const faqs = [
    {
      question: "Is LIT ISLE really free to use?",
      answer:
        "Yes! LIT ISLE is completely free for all readers. You can access our entire library, create reading lists, write reviews, and connect with other readers at no cost. We may introduce premium features in the future, but the core reading experience will always remain free.",
    },
    {
      question: "How do I find books I want to read?",
      answer:
        "You can search for books by title, author, or genre using our search bar. We also have curated collections, personalized recommendations based on your reading history, and trending books from our community.",
    },
    {
      question: "Can I read books offline?",
      answer:
        "Yes! You can download books to read offline. Simply click the download button on any book page, and it will be saved to your device for offline reading. This is perfect for reading during commutes or when you don't have internet access.",
    },
    {
      question: "How do I write a book review?",
      answer:
        "After reading a book, you can write a review by going to the book's page and clicking 'Write Review'. Share your thoughts, rate the book, and help other readers discover great books!",
    },
    {
      question: "Is my reading data private?",
      answer:
        "Absolutely! Your reading habits, personal lists, and private notes are completely private. We never share your personal reading data with third parties. You can control your privacy settings in your account preferences.",
    },
  ];

  const filteredCategories =
    selectedCategory === "all"
      ? helpCategories
      : helpCategories.filter((cat) => cat.id === selectedCategory);

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
                <h2 className="text-lg font-semibold text-gray-900">Help Center</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <a href="#search" className="block py-2 text-gray-700 hover:text-[#0B6623]">Search Help</a>
              <a href="#categories" className="block py-2 text-gray-700 hover:text-[#0B6623]">Help Topics</a>
              <a href="#faq" className="block py-2 text-gray-700 hover:text-[#0B6623]">FAQ</a>
              <a href="#contact" className="block py-2 text-gray-700 hover:text-[#0B6623]">Contact Support</a>
            </div>
          </div>
        </div>
      )}

      <div ref={sectionRef} className="relative">
        {/* ===== MOBILE HERO SECTION ===== */}
        <section className="lg:hidden">
          <div className="bg-gradient-to-br from-[#0B6623]/10 to-white py-8 px-4">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white shadow-sm"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Help Center</h1>
              <div className="w-10" />
            </div>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <HelpCircle className="w-12 h-12 text-[#0B6623]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get Help & Support
              </h2>
              <p className="text-gray-600 text-sm">
                Find answers and make the most of your reading experience
              </p>
            </div>

            {/* Mobile Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 text-sm"
              />
            </div>
          </div>
        </section>

        {/* ===== DESKTOP HERO SECTION ===== */}
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
          {/* Background pattern */}
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
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <HelpCircle className="w-16 h-16 text-[#0B6623]" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-serif">
                Help Center
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                Your guide to navigating LIT ISLE's digital library. Find
                answers, get support, and make the most of your reading
                experience.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== MOBILE CONTENT SECTIONS ===== */}
        <div className="lg:hidden px-4 py-6">
          {/* Quick Contact */}
          <MobileSection id="contact" title="Quick Contact">
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Email Support",
                  description: "Get detailed help via email",
                  value: "support@litisle.com",
                  action: "mailto:support@litisle.com"
                },
                {
                  icon: Clock,
                  title: "Response Time",
                  description: "We typically respond within",
                  value: "24 hours",
                  action: null
                },
                {
                  icon: MessageCircle,
                  title: "Live Chat",
                  description: "Coming soon!",
                  value: "Real-time support",
                  action: null
                }
              ].map((info, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    info.action ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer' : 'bg-gray-50'
                  }`}
                  onClick={info.action ? () => window.open(info.action) : undefined}
                >
                  <info.icon className="w-5 h-5 text-[#0B6623] flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{info.title}</h4>
                    <p className="text-gray-600 text-xs">{info.description}</p>
                    <p className={`text-sm font-medium ${info.action ? 'text-[#0B6623]' : 'text-gray-700'}`}>
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>

          {/* Help Categories */}
          <MobileSection id="categories" title="Help Topics">
            <div className="space-y-4">
              {helpCategories.map((category, index) => (
                <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#0B6623]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-4 h-4 text-[#0B6623]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        {category.title}
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed mb-3">
                        {category.description}
                      </p>
                      <div className="space-y-2">
                        {category.articles.slice(0, 2).map((article, articleIndex) => (
                          <div key={articleIndex} className="text-xs">
                            <div className="flex items-center text-gray-600 mb-1">
                              <ChevronRight className="w-3 h-3 mr-1 text-[#0B6623]" />
                              {article.q}
                            </div>
                          </div>
                        ))}
                        {category.articles.length > 2 && (
                          <p className="text-xs text-[#0B6623] font-medium">
                            +{category.articles.length - 2} more articles
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>

          {/* FAQ */}
          <MobileSection id="faq" title="Frequently Asked Questions">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#0B6623] mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MobileSection>

          {/* Contact CTA */}
          <MobileSection id="cta" title="Still Need Help?">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <MessageCircle className="w-12 h-12 text-[#0B6623]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                Can't find what you're looking for?
              </h4>
              <p className="text-gray-600 text-sm">
                Our support team is here to help you with any questions or issues.
              </p>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="block w-full px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Link>
                <a
                  href="mailto:support@litisle.com"
                  className="block w-full px-6 py-3 border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Us Directly
                </a>
              </div>
            </div>
          </MobileSection>
        </div>

        {/* ===== DESKTOP QUICK CONTACT ===== */}
        <section
          className="hidden lg:block py-16 px-6 bg-gray-50"
          data-scroll-item
          data-index="contact"
          style={{
            opacity: visibleItems.has("contact") ? 1 : 0,
            transform: visibleItems.has("contact")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
                Need Immediate Help?
              </h2>
              <p className="text-gray-600">
                Get in touch with our support team
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-[#0B6623]/30 transition-all duration-300">
                <Mail className="w-8 h-8 text-[#0B6623] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email Support
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get detailed help via email
                </p>
                <a
                  href="mailto:support@litisle.com"
                  className="text-[#0B6623] hover:text-[#0e7a2b] transition-colors"
                >
                  support@litisle.com
                </a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-[#0B6623]/30 transition-all duration-300">
                <Clock className="w-8 h-8 text-[#0B6623] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Response Time
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  We typically respond within
                </p>
                <p className="text-[#0B6623] font-medium">24 hours</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-[#0B6623]/30 transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-[#0B6623] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Live Chat
                </h3>
                <p className="text-gray-600 text-sm mb-4">Coming soon!</p>
                <p className="text-gray-600 text-sm">Real-time support</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DESKTOP HELP CATEGORIES ===== */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="categories"
          style={{
            opacity: visibleItems.has("categories") ? 1 : 0,
            transform: visibleItems.has("categories")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.2s",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
                Browse Help Topics
              </h2>
              <p className="text-gray-600">
                Find answers organized by category
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#0B6623]/30 transition-all duration-500"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#0B6623]/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#0B6623]/30 transition-colors">
                      <category.icon className="w-6 h-6 text-[#0B6623]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {category.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="space-y-3">
                    {category.articles.map((article, articleIndex) => (
                      <div key={articleIndex} className="group/item">
                        <div className="flex items-center text-sm text-gray-600 cursor-default">
                          <ChevronRight className="w-4 h-4 mr-2 text-[#0B6623]" />
                          {article.q}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed pl-6 mt-1">
                          {article.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DESKTOP FAQ SECTION ===== */}
        <section
          className="hidden lg:block py-20 px-6 bg-gray-50"
          data-scroll-item
          data-index="faq"
          style={{
            opacity: visibleItems.has("faq") ? 1 : 0,
            transform: visibleItems.has("faq")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.3s",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">Quick answers to common questions</p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#0B6623]/30 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#0B6623] mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DESKTOP CONTACT CTA ===== */}
        <section
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="cta"
          style={{
            opacity: visibleItems.has("cta") ? 1 : 0,
            transform: visibleItems.has("cta")
              ? "translateY(0)"
              : "translateY(50px)",
            transition: "all 0.8s ease-out 0.4s",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white border border-gray-200 rounded-3xl p-12">
              <div className="flex justify-center mb-6">
                <MessageCircle className="w-16 h-16 text-[#0B6623]" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
                Still Need Help?
              </h3>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Can't find what you're looking for? Our support team is here to
                help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/contact"
                  className="group px-10 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Contact Support</span>
                  </span>
                </Link>
                <a
                  href="mailto:support@litisle.com"
                  className="group px-10 py-4 border-2 border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-gray-900 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email Us Directly</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;
