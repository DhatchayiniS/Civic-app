import React, { useEffect, useState } from "react";
import axios from "axios";

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

const statusStyle = (status) => ({
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  background: status === "COMPLETED" ? "rgba(16,185,129,0.15)" : status === "ASSIGNED" ? "rgba(79,70,229,0.1)" : "rgba(251,191,36,0.15)",
  color:      status === "COMPLETED" ? "#059669"               : status === "ASSIGNED" ? "#4f46e5"              : "#d97706"
});

const ViewStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const localBodyId = user?.localBodyId;

  useEffect(() => {
    if (!localBodyId) { setLoading(false); return; }
    axios.get(`${BASE}/api/complaints/localbody/${localBodyId}`)
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [localBodyId]);

  if (loading) return <div className="admin-container"><h1>Complaint Status</h1><p>Loading...</p></div>;

  return (
    <div className="admin-container">
      {modal && <ImageModal url={modal.url} title={modal.title} onClose={() => setModal(null)} />}

      <h1>Complaint Status</h1>

      <table className="authority-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Status</th>
            <th>Worker</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr><td colSpan="4">No complaints found</td></tr>
          ) : (
            complaints.map(c => (
              <tr key={c.id}>
                <td>{c.issueType}</td>
                <td><span style={statusStyle(c.status)}>{c.status}</span></td>
                <td>{c.fieldWorker?.name || "Not Assigned"}</td>
                <td>
                  <div className="img-btn-row">
                    {c.imageName ? (
                      <button className="btn-img-view complaint"
                        onClick={() => setModal({ url: `${BASE}/uploads/${c.imageName}`, title: "Complaint Image" })}>
                        🖼 Complaint
                      </button>
                    ) : (
                      <button className="btn-img-view disabled" disabled>🖼 None</button>
                    )}
                    {c.completionImage ? (
                      <button className="btn-img-view completed"
                        onClick={() => setModal({ url: `${BASE}/uploads/${c.completionImage}`, title: "Completed Image" })}>
                        ✅ Completed
                      </button>
                    ) : (
                      <button className="btn-img-view disabled" disabled>✅ None</button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStatus;
