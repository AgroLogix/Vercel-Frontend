import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    // ✅ Check if user selected a role
    if (!selectedRole) {
      toast.warning("Please select your role before logging in!", {
        position: "top-right",
      });
      return; // stop login process
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        role: selectedRole,
        loginId: formData.loginId,
        password: formData.password,
      });

      const { user } = res.data;
      toast.success(res.data.message, { position: "top-right" });

      // Save user to localStorage (optional)
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect based on role
      setTimeout(() => {
        if (user.role === "farmer" && selectedRole === "farmer") {
          navigate("/farmer");
        } else if (user.role === "provider" && selectedRole === "provider") {
          navigate("/provider");
        } else {
          toast.error("Selected role does not match your account role.", {
            position: "top-right",
          });
        }
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const goToSignup = () => navigate("/Signup");

  return (
    <>
      <div className="login-modal-overlay" onClick={onClose}>
        <div className="login-modal" onClick={(e) => e.stopPropagation()}>
          <button className="login-modal-close-btn" onClick={onClose}>
            ✕
          </button>

          <div className="login-modal-header">
            <h2>Welcome Back!</h2>
            <p>Login to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmitLogin} className="login-form">
            {/* Role Selection */}
            <div className="login-role-selection">
              <label className="login-role-label">Login as:</label>
              <div className="login-role-buttons">
                <button
                  type="button"
                  className={`login-role-btn ${
                    selectedRole === "provider" ? "active" : ""
                  }`}
                  onClick={() => setSelectedRole("provider")}
                >
                  <span className="login-role-icon">🏪</span>
                  <span>Provider</span>
                </button>
                <button
                  type="button"
                  className={`login-role-btn ${
                    selectedRole === "farmer" ? "active" : ""
                  }`}
                  onClick={() => setSelectedRole("farmer")}
                >
                  <span className="login-role-icon">👤</span>
                  <span>Farmer</span>
                </button>
                {/* <button
                  type="button"
                  className={`login-role-btn ${
                    selectedRole === "admin" ? "active" : ""
                  }`}
                  onClick={() => setSelectedRole("admin")}
                >
                  <span className="login-role-icon">⚙️</span>
                  <span>Admin</span>
                </button> */}
              </div>
            </div>

            {/* Login ID Input */}
            <div className="login-form-group">
              <label htmlFor="loginId">Email or Phone Number</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">📧</span>
                <input
                  type="text"
                  id="loginId"
                  name="loginId"
                  placeholder="Enter your email or phone"
                  value={formData.loginId}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="login-form-footer">
              <a href="#forgot-password" className="login-forgot-password">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-submit-btn">
              Login
            </button>

            {/* Sign Up Link */}
            <div className="login-signup-link">
              Don't have an account?{" "}
              <a href="/Signup" onClick={goToSignup} className="signup-link">
                Sign Up
              </a>{" "}
            </div>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default Login;
