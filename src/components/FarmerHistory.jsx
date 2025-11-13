import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FarmerHistory.css";

const FarmerHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // date formatter helper
  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    if (isNaN(date)) return d;
    return date.toLocaleDateString("en-GB");
  };

  useEffect(() => {
    const fetchFarmerHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.userId) {
          throw new Error("Farmer not logged in (missing user in localStorage).");
        }

        const res = await axios.get(
          `http://localhost:5000/api/bookings/farmer/${user.userId}`
        );

        // Ensure we got an array
        const data = Array.isArray(res.data) ? res.data : [];

        // Map booking objects to table-friendly records (robust fields)
        const mapped = data.map((b) => {
          // status fallback: try multiple likely field names
          const status = b.status ?? b.bookingStatus ?? b.currentStatus ?? "N/A";

          // vehicle name/model fallback
          const vehicleName =
            (b.vehicleId && b.vehicleId.model) ||
            (b.vehicleDetails && b.vehicleDetails.model) ||
            b.vehicleName ||
            "N/A";

          // provider name fallback (if available)
          const providerName =
            b.providerDetails?.name || b.providerName || b.provider || "N/A";

          // date fallback
          const date = b.deliveryDate || b.createdAt || b.date || "-";

          return {
            id: b._id,
            vehicleName,
            productName: b.productName ?? b.produce ?? "N/A",
            quantity: b.quantity ?? "-",
            source: b.source ?? "-",
            destination: b.destination ?? "-",
            date,
            status,
            providerName,
          };
        });

        setBookings(mapped);
      } catch (err) {
        console.error("Error fetching farmer history:", err);
        setError(err.response?.data?.message || err.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerHistory();
  }, []);

  return (
    <div className="farmer-history-page">
      {/* ===== Header ===== */}
      <div className="farmer-history-header">
        <button className="farmer-back-btn" onClick={() => navigate("/farmer")}>
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaTruck /> Booking History
        </h2>
      </div>

      {/* Loading / Error */}
      {loading && <p style={{ padding: 16 }}>Loading booking history...</p>}
      {error && <p style={{ padding: 16, color: "crimson" }}>Error: {error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="farmer-history-table-container">
          <table className="farmer-history-table">
            <thead>
              <tr>
                <th>Vehicle Name</th>
                <th>Product</th>
                <th>Quantity (Tons)</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Status</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.vehicleName}</td>
                    <td>{b.productName}</td>
                    <td>{b.quantity}</td>
                    <td>{b.source}</td>
                    <td>{b.destination}</td>
                    <td>{formatDate(b.date)}</td>
                    <td>
                      <span
                        className={`farmer-status-badge ${String(b.status).toLowerCase()}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>{b.providerName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "#777", padding: 15 }}>
                    No booking history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmerHistory;
