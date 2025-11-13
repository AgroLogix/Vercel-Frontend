import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProviderHistory.css";

const ProviderHistory = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: format date (fallback to createdAt or deliveryDate)
  const formatDate = (rawDate) => {
    if (!rawDate) return "-";
    const d = new Date(rawDate);
    if (isNaN(d)) return rawDate;
    return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.userId) {
          setError("Provider not logged in or user data missing in localStorage.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/bookings/provider/${user.userId}`
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Server returned ${res.status}: ${txt}`);
        }

        const data = await res.json();

        // Filter to include only historical statuses (you can adjust this list)
        const historyStatuses = ["Completed", "Cancelled", "Delivered"];
        const filtered = Array.isArray(data)
          ? data
              .filter((b) => historyStatuses.includes(b.status))
              .map((b) => ({
                id: b._id,
                vehicleModel:
                  (b.vehicleId && b.vehicleId.model) ||
                  (b.vehicleDetails && b.vehicleDetails.model) ||
                  b.vehicleName ||
                  "N/A",
                date: b.deliveryDate || b.createdAt || b.updatedAt || "-",
                farmerName: b.farmerDetails?.name || b.farmerName || "N/A",
                fromLocation: b.source || "-",
                toLocation: b.destination || "-",
                status: b.status || b.bookingStatus || b.currentStatus || "N/A",
                // earnings: prefer explicit field, else fallback to computed or '-'
                earnings: b.earnings ?? b.fare ?? b.amount ?? "—",
              }))
          : [];

        setHistoryData(filtered);
      } catch (err) {
        console.error("Error fetching provider history:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="provider-history">
      {/* ===== HEADER ===== */}
      <div className="history-header">
        <button className="back-btn" onClick={() => navigate("/provider")}>
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaHistory /> Booking History
        </h2>
      </div>

      {/* ===== LOADING / ERROR STATES ===== */}
      {loading && <p style={{ padding: 16 }}>Loading history...</p>}
      {error && (
        <p style={{ padding: 16, color: "crimson" }}>
          Error: {error}
        </p>
      )}

      {/* ===== HISTORY TABLE ===== */}
      {!loading && !error && (
        <div className="history-table-container">
          {historyData.length === 0 ? (
            <p className="no-history">No past records available.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Vehicle Model</th>
                  <th>Date</th>
                  <th>Farmer Name</th>
                  <th>From Location</th>
                  <th>To Location</th>
                  <th>Status</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.vehicleModel}</td>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.farmerName}</td>
                    <td>{record.fromLocation}</td>
                    <td>{record.toLocation}</td>
                    <td className={`status ${record.status.toLowerCase()}`}>
                      {record.status}
                    </td>
                    <td>{record.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderHistory;
