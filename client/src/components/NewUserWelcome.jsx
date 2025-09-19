import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, BookOpen, Heart, Star, Users } from 'lucide-react';

const NewUserWelcome = () => {
  const { isNewUser, markUserAsSettled } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isNewUser) {
      // Show welcome message after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNewUser]);

  const handleClose = () => {
    setIsVisible(false);
    markUserAsSettled();
  };

  if (!isNewUser || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#0B6623] rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to LIT ISLE! 📚
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your literary journey begins here. Start exploring our vast collection of books and build your personal reading library.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-left">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-700">Add books to your favorites</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-700">Rate and review your reads</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700">Connect with fellow readers</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-[#0B6623] text-white py-3 rounded-xl font-medium hover:bg-[#0e7a2b] transition-colors"
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUserWelcome;
