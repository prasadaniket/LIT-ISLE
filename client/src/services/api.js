const API_BASE_URL = 'http://localhost:4000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Get user profile
  getProfile: async () => {
    return await apiRequest('/user/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Logout user
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current token
  getToken: () => {
    return getAuthToken();
  }
};

// Books API functions
export const booksAPI = {
  // Get all books
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    return await apiRequest(endpoint);
  },

  // Get book by ID
  getById: async (id) => {
    return await apiRequest(`/books/${id}`);
  },

  // Create book (requires authentication)
  create: async (bookData) => {
    return await apiRequest('/books/create', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  },

  // Update book (requires authentication)
  update: async (id, bookData) => {
    return await apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },

  // Delete book (requires authentication)
  delete: async (id) => {
    return await apiRequest(`/books/${id}`, {
      method: 'DELETE',
    });
  }
};

// Shelf API functions
export const shelfAPI = {
  // Add book to shelf
  addToShelf: async (bookId, shelfType) => {
    return await apiRequest('/shelf/add', {
      method: 'POST',
      body: JSON.stringify({ bookId, shelfType }),
    });
  },

  // Remove book from shelf
  removeFromShelf: async (bookId) => {
    return await apiRequest(`/shelf/remove/${bookId}`, {
      method: 'DELETE',
    });
  },

  // Get user shelf
  getUserShelf: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/shelf?${queryString}` : '/shelf';
    return await apiRequest(endpoint);
  },

  // Update reading progress
  updateProgress: async (bookId, progressData) => {
    return await apiRequest('/shelf/progress', {
      method: 'PUT',
      body: JSON.stringify({ bookId, ...progressData }),
    });
  }
};

// Reviews API functions
export const reviewsAPI = {
  // Add review
  addReview: async (reviewData) => {
    return await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Get book reviews
  getBookReviews: async (bookId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reviews/book/${bookId}?${queryString}` : `/reviews/book/${bookId}`;
    return await apiRequest(endpoint);
  },

  // Get user reviews
  getUserReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reviews/user?${queryString}` : '/reviews/user';
    return await apiRequest(endpoint);
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return await apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  deleteReview: async (reviewId) => {
    return await apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }
};

// Reading API functions
export const readingAPI = {
  // Add highlight/bookmark
  addHighlight: async (highlightData) => {
    return await apiRequest('/reading/highlight', {
      method: 'POST',
      body: JSON.stringify(highlightData),
    });
  },

  // Get book highlights
  getBookHighlights: async (bookId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reading/book/${bookId}/highlights?${queryString}` : `/reading/book/${bookId}/highlights`;
    return await apiRequest(endpoint);
  },

  // Update highlight
  updateHighlight: async (highlightId, highlightData) => {
    return await apiRequest(`/reading/highlight/${highlightId}`, {
      method: 'PUT',
      body: JSON.stringify(highlightData),
    });
  },

  // Delete highlight
  deleteHighlight: async (highlightId) => {
    return await apiRequest(`/reading/highlight/${highlightId}`, {
      method: 'DELETE',
    });
  },

  // Add to favorites
  addToFavorites: async (bookId) => {
    return await apiRequest('/reading/favorites', {
      method: 'POST',
      body: JSON.stringify({ bookId }),
    });
  },

  // Get reading progress
  getReadingProgress: async (bookId) => {
    return await apiRequest(`/reading/progress/${bookId}`);
  },

  // Update reading progress
  updateReadingProgress: async (progressData) => {
    return await apiRequest('/reading/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }
};

// Activity API functions
export const activityAPI = {
  // Create an activity entry
  create: async (action, metadata = {}) => {
    return await apiRequest('/activity', {
      method: 'POST',
      body: JSON.stringify({ action, metadata }),
    });
  },
  // Get current user's activity
  me: async () => {
    return await apiRequest('/activity/me');
  },
};

export default {
  authAPI,
  booksAPI,
  shelfAPI,
  reviewsAPI,
  readingAPI,
  activityAPI,
  getAuthToken,
  setAuthToken,
  removeAuthToken
};
