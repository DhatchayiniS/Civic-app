import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/ReportIssue.css";
import { submitComplaint } from "../api/complaintService";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleCaptureImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setImage(file);
    setError("");
  };

  const handleUseLocation = async () => {
    if (!user?.wardNo) {
      setError("User ward number not available.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/wards/${user.wardNo}`
      );

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

          {/* Issue Type */}
          <div className="form-group">
            <label>Issue Type</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="">Select issue type</option>
              {issueOptions.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          <div className="action-row">
            <label className={`action-card ${image ? "active" : ""}`}>
              <FaCamera className="action-icon" />
              <span>{image ? "Image Added" : "Add Image"}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCaptureImage}
                hidden
              />
            </label>

            <button
              type="button"
              className={`action-card ${location ? "active" : ""}`}
              onClick={handleUseLocation}
            >
              <FaMapMarkerAlt className="action-icon" />
              <span>{location ? "Location Set" : "Use Location"}</span>
            </button>
          </div>

          {/* IMAGE PREVIEW */}
          {image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                width="220"
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