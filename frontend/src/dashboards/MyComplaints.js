import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserComplaints } from "../api/complaintService";
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

const MyComplaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { url, title }

  useEffect(() => {
    if (user?.wardNo) {
      getUserComplaints(user.wardNo)
        .then((data) => { setComplaints(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

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
                <span className={`status ${comp.status?.toLowerCase()}`}>
                  {comp.status}
                </span>
              </div>

              <p className="description">{comp.description}</p>

              <div className="date">
                {new Date(comp.createdAt).toLocaleString()}
              </div>

              <div className="img-btn-row">
                {comp.imageName ? (
                  <button
                    className="btn-img-view complaint"
                    onClick={() => setModal({ url: `${BASE}/uploads/${comp.imageName}`, title: "Complaint Image" })}
                  >
                    🖼 View Complaint Image
                  </button>
                ) : (
                  <button className="btn-img-view disabled" disabled>🖼 No Complaint Image</button>
                )}

                {comp.completionImage ? (
                  <button
                    className="btn-img-view completed"
                    onClick={() => setModal({ url: `${BASE}/uploads/${comp.completionImage}`, title: "Completed Image" })}
                  >
                    ✅ View Completed Image
                  </button>
                ) : (
                  <button className="btn-img-view disabled" disabled>✅ No Completed Image</button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
