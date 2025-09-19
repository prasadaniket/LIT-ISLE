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
        {/* Top-left Logo */}
        <div className="absolute top-6 left-6">
          <Link to="/">
            <img src="/logo/Logob.png" alt="LIT ISLE" className="h-8 w-auto" />
          </Link>
        </div>
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
            {/* Social logins removed */}

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

