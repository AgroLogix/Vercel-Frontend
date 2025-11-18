import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaKey,
} from "react-icons/fa";
import "./FarmerProfile.css";

const emptyUser = {
  firstName: "",
  lastName: "",
  userId: "",
  profilePic: "",
  gender: "",
  dob: "",
  phone: "",
  email: "",
  addressLine: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  farmLocation: "",
  aadhaar: "",
  pan: "",
};

const FarmerProfile = () => {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState({ ...emptyUser, ...stored });
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false); // ✅ NEW: Loading state
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  // 🧭 Load farmer data from backend
  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("user")) || {};
    if (!s.userId) return;
    axios
      .get(`http://localhost:5000/api/auth/farmer/${s.userId}`)
      .then((res) => setUser(res.data))
      .catch(() => setUser({ ...emptyUser, ...s }));
  }, []);

  const onChange = (field, value) => {
    setUser((u) => ({ ...u, [field]: value }));
  };

  // ✅ ENHANCED: Helper function to get correct image URL (Cloudinary + Local)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-avatar.png";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath; // Cloudinary URL
    }
    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:5000${imagePath}`; // Old local path
    }
    return "/default-avatar.png";
  };

  // ✅ ENHANCED: Profile picture upload with validation, loading, and Cloudinary support
  const handleProfilePic = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ File validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("❌ Only JPG, PNG, and GIF images are allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ File size must be less than 5MB!");
      return;
    }

    setUploading(true); // ✅ Show loading state

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/provider/${user.userId}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );

      const updatedUser = { ...user, profilePic: res.data.profilePic };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("✅ Profile image uploaded to cloud successfully!");
    } catch (err) {
      console.error(err);
      alert(
        "❌ Image upload failed: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setUploading(false); // ✅ Hide loading state
    }
  };

  // 💾 Save profile to MongoDB
  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/auth/farmer/${user.userId}`,
        user
      );
      localStorage.setItem("user", JSON.stringify(user));
      setEditing(false);
      alert("Profile saved successfully to MongoDB.");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. Check backend connection.");
    }
  };

  const handleCancel = () => {
    const s = JSON.parse(localStorage.getItem("user")) || {};
    setUser({ ...emptyUser, ...s });
    setEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, password: passwords.newPassword })
    );
    setPasswords({ current: "", newPassword: "", confirm: "" });
    setShowPasswordBox(false);
    alert("Password updated locally!");
  };

  return (
    <div className="farmer-profile-page">
      {/* Header */}
      <div className="farmer-profile-header">
        <button className="farmer-back-btn" onClick={() => navigate("/farmer")}>
          <FaArrowLeft /> Back
        </button>
        <h1>Farmer Profile</h1>
        <div className="farmer-header-actions">
          {!editing ? (
            <>
              <button
                className="farmer-edit-btn"
                onClick={() => setEditing(true)}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="farmer-change-pass-btn"
                onClick={() => setShowPasswordBox((s) => !s)}
              >
                <FaKey /> Change Password
              </button>
            </>
          ) : (
            <>
              <button className="farmer-save-btn" onClick={handleSave}>
                <FaSave /> Save
              </button>
              <button className="farmer-cancel-btn" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Password Box */}
      {showPasswordBox && (
        <form className="farmer-password-box" onSubmit={handlePasswordChange}>
          <div className="farmer-row">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, newPassword: e.target.value }))
              }
              required
            />
          </div>
          <div className="farmer-row">
            <label>Confirm Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirm: e.target.value }))
              }
              required
            />
          </div>
          <div className="farmer-password-actions">
            <button type="submit" className="farmer-btn-primary">
              Update
            </button>
            <button
              type="button"
              className="farmer-btn-secondary"
              onClick={() => setShowPasswordBox(false)}
            >
              Close
            </button>
          </div>
        </form>
      )}

      {/* Profile Card */}
      <div className="farmer-profile-card">
        <div className="farmer-left-col">
          <div className="farmer-photo-wrap">
            {/* ✅ ENHANCED: Image with Cloudinary support */}
            <img
              src={getImageUrl(user.profilePic)}
              alt="Profile"
              className="farmer-profile-photo"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            {editing && (
              <label className="farmer-upload-overlay">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleProfilePic}
                  disabled={uploading} // ✅ Disable during upload
                />
                <span>
                  <FaCamera /> {uploading ? "Uploading..." : "Change"}
                </span>
              </label>
            )}
          </div>

          {/* ✅ NEW: Loading indicator */}
          {uploading && (
            <div
              style={{
                marginTop: "10px",
                color: "#6b8e23",
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ⏳ Uploading to cloud...
            </div>
          )}

          <div className="farmer-summary">
            <h2>
              {user.firstName
                ? `${user.firstName} ${user.lastName || ""}`
                : "Farmer Name"}
            </h2>
            <p>
              <strong>User ID:</strong> {user.userId || "AGX-FRM-XXXX"}
            </p>
            <p>
              <strong>Farm Location:</strong> {user.farmLocation || "N/A"}
            </p>
          </div>
        </div>

        <div className="farmer-right-col">
          <form
            className="farmer-profile-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3>Personal Information</h3>
            <div className="farmer-form-grid">
              <div className="farmer-form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={user.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={user.lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>Gender</label>
                <select
                  value={user.gender}
                  onChange={(e) => onChange("gender", e.target.value)}
                  disabled={!editing}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="farmer-form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={user.dob}
                  onChange={(e) => onChange("dob", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>Contact</label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  readOnly={!editing}
                />
              </div>
            </div>

            <h3>Address Information</h3>
            <div className="farmer-form-grid">
              <div className="farmer-form-group wide">
                <label>Address Line</label>
                <input
                  type="text"
                  value={user.addressLine}
                  onChange={(e) => onChange("addressLine", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>City</label>
                <input
                  type="text"
                  value={user.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>District</label>
                <input
                  type="text"
                  value={user.district}
                  onChange={(e) => onChange("district", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>State</label>
                <input
                  type="text"
                  value={user.state}
                  onChange={(e) => onChange("state", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={user.pincode}
                  onChange={(e) => onChange("pincode", e.target.value)}
                  readOnly={!editing}
                />
              </div>
            </div>

            <h3>Farm Information</h3>
            <div className="farmer-form-grid">
              <div className="farmer-form-group wide">
                <label>Farm Location</label>
                <input
                  type="text"
                  value={user.farmLocation}
                  onChange={(e) => onChange("farmLocation", e.target.value)}
                  readOnly={!editing}
                />
              </div>
            </div>

            <h3>Identification</h3>
            <div className="farmer-form-grid">
              <div className="farmer-form-group">
                <label>Aadhaar</label>
                <input
                  type="text"
                  value={user.aadhaar}
                  onChange={(e) => onChange("aadhaar", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="farmer-form-group">
                <label>PAN</label>
                <input
                  type="text"
                  value={user.pan}
                  onChange={(e) => onChange("pan", e.target.value)}
                  readOnly={!editing}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
