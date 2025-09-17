// Careers page for LIT ISLE - Digital Library
// Dark mode design with professional yet book-focused aesthetic

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Careers = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const cultureHighlights = [
    {
      title: "Inclusive & Collaborative",
      description: "We thrive on teamwork and openness, creating an environment where every voice matters.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      title: "Reader-First Approach",
      description: "Every decision starts with the reader, ensuring our platform serves the community best.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    },
    {
      title: "Innovation-Driven",
      description: "We experiment and grow with technology, always pushing the boundaries of digital reading.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      title: "Growth-Minded",
      description: "We believe in continuous learning and personal development for all team members.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.91.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75S7 14 17 14s6-1.25 6-1.25-1-1.5-1-3.5S17 8 17 8z"/>
        </svg>
      )
    }
  ];

  const wellnessBenefits = [
    {
      title: "Health Benefits",
      description: "Comprehensive medical coverage, dental, vision, and mental health support for you and your family.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      title: "Learning & Growth",
      description: "Free access to our entire library, online courses, conferences, and professional development programs.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      )
    },
    {
      title: "Work-Life Balance",
      description: "Flexible hours, remote work options, unlimited PTO, and family-friendly policies.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      title: "Community & Support",
      description: "Mental health resources, team events, book clubs, and a supportive community of readers.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 13.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 8H12c.8 0 1.54.37 2.01.99L16 11l1.99-2.01A2.5 2.5 0 0 1 20 8h2.5l-2.54 7.63A1.5 1.5 0 0 1 18.54 16H16v6h4z"/>
        </svg>
      )
    }
  ];

  const values = [
    {
      title: "Curiosity",
      description: "We keep learning, exploring, and asking questions that lead to better solutions.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      )
    },
    {
      title: "Integrity",
      description: "We do the right thing, even when no one is watching, building trust through transparency.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      title: "Empathy",
      description: "We care deeply for our readers and teammates, understanding their needs and challenges.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )
    },
    {
      title: "Creativity",
      description: "We imagine and innovate, turning ideas into reality that enhances the reading experience.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      title: "Accountability",
      description: "We own our impact, taking responsibility for our actions and their outcomes.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      title: "Passion for Books",
      description: "We live the LIT ISLE spirit, genuinely loving books and the communities they create.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    }
  ];


  const scrollToJobs = () => {
    const jobsSection = document.getElementById('jobs-section');
    jobsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div ref={sectionRef}>
        {/* Hero Section */}
        <section
          className="relative h-screen flex items-center justify-center overflow-hidden"
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
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/brand-img/career.jpeg"
              alt="LIT ISLE Careers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Help shape the future of reading with LIT ISLE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Join us in building a digital home where books and readers connect — freely, socially, and endlessly.
            </p>
            <button
              onClick={scrollToJobs}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore Careers
            </button>
          </div>
        </section>

        {/* Our Mission Section */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="mission"
          style={{
            opacity: visibleItems.has("mission") ? 1 : 0,
            transform: visibleItems.has("mission")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Text Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  At LIT ISLE, we believe books shape lives. Our mission is to make knowledge, 
                  stories, and ideas accessible to every reader - digitally and socially.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  We're building more than a platform; we're creating a community where 
                  every reader finds their voice, every story finds its audience, and 
                  every idea has the power to change the world.
                </p>
              </div>

              {/* Right - Image */}
              <div className="relative">
                <img
                  src="/brand-img/meet1.jpeg"
                  alt="LIT ISLE Team Mission"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-orange-500/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Culture Section */}
        <section
          className="py-20 px-6 bg-gray-900/30"
          data-scroll-item
          data-index="culture"
          style={{
            opacity: visibleItems.has("culture") ? 1 : 0,
            transform: visibleItems.has("culture")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Culture
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                We've built a culture that celebrates reading, learning, and the power of human connection.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cultureHighlights.map((item, index) => (
                <div
                  key={index}
                  className="text-center group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/20 transition-all duration-300">
                    <div className="text-orange-500">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Employee Wellness Section */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="wellness"
          style={{
            opacity: visibleItems.has("wellness") ? 1 : 0,
            transform: visibleItems.has("wellness")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Employee Wellness
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                We believe that happy, healthy employees create the best experiences for our readers.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {wellnessBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-orange-500/30 transition-all duration-300 hover:bg-gray-900/70"
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-orange-500">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section
          className="py-20 px-6 bg-gray-900/30"
          data-scroll-item
          data-index="values"
          style={{
            opacity: visibleItems.has("values") ? 1 : 0,
            transform: visibleItems.has("values")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                These core values guide everything we do, from product decisions to team interactions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/20 transition-all duration-300">
                    <div className="text-orange-500">
                      <span className="text-2xl">{value.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Image Section */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="team"
          style={{
            opacity: visibleItems.has("team") ? 1 : 0,
            transform: visibleItems.has("team")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Image */}
              <div className="relative">
                <img
                  src="/brand-img/meet2.jpg"
                  alt="LIT ISLE Team"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-orange-500/20 rounded-xl"></div>
              </div>

              {/* Right - Text */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Join Our Team
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  We're a diverse group of readers, creators, and innovators who share 
                  a passion for making knowledge accessible to everyone.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Whether you're a developer, designer, writer, or just someone who 
                  loves books, there's a place for you at LIT ISLE.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section
          id="jobs-section"
          className="py-20 px-6 bg-gray-900/30"
          data-scroll-item
          data-index="jobs"
          style={{
            opacity: visibleItems.has("jobs") ? 1 : 0,
            transform: visibleItems.has("jobs")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Join Our Story?
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
                If you're passionate about books, technology, and making a difference 
                in the world, we'd love to hear from you.
              </p>
            </div>

            {/* No Openings Message */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  No Open Positions Currently
                </h3>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  We're not actively hiring at the moment, but we're always interested in connecting 
                  with talented individuals who share our passion for books and technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/careers/apply"
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Send Us Your Resume
                  </Link>
                  <Link
                    to="/careers/browse"
                    className="px-8 py-4 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Browse Positions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
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
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  We envision a world where every reader has access to the books they need, 
                  when they need them, in a way that enhances their learning and growth.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Through technology, community, and innovation, we're building the future 
                  of reading - one that's inclusive, accessible, and endlessly inspiring.
                </p>
              </div>

              {/* Right - Image */}
              <div className="relative">
                <img
                  src="/brand-img/vision.jpeg"
                  alt="LIT ISLE Vision"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute inset-0 rounded-xl"></div>
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
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;