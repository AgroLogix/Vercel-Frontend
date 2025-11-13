import React, { useState } from "react";
import { FaArrowLeft, FaEnvelope, FaPhone, FaQuestionCircle, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProviderHelpSupport.css";

const ProviderHelpSupport = () => {
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
    console.log("Support request:", formData);
    setSubmitted(true);
  };

  return (
    <div className="help-container">
      <div className="help-header">
        <button className="back-btn" onClick={() => navigate("/provider")}>
          <FaArrowLeft /> Back
        </button>
        <h2><FaQuestionCircle /> Help & Support</h2>
      </div>

      {/* ===== Search Section ===== */}
      <div className="help-search">
        <input
          type="text"
          placeholder="Search for help topics (e.g., payments, vehicle issues...)"
        />
      </div>

      {/* ===== FAQ Section ===== */}
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <details>
          <summary>🚚 How do I add a new vehicle?</summary>
          <p>Go to Dashboard → Click “Add Vehicle” button → Fill details and submit.</p>
        </details>
        <details>
          <summary>💸 When will I receive my earnings?</summary>
          <p>Payments are processed within 3–5 business days after trip completion.</p>
        </details>
        <details>
          <summary>🧾 How can I view my booking history?</summary>
          <p>Navigate to Dashboard → Click on “History” tab to see all past bookings.</p>
        </details>
        <details>
          <summary>🔧 My vehicle is under maintenance. How can I update its status?</summary>
          <p>Go to the “Vehicle” page → Click “Mark Maintenance” or “Mark Available”.</p>
        </details>
      </div>

      {/* ===== Contact Form ===== */}
      <div className="support-form-section">
        <h3>Contact Support</h3>
        {submitted ? (
          <p className="success-msg">✅ Your request has been submitted. Our team will contact you soon!</p>
        ) : (
          <form className="support-form" onSubmit={handleSubmit}>
            <div className="form-row">
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

            <select name="issueType" value={formData.issueType} onChange={handleChange} required>
              <option value="">Select Issue Type</option>
              <option value="booking">Booking Issue</option>
              <option value="vehicle">Vehicle Issue</option>
              <option value="payment">Payment Problem</option>
              <option value="technical">Technical Error</option>
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

            <button type="submit" className="submit-btn">
              <FaPaperPlane /> Submit Ticket
            </button>
          </form>
        )}
      </div>

      {/* ===== Contact Info ===== */}
      <div className="contact-info">
        <h3>Need Immediate Help?</h3>
        <p><FaPhone /> +91 98765 43210</p>
        <p><FaEnvelope /> support@agrologix.in</p>
        <p>⏰ Support Hours: 9:00 AM – 7:00 PM (Mon–Sat)</p>
        <p>📍 AgroLogiX Pvt Ltd, Pune, Maharashtra</p>
      </div>
    </div>
  );
};

export default ProviderHelpSupport;
