import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lower: false,
    upper: false,
    digit: false,
    special: false,
    nospace: true
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showRequirements, setShowRequirements] = useState(true);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle password validation
    if (field === 'password') {
      validatePassword(value);
    }
    
    // Handle confirm password validation
    if (field === 'confirmPassword') {
      validateConfirmPassword(value);
    }
    
    // Handle email validation
    if (field === 'email') {
      validateEmail(value);
    }
    
    // Check if all requirements are met to fade out instructions
    checkAllRequirementsMet();
  };

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 10,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(password),
      nospace: !/\s/.test(password)
    };
    
    setPasswordValidation(checks);
    
    // Calculate strength (0-100)
    const validChecks = Object.values(checks).filter(Boolean).length;
    const strength = (validChecks / 6) * 100;
    setPasswordStrength(strength);
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword && formData.password) {
      if (confirmPassword !== formData.password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
    }
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-orange-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  const validateEmail = (email) => {
    if (!email) {
      setEmailError("");
      return;
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    // Check if it's a Gmail address
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain !== 'gmail.com') {
      setEmailError("Only Gmail addresses are allowed");
      return;
    }
    
    setEmailError("");
  };

  const checkAllRequirementsMet = () => {
    const allMet = formData.name.trim() && 
                   formData.email.trim() && 
                   !emailError && 
                   isPasswordValid() && 
                   formData.password === formData.confirmPassword && 
                   formData.terms;
    
    if (allMet && showRequirements) {
      // Add a small delay before fading out for better UX
      setTimeout(() => {
        setShowRequirements(false);
      }, 500);
    } else if (!allMet && !showRequirements) {
      // Show requirements again if validation fails
      setShowRequirements(true);
    }
  };

  const handleEmailSubmit = () => {
    if (formData.email.trim()) {
      passwordRef.current?.focus();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    setConfirmPasswordError("");
    setEmailError("");
    setShowRequirements(true);
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!formData.terms) {
      setError("Please accept the terms and conditions");
      return;
    }
    
    if (emailError) {
      setError("Please fix the email validation errors");
      return;
    }
    
    if (!isPasswordValid()) {
      setError("Password does not meet security requirements");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await register({
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: 'user'
      });
      
      if (result.success) {
        // Navigate to home page after successful registration
        navigate("/");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
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
              <h1 className="text-black text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-gray-600 text-sm">Join our reading community</p>
            </div>

            <form onSubmit={handleRegister}>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message - Show when all validations pass */}
              {!error && formData.name.trim() && formData.email.trim() && !emailError && isPasswordValid() && formData.password === formData.confirmPassword && formData.terms && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                  <p className="text-green-600 text-sm">✓ All requirements met! You can now create your account.</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="name" className="text-gray-700 text-sm font-medium mb-2 block">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name" 
                    className="w-full bg-white border-gray-300 text-black placeholder-gray-400 focus:border-[#0B6623] focus:ring-[#0B6623]/20 rounded-xl px-4 py-3"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 text-sm font-medium mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input 
                      ref={emailRef}
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your Gmail address"
                      className={`w-full bg-white border-gray-300 text-black placeholder-gray-400 focus:border-[#0B6623] focus:ring-[#0B6623]/20 rounded-xl px-4 py-3 pr-12 ${
                        emailError ? 'border-red-300 focus:border-red-500' : 
                        formData.email && !emailError ? 'border-green-300 focus:border-green-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Email Validation Feedback */}
                  {formData.email && (
                    <div className="mt-2">
                      {emailError ? (
                        <div className="flex items-center text-xs text-red-600">
                          <span className="mr-2">✗</span>
                          {emailError}
                        </div>
                      ) : (
                        <div className="flex items-center text-xs text-green-600">
                          <span className="mr-2">✓</span>
                          Valid Gmail address
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Gmail Requirement Info */}
                  <div className={`mt-1 transition-all duration-500 ${showRequirements ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-xs text-gray-500">Only Gmail addresses are accepted</p>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-gray-700 text-sm font-medium mb-2 block">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    ref={passwordRef}
                    id="password" 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a strong password"
                    className={`w-full bg-white border-gray-300 text-black placeholder-gray-400 focus:border-[#0B6623] focus:ring-[#0B6623]/20 rounded-xl px-4 py-3 ${
                      formData.password && !isPasswordValid() ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                    required
                    disabled={isLoading}
                  />
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Password Strength:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength < 30 ? 'text-red-600' :
                          passwordStrength < 60 ? 'text-orange-600' :
                          passwordStrength < 80 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Password Requirements */}
                  {formData.password && (
                    <div className={`mt-3 space-y-1 transition-all duration-500 ${showRequirements ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="text-xs text-gray-600 mb-2">Password Requirements:</div>
                      <div className="space-y-1">
                        <div className={`flex items-center text-xs ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-2">{passwordValidation.length ? '✓' : '○'}</span>
                          At least 10 characters
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.lower ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-2">{passwordValidation.lower ? '✓' : '○'}</span>
                          One lowercase letter
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.upper ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-2">{passwordValidation.upper ? '✓' : '○'}</span>
                          One uppercase letter
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.digit ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-2">{passwordValidation.digit ? '✓' : '○'}</span>
                          One number
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.special ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-2">{passwordValidation.special ? '✓' : '○'}</span>
                          One special character
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.nospace ? 'text-green-600' : 'text-gray-500'}`}>
                          <span className="mr-2">{passwordValidation.nospace ? '✓' : '○'}</span>
                          No spaces
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium mb-2 block">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    ref={confirmPasswordRef}
                    id="confirmPassword" 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={`w-full bg-white border-gray-300 text-black placeholder-gray-400 focus:border-[#0B6623] focus:ring-[#0B6623]/20 rounded-xl px-4 py-3 ${
                      confirmPasswordError ? 'border-red-300 focus:border-red-500' : 
                      formData.confirmPassword && formData.password && formData.confirmPassword === formData.password ? 'border-green-300 focus:border-green-500' : ''
                    }`}
                    required
                    disabled={isLoading}
                  />
                  
                  {/* Confirm Password Feedback */}
                  {formData.confirmPassword && (
                    <div className={`mt-2 transition-all duration-500 ${showRequirements ? 'opacity-100' : 'opacity-0'}`}>
                      {confirmPasswordError ? (
                        <div className="flex items-center text-xs text-red-600">
                          <span className="mr-2">✗</span>
                          {confirmPasswordError}
                        </div>
                      ) : formData.password && formData.confirmPassword === formData.password ? (
                        <div className="flex items-center text-xs text-green-600">
                          <span className="mr-2">✓</span>
                          Passwords match
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                    className="w-4 h-4 text-[#0B6623] bg-white border-gray-300 rounded focus:ring-[#0B6623]/20 mt-1"
                    required
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-gray-600 text-sm leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-[#0B6623] hover:text-[#0e7a2b] transition-colors underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-[#0B6623] hover:text-[#0e7a2b] transition-colors underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={
                  isLoading || 
                  !formData.name.trim() || 
                  !formData.email.trim() || 
                  !formData.password.trim() || 
                  !formData.confirmPassword.trim() || 
                  !formData.terms ||
                  !isPasswordValid() ||
                  formData.password !== formData.confirmPassword ||
                  confirmPasswordError ||
                  emailError
                }
                className="w-full bg-[#0B6623] text-white py-3 rounded-xl font-medium hover:bg-[#0e7a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-[#0B6623] hover:text-[#0e7a2b] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

