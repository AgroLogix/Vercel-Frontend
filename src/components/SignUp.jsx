import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Login from "./Login";
import "./SignUp.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLogin(true);
  };

  const handleCloseModal = () => {
    setShowLogin(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Real-time password strength check
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = "";
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaCount = [
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (criteriaCount <= 2) strength = "Weak";
    else if (criteriaCount === 3 || criteriaCount === 4) strength = "Medium";
    else if (criteriaCount === 5) strength = "Strong";

    setPasswordStrength(strength);
  };

  // Validate password
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(password);
  };

  // Validate email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.userId.trim()) {
      newErrors.userId = "User ID is required";
    } else if (formData.userId.length < 4) {
      newErrors.userId = "User ID must be at least 4 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with one uppercase, one number, and one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/Signup",
          formData
        );
        toast.success(res.data.message, { position: "top-right" });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          userId: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
        });
        setPasswordStrength("");
        // ✅ Automatically open login popup after 2 seconds
        setTimeout(() => {
          setShowLogin(true);
        }, 2000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed", {
          position: "top-right",
        });
        console.error(err);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
         <button
    className="close-btn"
    onClick={() => navigate("/")}
    title="Go to Home"
  >
    <FaTimes />
  </button>
        <h2>Create Account</h2>
        <p className="subtitle">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* First Name and Last Name */}
          <div className="name-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "error-input" : ""}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "error-input" : ""}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* User ID */}
          <div className="form-group">
            <label htmlFor="userId">User ID *</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={errors.userId ? "error-input" : ""}
              placeholder="Enter unique user ID"
            />
            {errors.userId && (
              <span className="error-message">{errors.userId}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
              placeholder="Enter email address"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {passwordStrength && formData.password && (
              <div
                className={`password-strength ${passwordStrength.toLowerCase()}`}
              >
                Strength: {passwordStrength}
              </div>
            )}
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            <small className="password-hint">
              Min 8 characters, 1 uppercase, 1 number, 1 special character
            </small>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error-input" : ""}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>Select Role *</label>
            <div className="role-selection">
              <label
                className={`role-option ${
                  formData.role === "provider" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="provider"
                  checked={formData.role === "provider"}
                  onChange={handleChange}
                />
                <div className="role-content">
                  <span className="role-icon">🏢</span>
                  <span className="role-name">Provider</span>
                </div>
              </label>

              <label
                className={`role-option ${
                  formData.role === "farmer" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={formData.role === "farmer"}
                  onChange={handleChange}
                />
                <div className="role-content">
                  <span className="role-icon">🌾</span>
                  <span className="role-name">Farmer</span>
                </div>
              </label>
            </div>
            {errors.role && (
              <span className="error-message">{errors.role}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Sign Up
          </button>

          <p className="login-link">
            Already have an account?{" "}
            <a href="#" onClick={handleLoginClick}>
              Login here
            </a>
          </p>
        </form>
      </div>

      {showLogin && <Login onClose={handleCloseModal} />}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
