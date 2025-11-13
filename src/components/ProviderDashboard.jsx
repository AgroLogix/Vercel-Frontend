import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaSearch,
  FaPlus,
  FaTruck,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProviderDashboard.css";
import logo from "../assets/Logo.jpg";
import axios from "axios";

const ProviderDashboard = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ Modal visibility state
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  useEffect(() => {
    const handleUserUpdate = () => {
      const updated = JSON.parse(localStorage.getItem("user"));
      if (updated) setUser(updated);
    };

    window.addEventListener("storage", handleUserUpdate);
    return () => window.removeEventListener("storage", handleUserUpdate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = dateTime.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [dateTime]);

  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString();

  const handleLogout = () => {
    navigate("/");
  };

  const handleAddVehicle = () => {
    setShowModal(true); // ✅ open modal
  };

  const handleAccept = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Accepted" }),
    });

    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "Accepted" } : b))
    );
  } catch (err) {
    console.error("Error accepting booking:", err);
  }
};

  const handleReject = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),
    });

    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "Rejected" } : b))
    );
  } catch (err) {
    console.error("Error rejecting booking:", err);
  }
};

// ✅ NEW: Handle delivery complete
  const handleDeliveryComplete = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/deliver/${bookingId}`);
      alert("✅ Delivery marked as completed!");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "Delivered" } : b
        )
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("❌ Failed to update delivery status.");
    }
  };

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings"));
    if (storedBookings) {
      setBookings(storedBookings);
    }
  }, []);

  // 🆕 FETCH VEHICLES WHEN DASHBOARD LOADS
  // useEffect(() => {
  //   const fetchVehicles = async () => {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:5000/api/vehicles/${user.userId}`
  //       );
  //       const data = await res.json();
  //       setVehicles(data);
  //     } catch (err) {
  //       console.error("Error fetching vehicles", err);
  //     }
  //   };
  //   if (user?.userId) fetchVehicles();
  // }, [user]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await fetch(
        `http://localhost:5000/api/vehicles/${user.userId}`
      );
      const data = await res.json();
      setVehicles(data);
    };
    if (user?.userId) fetchVehicles();
  }, [user]);

   useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/provider/${user.userId}`
        );
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    if (user?.userId) fetchBookings();
  }, [user]);

  // 🔄 Auto-refresh vehicles when changed in ProviderVehicle page
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "vehiclesUpdated") {
        // Re-fetch vehicles to stay in sync
        fetchVehicles();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSubmitVehicle = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("providerId", user.userId);

    try {
      const res = await fetch("http://localhost:5000/api/vehicles/add", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Vehicle added successfully!");
        setVehicles((prev) => [...prev, data.vehicle]);
        setShowModal(false);
        document.getElementById("vehicleForm").reset();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding vehicle");
    }
  };

  return (
    <div className="provider-dashboard">
      {/* ===== TOP NAVBAR ===== */}
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Agrologix Logo" className="logo" />
          <h1 className="site-name">AgrologiX</h1>
        </div>

        <div className="navbar-center">
          <button className="nav-btn active">Dashboard</button>
          <button
            className="nav-btn"
            onClick={() => navigate("/provider-vehicle")}
          >
            Vehicle
          </button>
          <button
            className="nav-btn"
            onClick={() => navigate("/provider-history")}
          >
            History
          </button>
          <button
            className="nav-btn"
            onClick={() => navigate("/provider-help")}
          >
            Help & Support
          </button>
          <div className="nav-btn disabled-btn" title="Coming Soon">
  Earning
</div>

          <button
            className="nav-btn"
            onClick={() => navigate("/provider-profile")}
          >
            Profile
          </button>
        </div>

        <div className="navbar-right">
          <FaBell className="bell-icon" />
          <img
            src={
              user?.profilePic
                ? `http://localhost:5000${user.profilePic}`
                : "/default_profile.png"
            }
            alt="Profile"
            className="profile-pic"
          />

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== GREETING SECTION ===== */}
      <div className="greeting-section">
        <div className="greeting-left">
          <h3>
            {greeting}, <span>{user?.userId || "User"} 👋</span>
          </h3>
          <p>
            {formattedDate} — {formattedTime}
          </p>
        </div>

        <div className="greeting-right">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              // placeholder="Track using Tracking ID"
              placeholder="Coming Soon,Now not available"
              className="search-input"
            />
          </div>
          <button className="add-vehicle-btn" onClick={handleAddVehicle}>
            <FaPlus /> Add Vehicle
          </button>
        </div>
      </div>

      {/* ===== DASHBOARD STAT BOXES ===== */}
      <div className="stats-section">
  <div className="stat-box">
    <h4>Total Bookings</h4>
    <p>{bookings.length}</p>
  </div>
  <div className="stat-box">
    <h4>Active Bookings</h4>
    <p>{bookings.filter((b) => b.status === "Accepted").length}</p>
  </div>
  <div className="stat-box">
    <h4>Total Vehicles</h4>
    <p>{vehicles.length}</p>
  </div>
  <div className="stat-box disabled-box" title="Coming Soon">
  <h4>Total Earnings</h4>
  <p>₹0</p>
</div>
<div className="stat-box disabled-box" title="Coming Soon">
  <h4>Reviews</h4>
  <p>0 ★</p>
</div>

</div>


      {/* ===== VEHICLE LIST BELOW BOXES ===== */}
      <div className="vehicle-list-section">
        <h3>Your Vehicles</h3>
        {vehicles.length === 0 ? (
          <p className="no-vehicles">No vehicles added yet.</p>
        ) : (
          <div className="vehicle-list">
            {vehicles.map((v) => (
              <div key={v._id} className="vehicle-card">
                <img
                  src={`http://localhost:5000${v.vehicleImages[0]}`}
                  alt={v.model}
                  className="vehicle-thumb"
                />
                <div className="vehicle-info">
                  <h4>{v.model}</h4>
                  <p>
                    <strong>Reg No:</strong> {v.registrationNumber}
                  </p>
                  <p>
                    <strong>Location:</strong> {v.baseLocation}
                  </p>
                  <p>
                    <strong>Description:</strong> {v.description || "N/A"}
                  </p>
                  <p
                    className={`vehicle-status ${
                      v.status === "Booked" ? "booked" : "available"
                    }`}
                  >
                    <strong>Status:</strong>{" "}
                    <span>{v.status || "Available"}</span>
                  </p>
                  <a
                    href={`http://localhost:5000${v.rcFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-rc-link"
                  >
                    View RC
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== BOOKING STATUS SECTION ===== */}
<div className="booking-status-section">
  <h3>Pending Bookings</h3>
  {bookings.filter((b) => b.status === "Pending").length === 0 ? (
    <p className="no-bookings">No pending booking requests.</p>
  ) : (
    <div className="booking-list">
      {bookings
        .filter((b) => b.status === "Pending")
        .map((b) => (
          <div key={b._id} className="booking-card">
            <div className="booking-details">
              <h4>
            Farmer:{b.farmerDetails?.name || b.farmerName || "N/A"}
          </h4>
              <p>
                <strong>Product:</strong> {b.productName}
              </p>
              <p>
                <strong>Quantity:</strong> {b.quantity} tons
              </p>
              <p>
                <strong>Route:</strong> {b.source} ➝ {b.destination}
              </p>
              <p>
                <strong>Delivery Date:</strong> {b.deliveryDate}
              </p>
            </div>
            <div className="booking-actions">
              <button
                className="accept-btn"
                onClick={() => handleAccept(b._id)}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => handleReject(b._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  )}
</div>

 {/* ===== CONFIRMED BOOKINGS SECTION ===== */}
      <div className="confirmed-bookings-section">
        <h3>Confirmed Bookings</h3>
        {bookings.filter((b) => b.status === "Accepted").length === 0 ? (
          <p className="no-bookings">No confirmed bookings yet.</p>
        ) : (
          <div className="booking-list">
            {bookings
              .filter((b) => b.status === "Accepted" || b.status === "Delivered")
              .map((b) => (
                <div key={b._id} className="booking-card confirmed">
                  <div className="booking-details">
                    <h4>
                      Farmer: {b.farmerDetails?.name || b.farmerName || "N/A"}
                    </h4>
                    <p>
                      <strong>Phone:</strong> {b.farmerDetails?.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Product:</strong> {b.productName}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {b.quantity} tons
                    </p>
                    <p>
                      <strong>Route:</strong> {b.source} ➝ {b.destination}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong> {b.deliveryDate}
                    </p>
                    {b.status === "Delivered" ? (
                      <p className="status-text delivered">
                        ✅ Delivery Completed
                      </p>
                    ) : (
                      <>
                        <p className="status-text accepted">
                          ✅ Booking Confirmed
                        </p>
                        {/* ✅ New Delivered Button */}
                        <button
                          className="deliver-btn"
                          onClick={() => handleDeliveryComplete(b._id)}
                        >
                          Mark as Delivered
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>


      {/* ===== ADD VEHICLE MODAL ===== */}
      {showModal && (
        <div className="modal" id="addVehicleModal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <FaTruck /> Add New Vehicle
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form
              className="vehicle-form"
              id="vehicleForm"
              onSubmit={handleSubmitVehicle}
              encType="multipart/form-data"
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Type *</label>
                  <select name="vehicleType" required>
                    <option value="">Select Type</option>
                    <option value="mini-truck">Mini Truck (1–2 Tons)</option>
                    <option value="medium-truck">
                      Medium Truck (2–5 Tons)
                    </option>
                    <option value="heavy-truck">Heavy Truck (5–10 Tons)</option>
                    <option value="trailer">Trailer (10+ Tons)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Vehicle Brand *</label>
                  <select name="brand" required>
                    <option value="">Select Brand</option>
                    <option value="tata">Tata Motors</option>
                    <option value="ashok-leyland">Ashok Leyland</option>
                    <option value="mahindra">Mahindra</option>
                    <option value="eicher">Eicher Motors</option>
                    <option value="bharat-benz">Bharat Benz</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Model *</label>
                  <input
                    type="text"
                    name="model"
                    placeholder="e.g., Tata 407"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Registration Number *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="e.g., MH-12-AB-1234"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity (Tons) *</label>
                  <input type="number" name="capacity" step="0.1" required />
                </div>

                <div className="form-group">
                  <label>Manufacturing Year *</label>
                  <input
                    type="number"
                    name="year"
                    min="2000"
                    max="2025"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fuel Type *</label>
                  <select name="fuelType" required>
                    <option value="">Select Fuel Type</option>
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Rate per KM (₹) *</label>
                  <input
                    type="number"
                    name="ratePerKm"
                    placeholder="e.g., 15"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Base Location *</label>
                <input type="text" name="baseLocation" required />
              </div>

              <div className="form-group full-width">
                <label>Vehicle Description</label>
                <textarea name="description" rows="3"></textarea>
              </div>

              <div className="form-group full-width">
                <label>Upload Vehicle Images</label>
                <input
                  type="file"
                  name="vehicleImages"
                  multiple
                  accept="image/*"
                />
              </div>

              <div className="form-group full-width">
                <label>Upload RC (PDF or Image)</label>
                <input type="file" name="rcFile" accept=".pdf,image/*" />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FaPlus /> Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
