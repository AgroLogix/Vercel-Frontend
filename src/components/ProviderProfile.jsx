import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProviderProfile.css";
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaCamera,
  FaTimes,
  FaKey,
} from "react-icons/fa";

const emptyUser = {
  firstName: "",
  lastName: "",
  userId: "",
  profilePic: "",
  gender: "",
  dob: "",
  phone: "",
  email: "",
  password: "",
  addressLine: "",
  city: "",
  state: "",
  district:"",
  pincode: "",
  baseLocation: "",
  aadhaar: "",
  pan: "",
  drivingLicense: "",
};

const ProviderProfile = () => {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState({ ...emptyUser, ...stored });
  const [editing, setEditing] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  useEffect(() => {
  const s = JSON.parse(localStorage.getItem("user")) || {};
  if (!s.userId) return;
  axios.get(`http://localhost:5000/api/auth/provider/${s.userId}`)
    .then(res => setUser(res.data))
    .catch(() => setUser({ ...emptyUser, ...s }));
}, []);


  const onChange = (field, value) => {
    setUser((u) => ({ ...u, [field]: value }));
  };

  const handleProfilePic = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePic", file);

  try {
    const res = await axios.post(
      `http://localhost:5000/api/auth/provider/${user.userId}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // ✅ Update local storage + broadcast event
    const updatedUser = { ...user, profilePic: res.data.profilePic };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // 🔄 Notify other tabs/pages (e.g., ProviderDashboard)
    window.dispatchEvent(new Event("storage"));

    alert("Profile image uploaded successfully!");
  } catch (err) {
    console.error(err);
    alert("Image upload failed. Check backend.");
  }
};


  const handleSave = async (e) => {
  e?.preventDefault();
  try {
    await axios.put(`http://localhost:5000/api/auth/provider/${user.userId}`, user);
    localStorage.setItem("user", JSON.stringify(user));
    setEditing(false);
    alert("Profile saved successfully to MongoDB.");
  } catch (err) {
    console.error(err);
    alert("Failed to save profile. Check server connection.");
  }
};


  const handleCancel = () => {
    const s = JSON.parse(localStorage.getItem("user")) || {};
    setUser({ ...emptyUser, ...s });
    setEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwords.newPassword) {
      alert("Please enter a new password.");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      alert("New password and confirm mismatch.");
      return;
    }
    onChange("password", passwords.newPassword);
    localStorage.setItem("user", JSON.stringify({ ...user, password: passwords.newPassword }));
    setPasswords({ current: "", newPassword: "", confirm: "" });
    setShowPasswordBox(false);
    alert("Password updated locally.");
  };

  return (
    <div className="provider-profile">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/provider")}>
          <FaArrowLeft /> Back
        </button>
        <h1>Provider Profile</h1>
        <div className="header-actions">
          {!editing ? (
            <>
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
              <button
                className="change-pass-btn"
                onClick={() => setShowPasswordBox((s) => !s)}
                title="Change Password"
              >
                <FaKey /> Change Password
              </button>
            </>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>
                <FaSave /> Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Password Box */}
      {showPasswordBox && (
        <form className="password-box" onSubmit={handlePasswordChange}>
          <div className="row">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              placeholder="Current password (optional for local)"
            />
          </div>
          <div className="row">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              required
            />
          </div>
          <div className="row">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              required
            />
          </div>
          <div className="password-actions">
            <button type="submit" className="btn-primary">Update Password</button>
            <button type="button" className="btn-secondary" onClick={() => setShowPasswordBox(false)}>Close</button>
          </div>
        </form>
      )}

      {/* Profile Card */}
      <div className="profile-card">
        <div className="left-col">
          <div className="photo-wrap">
            <img
              src={
    user.profilePic
      ? `http://localhost:5000${user.profilePic}`
      : "/default_profile.png"
  }
              alt="Profile"
              className="profile-photo"
            />
            {editing && (
              <label className="upload-overlay">
                <input type="file" accept="image/*" onChange={handleProfilePic} />
                <span><FaCamera /> Change</span>
              </label>
            )}
          </div>

          <div className="summary">
            <h2>
              {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Provider Name"}
            </h2>
            <p><strong>User ID:</strong> {user.userId || "AGX-PRV-XXXX"}</p>
            <p><strong>Base Location:</strong> {user.baseLocation || "N/A"}</p>
            <p><strong>Total Vehicles:</strong> N/A</p>
            <p><strong>Avg Rating:</strong> ★ 0.0</p>
          </div>
        </div>

        <div className="right-col">
          <form className="profile-form" onSubmit={handleSave}>
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={user.firstName || ""}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  placeholder="First name"
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={user.lastName || ""}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  placeholder="Last name"
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  value={user.userId || ""}
                  onChange={(e) => onChange("userId", e.target.value)}
                  readOnly={!editing}
                  placeholder="AGX-PRV-1024"
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={user.gender || ""}
                  onChange={(e) => onChange("gender", e.target.value)}
                  disabled={!editing}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={user.dob || ""}
                  onChange={(e) => onChange("dob", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={user.phone || ""}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user.email || ""}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="you@example.com"
                  readOnly={!editing}
                />
              </div>
            </div>

            <h3>Address & Location</h3>
            <div className="form-grid">
              <div className="form-group wide">
                <label>Address Line</label>
                <input
                  type="text"
                  value={user.addressLine || ""}
                  onChange={(e) => onChange("addressLine", e.target.value)}
                  readOnly={!editing}
                  placeholder="21, Main Market Road"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={user.city || ""}
                  onChange={(e) => onChange("city", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={user.state || ""}
                  onChange={(e) => onChange("state", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <input
                  type="text"
                  value={user.district || ""}
                  onChange={(e) => onChange("district", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={user.pincode || ""}
                  onChange={(e) => onChange("pincode", e.target.value)}
                  readOnly={!editing}
                />
              </div>
              <div className="form-group wide">
                <label>Base Location</label>
                <input
                  type="text"
                  value={user.baseLocation || ""}
                  onChange={(e) => onChange("baseLocation", e.target.value)}
                  readOnly={!editing}
                  placeholder="Pune, Maharashtra"
                />
              </div>
            </div>

            <h3>Identification</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  value={user.aadhaar || ""}
                  onChange={(e) => onChange("aadhaar", e.target.value)}
                  readOnly={!editing}
                  placeholder="XXXX-XXXX-1234"
                />
              </div>
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  value={user.pan || ""}
                  onChange={(e) => onChange("pan", e.target.value)}
                  readOnly={!editing}
                  placeholder="ABCPK1234F"
                />
              </div>
              <div className="form-group">
                <label>Driving Licence</label>
                <input
                  type="text"
                  value={user.drivingLicense || ""}
                  onChange={(e) => onChange("drivingLicense", e.target.value)}
                  readOnly={!editing}
                />
              </div>
            </div>

            {editing && (
              <div className="form-actions-bottom">
                <button type="submit" className="btn-primary">Save Profile</button>
                <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
