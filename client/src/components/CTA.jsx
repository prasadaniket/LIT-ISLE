import { useAuth } from "../contexts/AuthContext";

// Dark-mode CTA that adapts pre/post login
// Uses real auth context to decide state

const CTA = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <section id="cta" className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-5xl mx-auto" style={{ padding: '0 24px' }}>
        {/* Centered Content */}
        <div className="text-center">
          {/* Heading and subtext change based on login */}
          <h2 className="text-black font-semibold mb-3" style={{ fontSize: isAuthenticated ? '38px' : '40px', lineHeight: 1.2, fontFamily: "'Playful Display', serif" }}>
            {isAuthenticated ? `Welcome back, ${user?.name || 'Reader'} 👋` : 'Step into the world of books 📚'}
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontSize: '16px' }}>
            {isAuthenticated
              ? 'Continue reading from where you left off, or explore new collections.'
              : 'Login or Register to create your personal shelf.'}
          </p>

          {/* Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <a href="/shelf" className="rounded-xl text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0B6623', height: '48px', padding: '0 24px', minWidth: '180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Go to My Shelf</a>
                <a href="/allbooks" className="rounded-xl border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition-colors" style={{ height: '48px', padding: '0 24px', minWidth: '180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Explore Books</a>
              </>
            ) : (
              <>
                <a href="/login" className="rounded-xl text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0B6623', height: '48px', padding: '0 24px', minWidth: '180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Login</a>
                <a href="/register" className="rounded-xl border border-[#0B6623] text-[#0B6623] hover:bg-[#0B6623] hover:text-white transition-colors" style={{ height: '48px', padding: '0 24px', minWidth: '180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Register</a>
              </>
            )}
          </div>
        </div>

        {/* Optional cozy divider */}
        <div className="mt-10 flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default CTA;
