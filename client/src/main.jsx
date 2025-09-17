import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { ShelfProvider } from './contexts/ShelfContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import App from './App.jsx'
import Categories from './pages/genres.jsx'
import Collections from './pages/library.jsx'
import Recommendations from './pages/allbooks.jsx'
import MyShelf from './pages/MyShelf.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
// Brand pages
import About from './brand-pages/about.jsx'
import Authors from './brand-pages/authors.jsx'
import Careers from './brand-pages/careers.jsx'
import Privacy from './brand-pages/privacy.jsx'
import Terms from './brand-pages/terms.jsx'
import HelpCenter from './brand-pages/helpCenter.jsx'
import Contact from './brand-pages/Contact.jsx'
// Career pages
import BrowsePositions from './brand-pages/career-pages/browse-positions.jsx'
import SendResume from './brand-pages/career-pages/send-resume.jsx'
import BookDetail from './pages/bookG/BookDetail.jsx'
import BookReader from './pages/bookG/BookReader.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <ShelfProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/shelf" element={<MyShelf />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Brand pages */}
            <Route path="/about" element={<About />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            {/* Career pages */}
            <Route path="/careers/browse" element={<BrowsePositions />} />
            <Route path="/careers/apply" element={<SendResume />} />
            <Route path="/book/:slug" element={<BookDetail />} />
            <Route path="/book/:slug/read" element={<BookReader />} />
          </Routes>
        </BrowserRouter>
      </ShelfProvider>
    </AuthProvider>,
)
