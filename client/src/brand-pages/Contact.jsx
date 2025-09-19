// Contact page for LIT ISLE
// Book geek aesthetic with contact form and support information

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle,
  BookOpen,
  Users,
  Library,
  Star,
  Heart,
  Menu,
  X
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRef = useRef(null);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll animation setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const items = sectionRef.current?.querySelectorAll('[data-scroll-item]');
    items?.forEach(item => observer.observe(item));

    return () => {
      items?.forEach(item => observer.unobserve(item));
    };
  }, []);

  // ===== CONTACT CATEGORIES =====
  const contactCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "account", label: "Account Issues" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "partnership", label: "Partnership" },
    { value: "other", label: "Other" }
  ];

  // ===== CONTACT INFO =====
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email",
      value: "support@litisle.com",
      action: "mailto:support@litisle.com"
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "We typically respond within",
      value: "24 hours",
      action: null
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Coming soon!",
      value: "Real-time support",
      action: null
    }
  ];

  // ===== FORM HANDLING =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 3000);
  };

  // ===== SUCCESS STATE =====
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-[#0B6623]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#0B6623]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="block px-8 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] text-gray-900 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Return Home
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="block w-full px-8 py-4 border border-gray-600 text-gray-700 hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Contact Us</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <a href="#contact-info" className="block py-2 text-gray-700 hover:text-[#0B6623]">Contact Info</a>
              <a href="#contact-form" className="block py-2 text-gray-700 hover:text-[#0B6623]">Send Message</a>
              <a href="#why-contact" className="block py-2 text-gray-700 hover:text-[#0B6623]">Why Contact Us</a>
            </div>
          </div>
        </div>
      )}

      <div ref={sectionRef} className="relative">
        {/* ===== MOBILE HERO SECTION ===== */}
        <section className="lg:hidden">
          <div className="bg-gradient-to-br from-[#0B6623]/10 to-white py-8 px-4">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white shadow-sm"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
              <div className="w-10" />
            </div>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <MessageCircle className="w-12 h-12 text-[#0B6623]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600 text-sm">
                We're here to help you on your reading journey
              </p>
            </div>
          </div>
        </section>

        {/* ===== DESKTOP HERO SECTION ===== */}
        <section 
          className="hidden lg:block relative py-32 px-6 overflow-hidden"
          data-scroll-item
          data-index="hero"
          style={{
            opacity: visibleItems.has('hero') ? 1 : 0,
            transform: visibleItems.has('hero') ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out'
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <MessageCircle className="w-16 h-16 text-[#0B6623]" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-serif">
                Contact Us
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                Have questions, feedback, or need help? We're here to assist you on your reading journey. 
                Reach out to our friendly support team.
              </p>
            </div>
          </div>
        </section>

        {/* ===== MOBILE CONTENT SECTIONS ===== */}
        <div className="lg:hidden px-4 py-6">
          {/* Contact Info */}
          <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
            <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            <div className="px-4 py-4 space-y-4">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    info.action ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer' : 'bg-gray-50'
                  }`}
                  onClick={info.action ? () => window.open(info.action) : undefined}
                >
                  <info.icon className="w-5 h-5 text-[#0B6623] flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{info.title}</h4>
                    <p className="text-gray-600 text-xs">{info.description}</p>
                    <p className={`text-sm font-medium ${info.action ? 'text-[#0B6623]' : 'text-gray-700'}`}>
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
            <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Send us a Message</h3>
            </div>
            <div className="px-4 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-900 font-semibold mb-2 text-sm">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 text-sm ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2 text-sm">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 text-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2 text-sm">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 text-sm ${
                      errors.subject ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2 text-sm">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-900 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 text-sm ${
                      errors.category ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {contactCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-xs mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-900 font-semibold mb-2 text-sm">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 text-sm ${
                      errors.message ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                  <p className="text-gray-600 text-xs mt-1">
                    Minimum 10 characters ({formData.message.length}/10)
                  </p>
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-[#0B6623] hover:bg-[#0e7a2b] disabled:bg-[#0B6623]/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Why Contact Us */}
          <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
            <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Why Contact Us?</h3>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0B6623]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-[#0B6623]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Reading Support</h4>
                  <p className="text-gray-600 text-xs">
                    Need help finding the perfect book or having trouble with our reading features? We're here to help.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0B6623]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-[#0B6623]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Community Help</h4>
                  <p className="text-gray-600 text-xs">
                    Questions about our community features, reviews, or connecting with other readers? We've got you covered.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0B6623]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-[#0B6623]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Feedback Welcome</h4>
                  <p className="text-gray-600 text-xs">
                    We love hearing from our readers! Share your ideas, suggestions, or just say hello.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DESKTOP CONTACT INFO ===== */}
        <section 
          className="hidden lg:block py-16 px-6 bg-gray-50"
          data-scroll-item
          data-index="info"
          style={{
            opacity: visibleItems.has('info') ? 1 : 0,
            transform: visibleItems.has('info') ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.1s'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Get in Touch</h2>
              <p className="text-gray-600">Choose your preferred way to reach us</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className={`bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:border-[#0B6623]/30 transition-all duration-300 ${
                    info.action ? 'cursor-pointer' : ''
                  }`}
                  onClick={info.action ? () => window.open(info.action) : undefined}
                >
                  <info.icon className="w-8 h-8 text-[#0B6623] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{info.description}</p>
                  <p className={`font-medium ${info.action ? 'text-[#0B6623] hover:text-[#0e7a2b]' : 'text-gray-700'}`}>
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DESKTOP CONTACT FORM ===== */}
        <section 
          className="hidden lg:block py-20 px-6"
          data-scroll-item
          data-index="form"
          style={{
            opacity: visibleItems.has('form') ? 1 : 0,
            transform: visibleItems.has('form') ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.2s'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Send us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you soon</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject and Category */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 ${
                        errors.subject ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-100 border rounded-xl text-gray-900 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 ${
                        errors.category ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {contactCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-gray-100 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B6623] focus:ring-2 focus:ring-[#0B6623]/20 ${
                      errors.message ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                  <p className="text-gray-600 text-sm mt-1">
                    Minimum 10 characters ({formData.message.length}/10)
                  </p>
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 bg-[#0B6623] hover:bg-[#0e7a2b] disabled:bg-[#0B6623]/50 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* ===== DESKTOP WHY CONTACT US ===== */}
        <section 
          className="hidden lg:block py-20 px-6 bg-gray-50"
          data-scroll-item
          data-index="why"
          style={{
            opacity: visibleItems.has('why') ? 1 : 0,
            transform: visibleItems.has('why') ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.3s'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Why Contact Us?</h2>
              <p className="text-gray-600">We're here to make your reading experience amazing</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-[#0B6623]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reading Support
                </h3>
                <p className="text-gray-600">
                  Need help finding the perfect book or having trouble with our reading features? We're here to help.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-[#0B6623]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Community Help
                </h3>
                <p className="text-gray-600">
                  Questions about our community features, reviews, or connecting with other readers? We've got you covered.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#0B6623]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-[#0B6623]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Feedback Welcome
                </h3>
                <p className="text-gray-600">
                  We love hearing from our readers! Share your ideas, suggestions, or just say hello.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
