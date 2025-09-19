import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ShelfContext = createContext();

export const useShelf = () => {
  const context = useContext(ShelfContext);
  if (!context) {
    throw new Error('useShelf must be used within a ShelfProvider');
  }
  return context;
};

export const ShelfProvider = ({ children }) => {
  const { isNewUser, markUserAsSettled } = useAuth();
  
  const [shelf, setShelf] = useState({
    currentlyReading: [
      {
        slug: "the-great-gatsby",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover: "/Books/covers/The-Great-Gatsby.jpg",
        progress: 78
      }
    ],
    nextUp: [
      {
        slug: "moby-dick",
        title: "Moby Dick: Castellano",
        author: "Helman Melville",
        cover: "/Books/covers/moby-dick.jpg"
      },
      {
        slug: "dracula",
        title: "Dracula",
        author: "Bram Stoker",
        cover: "/Books/covers/dracula.jpg"
      },
      {
        slug: "art-of-war",
        title: "Art of War",
        author: "Petros Triantafyllou",
        cover: "/Books/covers/Art-of-War.jpg"
      },
      {
        slug: "walden",
        title: "Walden; or, Life in the Woods",
        author: "Henry David Thoreau",
        cover: "/Books/covers/Walden.jpg"
      },
      {
        slug: "origin-of-species",
        title: "On the Origin of Species and Other Stories",
        author: "Bo-young Kim",
        cover: "/Books/covers/On-the-Origin-of-Species-and-Other-Stories.jpg"
      }
    ],
    finished: [
      {
        slug: "shakespeare-works-vol1",
        title: "The Complete Works of William Shakespeare, Volume 1 of 2",
        author: "William Shakespeare",
        cover: "/Books/covers/The-Complete-Works-of-William-Shakespeare,-Volume-1-of-2.jpg"
      },
      {
        slug: "alice-in-wonderland",
        title: "Alice's Adventures in Wonderland and Other Tales",
        author: "Lewis Carroll",
        cover: "/Books/covers/Alices-Adventures-in-Wonderland-and-Other-Tales.jpg"
      },
      {
        slug: "sherlock-holmes",
        title: "The Adventures of Sherlock Holmes",
        author: "Chris Sasaki",
        cover: "/Books/covers/The-Adventures-of-Sherlock-Holmes.jpg"
      },
      {
        slug: "thirty-nine-steps",
        title: "The Thirty-Nine Steps (Richard Hannay, #1)",
        author: "John Buchan",
        cover: "/Books/covers/The-Thirty-Nine-Steps-Richard-Hannay-1.jpg"
      },
      {
        slug: "mountains-of-madness",
        title: "At the Mountains of Madness",
        author: "H. P. Lovecraft",
        cover: "/Books/covers/At-the-Mountains-of-Madness.jpg"
      },
      {
        slug: "vindication-of-rights-of-woman",
        title: "A Vindication of the Rights of Woman",
        author: "Mary Wollstonecraft",
        cover: "/Books/covers/A-Vindication-of-the-Rights-of-Woman.jpg"
      }
    ],
    favorites: []
  });

  // Load shelf data from localStorage on mount
  useEffect(() => {
    // If it's a new user, start with fresh/empty shelves
    if (isNewUser) {
      const freshShelf = {
        currentlyReading: [],
        nextUp: [],
        finished: [],
        favorites: []
      };
      setShelf(freshShelf);
      // Mark user as settled after giving them fresh start
      setTimeout(() => {
        markUserAsSettled();
      }, 1000);
      return;
    }

    // For returning users, load their saved data
    const savedShelf = localStorage.getItem('lit-isle-shelf');
    if (savedShelf) {
      try {
        const parsed = JSON.parse(savedShelf);
        // Migrate legacy 'wishlist' -> 'favorites'
        if (parsed && parsed.wishlist && !parsed.favorites) {
          parsed.favorites = parsed.wishlist;
          delete parsed.wishlist;
        }
        // Ensure all expected shelves exist
        const ensured = {
          currentlyReading: parsed.currentlyReading || [],
          nextUp: parsed.nextUp || [],
          finished: parsed.finished || [],
          favorites: parsed.favorites || []
        };
        setShelf(ensured);
      } catch {
        // Fallback to defaults on parse error
      }
    }
  }, [isNewUser, markUserAsSettled]);

  // Save shelf data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lit-isle-shelf', JSON.stringify(shelf));
  }, [shelf]);

  const addToShelf = useCallback((book, shelfType) => {
    setShelf(prev => {
      const newShelf = { ...prev };

      // Ensure arrays exist
      if (!Array.isArray(newShelf.currentlyReading)) newShelf.currentlyReading = [];
      if (!Array.isArray(newShelf.nextUp)) newShelf.nextUp = [];
      if (!Array.isArray(newShelf.finished)) newShelf.finished = [];
      if (!Array.isArray(newShelf.favorites)) newShelf.favorites = [];

      const addUnique = (list, item) => {
        if (list.some(b => b.slug === item.slug)) return list;
        return [...list, { ...item, addedAt: Date.now() }];
      };

      if (shelfType === 'favorites') {
        // Do not touch reading shelves; allow coexistence
        newShelf.favorites = addUnique(newShelf.favorites, book);
        // log activity
        try {
          const token = authAPI.getToken();
          if (token) {
            fetch('http://localhost:4000/api/activity', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ action: 'favorites.add', metadata: { slug: book.slug, title: book.title } })
            }).catch(() => {});
          }
        } catch {}
        return newShelf;
      }

      if (shelfType === 'nextUp') {
        // Move into Next Up, remove duplicates from nextUp only.
        newShelf.nextUp = addUnique(newShelf.nextUp.filter(b => b.slug !== book.slug), book);
        // Keep favorites membership intact; do not remove from favorites.
        // Optionally remove from other reading shelves to avoid duplicates across reading queues
        newShelf.currentlyReading = newShelf.currentlyReading.filter(b => b.slug !== book.slug);
        newShelf.finished = newShelf.finished.filter(b => b.slug !== book.slug);
        return newShelf;
      }

      if (shelfType === 'currentlyReading') {
        newShelf.currentlyReading = addUnique(newShelf.currentlyReading.filter(b => b.slug !== book.slug), book);
        newShelf.nextUp = newShelf.nextUp.filter(b => b.slug !== book.slug);
        newShelf.finished = newShelf.finished.filter(b => b.slug !== book.slug);
        return newShelf;
      }

      if (shelfType === 'finished') {
        newShelf.finished = addUnique(newShelf.finished.filter(b => b.slug !== book.slug), book);
        newShelf.currentlyReading = newShelf.currentlyReading.filter(b => b.slug !== book.slug);
        newShelf.nextUp = newShelf.nextUp.filter(b => b.slug !== book.slug);
        return newShelf;
      }

      // Fallback: just add uniquely to the target shelf key if exists
      if (newShelf[shelfType]) {
        newShelf[shelfType] = addUnique(newShelf[shelfType].filter(b => b.slug !== book.slug), book);
      }
      return newShelf;
    });
  }, []);

  const removeFromShelf = useCallback((bookSlug, shelfType) => {
    setShelf(prev => ({
      ...prev,
      [shelfType]: prev[shelfType].filter(book => book.slug !== bookSlug)
    }));
    if (shelfType === 'favorites') {
      try {
        const token = authAPI.getToken();
        if (token) {
          fetch('http://localhost:4000/api/activity', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'favorites.remove', metadata: { slug: bookSlug } })
          }).catch(() => {});
        }
      } catch {}
    }
  }, []);

  const moveBook = useCallback((bookSlug, fromShelf, toShelf) => {
    setShelf(prev => {
      const book = prev[fromShelf].find(b => b.slug === bookSlug);
      if (!book) return prev;

      return {
        ...prev,
        [fromShelf]: prev[fromShelf].filter(b => b.slug !== bookSlug),
        [toShelf]: [...prev[toShelf], { ...book, movedAt: Date.now() }]
      };
    });
  }, []);

  const updateProgress = useCallback((bookSlug, progress) => {
    setShelf(prev => ({
      ...prev,
      currentlyReading: prev.currentlyReading.map(book => 
        book.slug === bookSlug ? { ...book, progress } : book
      )
    }));
  }, []);

  const isInShelf = useCallback((bookSlug, shelfType) => {
    const list = (shelf && shelf[shelfType]) || [];
    return list.some(book => book.slug === bookSlug);
  }, [shelf]);

  const getBookFromShelf = useCallback((bookSlug) => {
    for (const shelfType of Object.keys(shelf)) {
      const book = shelf[shelfType].find(b => b.slug === bookSlug);
      if (book) return { book, shelfType };
    }
    return null;
  }, [shelf]);

  const contextValue = useMemo(() => ({
    shelf,
    addToShelf,
    removeFromShelf,
    moveBook,
    updateProgress,
    isInShelf,
    getBookFromShelf
  }), [shelf, addToShelf, removeFromShelf, moveBook, updateProgress, isInShelf, getBookFromShelf]);

  return (
    <ShelfContext.Provider value={contextValue}>
      {children}
    </ShelfContext.Provider>
  );
};
