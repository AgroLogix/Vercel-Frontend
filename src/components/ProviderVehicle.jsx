import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTruck, FaWrench, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProviderVehicle.css";

const ProviderVehicle = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ SAME IMAGE HANDLER AS PROVIDERDASHBOARD
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-vehicle.jpg";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath; // Cloudinary URL
    }

    if (imagePath.startsWith("/uploads")) {
      return `http://localhost:5000${imagePath}`; // Local uploads folder
    }

    return "/default-vehicle.jpg";
  };

  // ✅ Fetch all provider vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/vehicles/${user.userId}`
        );
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles", err);
      }
    };
    if (user?.userId) fetchVehicles();
  }, [user]);

  // ✅ Toggle Maintenance (updates DB + local state)
  const toggleMaintenance = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Maintenance" ? "Available" : "Maintenance";

    try {
      const res = await fetch(
        `http://localhost:5000/api/vehicles/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: newStatus } : v))
      );

      localStorage.setItem("vehiclesUpdated", Date.now());
    } catch (err) {
      console.error(err);
      alert("Error updating vehicle status");
    }
  };

  // ✅ Delete Vehicle
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      alert("✅ Vehicle deleted successfully");

      setVehicles((prev) => prev.filter((v) => v._id !== id));

      localStorage.setItem("vehiclesUpdated", Date.now());
    } catch (err) {
      console.error(err);
      alert("Error deleting vehicle");
    }
  };

  return (
    <div className="provider-vehicle">
      {/* ===== HEADER ===== */}
      <div className="vehicle-header">
        <button className="back-btn" onClick={() => navigate("/provider")}>
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaTruck /> Vehicle Management
        </h2>
      </div>

      {/* ===== VEHICLE LIST ===== */}
      <div className="vehicle-container">
        {vehicles.length === 0 ? (
          <p className="no-vehicle">No vehicles added yet.</p>
        ) : (
          <div className="vehicle-grid">
            {vehicles.map((v) => (
              <div
                key={v._id}
                className={`vehicle-card ${
                  v.status?.toLowerCase() || "available"
                }`}
              >
                {/* ✅ FIXED IMAGE HANDLING (Cloudinary + Local + Fallback) */}
                <img
                  src={getImageUrl(v.vehicleImages?.[0])}
                  alt={v.model}
                  className="vehicle-img"
                />

                <div className="vehicle-info">
                  <h3>{v.model}</h3>
                  <p>
                    <strong>Reg No:</strong> {v.registrationNumber}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {v.capacity} Tons
                  </p>
                  <p>
                    <strong>Fuel:</strong> {v.fuelType}
                  </p>
                  <p>
                    <strong>Location:</strong> {v.baseLocation}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`status ${
                        v.status?.toLowerCase() || "available"
                      }`}
                    >
                      {v.status || "Available"}
                    </span>
                  </p>

                  {/* ✅ FIXED RC VIEW LINK */}
                  <a
                    href={getImageUrl(v.rcFile)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-rc-link"
                  >
                    View RC
                  </a>

                  <div className="button-row">
                    {v.status !== "Booked" && (
                      <button
                        className={`maint-btn ${
                          v.status === "Maintenance" ? "available" : "maint"
                        }`}
                        onClick={() => toggleMaintenance(v._id, v.status)}
                      >
                        {v.status === "Maintenance"
                          ? "Mark Available"
                          : "Mark Maintenance"}{" "}
                        <FaWrench />
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(v._id)}
                    >
                      <FaTrash /> Delete Vehicle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderVehicle;
