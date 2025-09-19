import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { clearUserData } from "../utils/freshStart";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "Prefer not to say",
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
        gender: formData.gender,
        role: 'user'
      });
      
      if (result.success) {
        // Clear any existing user data for fresh start
        clearUserData();
        // Navigate to login page after successful registration
        navigate("/login");
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

                {/* Gender */}
                <div>
                  <Label htmlFor="gender" className="text-gray-700 text-sm font-medium mb-2 block">
                    Gender
                  </Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full bg-white border border-gray-300 text-black focus:border-[#0B6623] focus:ring-[#0B6623]/20 rounded-xl px-4 py-3"
                    disabled={isLoading}
                  >
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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
            {/* Social logins removed */}

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

