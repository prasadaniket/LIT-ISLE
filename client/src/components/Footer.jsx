import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand row: LIT ISLE logo */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3">
            <img src="/logo/Logoq.png" alt="LIT ISLE logo" className="h-7 w-auto object-contain" />
            <span className="sr-only">LIT ISLE</span>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column: Company */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#0B6623] transition-colors">About us</Link></li>
              <li><Link to="/careers" className="hover:text-[#0B6623] transition-colors">Careers</Link></li>
              <li><Link to="/terms" className="hover:text-[#0B6623] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#0B6623] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column: Work with us */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Work with us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/authors" className="hover:text-[#0B6623] transition-colors">Authors</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => alert('This feature is coming soon!')}
                  className="hover:text-[#0B6623] transition-colors"
                >
                  Advertise
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => alert('This feature is currently unavailable. Coming soon!')}
                  className="hover:text-[#0B6623] transition-colors"
                >
                  Authors & ads blog
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Help & FAQ */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Help & FAQ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#faq" className="hover:text-[#0B6623] transition-colors">FAQ</Link></li>
              <li><Link to="/help" className="hover:text-[#0B6623] transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-[#0B6623] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column: Connect + Get the app combined in one row */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Connect & Get the app</h4>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Social icons */}
              <div className="flex items-center space-x-4">
                {/* Facebook */}
                <a href="#" className="hover:text-[#0B6623] transition-colors" aria-label="Facebook" title="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M22 12a10 10 0 1 0-11.5 9.95v-7.04H7.9V12h2.6V9.8c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.29.2 2.29.2v2.52h-1.29c-1.27 0-1.66.79-1.66 1.6V12h2.83l-.45 2.91h-2.38v7.04A10 10 0 0 0 22 12Z"/></svg>
                </a>
                {/* Twitter/X */}
                <a href="#" className="hover:text-[#0B6623] transition-colors" aria-label="Twitter" title="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M4.5 3h4.3l4.1 5.6L17.8 3H21l-6.4 8.7L21.6 21h-4.3l-4.6-6.3L8 21H3l6.9-9.4L4.5 3Z"/></svg>
                </a>
                {/* Instagram */}
                <a href="#" className="hover:text-[#0B6623] transition-colors" aria-label="Instagram" title="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.75-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25Z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="hover:text-[#0B6623] transition-colors" aria-label="LinkedIn" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6a2.5 2.5 0 0 1 2.48-2.5ZM3 8h4v13H3ZM9 8h3.8v1.78h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.09V21h-4v-5.3c0-1.26-.02-2.88-1.76-2.88-1.77 0-2.04 1.38-2.04 2.79V21H9Z"/></svg>
                </a>
              </div>
            </div>

            {/* Legal + note */}
            <div className="space-y-2 mt-4">
              <span className="text-xs text-gray-500">Mobile version — <span className="text-gray-700">Coming soon</span></span>
              <p className="text-xs text-gray-500">Copyright © {new Date().getFullYear()} LIT ISLE, Inc.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


