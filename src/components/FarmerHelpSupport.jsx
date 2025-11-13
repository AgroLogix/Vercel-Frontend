import React, { useState } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaQuestionCircle,
  FaPaperPlane,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FarmerHelpSupport.css";

const FarmerHelpSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Farmer support request:", formData);
    setSubmitted(true);
  };

  return (
    <div className="farmer-help-container">
      <div className="farmer-help-header">
        <button
          className="farmer-back-btn"
          onClick={() => navigate("/farmer")}
        >
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaQuestionCircle /> Help & Support
        </h2>
      </div>

      {/* ===== Search Section ===== */}
      <div className="farmer-help-search">
        <input
          type="text"
          placeholder="Search help topics (e.g., crop issues, fertilizer help...)"
        />
      </div>

      {/* ===== FAQ Section ===== */}
      <div className="farmer-faq-section">
        <h3>Frequently Asked Questions</h3>
        <details>
          <summary>🌾 How can I update my crop details?</summary>
          <p>
            Go to Dashboard → Click “My Crops” → Edit or add crop information.
          </p>
        </details>
        <details>
          <summary>💧 How do I request irrigation support?</summary>
          <p>
            Open “Services” in the Dashboard → Choose “Irrigation Support” →
            Submit your request.
          </p>
        </details>
        <details>
          <summary>📦 How can I check my order history?</summary>
          <p>
            Navigate to Dashboard → Click on “History” to view past orders or
            transactions.
          </p>
        </details>
        <details>
          <summary>🧑‍🌾 How do I connect with nearby providers?</summary>
          <p>
            Go to “Find Providers” → Select your location → View available
            providers nearby.
          </p>
        </details>
      </div>

      {/* ===== Contact Form ===== */}
      <div className="farmer-support-form-section">
        <h3>Contact Support</h3>
        {submitted ? (
          <p className="farmer-success-msg">
            ✅ Your request has been submitted. Our team will contact you soon!
          </p>
        ) : (
          <form
            className="farmer-support-form"
            onSubmit={handleSubmit}
          >
            <div className="farmer-form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              required
            >
              <option value="">Select Issue Type</option>
              <option value="crop">Crop Issue</option>
              <option value="fertilizer">Fertilizer/Tool Support</option>
              <option value="payment">Payment Problem</option>
              <option value="technical">App/Technical Issue</option>
              <option value="other">Other</option>
            </select>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Describe your issue in detail..."
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="farmer-submit-btn">
              <FaPaperPlane /> Submit Request
            </button>
          </form>
        )}
      </div>

      {/* ===== Contact Info ===== */}
      <div className="farmer-contact-info">
        <h3>Need Immediate Help?</h3>
        <p>
          <FaPhone /> +91 98765 43210
        </p>
        <p>
          <FaEnvelope /> support@kisansathi.in
        </p>
        <p>⏰ Support Hours: 9:00 AM – 7:00 PM (Mon–Sat)</p>
        <p>📍 KisanSathi Support Centre, Pune, Maharashtra</p>
      </div>
    </div>
  );
};

export default FarmerHelpSupport;
