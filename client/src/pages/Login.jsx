import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const passwordRef = useRef(null);

  const handleEmailSubmit = () => {
    if (email.trim()) {
      passwordRef.current?.focus();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await login({
        email: email.trim(),
        password: password.trim()
      });
      
      if (result.success) {
        // Navigate to home page after successful login
        navigate("/");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div 
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230B6623' fill-opacity='0.15'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">
          {/* Light Card */}
          <div 
            className="relative bg-white border border-gray-200 rounded-2xl p-8 shadow-lg"
            style={{
              boxShadow: '0 20px 40px -20px rgba(0,0,0,0.15)'
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-black text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-gray-600 text-sm">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin}>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Email Input Section */}
              <div className="mb-6">
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium mb-2 block">Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-white border-gray-300 text-black placeholder-gray-400 focus:border-[#0B6623] focus:ring-[#0B6623]/20 rounded-xl px-4 py-3 pr-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input Section */}
              <div className="mb-6">
                <Label htmlFor="password" className="text-gray-700 text-sm font-medium mb-2 block">Password</Label>
                <Input 
                  ref={passwordRef}
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border-gray-300 text-black placeholder-gray-400 focus:border-[#0B6623] focus:ring-[#0B6623]/20 rounded-xl px-4 py-3"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password.trim()}
                className="w-full bg-[#0B6623] text-white py-3 rounded-xl font-medium hover:bg-[#0e7a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              {/* Google Button */}
              <button className="w-full bg-white border border-gray-300 text-black hover:bg-gray-50 transition-all duration-200 rounded-xl px-4 py-3 flex items-center justify-center group">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium">Continue with Google</span>
                </div>
                <svg className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* X (Twitter) Button */}
              <button className="w-full bg-white border border-gray-300 text-black hover:bg-gray-50 transition-all duration-200 rounded-xl px-4 py-3 flex items-center justify-center group">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 bg-black rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="font-medium">Continue with X</span>
                </div>
                <svg className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-[#0B6623] hover:text-[#0e7a2b] font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

