// FAQ section with smooth accordion animation
// Dark mode with scrolling animations

import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    q: "What is LIT ISLE?",
    a: "LIT ISLE is a digital library and book community where you can read, bookmark, highlight, and review books. It's designed to give book lovers a personalized and interactive reading experience.",
  },
  {
    q: "Is LIT ISLE free to use?",
    a: "Yes! LIT ISLE is completely free to use. All you need to do is create an account to start reading, tracking books, and joining the community discussions.",
  },
  {
    q: "How do I bookmark a book while reading?",
    a: "Click the bookmark icon on the top right of the reading page. Your bookmark will automatically be saved to My Shelf, so you can continue reading from where you left off.",
  },
  {
    q: "Can I highlight text and add notes?",
    a: "Yes, you can highlight any text inside the book. You can also attach personal notes to your highlights. These notes are private to you, but you can choose to share them in the community.",
  },
  {
    q: "What is a Book Playlist or To-Do List?",
    a: "Think of it as your personal reading queue. You can create lists like \"Books to Read This Month\" or \"Fantasy Collection\" and organize your reading journey.",
  },
  {
    q: "Can I write and share book reviews?",
    a: "Absolutely! After finishing a book, you can write a review, give ratings, and even see what others thought about it. Reviews help other readers decide what to pick next.",
  },
  {
    q: "Can I comment on highlighted paragraphs in the community?",
    a: "Yes. When you highlight a paragraph, you'll see a \"Discuss\" option. This lets you share your highlight and join a thread with other readers who found that part interesting too.",
  },
  {
    q: "Can I download books for offline reading?",
    a: "Yes, you can. Just tap the download button on any book, and it will be stored in your device so you can read even without internet access.",
  },
  {
    q: "How do recommendations work?",
    a: "LIT ISLE uses a smart recommendation system that looks at your bookmarks, highlights, playlists, and reading history. Based on your interests, it suggests books that you're most likely to enjoy.",
  },
  {
    q: "Can I read on mobile?",
    a: "Yes! LIT ISLE is fully mobile-friendly. You can log in from your phone's browser or app (coming soon) and continue reading seamlessly across devices.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const sectionRef = useRef(null);

  // Ensure calligraphy font is available (Dancing Script)
  useEffect(() => {
    if (!document.getElementById('font-dancing-script')) {
      const link = document.createElement('link');
      link.id = 'font-dancing-script';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Show only first 5 questions initially, or all if showAll is true
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  // Scroll animation setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const items = sectionRef.current?.querySelectorAll('[data-faq-item]');
    items?.forEach(item => observer.observe(item));

    return () => {
      items?.forEach(item => observer.unobserve(item));
    };
  }, [displayedFaqs]);

  return (
    <section ref={sectionRef} id="faq" className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="mx-auto px-6" style={{ maxWidth: '1080px' }}>
        {/* Heading - Left aligned with scroll animation */}
        <div 
          className="mb-10 transition-all duration-700 ease-out"
          style={{
            opacity: visibleItems.has(-1) ? 1 : 0,
            transform: visibleItems.has(-1) ? 'translateY(0)' : 'translateY(30px)'
          }}
          data-faq-item
          data-index="-1"
        >
          <h2 className="text-black font-bold" style={{ fontSize: '32px', lineHeight: 1.2, fontFamily: '\'Dancing Script\', cursive' }}>Frequently Asked Questions</h2>
        </div>

        {/* Accordion with horizontal separators */}
        <div>
          {displayedFaqs.map((item, index) => {
            const isOpen = openIndex === index;
            const isVisible = visibleItems.has(index);
            const animationDelay = index * 100; // Stagger animation by 100ms per item
            
            return (
              <div 
                key={index}
                data-faq-item
                data-index={index}
                className="transition-all duration-700 ease-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                  transitionDelay: `${animationDelay}ms`
                }}
              >
                {/* Question row */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full text-left py-6 flex items-center justify-between hover:text-black transition-all duration-300 ease-in-out"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="text-black font-medium transition-colors duration-300" style={{ fontSize: '18px', lineHeight: 1.4, fontFamily: '\'Playfair Display\', serif' }}>{item.q}</span>
                  <span 
                    className="text-black font-bold transition-all duration-300 ease-in-out" 
                    style={{ 
                      fontSize: '20px',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    aria-hidden
                  >
                    {isOpen ? '–' : '+'}
                  </span>
                </button>

                {/* Answer panel with smooth sliding animation */}
                <div 
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ 
                    maxHeight: isOpen ? '300px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)'
                  }}
                >
                  <div 
                    id={`faq-panel-${index}`} 
                    className="pb-6 text-gray-600 transition-all duration-300 ease-in-out" 
                    style={{ 
                      fontSize: '16px', 
                      lineHeight: 1.6,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-5px)'
                    }}
                  >
                    {item.a}
                  </div>
                </div>

                {/* Horizontal separator line */}
                {index < displayedFaqs.length - 1 && (
                  <div className="border-t border-gray-300"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* More/Less Button with smooth animation */}
        {faqs.length > 5 && (
          <div 
            className="text-center mt-8 transition-all duration-700 ease-out"
            style={{
              opacity: visibleItems.has(displayedFaqs.length) ? 1 : 0,
              transform: visibleItems.has(displayedFaqs.length) ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: `${displayedFaqs.length * 100}ms`
            }}
            data-faq-item
            data-index={displayedFaqs.length}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-full border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition-all duration-300 ease-in-out font-semibold transform hover:scale-105 active:scale-95"
              style={{ fontSize: '16px' }}
            >
              <span className="transition-all duration-300 ease-in-out">
                {showAll ? 'Less' : 'More'}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;


