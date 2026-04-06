import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserComplaints } from "../api/complaintService";
import { reuploadComplaintImage } from "../api/adminService";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import { getGeoLocation, isValidGeoTag, stampGeoTag } from "../utils/geotagUtils";
import "../styles/MyComplaints.css";

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

const ReuploadSection = ({ complaintId, onSuccess }) => {
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
      formData.append("image", photo);
      const updated = await reuploadComplaintImage(complaintId, formData);
      onSuccess(updated);
    } catch {
      setError("Failed to reupload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reupload-section">
      <p className="reupload-notice">⚠️ Your complaint is on hold. Please reupload a clearer image to proceed.</p>
      {error && <div className="error-box">{error}</div>}

      <div className="action-row">
        <button
          type="button"
          className={`action-card ${photo ? "active" : ""}`}
          onClick={isCameraOpen ? stopCamera : startCamera}
        >
          <FaCamera className="action-icon" />
          <span>{photo ? "Change Photo" : "Take New Photo"}</span>
        </button>
      </div>

      {isCameraOpen && (
        <div className="camera-container" style={{ textAlign: "center", marginTop: "10px" }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: "8px", backgroundColor: "#000" }} />
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
            <button type="button" onClick={takePhoto} className="capture-btn-inner"><FaCheck /> Capture</button>
            <button type="button" onClick={stopCamera} className="close-btn-inner"><FaTimes /> Cancel</button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photo && !isCameraOpen && (
        <div className="image-preview">
          <img src={URL.createObjectURL(photo)} alt="Preview" width="220" style={{ borderRadius: "8px", marginTop: "10px" }} />
        </div>
      )}

      {photo && !isCameraOpen && (
        <button className="btn-complete" disabled={loading} onClick={handleSubmit} style={{ marginTop: "12px" }}>
          {loading ? "Uploading..." : "📤 Submit New Image"}
        </button>
      )}
    </div>
  );
};

const MyComplaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (user?.wardNo) {
      getUserComplaints(user.wardNo)
        .then((data) => { setComplaints(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleReuploadSuccess = (updated) => {
    setComplaints(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
  };

  if (loading) return <h2 className="loading">Loading complaints...</h2>;

  return (
    <div className="complaints-page">
      {modal && <ImageModal url={modal.url} title={modal.title} onClose={() => setModal(null)} />}

      <h2 className="page-title">My Complaints</h2>

      {complaints.length === 0 ? (
        <p className="no-data">No complaints found.</p>
      ) : (
        <div className="complaints-grid">
          {complaints.map((comp) => (
            <div key={comp.id} className="complaint-card">
              <div className="card-header">
                <h3>{comp.issueType}</h3>
                <span className={`status ${comp.status?.toLowerCase().replace("_", "-")}`}>
                  {comp.status === "ON_HOLD" ? "On Hold" : comp.status}
                </span>
              </div>

              <p className="description">{comp.description}</p>

              <div className="date">{new Date(comp.createdAt).toLocaleString()}</div>

              <div className="img-btn-row">
                {comp.imageName ? (
                  <button className="btn-img-view complaint"
                    onClick={() => setModal({ url: `${BASE}/uploads/${comp.imageName}`, title: "Complaint Image" })}>
                    🖼 View Complaint Image
                  </button>
                ) : (
                  <button className="btn-img-view disabled" disabled>🖼 No Complaint Image</button>
                )}
                {comp.completionImage ? (
                  <button className="btn-img-view completed"
                    onClick={() => setModal({ url: `${BASE}/uploads/${comp.completionImage}`, title: "Completed Image" })}>
                    ✅ View Completed Image
                  </button>
                ) : (
                  <button className="btn-img-view disabled" disabled>✅ No Completed Image</button>
                )}
              </div>

              {comp.status === "ON_HOLD" && (
                <ReuploadSection complaintId={comp.id} onSuccess={handleReuploadSuccess} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
