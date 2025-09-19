import { useState } from "react";
import { Link } from "react-router-dom";
import { X, User, Camera, Edit3, Star, BookOpen } from "lucide-react";

const ProfileCompletionModal = ({ isOpen, onClose, profileCompletion, missingFields }) => {
  if (!isOpen) return null;

  const getCompletionMessage = () => {
    if (profileCompletion < 25) return "Let's get started!";
    if (profileCompletion < 50) return "You're making progress!";
    if (profileCompletion < 75) return "Almost there!";
    if (profileCompletion < 100) return "Just a few more details!";
    return "Perfect! Your profile is complete!";
  };

  const getCompletionColor = () => {
    if (profileCompletion < 25) return "text-red-500";
    if (profileCompletion < 50) return "text-orange-500";
    if (profileCompletion < 75) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-sm text-gray-600 mt-1">{getCompletionMessage()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Section */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#004225"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - profileCompletion / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getCompletionColor()}`}>
                  {profileCompletion}%
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Profile Completion
            </h3>
            <p className="text-sm text-gray-600">
              Complete your profile to get the best experience on LIT ISLE
            </p>
          </div>

          {/* Missing Fields */}
          {profileCompletion < 100 && (
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900">Complete these to finish your profile:</h4>
              <div className="space-y-2">
                {missingFields.name && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Add your name</span>
                  </div>
                )}
                {missingFields.username && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Edit3 className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Choose a username</span>
                  </div>
                )}
                {missingFields.profileImage && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Camera className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Upload profile picture</span>
                  </div>
                )}
                {missingFields.coverImage && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Camera className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Add cover image</span>
                  </div>
                )}
                {missingFields.bio && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Edit3 className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Write a bio</span>
                  </div>
                )}
                {missingFields.dateOfBirth && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Add date of birth</span>
                  </div>
                )}
                {missingFields.genres && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Select favorite genres</span>
                  </div>
                )}
                {missingFields.favoriteBooks && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Star className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Add favorite books</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              to="/profile"
              className="flex-1 bg-[#004225] hover:bg-[#0a5c3f] text-white py-3 px-4 rounded-lg text-center font-medium transition-colors"
            >
              Complete Profile
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Why complete your profile?</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Get personalized book recommendations</li>
              <li>• Connect with readers who share your interests</li>
              <li>• Access exclusive features and content</li>
              <li>• Build your reading community</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
