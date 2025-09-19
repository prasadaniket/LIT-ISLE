import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authAPI.getToken();
        if (token) {
          // Verify token by getting user profile
          const response = await authAPI.getProfile();
          if (response.success) {
            // API returns { success, profile, profileCompletion, isProfileComplete }
            setUser(response.profile);
            setIsAuthenticated(true);
            setProfileCompletion(response.profileCompletion || 0);
            setIsProfileComplete(response.isProfileComplete || false);
          } else {
            // Token is invalid, remove it
            authAPI.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        setProfileCompletion(response.profileCompletion || 0);
        setIsProfileComplete(response.isProfileComplete || false);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        // Do NOT authenticate on register. Require explicit login afterwards.
        setUser(null);
        setIsAuthenticated(false);
        setIsNewUser(true);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsNewUser(false);
    setProfileCompletion(0);
    setIsProfileComplete(false);
  };

  // Function to mark new user as "settled" after they've had their fresh start
  const markUserAsSettled = () => {
    setIsNewUser(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.success) {
        // API returns updated profile under `profile`
        setUser(response.profile);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isNewUser,
    profileCompletion,
    isProfileComplete,
    login,
    register,
    logout,
    updateProfile,
    markUserAsSettled,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
