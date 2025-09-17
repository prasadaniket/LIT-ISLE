// Newsettler (Newsletter) section
// Dark, minimal, cozy signup with clear call-to-action

const Newsettler = () => {
  return (
    <section id="newsletter" className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="mx-auto" style={{ maxWidth: '1200px', padding: '0 24px' }}>
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-black font-semibold" style={{ fontSize: '32px', lineHeight: 1.2 }}>Stay in the loop</h2>
          <p className="text-gray-600" style={{ fontSize: '16px' }}>Weekly picks, hidden gems, and cozy reads—straight to your inbox.</p>
        </div>

        {/* Form Row */}
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 mx-auto" style={{ maxWidth: '640px' }}>
          {/* Email input */}
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full rounded-xl bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B6623] px-4"
            style={{ height: '48px' }}
            aria-label="Email address"
          />
          {/* Subscribe button */}
          <button
            type="submit"
            className="rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0B6623', height: '48px', padding: '0 20px', minWidth: '160px' }}
          >
            Subscribe
          </button>
        </form>

        {/* Consent note */}
        <p className="text-center text-gray-500 mt-4" style={{ fontSize: '12px' }}>
          By subscribing, you agree to receive emails from LIT ISLE. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsettler;


