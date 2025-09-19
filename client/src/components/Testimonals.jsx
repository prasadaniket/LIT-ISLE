import { useState, useRef, useEffect } from 'react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // Testimonials data with actual reviewer images - 12 total with 4 featured (after every 2 review cards)
  // Rating distribution: 6 cards with 5 stars, 3 cards with 4.5 stars, 2 cards with 4 stars, 1 card with 3.5 stars
  const testimonials = [
    {
      id: 1,
      name: "Muskan Jaiswal",
      handle: "@talesofmusku",
      role: "Original Founder of LIT ISLE",
      image: "/reviewer-img/talesofmusku.jpg",
      testimonial: "The user interface is clean and the reading experience is seamless. I love how I can organize my books into different shelves and track my reading progress. Highly recommended for book enthusiasts!",
      type: "testimonial",
      rating: 5.0
    },
    {
      id: 2,
      name: "Learn With Jayy",
      handle: "@learnwithjayy",
      role: "Educational Content Creator",
      image: "/reviewer-img/learnwithjayy.jpg",
      testimonial: "LIT ISLE's recommendation engine is spot-on! It understands my reading preferences and suggests books I actually want to read. The progress tracking keeps me motivated to finish more books.",
      type: "testimonial",
      rating: 5.0
    },
    {
      id: 3,
      name: "Neelanjali",
      handle: "@booksmakemewhole",
      role: "Book Blogger",
      image: "/reviewer-img/booksmakemewhole.jpg",
      testimonial: "The community aspect of LIT ISLE is incredible. I've discovered so many amazing books through reader recommendations and the discussion forums. It's like having a book club at your fingertips!",
      type: "featured",
      rating: 5.0
    },
    {
      id: 4,
      name: "Megan The Book Worm",
      handle: "@megan.the.book.worm.elf",
      role: "Book Reviewer & Content Creator",
      image: "/reviewer-img/megan.the.book.worm.elf.jpg",
      testimonial: "LIT ISLE has transformed my reading experience! The personalized recommendations and community features make discovering new books so much easier. The platform's design is intuitive and the book collection is impressive.",
      type: "testimonial",
      rating: 4.5
    },
    {
      id: 5,
      name: "Sandra",
      handle: "@secretreadinglife",
      role: "Book Reviewer",
      image: "/reviewer-img/secretreadinglife.jpg",
      testimonial: "LIT ISLE has become my go-to platform for book discovery. The personalized recommendations based on my reading history are incredibly accurate, and I love the social features that let me share my reading journey.",
      type: "testimonial",
      rating: 5.0
    },
    {
      id: 6,
      name: "Nikita Navalkar",
      handle: "@nikitanavalkar",
      role: "Literary Influencer",
      image: "/reviewer-img/nikitanavalkar.jpg",
      testimonial: "As a book lover, I've tried many platforms, but LIT ISLE stands out. The reading tracking features and the ability to connect with other readers has made my reading journey more engaging and social.",
      type: "featured",
      rating: 4.5
    },
    {
      id: 7,
      name: "Reader's Wave",
      handle: "@readers.wave",
      role: "Book Community",
      image: "/reviewer-img/readers.wave.jpg",
      testimonial: "The reading challenges and community features on LIT ISLE have brought our book club to life. We've discovered so many new authors and genres through the platform's recommendations.",
      type: "testimonial",
      rating: 4.0
    },
    {
      id: 8,
      name: "Meg's Book Club",
      handle: "@megsbookclub",
      role: "Book Club Leader",
      image: "/reviewer-img/megsbookclub.jpg",
      testimonial: "LIT ISLE makes managing our book club so much easier! The discussion forums, reading progress tracking, and book recommendations have enhanced our monthly meetings significantly.",
      type: "testimonial",
      rating: 5.0
    },
    {
      id: 9,
      name: "Pantheon Books",
      handle: "@pantheonbooks",
      role: "Publishing House",
      image: "/reviewer-img/pantheonbooks.jpg",
      testimonial: "LIT ISLE has revolutionized how we connect with readers. The platform's analytics help us understand reader preferences and the community features create meaningful engagement with our books.",
      type: "featured",
      rating: 4.5
    },
    {
      id: 10,
      name: "Author Sonali",
      handle: "@author_sonali",
      role: "Author & Writer",
      image: "/reviewer-img/author_sonali.jpg",
      testimonial: "As an author, LIT ISLE has given me incredible insights into reader behavior and preferences. The platform's community engagement features help me connect directly with my readers.",
      type: "testimonial",
      rating: 4.0
    },
    {
      id: 11,
      name: "Penguin UK Books",
      handle: "@penguinukbooks",
      role: "Publisher",
      image: "/reviewer-img/penguinukbooks.jpg",
      testimonial: "LIT ISLE's innovative approach to digital reading has set new standards in the industry. The platform's user experience and community features make it a standout choice for book lovers worldwide.",
      type: "testimonial",
      rating: 3.5
    },
    {
      id: 12,
      name: "Bookly Reads",
      handle: "@booklyreads",
      role: "Book Reviewer",
      image: "/reviewer-img/booklyreads.jpg",
      testimonial: "The highlight and note-taking features are game-changers for serious readers. I can organize my thoughts, share insights with the community, and build a personal library of favorite quotes.",
      type: "featured",
      rating: 5.0
    }
  ];

  const slideLeft = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const slideRight = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // Calculate the actual index for the testimonials array (handles infinite loop)
  const getActualIndex = (index) => {
    return ((index % testimonials.length) + testimonials.length) % testimonials.length;
  };

  // Handle infinite loop reset
  useEffect(() => {
    const totalCards = testimonials.length * 3; // 3 sets of testimonials
    
    // Reset to middle set when reaching boundaries
    if (currentIndex >= testimonials.length * 2) {
      // When we reach the end of the second set, reset to the beginning of the second set
      setTimeout(() => {
        setCurrentIndex(testimonials.length);
      }, 500); // Wait for transition to complete
    } else if (currentIndex < 0) {
      // When we go before the first set, reset to the end of the second set
      setTimeout(() => {
        setCurrentIndex(testimonials.length * 2 - 1);
      }, 500); // Wait for transition to complete
    }
  }, [currentIndex, testimonials.length]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="relative w-4 h-4">
                <svg className="w-4 h-4 text-gray-300" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            );
          } else {
            return (
              <svg key={i} className="w-4 h-4 text-gray-300" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
            );
          }
        })}
      </div>
    );
  };

  return (
    <section id="testimonials" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Testimonials 
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playful Display', serif" }}>
            Don't take our word for it! <br /> 
            <span style={{ color: '#0B6623' }}>Hear it from our readers.</span>
          </h2>
        </div>

        {/* Testimonials Cards Row with Navigation */}
        <div className="mt-12">
          {/* Navigation Container - Top Right */}
          <div className="flex items-center justify-end gap-2 mb-6">
            {/* Left Arrow Button */}
            <button
              onClick={slideLeft}
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={slideRight}
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
              </div>

          {/* Testimonials Container with Fade Effects */}
          <div className="relative">
            {/* Left Fade Effect - Always visible for infinite loop */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            
            {/* Right Fade Effect - Always visible for infinite loop */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Testimonials Container */}
            <div 
              ref={scrollContainerRef}
              className="overflow-hidden"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (320 + 24)}px)`,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {/* Render multiple sets of testimonials for infinite loop effect */}
                {[...Array(3)].map((_, setIndex) => 
                  testimonials.map((testimonial, testimonialIndex) => {
                    const globalIndex = setIndex * testimonials.length + testimonialIndex;
                    return (
                      <div key={`${setIndex}-${testimonial.id}`} className="flex-shrink-0 mr-6">
                        {testimonial.type === 'featured' ? (
                          /* Featured Image Card */
                          <div className="relative bg-gray-200 rounded-2xl overflow-hidden w-80 h-96 group cursor-pointer transform transition-all duration-300 hover:scale-105">
                            <img 
                              src={testimonial.image} 
                  alt={testimonial.name}
                              className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm" 
                            />
                            
                            {/* Default Author Info Overlay */}
                            <div className="absolute bottom-4 left-4 text-white group-hover:opacity-0 transition-opacity duration-300">
                              <h4 className="font-bold text-lg" style={{ fontFamily: 'cursive' }}>
                                {testimonial.name}
                              </h4>
                              <p className="text-sm opacity-90">{testimonial.role}</p>
                              <p className="text-xs opacity-75 mt-1">{testimonial.handle}</p>
                            </div>

                            {/* Hover Testimonial Overlay */}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                              <div className="text-center">
                                <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'cursive' }}>
                                  {testimonial.name}
                                </h4>
                                <p className="text-sm opacity-90 mb-4">{testimonial.role}</p>
                                <p className="text-xs opacity-75 mb-4">{testimonial.handle}</p>
                                <blockquote className="text-sm leading-relaxed italic">
                                  "{testimonial.testimonial}"
                                </blockquote>
                                 {/* Rating Stars */}
                                 <div className="flex items-center justify-center gap-1 mt-4">
                                   {renderStars(testimonial.rating)}
                                   <span className="text-xs font-medium ml-2">{testimonial.rating}</span>
                                 </div>
                </div>
              </div>
            </div>
                        ) : (
                          /* Regular Testimonial Card */
                          <div className="bg-white rounded-2xl shadow-md p-6 w-80 border border-gray-100 hover:shadow-lg hover:border-[#0B6623]/20 transition-all duration-300 transform hover:scale-105">
                            {/* Profile Section */}
                            <div className="flex items-center space-x-3 mb-4">
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" 
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'cursive' }}>
                                  {testimonial.name}
                                </h4>
                                <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                <p className="text-xs text-gray-400">{testimonial.handle}</p>
                              </div>
        </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-600 text-base leading-relaxed mb-4">
                              "{testimonial.testimonial}"
                            </p>
                            
                             {/* Rating Stars */}
                             <div className="flex items-center gap-1">
                               {renderStars(testimonial.rating)}
                               <span className="text-sm text-gray-500 ml-2">{testimonial.rating}</span>
              </div>
              </div>
                        )}
              </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of readers building their own journeys with books.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
