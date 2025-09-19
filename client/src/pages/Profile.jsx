import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  Camera,
  BookOpen,
  Plus,
  X,
  Lock,
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
  Heart,
  Star,
  Settings,
  Upload,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ExternalLink,
  Menu,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useShelf } from "../contexts/ShelfContext";
import { Calendar } from "../components/ui/calendar";
import { Button } from "../components/ui/button";

// Extracted to avoid remounting on each parent render which can cause input focus loss
const ProfileCard = memo(
  ({
    title,
    children,
    className = "",
    isCollapsible = false,
    isExpanded = true,
    onToggle,
  }) => (
    <div
      className={`bg-white rounded-2xl shadow-md border border-gray-100 ${className}`}
    >
      <div
        className={`p-4 ${isCollapsible ? "cursor-pointer" : ""}`}
        onClick={isCollapsible ? onToggle : undefined}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-lg font-medium text-gray-900"
            style={{ color: "#004225" }}
          >
            {title}
          </h3>
          {isCollapsible && (
            <div className="p-1">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          )}
        </div>
      </div>
      {isExpanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
);

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { shelf, removeFromShelf } = useShelf();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    about: false,
    genres: false,
    favorites: false,
    social: false,
    stats: false,
  });

  // User profile data - starts empty and gets populated from server
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    username: "",
    email: user?.email || "",
    countryCode: "+91",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    about: "",
    coverImage: null,
    profileImage: user?.avatar || null,
    socialMedia: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
    },
  });

  const [userGenres, setUserGenres] = useState([]);
  // favorites are managed via ShelfContext
  const [isLoading, setIsLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const coverFileInputRef = useRef(null);
  const [activities, setActivities] = useState([]);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);

  const availableGenres = [
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Romance",
    "Thriller",
    "Horror",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Health",
    "Travel",
    "Cooking",
    "Art",
    "Drama",
    "Comedy",
    "Adventure",
    "Crime",
    "Philosophy",
    "Religion",
    "Education",
    "Technology",
    "Nature",
    "Sports",
    "Music",
    "Photography",
  ];

  // Social media validation functions
  const validateSocialMedia = (platform, value) => {
    if (!value) return true; // Empty is valid

    switch (platform) {
      case "instagram":
        return /^[a-zA-Z0-9._]+$/.test(value) && value.length <= 30;
      case "facebook":
        return /^[a-zA-Z0-9.]+$/.test(value) && value.length <= 50;
      case "twitter":
        return /^[a-zA-Z0-9_]+$/.test(value) && value.length <= 15;
      case "linkedin":
        return /^[a-zA-Z0-9-]+$/.test(value) && value.length <= 100;
      default:
        return true;
    }
  };

  const formatSocialMediaUrl = (platform, username) => {
    if (!username) return "";

    switch (platform) {
      case "instagram":
        return `https://instagram.com/${username}`;
      case "facebook":
        return `https://facebook.com/${username}`;
      case "twitter":
        return `https://twitter.com/${username}`;
      case "linkedin":
        return `https://linkedin.com/in/${username}`;
      default:
        return "";
    }
  };

  const handleAddGenre = (genre) => {
    if (!userGenres.includes(genre) && userGenres.length < 8) {
      setUserGenres([...userGenres, genre]);
    }
  };

  const handleRemoveGenre = (genre) => {
    setUserGenres(userGenres.filter((g) => g !== genre));
  };

  // Handle phone number input - only allow digits and limit to 10
  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "");
    const tenDigits = value.slice(0, 10);
    setProfileData((prev) => ({ ...prev, phone: tenDigits }));
  }, []);

  // Stable input handlers to prevent focus loss
  const handleInputChange = useCallback((field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Calendar handlers
  const handleDateSelect = useCallback((date) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      setProfileData((prev) => ({ ...prev, dateOfBirth: formattedDate }));
      setShowCalendar(false);
    }
  }, []);

  const toggleCalendar = useCallback(() => {
    setShowCalendar((prev) => !prev);
  }, []);

  const formatDisplayDate = useCallback((dateString) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  }, []);

  // favorites managed in My Shelf

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "lit_isle_profile"); // Must exist in Cloudinary
      data.append("cloud_name", "dgqtsaags"); // Your cloud name

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgqtsaags/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const errText = await res.text(); // Log Cloudinary error response
        console.error("Cloudinary error response:", errText);
        throw new Error(errText || `Upload failed with ${res.status}`);
      }

      const result = await res.json();
      return result.secure_url; // Use this URL for your DB/profile
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setIsLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProfileData((prev) => ({ ...prev, profileImage: url }));
      await updateProfile({ profileImage: url });
      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Profile image upload error:", error);
      alert("Profile image upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove profile image
  const handleRemoveProfileImage = async () => {
    setIsLoading(true);
    try {
      setProfileData((prev) => ({ ...prev, profileImage: null }));
      await updateProfile({ profileImage: null });
    } catch (error) {
      console.error("Remove profile image error:", error);
      alert("Failed to remove profile image.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setIsLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProfileData((prev) => ({ ...prev, coverImage: url }));
      await updateProfile({ coverImage: url });
      alert("Cover image uploaded successfully!");
    } catch (error) {
      console.error("Cover image upload error:", error);
      alert("Cover image upload failed. Please try again.");
    } finally {
      setIsLoading(false);
      setShowCoverPicker(false);
    }
  };

  // Handle selecting a preset cover from public/cover-img
  const handleSelectPresetCover = async (src) => {
    setIsLoading(true);
    try {
      setProfileData((prev) => ({ ...prev, coverImage: src }));
      await updateProfile({ coverImage: src });
      alert("Cover image updated!");
    } catch (error) {
      console.error("Set preset cover error:", error);
      alert("Failed to set cover image.");
    } finally {
      setIsLoading(false);
      setShowCoverPicker(false);
    }
  };

  // Remove cover image
  const handleRemoveCoverImage = async () => {
    setIsLoading(true);
    try {
      setProfileData((prev) => ({ ...prev, coverImage: null }));
      await updateProfile({ coverImage: null });
    } catch (error) {
      console.error("Remove cover image error:", error);
      alert("Failed to remove cover image.");
    } finally {
      setIsLoading(false);
      setShowCoverPicker(false);
    }
  };

  // Server API functions
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No auth token found");
        return;
      }

      const response = await fetch("http://localhost:4000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format - not JSON");
      }

      const data = await response.json();
      console.log("Profile API Response:", data); // Debug log

      if (data.success && data.profile) {
        setProfileData({
          name: data.profile.name || "",
          username: (data.profile.username || "")
            .toLowerCase()
            .replace(/\s+/g, ""),
          email: data.profile.email || "",
          countryCode: data.profile.countryCode || "+91",
          phone: data.profile.phone || "",
          dateOfBirth: data.profile.dateOfBirth || "",
          gender: data.profile.gender || "",
          bio: data.profile.bio || "",
          about: data.profile.about || "",
          coverImage: data.profile.coverImage || null,
          profileImage:
            data.profile.profileImage || data.profile.avatar || null,
          socialMedia: data.profile.socialMedia || {
            instagram: "",
            facebook: "",
            twitter: "",
            linkedin: "",
          },
        });
        setUserGenres(data.genres || []);
        setProfileCompletion(data.profileCompletion || 0);
      } else {
        throw new Error("Invalid response format - missing profile data");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // Set fallback data instead of leaving undefined
      setProfileData((prev) => ({
        ...prev,
        name: user?.name || "User",
        email: user?.email || "",
      }));
    }
  };

  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch("http://localhost:4000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format - not JSON");
      }

      const data = await response.json();

      if (data.success) {
        setProfileCompletion(data.profileCompletion);
        return data;
      } else {
        throw new Error(
          JSON.stringify({
            message: data.message,
            field: data.field,
            remainingDays: data.remainingDays,
          })
        );
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      try {
        const { message, field, remainingDays } = JSON.parse(error.message);
        if (field === "username") {
          if (typeof remainingDays === "number") {
            alert(
              `You have reached the username change limit. Please wait ${remainingDays} day(s) before trying again.`
            );
          } else {
            alert("Username is already taken. Please choose another.");
          }
        } else if (field === "phone") {
          alert("Phone number is already in use.");
        } else if (message) {
          alert(message);
        } else {
          alert("Failed to update profile");
        }
      } catch {
        alert("Failed to update profile");
      }
      throw error;
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...profileData,
        genres: userGenres,
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 9; // Total fields to track

    if (profileData?.name) completed++;
    if (profileData?.username) completed++;
    if (profileData?.profileImage) completed++;
    if (profileData?.coverImage) completed++;
    if (profileData?.bio) completed++;
    if (profileData?.dateOfBirth) completed++;
    if (userGenres && userGenres.length > 0) completed++;
    if (shelf?.favorites && shelf.favorites.length > 0) completed++;
    if (
      profileData?.socialMedia &&
      Object.values(profileData.socialMedia).some(
        (value) => value.trim() !== ""
      )
    )
      completed++;

    return Math.round((completed / total) * 100);
  };

  // Load profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  // Initialize selected date when profile data changes
  useEffect(() => {
    if (profileData.dateOfBirth) {
      setSelectedDate(new Date(profileData.dateOfBirth));
    }
  }, [profileData.dateOfBirth]);

  // Handle click outside calendar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // Update completion percentage when data changes (debounced to prevent input focus loss)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProfileCompletion(calculateProfileCompletion());
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeoutId);
  }, [profileData, userGenres, shelf]);

  // Activity: fetch when Activity tab is opened
  useEffect(() => {
    const fetchActivity = async () => {
      setIsActivityLoading(true);
      setActivityError(null);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:4000/api/activity/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setActivities(data.activities || []);
        } else {
          throw new Error(data.message || "Failed to load activity");
        }
      } catch (e) {
        setActivityError("Failed to load activity");
      } finally {
        setIsActivityLoading(false);
      }
    };

    if (activeTab === "activity" && isAuthenticated) {
      fetchActivity();
    }
  }, [activeTab, isAuthenticated]);

  const formatActivity = useCallback((a) => {
    const action = a.action || "";
    const meta = a.metadata || {};
    if (action === "auth.login") return "Logged in";
    if (action === "profile.update") {
      const fields = Array.isArray(meta.changedFields)
        ? meta.changedFields.filter(Boolean)
        : [];
      return fields.length
        ? `Updated profile: ${fields.join(", ")}`
        : "Updated profile";
    }
    if (action === "shelf.add")
      return `Added a book to ${meta.shelfType || "shelf"}`;
    if (action === "shelf.remove") return "Removed a book from shelf";
    if (action === "reading.progress")
      return `Updated reading progress to ${meta.progress ?? ""}%`;
    return action;
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="h-16" />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Profile
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to view and edit your profile, manage your reading
              preferences, and connect with other book lovers.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 rounded-lg border border-gray-300 hover:border-[#004225] hover:text-[#004225] transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-lg bg-[#004225] text-white hover:bg-[#0a5c3f] transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-16" />

      {/* Mobile Cover Section */}
      <div className="lg:hidden relative">
        <div className="h-48 bg-gradient-to-r from-[#004225] to-[#0B6B4D] relative overflow-visible">
          {profileData.coverImage && (
            <img
              src={profileData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          {profileData.coverImage && (
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          )}
          <button
            type="button"
            onClick={() => setShowCoverPicker(true)}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-[#004225] p-2 rounded-full transition-all shadow"
            title="Change cover image"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Profile Image */}
        <div className="absolute -bottom-12 left-4 z-10">
          <div className="relative">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg bg-gray-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 bg-[#004225] text-white p-1.5 rounded-full hover:bg-[#0a5c3f] transition-colors cursor-pointer">
              <Camera className="w-3 h-3" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            {profileData.profileImage && (
              <button
                type="button"
                onClick={handleRemoveProfileImage}
                className="absolute -top-1 -right-1 bg-white text-gray-700 p-1 rounded-full shadow hover:bg-gray-100"
                title="Remove profile image"
                disabled={isLoading}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Cover Section */}
      <div className="hidden lg:block relative">
        <div className="h-64 bg-gradient-to-r from-[#004225] to-[#0B6B4D] relative overflow-visible">
          {profileData.coverImage && (
            <img
              src={profileData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          {profileData.coverImage && (
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          )}
          <button
            type="button"
            onClick={() => setShowCoverPicker(true)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#004225] p-2 rounded-full transition-all shadow"
            title="Change cover image"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Profile Image */}
        <div className="absolute -bottom-16 left-8 z-10">
          <div className="relative">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-gray-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 bg-[#004225] text-white p-2 rounded-full hover:bg-[#0a5c3f] transition-colors cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            {profileData.profileImage && (
              <button
                type="button"
                onClick={handleRemoveProfileImage}
                className="absolute -top-2 -right-2 bg-white text-gray-700 p-1 rounded-full shadow hover:bg-gray-100"
                title="Remove profile image"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-16 lg:pt-20 pb-10">
        {/* Cover Picker Modal */}
        {showCoverPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowCoverPicker(false)}
            ></div>
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Add a cover image</h3>
                <button
                  onClick={() => setShowCoverPicker(false)}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div
                className="p-4 lg:p-6 overflow-y-auto"
                style={{ maxHeight: "calc(90vh - 64px)" }}
              >
                <div className="mb-6">
                  <h4 className="text-base font-medium mb-1">Upload a photo</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Showcase your personality, interests, work, or team moments
                  </p>
                  <button
                    onClick={() => coverFileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-[#004225] hover:text-[#004225] transition-colors"
                    disabled={isLoading}
                  >
                    <Upload className="w-4 h-4" /> Upload photo
                  </button>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <h4 className="text-base font-medium mb-1">
                    Choose an image
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Powered by{" "}
                    <a
                      href="https://www.lummi.ai/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#004225] underline"
                    >
                      Lummi.ai
                    </a>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const idx = i + 1;
                      const src = `/cover-img/cover${idx}.jpeg`;
                      return (
                        <button
                          key={src}
                          onClick={() => handleSelectPresetCover(src)}
                          className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-[#004225]"
                        >
                          <img
                            src={src}
                            alt={`Cover ${idx}`}
                            className="w-full h-20 lg:h-28 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex justify-between">
                {profileData.coverImage && (
                  <button
                    onClick={handleRemoveCoverImage}
                    className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                    disabled={isLoading}
                  >
                    Remove cover image
                  </button>
                )}
                <button
                  onClick={() => setShowCoverPicker(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Profile Header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {profileData?.name || "Your Name"}
              </h1>
              <p className="text-gray-600 text-sm">
                @{profileData?.username || "username"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {profileData?.bio || "Tell us about yourself..."}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              {isEditing ? (
                <>
                  <button
                    onClick={saveProfile}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm"
                  >
                    <Upload className="w-3 h-3" />
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#004225] hover:bg-[#0a5c3f] text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <Link
                    to="/shelf"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm"
                  >
                    <BookOpen className="w-3 h-3" />
                    Shelf
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Profile Completion Progress */}
          {profileCompletion < 100 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Profile Completion</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#004225] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "text-[#004225] border-[#004225]"
                  : "text-gray-500 border-transparent"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "activity"
                  ? "text-[#004225] border-[#004225]"
                  : "text-gray-500 border-transparent"
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Desktop Profile Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData?.name || "Your Name"}
              </h1>
              <p className="text-gray-600 mt-1">
                @{profileData?.username || "username"}
              </p>
              <p className="text-gray-500 mt-2 max-w-2xl">
                {profileData?.bio || "Tell us about yourself..."}
              </p>

              {/* Profile Completion Progress */}
              {profileCompletion < 100 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Profile Completion</span>
                    <span>{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#004225] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-6">
              {isEditing ? (
                <>
                  <button
                    onClick={saveProfile}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#004225] hover:bg-[#0a5c3f] text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <Link
                    to="/shelf"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    My Shelf
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="flex space-x-8 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "text-[#004225] border-[#004225]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "activity"
                  ? "text-[#004225] border-[#004225]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {activeTab === "profile" && (
          <div className="space-y-4 lg:space-y-6">
            {/* Mobile: Collapsible sections */}
            <div className="lg:hidden space-y-4">
              {/* Basic Info */}
              <ProfileCard
                title="Basic Information"
                isCollapsible={true}
                isExpanded={expandedSections.basicInfo}
                onToggle={() => toggleSection("basicInfo")}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) =>
                            handleInputChange(
                              "username",
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]/g, "")
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Only lowercase letters and numbers. Example: @john123
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-900">@{profileData.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <Lock className="w-3 h-3" />
                      Phone
                    </label>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <select
                          value={profileData.countryCode}
                          onChange={(e) =>
                            handleInputChange("countryCode", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225] bg-white"
                        >
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (AU)</option>
                          <option value="+81">+81 (JP)</option>
                          <option value="+91">+91 (IN)</option>
                        </select>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={handlePhoneChange}
                          placeholder="10-digit number"
                          maxLength={10}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-900">
                        {profileData.phone && profileData.countryCode
                          ? `${profileData.countryCode} ${profileData.phone}`
                          : "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <Lock className="w-3 h-3" />
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <div className="relative" ref={calendarRef}>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={toggleCalendar}
                          className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {profileData.dateOfBirth
                            ? formatDisplayDate(profileData.dateOfBirth)
                            : "Select date"}
                        </Button>
                        {showCalendar && (
                          <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                            <Calendar
                              mode="single"
                              selected={
                                selectedDate ||
                                (profileData.dateOfBirth
                                  ? new Date(profileData.dateOfBirth)
                                  : undefined)
                              }
                              onSelect={handleDateSelect}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900">
                        {formatDisplayDate(profileData.dateOfBirth)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profileData.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        maxLength={300}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.bio}</p>
                    )}
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        {profileData.bio.length}/300 characters
                      </p>
                    )}
                  </div>
                </div>
              </ProfileCard>

              {/* About Section */}
              <ProfileCard
                title="About"
                isCollapsible={true}
                isExpanded={expandedSections.about}
                onToggle={() => toggleSection("about")}
              >
                {isEditing ? (
                  <textarea
                    value={profileData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    maxLength={1000}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                    placeholder="Share more about yourself, your reading journey, or what you're looking for in the community..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profileData.about}
                  </p>
                )}
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-2">
                    {profileData.about.length}/1000 characters
                  </p>
                )}
              </ProfileCard>

              {/* Genres Section */}
              <ProfileCard
                title="Favorite Genres"
                isCollapsible={true}
                isExpanded={expandedSections.genres}
                onToggle={() => toggleSection("genres")}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {userGenres && userGenres.length > 0 ? (
                      userGenres.map((genre) => (
                        <span
                          key={genre}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                        >
                          {genre}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveGenre(genre)}
                              className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No genres selected
                      </p>
                    )}
                  </div>

                  {isEditing && userGenres.length < 8 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Add more genres:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {availableGenres
                          .filter((genre) => !userGenres.includes(genre))
                          .slice(0, 6)
                          .map((genre) => (
                            <button
                              key={genre}
                              onClick={() => handleAddGenre(genre)}
                              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              + {genre}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </ProfileCard>

              {/* Favorite Books */}
              <ProfileCard
                title="Favorite Books"
                isCollapsible={true}
                isExpanded={expandedSections.favorites}
                onToggle={() => toggleSection("favorites")}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {shelf?.favorites && shelf.favorites.length > 0 ? (
                      shelf.favorites.map((book) => (
                        <div
                          key={book.slug}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                        >
                          {book.cover && (
                            <img
                              src={book.cover}
                              alt={book.title || "Book cover"}
                              className="w-12 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {book.title || "Untitled"}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {book.author || "Unknown Author"}
                            </p>
                            {book.rating && (
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < book.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              className="p-1 hover:bg-gray-200 rounded"
                              onClick={() =>
                                removeFromShelf(book.slug, "favorites")
                              }
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No favorite books added yet
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <Link
                      to="/shelf"
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#004225] hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                      Manage Favorites in My Shelf
                    </Link>
                  )}
                </div>
              </ProfileCard>

              {/* Social Media Links */}
              <ProfileCard
                title="Social Media"
                isCollapsible={true}
                isExpanded={expandedSections.social}
                onToggle={() => toggleSection("social")}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Instagram */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Instagram className="w-3 h-3" />
                        Instagram
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={profileData.socialMedia.instagram}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z0-9._]/g,
                                ""
                              );
                              setProfileData((prev) => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  instagram: value,
                                },
                              }));
                            }}
                            placeholder="username"
                            maxLength={30}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                              profileData.socialMedia.instagram &&
                              !validateSocialMedia(
                                "instagram",
                                profileData.socialMedia.instagram
                              )
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-300 focus:border-[#004225]"
                            }`}
                          />
                          {profileData.socialMedia.instagram &&
                            !validateSocialMedia(
                              "instagram",
                              profileData.socialMedia.instagram
                            ) && (
                              <p className="text-xs text-red-500 mt-1">
                                Invalid Instagram username
                              </p>
                            )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {profileData.socialMedia.instagram ? (
                            <a
                              href={formatSocialMediaUrl(
                                "instagram",
                                profileData.socialMedia.instagram
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#004225] hover:underline flex items-center gap-1"
                            >
                              @{profileData.socialMedia.instagram}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Not provided
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Facebook className="w-3 h-3" />
                        Facebook
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={profileData.socialMedia.facebook}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z0-9.]/g,
                                ""
                              );
                              setProfileData((prev) => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  facebook: value,
                                },
                              }));
                            }}
                            placeholder="username"
                            maxLength={50}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                              profileData.socialMedia.facebook &&
                              !validateSocialMedia(
                                "facebook",
                                profileData.socialMedia.facebook
                              )
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-300 focus:border-[#004225]"
                            }`}
                          />
                          {profileData.socialMedia.facebook &&
                            !validateSocialMedia(
                              "facebook",
                              profileData.socialMedia.facebook
                            ) && (
                              <p className="text-xs text-red-500 mt-1">
                                Invalid Facebook username
                              </p>
                            )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {profileData.socialMedia.facebook ? (
                            <a
                              href={formatSocialMediaUrl(
                                "facebook",
                                profileData.socialMedia.facebook
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#004225] hover:underline flex items-center gap-1"
                            >
                              @{profileData.socialMedia.facebook}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Not provided
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Twitter/X */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Twitter className="w-3 h-3" />X (Twitter)
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={profileData.socialMedia.twitter}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z0-9_]/g,
                                ""
                              );
                              setProfileData((prev) => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  twitter: value,
                                },
                              }));
                            }}
                            placeholder="username"
                            maxLength={15}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                              profileData.socialMedia.twitter &&
                              !validateSocialMedia(
                                "twitter",
                                profileData.socialMedia.twitter
                              )
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-300 focus:border-[#004225]"
                            }`}
                          />
                          {profileData.socialMedia.twitter &&
                            !validateSocialMedia(
                              "twitter",
                              profileData.socialMedia.twitter
                            ) && (
                              <p className="text-xs text-red-500 mt-1">
                                Invalid Twitter username
                              </p>
                            )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {profileData.socialMedia.twitter ? (
                            <a
                              href={formatSocialMediaUrl(
                                "twitter",
                                profileData.socialMedia.twitter
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#004225] hover:underline flex items-center gap-1"
                            >
                              @{profileData.socialMedia.twitter}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Not provided
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Linkedin className="w-3 h-3" />
                        LinkedIn
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={profileData.socialMedia.linkedin}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z0-9-]/g,
                                ""
                              );
                              setProfileData((prev) => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  linkedin: value,
                                },
                              }));
                            }}
                            placeholder="username"
                            maxLength={100}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                              profileData.socialMedia.linkedin &&
                              !validateSocialMedia(
                                "linkedin",
                                profileData.socialMedia.linkedin
                              )
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-300 focus:border-[#004225]"
                            }`}
                          />
                          {profileData.socialMedia.linkedin &&
                            !validateSocialMedia(
                              "linkedin",
                              profileData.socialMedia.linkedin
                            ) && (
                              <p className="text-xs text-red-500 mt-1">
                                Invalid LinkedIn username
                              </p>
                            )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {profileData.socialMedia.linkedin ? (
                            <a
                              href={formatSocialMediaUrl(
                                "linkedin",
                                profileData.socialMedia.linkedin
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#004225] hover:underline flex items-center gap-1"
                            >
                              @{profileData.socialMedia.linkedin}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Not provided
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ProfileCard>

              {/* Reading Stats */}
              <ProfileCard
                title="Reading Stats"
                isCollapsible={true}
                isExpanded={expandedSections.stats}
                onToggle={() => toggleSection("stats")}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Books Read</span>
                    <span className="font-semibold text-[#004225]">
                      {shelf?.finished?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Currently Reading
                    </span>
                    <span className="font-semibold text-[#004225]">
                      {shelf?.currentlyReading?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Want to Read</span>
                    <span className="font-semibold text-[#004225]">
                      {shelf?.nextUp?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Favorites</span>
                    <span className="font-semibold text-[#004225]">
                      {shelf?.favorites?.length || 0}
                    </span>
                  </div>
                </div>
              </ProfileCard>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <ProfileCard title="Basic Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) =>
                              handleInputChange(
                                "username",
                                e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]/g, "")
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Only lowercase letters and numbers. Example:
                            @john123
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-900">@{profileData.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <Lock className="w-3 h-3" />
                        Phone
                      </label>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <select
                            value={profileData.countryCode}
                            onChange={(e) =>
                              handleInputChange("countryCode", e.target.value)
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225] bg-white"
                          >
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+61">+61 (AU)</option>
                            <option value="+81">+81 (JP)</option>
                            <option value="+91">+91 (IN)</option>
                          </select>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={handlePhoneChange}
                            placeholder="10-digit number"
                            maxLength={10}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                          />
                        </div>
                      ) : (
                        <p className="text-gray-900">
                          {profileData.phone && profileData.countryCode
                            ? `${profileData.countryCode} ${profileData.phone}`
                            : "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <Lock className="w-3 h-3" />
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <div className="relative" ref={calendarRef}>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={toggleCalendar}
                            className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {profileData.dateOfBirth
                              ? formatDisplayDate(profileData.dateOfBirth)
                              : "Select date"}
                          </Button>
                          {showCalendar && (
                            <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                              <Calendar
                                mode="single"
                                selected={
                                  selectedDate ||
                                  (profileData.dateOfBirth
                                    ? new Date(profileData.dateOfBirth)
                                    : undefined)
                                }
                                onSelect={handleDateSelect}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-900">
                          {formatDisplayDate(profileData.dateOfBirth)}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          value={profileData.gender}
                          onChange={(e) =>
                            handleInputChange("gender", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profileData.gender}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        maxLength={300}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.bio}</p>
                    )}
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        {profileData.bio.length}/300 characters
                      </p>
                    )}
                  </div>
                </ProfileCard>

                {/* About Section */}
                <ProfileCard title="About">
                  {isEditing ? (
                    <textarea
                      value={profileData.about}
                      onChange={(e) =>
                        handleInputChange("about", e.target.value)
                      }
                      maxLength={1000}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 focus:border-[#004225]"
                      placeholder="Share more about yourself, your reading journey, or what you're looking for in the community..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {profileData.about}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-2">
                      {profileData.about.length}/1000 characters
                    </p>
                  )}
                </ProfileCard>

                {/* Favorite Books */}
                <ProfileCard title="Favorite Books">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {shelf?.favorites && shelf.favorites.length > 0 ? (
                        shelf.favorites.map((book) => (
                          <div
                            key={book.slug}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                          >
                            {book.cover && (
                              <img
                                src={book.cover}
                                alt={book.title || "Book cover"}
                                className="w-12 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {book.title || "Untitled"}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {book.author || "Unknown Author"}
                              </p>
                              {book.rating && (
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < book.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            {isEditing && (
                              <button
                                className="p-1 hover:bg-gray-200 rounded"
                                onClick={() =>
                                  removeFromShelf(book.slug, "favorites")
                                }
                              >
                                <X className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No favorite books added yet
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <Link
                        to="/shelf"
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#004225] hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                        Manage Favorites in My Shelf
                      </Link>
                    )}
                  </div>
                </ProfileCard>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Genres Section */}
                <ProfileCard title="Favorite Genres">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {userGenres && userGenres.length > 0 ? (
                        userGenres.map((genre) => (
                          <span
                            key={genre}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                          >
                            {genre}
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveGenre(genre)}
                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No genres selected
                        </p>
                      )}
                    </div>

                    {isEditing && userGenres.length < 8 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Add more genres:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {availableGenres
                            .filter((genre) => !userGenres.includes(genre))
                            .slice(0, 6)
                            .map((genre) => (
                              <button
                                key={genre}
                                onClick={() => handleAddGenre(genre)}
                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                              >
                                + {genre}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ProfileCard>
                {/* Reading Stats */}
                <ProfileCard title="Reading Stats">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Books Read</span>
                      <span className="font-semibold text-[#004225]">
                        {shelf?.finished?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Currently Reading
                      </span>
                      <span className="font-semibold text-[#004225]">
                        {shelf?.currentlyReading?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Want to Read
                      </span>
                      <span className="font-semibold text-[#004225]">
                        {shelf?.nextUp?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Favorites</span>
                      <span className="font-semibold text-[#004225]">
                        {shelf?.favorites?.length || 0}
                      </span>
                    </div>
                  </div>
                </ProfileCard>

                {/* Social Media Links */}
                <ProfileCard title="Social Media">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {/* Instagram */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={profileData.socialMedia.instagram}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9._]/g,
                                  ""
                                );
                                setProfileData((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...prev.socialMedia,
                                    instagram: value,
                                  },
                                }));
                              }}
                              placeholder="username"
                              maxLength={30}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                                profileData.socialMedia.instagram &&
                                !validateSocialMedia(
                                  "instagram",
                                  profileData.socialMedia.instagram
                                )
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-300 focus:border-[#004225]"
                              }`}
                            />
                            {profileData.socialMedia.instagram &&
                              !validateSocialMedia(
                                "instagram",
                                profileData.socialMedia.instagram
                              ) && (
                                <p className="text-xs text-red-500 mt-1">
                                  Invalid Instagram username
                                </p>
                              )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {profileData.socialMedia.instagram ? (
                              <a
                                href={formatSocialMediaUrl(
                                  "instagram",
                                  profileData.socialMedia.instagram
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#004225] hover:underline flex items-center gap-1"
                              >
                                @{profileData.socialMedia.instagram}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-gray-500 text-sm">
                                Not provided
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Facebook */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={profileData.socialMedia.facebook}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9.]/g,
                                  ""
                                );
                                setProfileData((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...prev.socialMedia,
                                    facebook: value,
                                  },
                                }));
                              }}
                              placeholder="username"
                              maxLength={50}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                                profileData.socialMedia.facebook &&
                                !validateSocialMedia(
                                  "facebook",
                                  profileData.socialMedia.facebook
                                )
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-300 focus:border-[#004225]"
                              }`}
                            />
                            {profileData.socialMedia.facebook &&
                              !validateSocialMedia(
                                "facebook",
                                profileData.socialMedia.facebook
                              ) && (
                                <p className="text-xs text-red-500 mt-1">
                                  Invalid Facebook username
                                </p>
                              )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {profileData.socialMedia.facebook ? (
                              <a
                                href={formatSocialMediaUrl(
                                  "facebook",
                                  profileData.socialMedia.facebook
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#004225] hover:underline flex items-center gap-1"
                              >
                                @{profileData.socialMedia.facebook}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-gray-500 text-sm">
                                Not provided
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Twitter/X */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <Twitter className="w-4 h-4" />X (Twitter)
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={profileData.socialMedia.twitter}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9_]/g,
                                  ""
                                );
                                setProfileData((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...prev.socialMedia,
                                    twitter: value,
                                  },
                                }));
                              }}
                              placeholder="username"
                              maxLength={15}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                                profileData.socialMedia.twitter &&
                                !validateSocialMedia(
                                  "twitter",
                                  profileData.socialMedia.twitter
                                )
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-300 focus:border-[#004225]"
                              }`}
                            />
                            {profileData.socialMedia.twitter &&
                              !validateSocialMedia(
                                "twitter",
                                profileData.socialMedia.twitter
                              ) && (
                                <p className="text-xs text-red-500 mt-1">
                                  Invalid Twitter username
                                </p>
                              )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {profileData.socialMedia.twitter ? (
                              <a
                                href={formatSocialMediaUrl(
                                  "twitter",
                                  profileData.socialMedia.twitter
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#004225] hover:underline flex items-center gap-1"
                              >
                                @{profileData.socialMedia.twitter}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-gray-500 text-sm">
                                Not provided
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={profileData.socialMedia.linkedin}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^a-zA-Z0-9-]/g,
                                  ""
                                );
                                setProfileData((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...prev.socialMedia,
                                    linkedin: value,
                                  },
                                }));
                              }}
                              placeholder="username"
                              maxLength={100}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004225]/20 ${
                                profileData.socialMedia.linkedin &&
                                !validateSocialMedia(
                                  "linkedin",
                                  profileData.socialMedia.linkedin
                                )
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-300 focus:border-[#004225]"
                              }`}
                            />
                            {profileData.socialMedia.linkedin &&
                              !validateSocialMedia(
                                "linkedin",
                                profileData.socialMedia.linkedin
                              ) && (
                                <p className="text-xs text-red-500 mt-1">
                                  Invalid LinkedIn username
                                </p>
                              )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {profileData.socialMedia.linkedin ? (
                              <a
                                href={formatSocialMediaUrl(
                                  "linkedin",
                                  profileData.socialMedia.linkedin
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#004225] hover:underline flex items-center gap-1"
                              >
                                @{profileData.socialMedia.linkedin}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-gray-500 text-sm">
                                Not provided
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ProfileCard>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            <ProfileCard title="Recent Activity">
              {isActivityLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading activity...
                </div>
              ) : activityError ? (
                <div className="text-center py-8 text-red-500">
                  {activityError}
                </div>
              ) : activities && activities.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {activities.map((a) => (
                    <li key={a._id} className="py-3 flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#004225]" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {formatActivity(a)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity to show</p>
                  <p className="text-sm">
                    Your reading activity and profile updates will appear here
                  </p>
                </div>
              )}
            </ProfileCard>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
