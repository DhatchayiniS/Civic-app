import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/fieldworker-dashboard.css";

const BASE = "http://localhost:8080";

const ImageModal = ({ url, title, onClose }) => (
  <div className="img-modal-overlay" onClick={onClose}>
    <div className="img-modal-box" onClick={(e) => e.stopPropagation()}>
      <div className="img-modal-header">
        <span>{title}</span>
        <button className="img-modal-close" onClick={onClose}>✕</button>
      </div>
      <img src={url} alt={title} className="img-modal-img" />
    </div>
  </div>
);

const FieldWorkerDashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [photoMap, setPhotoMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [modal, setModal] = useState(null);

  const workerId = user?.workerId;

  useEffect(() => {
    if (!workerId) return;
    axios.get(`${BASE}/api/complaints/worker/${workerId}`)
      .then(res => setComplaints(res.data))
      .catch(() => alert("Failed to load complaints"));
  }, [workerId]);

  const handlePhotoChange = (id, file) => {
    setPhotoMap(prev => ({ ...prev, [id]: file }));
  };

  const handleComplete = async (id) => {
    setLoadingMap(prev => ({ ...prev, [id]: true }));
    try {
      const formData = new FormData();
      if (photoMap[id]) formData.append("completionImage", photoMap[id]);
      await axios.put(`${BASE}/api/complaints/${id}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "COMPLETED" } : c));
      setPhotoMap(prev => { const n = { ...prev }; delete n[id]; return n; });
    } catch {
      alert("Failed to complete complaint");
    } finally {
      setLoadingMap(prev => ({ ...prev, [id]: false }));
    }
  };

  const counts = {
    total: complaints.length,
    assigned: complaints.filter(c => c.status === "ASSIGNED").length,
    completed: complaints.filter(c => c.status === "COMPLETED").length,
  };

  return (
    <div className="fw-container">
      {modal && <ImageModal url={modal.url} title={modal.title} onClose={() => setModal(null)} />}

      <div className="fw-header">
        <h1>SmartResolve</h1>
        <span>Welcome, {user?.name || "Field Worker"}</span>
        <button className="logout-btn" onClick={() => { logoutUser(); navigate("/login"); }}>Logout</button>
      </div>

      <div className="fw-stats">
        <div className="fw-stat-card">
          <div className="stat-num">{counts.total}</div>
          <div className="stat-label">Total Assigned</div>
        </div>
        <div className="fw-stat-card">
          <div className="stat-num">{counts.assigned}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="fw-stat-card">
          <div className="stat-num">{counts.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="fw-content">
        <h2>My Assigned Work</h2>

        {complaints.length === 0 ? (
          <div className="empty-state">No complaints assigned yet.</div>
        ) : (
          <div className="fw-grid">
            {complaints.map(c => (
              <div className="fw-card" key={c.id}>
                <div className="fw-card-header">
                  <h3>{c.issueType}</h3>
                  <span className={`status-badge ${c.status?.toLowerCase()}`}>{c.status}</span>
                </div>

                <p><strong>Description:</strong> {c.description}</p>
                <p><strong>Ward:</strong> {c.ward?.wardNo}</p>
                <p><strong>Location:</strong> {c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}</p>

                {/* Image buttons */}
                <div className="img-btn-row">
                  {c.imageName ? (
                    <button className="btn-img-view complaint"
                      onClick={() => setModal({ url: `${BASE}/uploads/${c.imageName}`, title: "Complaint Image" })}>
                      🖼 View Complaint Image
                    </button>
                  ) : (
                    <button className="btn-img-view disabled" disabled>🖼 No Complaint Image</button>
                  )}
                  {c.completionImage ? (
                    <button className="btn-img-view completed"
                      onClick={() => setModal({ url: `${BASE}/uploads/${c.completionImage}`, title: "Completed Image" })}>
                      ✅ View Completed Image
                    </button>
                  ) : (
                    <button className="btn-img-view disabled" disabled>✅ No Completed Image</button>
                  )}
                </div>

                {c.status === "ASSIGNED" && (
                  <div className="complete-section">
                    <label className="file-input-label">Upload Completion Photo (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input"
                      onChange={e => handlePhotoChange(c.id, e.target.files[0])}
                    />
                    <button
                      className="btn-complete"
                      disabled={loadingMap[c.id]}
                      onClick={() => handleComplete(c.id)}
                    >
                      {loadingMap[c.id] ? "Submitting..." : "Mark as Completed"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldWorkerDashboard;
