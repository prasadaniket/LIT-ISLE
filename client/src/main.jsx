/**
 * LIT ISLE - Application Entry Point
 * 
 * This is the main entry point for the LIT ISLE React application.
 * It sets up routing, context providers, and renders the application.
 * 
 * Key Features:
 * - React Router setup with protected routes
 * - Context providers for authentication and shelf management
 * - Comprehensive routing for all application pages
 * - Protected route wrapper for authenticated content
 * 
 * @author LIT ISLE Development Team
 * @version 1.0.0
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// ===== CONTEXT PROVIDERS =====
import { ShelfProvider } from './contexts/ShelfContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// ===== MAIN APPLICATION =====
import App from './App.jsx'

// ===== CORE PAGES =====
import Categories from './pages/genres.jsx'
import AllBooks from './pages/allbooks.jsx'
import MyShelf from './pages/MyShelf.jsx'
import Profile from './pages/Profile.jsx'
import ShelfView from './pages/ShelfView.jsx'
import Community from './pages/community.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Search from './pages/Search.jsx'

// ===== BRAND PAGES =====
import About from './brand-pages/about.jsx'
import Authors from './brand-pages/authors.jsx'
import FeaturedAuthors from './components/Authors.jsx'
import Careers from './brand-pages/careers.jsx'
import Privacy from './brand-pages/privacy.jsx'
import Terms from './brand-pages/terms.jsx'
import HelpCenter from './brand-pages/helpCenter.jsx'
import Contact from './brand-pages/Contact.jsx'

// ===== CAREER PAGES =====
import BrowsePositions from './brand-pages/career-pages/browse-positions.jsx'
import SendResume from './brand-pages/career-pages/send-resume.jsx'

// ===== BOOK-RELATED PAGES =====
import BookDetail from './pages/bookG/BookDetail.jsx'
import BookReader from './pages/bookG/BookReader.jsx'
import GenreDetail from './pages/GenreDetail.jsx'
import CommunityDetail from './pages/CommunityDetail.jsx'

// ===== AUTHENTICATION HOOK =====
import { useAuth } from './contexts/AuthContext.jsx'

/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} Protected content or redirect to login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) return null;
  
  // Redirect to login if not authenticated, otherwise render children
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Application Root Render
 * 
 * Sets up the React application with context providers and routing.
 * Wraps the entire app in authentication and shelf management contexts.
 */
createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <ShelfProvider>
        <BrowserRouter>
          <Routes>
            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            
            {/* ===== BRAND PAGES (PUBLIC) ===== */}
            <Route path="/about" element={<About />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* ===== CAREER PAGES (PUBLIC) ===== */}
            <Route path="/careers/browse" element={<BrowsePositions />} />
            <Route path="/careers/apply" element={<SendResume />} />
            
            {/* ===== PROTECTED ROUTES (REQUIRE AUTHENTICATION) ===== */}
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><AllBooks /></ProtectedRoute>} />
            <Route path="/allbooks" element={<ProtectedRoute><AllBooks /></ProtectedRoute>} />
            <Route path="/shelf" element={<ProtectedRoute><MyShelf /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/shelf/:type" element={<ProtectedRoute><ShelfView /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/genres/:genreName" element={<ProtectedRoute><GenreDetail /></ProtectedRoute>} />
            <Route path="/community/:slug" element={<ProtectedRoute><CommunityDetail /></ProtectedRoute>} />
            <Route path="/book/:slug" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
            <Route path="/book/:slug/read" element={<ProtectedRoute><BookReader /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ShelfProvider>
    </AuthProvider>,
)
