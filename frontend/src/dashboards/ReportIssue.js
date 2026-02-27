import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaCamera, FaMapMarkerAlt, FaTimes, FaCheck } from "react-icons/fa";
import "../styles/ReportIssue.css";
import { submitComplaint } from "../api/complaintService";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Refs for Camera Logic
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const issueOptions = [
    "Water Leakage",
    "Street Lights",
    "Drainage Issue",
    "Road Damage",
    "Garbage Issue",
  ];

  // --- START CAMERA LOGIC ---
  const startCamera = async () => {
    setError("");
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Access Error:", err);
      setError("Cannot access camera. Ensure permissions are granted.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    const context = canvasRef.current.getContext("2d");

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);

    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
      
      if (file.size > 5 * 1024 * 1024) {
        setError("Captured image is too large.");
        return;
      }

      setImage(file);
      setError("");
      stopCamera();
    }, "image/jpeg", 0.9);
  };
  // --- END CAMERA LOGIC ---

  const handleUseLocation = async () => {
    if (!user?.wardNo) {
      setError("User ward number not available.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/wards/${user.wardNo}`);
      if (!res.ok) throw new Error("Unable to fetch ward info");
      const ward = await res.json();
      const centerLat = (ward.minLatitude + ward.maxLatitude) / 2;
      const centerLng = (ward.minLongitude + ward.maxLongitude) / 2;
      setLocation({
        latitude: centerLat,
        longitude: centerLng,
        wardId: ward.wardNo, 
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch ward location.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issueType) return setError("Please select an issue type.");
    if (!location) return setError("Please use location.");
    if (!user?.id) return setError("User not found.");

    const formData = new FormData();
    formData.append("issueType", issueType);
    formData.append("description", description);
    formData.append("wardId", location.wardId);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("userId", user.id);

    if (image) {
      formData.append("completionImage", image);
    }

    try {
      await submitComplaint(formData);
      navigate("/user-dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to submit complaint.");
    }
  };

  return (
    <div className="report-wrapper">
      <div className="report-card">
        <div className="report-header">
          <h2>Report an Issue</h2>
        </div>

        <form className="report-form" onSubmit={handleSubmit}>
          {error && <div className="error-box">{error}</div>}

          <div className="form-group">
            <label>Issue Type</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
              <option value="">Select issue type</option>
              {issueOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows="4"
            />
          </div>

          <div className="action-row">
            {/* Capture Button Triggers Camera Modal/View */}
            <button 
                type="button"
                className={`action-card ${image ? "active" : ""}`} 
                onClick={isCameraOpen ? stopCamera : startCamera}
            >
              <FaCamera className="action-icon" />
              <span>{image ? "Change Image" : "Take Photo"}</span>
            </button>

            <button
              type="button"
              className={`action-card ${location ? "active" : ""}`}
              onClick={handleUseLocation}
            >
              <FaMapMarkerAlt className="action-icon" />
              <span>{location ? "Location Set" : "Use Location"}</span>
            </button>
          </div>

          {/* LIVE CAMERA VIEW */}
          {isCameraOpen && (
            <div className="camera-container" style={{ textAlign: 'center', marginTop: '10px' }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000' }} />
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button type="button" onClick={takePhoto} className="capture-btn-inner"><FaCheck /> Capture</button>
                <button type="button" onClick={stopCamera} className="close-btn-inner"><FaTimes /> Cancel</button>
              </div>
            </div>
          )}

          {/* HIDDEN CANVAS FOR CAPTURING */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* IMAGE PREVIEW */}
          {image && !isCameraOpen && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                width="220"
                style={{ borderRadius: '8px', marginTop: '10px' }}
              />
            </div>
          )}

          <button className="submit-btn" type="submit">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;