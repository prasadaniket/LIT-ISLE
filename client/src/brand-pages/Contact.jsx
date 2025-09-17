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
  Heart
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
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Return Home
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="block w-full px-8 py-4 border border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300"
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
    <div className="min-h-screen bg-black">
      <Navbar />
      <div ref={sectionRef} className="relative">
        {/* ===== HERO SECTION ===== */}
        <section 
          className="relative py-32 px-6 overflow-hidden"
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
                <MessageCircle className="w-16 h-16 text-orange-400" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">
                Contact Us
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Have questions, feedback, or need help? We're here to assist you on your reading journey. 
                Reach out to our friendly support team.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CONTACT INFO ===== */}
        <section 
          className="py-16 px-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50"
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
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Get in Touch</h2>
              <p className="text-gray-400">Choose your preferred way to reach us</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className={`bg-gray-800/30 border border-gray-700 rounded-2xl p-6 text-center hover:border-orange-500/30 transition-all duration-300 ${
                    info.action ? 'cursor-pointer' : ''
                  }`}
                  onClick={info.action ? () => window.open(info.action) : undefined}
                >
                  <info.icon className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{info.description}</p>
                  <p className={`font-medium ${info.action ? 'text-orange-400 hover:text-orange-300' : 'text-gray-300'}`}>
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT FORM ===== */}
        <section 
          className="py-20 px-6"
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
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Send us a Message</h2>
              <p className="text-gray-400">Fill out the form below and we'll get back to you soon</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-3xl p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
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
                    <label className="block text-white font-semibold mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                        errors.subject ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                        errors.category ? 'border-red-500' : 'border-gray-700'
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
                  <label className="block text-white font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
                      errors.message ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                  <p className="text-gray-400 text-sm mt-1">
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
                    className="px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-500/50 disabled:to-orange-600/50 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-orange-500/25"
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

        {/* ===== WHY CONTACT US ===== */}
        <section 
          className="py-20 px-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60"
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
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Why Contact Us?</h2>
              <p className="text-gray-400">We're here to make your reading experience amazing</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Reading Support
                </h3>
                <p className="text-gray-400">
                  Need help finding the perfect book or having trouble with our reading features? We're here to help.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Community Help
                </h3>
                <p className="text-gray-400">
                  Questions about our community features, reviews, or connecting with other readers? We've got you covered.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Feedback Welcome
                </h3>
                <p className="text-gray-400">
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
