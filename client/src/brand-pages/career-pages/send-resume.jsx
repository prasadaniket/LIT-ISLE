// Send Resume page for LIT ISLE - Career Pages
// Dark mode design for resume submission form

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SendResume = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    coverLetter: "",
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const sectionRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll animation setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    const items = sectionRef.current?.querySelectorAll("[data-scroll-item]");
    items?.forEach((item) => observer.observe(item));

    return () => {
      items?.forEach((item) => observer.unobserve(item));
    };
  }, []);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({
          ...prev,
          resume: "Please upload a PDF file only"
        }));
        return;
      }

      // Validate file size (100KB to 10MB)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB < 0.1) {
        setErrors(prev => ({
          ...prev,
          resume: "File size must be at least 100KB"
        }));
        return;
      }
      
      if (fileSizeInMB > 10) {
        setErrors(prev => ({
          ...prev,
          resume: "File size must not exceed 10MB"
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resume: file
      }));

      // Clear error
      setErrors(prev => ({
        ...prev,
        resume: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Desired position is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience level is required";
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (formData.coverLetter.trim().length < 100) {
      newErrors.coverLetter = "Cover letter must be at least 100 characters";
    }

    if (!formData.resume) {
      newErrors.resume = "Resume is required";
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Thank you for your interest in joining LIT ISLE. We've received your application and will review it carefully.
            </p>
            <div className="space-y-4">
              <Link
                to="/careers"
                className="block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Back to Careers
              </Link>
              <Link
                to="/"
                className="block px-8 py-4 border border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold rounded-xl transition-all duration-300"
              >
                Return Home
              </Link>
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
      <div ref={sectionRef}>
        {/* Hero Section */}
        <section
          className="relative py-25 px-6"
          data-scroll-item
          data-index="hero"
          style={{
            opacity: visibleItems.has("hero") ? 1 : 0,
            transform: visibleItems.has("hero")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Send Us Your Resume
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Even though we're not actively hiring, we'd love to hear from you
            </p>
          </div>
        </section>

        {/* Application Form Section */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="form"
          style={{
            opacity: visibleItems.has("form") ? 1 : 0,
            transform: visibleItems.has("form")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Application Form
                </h2>
                <p className="text-gray-400">
                  Fill out the form below and upload your resume. We'll keep your information on file for future opportunities.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Position and Experience */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Desired Position *
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${
                        errors.position ? 'border-red-500' : 'border-gray-700'
                      }`}
                    >
                      <option value="">Select a position</option>
                      <option value="frontend-developer">Frontend Developer</option>
                      <option value="backend-developer">Backend Developer</option>
                      <option value="fullstack-developer">Full Stack Developer</option>
                      <option value="product-designer">Product Designer</option>
                      <option value="ui-ux-designer">UI/UX Designer</option>
                      <option value="product-manager">Product Manager</option>
                      <option value="marketing-manager">Marketing Manager</option>
                      <option value="content-writer">Content Writer</option>
                      <option value="community-manager">Community Manager</option>
                      <option value="data-analyst">Data Analyst</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.position && (
                      <p className="text-red-400 text-sm mt-1">{errors.position}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Experience Level *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-orange-500 ${
                        errors.experience ? 'border-red-500' : 'border-gray-700'
                      }`}
                    >
                      <option value="">Select experience level</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (3-5 years)</option>
                      <option value="senior">Senior Level (6-10 years)</option>
                      <option value="lead">Lead/Principal (10+ years)</option>
                    </select>
                    {errors.experience && (
                      <p className="text-red-400 text-sm mt-1">{errors.experience}</p>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 ${
                      errors.coverLetter ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Tell us why you're interested in joining LIT ISLE and what you can bring to our team..."
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Minimum 100 characters ({formData.coverLetter.length}/100)
                  </p>
                  {errors.coverLetter && (
                    <p className="text-red-400 text-sm mt-1">{errors.coverLetter}</p>
                  )}
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Resume (PDF only) *
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-orange-500 transition-colors duration-300">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer block"
                    >
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-white font-semibold mb-2">
                        {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        PDF files only, 100KB - 10MB
                      </p>
                    </label>
                  </div>
                  {errors.resume && (
                    <p className="text-red-400 text-sm mt-1">{errors.resume}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting Application...
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-20 px-6"
          data-scroll-item
          data-index="cta"
          style={{
            opacity: visibleItems.has("cta") ? 1 : 0,
            transform: visibleItems.has("cta")
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Questions About the Application?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                If you have any questions about the application process or need assistance, 
                feel free to reach out to our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/careers"
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Back to Careers
                </Link>
                <a
                  href="mailto:careers@litisle.com"
                  className="px-8 py-4 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SendResume;
