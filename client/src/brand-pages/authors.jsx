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
} from "lucide-react";

const Authors = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const sectionRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div ref={sectionRef}>
        {/* Hero */}
        <section
          className="relative py-24 px-6"
          data-scroll-item
          data-index="hero"
          style={{
            opacity: visibleItems.has("hero") ? 1 : 0,
            transform: visibleItems.has("hero") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-3 text-orange-500">
              <BookOpen className="w-6 h-6" />
              <span className="tracking-wide uppercase text-sm">Lit Isle Author Program</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Become a Lit Isle Author</h1>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded" />
            <p className="text-gray-300 max-w-3xl mx-auto mt-6 leading-relaxed">
              Any author, anywhere in the world, can join the Lit Isle Author Program for free.
              The program lets published authors claim their profile, promote books, and engage with readers.
            </p>
            <div className="mt-6 text-gray-400 max-w-2xl mx-auto">
              <ul className="space-y-1">
                <li>• An internet connection</li>
                <li>• A published book (or one about to be published) listed in our library</li>
              </ul>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-orange-500">
              <BadgeCheck className="w-5 h-5" />
              <span className="text-sm">Verified authors receive the Lit Isle Author Badge</span>
            </div>
          </div>
        </section>

        {/* Badge design note */}
        <section
          className="px-6"
          data-scroll-item
          data-index="badge"
          style={{
            opacity: visibleItems.has("badge") ? 1 : 0,
            transform: visibleItems.has("badge") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.05s",
          }}
        >
          <div className="max-w-4xl mx-auto bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-black flex items-center justify-center">
                <span className="text-white text-[10px] tracking-wide">AUTHOR</span>
              </div>
              <div className="text-gray-300 text-sm">
                Badge: Clean circular mark with an orange ring, black center, and white “Author” label—instantly recognizable across Lit Isle.
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="benefits"
          style={{
            opacity: visibleItems.has("benefits") ? 1 : 0,
            transform: visibleItems.has("benefits") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.1s",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Benefits of Claiming Your Author Profile
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="bg-[#0E0E0E] border border-[#1F1F1F] hover:border-orange-500/30 rounded-xl p-6 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 mb-4 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{b.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to claim */}
        <section
          className="py-20 px-6 bg-[#0B0B0B]"
          data-scroll-item
          data-index="steps"
          style={{
            opacity: visibleItems.has("steps") ? 1 : 0,
            transform: visibleItems.has("steps") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.15s",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-white text-center mb-10">How to Claim Your Author Profile</h3>
            <ol className="space-y-4">
              {steps.map((s, idx) => (
                <li key={idx} className="flex items-start gap-4 bg-[#0E0E0E] border border-[#1F1F1F] rounded-xl p-4">
                  <div className="mt-1 w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="text-gray-400 text-sm mt-6 text-center">
              Your login and password will remain the same after verification.
            </p>
          </div>
        </section>

        {/* Already an author CTA */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="cta"
          style={{
            opacity: visibleItems.has("cta") ? 1 : 0,
            transform: visibleItems.has("cta") ? "translateY(0)" : "translateY(50px)",
            transition: "all 0.8s ease-out 0.2s",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-[#0E0E0E] border border-[#1F1F1F] rounded-2xl p-10">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">Already a Lit Isle Author?</h4>
              <p className="text-gray-300 mb-6">
                Learn how to make the most of the Author Program with our Author Resources Hub.
              </p>
              <button
                type="button"
                onClick={() => alert('Author Resources Hub is coming soon!')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
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
