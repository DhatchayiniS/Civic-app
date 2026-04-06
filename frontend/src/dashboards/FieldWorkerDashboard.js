import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import { getGeoLocation, isValidGeoTag, stampGeoTag } from "../utils/geotagUtils";
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

/* Per-card complete section with live camera capture */
const CompleteSection = ({ complaintId, onComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  const startCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera not supported or page must be served over HTTPS.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setError("Cannot access camera. Please grant camera permission.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
  };

  const takePhoto = async () => {
    setError("");
    try {
      const { latitude, longitude } = await getGeoLocation();
      if (!isValidGeoTag(latitude, longitude)) {
        setError("Invalid geotag. Cannot verify your location.");
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      stampGeoTag(canvas, latitude, longitude);
      canvas.toBlob((blob) => {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
        setPhoto(file);
        stopCamera();
      }, "image/jpeg", 0.9);
    } catch (err) {
      setError(typeof err === "string" ? err : "Location access denied. Please enable location services.");
    }
  };

  const handleSubmit = async () => {
    if (!photo) { setError("Please take a photo first."); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("completionImage", photo);
      const res = await axios.put(`${BASE}/api/complaints/${complaintId}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onComplete(complaintId, res.data); // pass full updated complaint back
    } catch {
      setError("Failed to complete complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complete-section">
      {error && <div className="error-box">{error}</div>}

      {/* Camera trigger — same as ReportIssue action-card */}
      <div className="action-row">
        <button
          type="button"
          className={`action-card ${photo ? "active" : ""}`}
          onClick={isCameraOpen ? stopCamera : startCamera}
        >
          <FaCamera className="action-icon" />
          <span>{photo ? "Change Photo" : "Take Completion Photo"}</span>
        </button>
      </div>

      {/* Live camera view — same as ReportIssue */}
      {isCameraOpen && (
        <div className="camera-container" style={{ textAlign: "center", marginTop: "10px" }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: "8px", backgroundColor: "#000" }} />
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
            <button type="button" onClick={takePhoto} className="capture-btn-inner"><FaCheck /> Capture</button>
            <button type="button" onClick={stopCamera} className="close-btn-inner"><FaTimes /> Cancel</button>
          </div>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Preview — same as ReportIssue image-preview */}
      {photo && !isCameraOpen && (
        <div className="image-preview">
          <img
            src={URL.createObjectURL(photo)}
            alt="Preview"
            width="220"
            style={{ borderRadius: "8px", marginTop: "10px" }}
          />
        </div>
      )}

      {/* Submit */}
      {photo && !isCameraOpen && (
        <button
          className="btn-complete"
          disabled={loading}
          onClick={handleSubmit}
          style={{ marginTop: "12px" }}
        >
          {loading ? "Submitting..." : "✅ Mark as Completed"}
        </button>
      )}
    </div>
  );
};

const FieldWorkerDashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [modal, setModal] = useState(null);

  const workerId = user?.workerId;

  useEffect(() => {
    if (!workerId) return;
    axios.get(`${BASE}/api/complaints/worker/${workerId}`)
      .then(res => setComplaints(res.data))
      .catch(() => alert("Failed to load complaints"));
  }, [workerId]);

  const handleCompleted = (id, updatedComplaint) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updatedComplaint } : c));
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
                  <CompleteSection complaintId={c.id} onComplete={handleCompleted} />
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
