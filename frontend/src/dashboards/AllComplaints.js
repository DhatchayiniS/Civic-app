import { useEffect, useState } from "react";
import { getAllComplaints } from "../api/complaintService";
import "../styles/AllComplaints.css";

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

const issueTypes = ["Garbage", "Water Leakage", "Street Lights", "Road Damage", "Drainage"];

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [wardFilter, setWardFilter] = useState("");
  const [issueFilter, setIssueFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState(null); // { url, title }

  useEffect(() => {
    getAllComplaints()
      .then((data) => { setComplaints(data); setFilteredComplaints(data); })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = complaints;
    if (wardFilter)   filtered = filtered.filter((c) => c.ward?.wardNo === Number(wardFilter));
    if (issueFilter)  filtered = filtered.filter((c) => c.issueType === issueFilter);
    if (statusFilter) filtered = filtered.filter((c) => c.status === statusFilter);
    setFilteredComplaints(filtered);
  }, [wardFilter, issueFilter, statusFilter, complaints]);

  return (
    <div className="all-complaints-container">
      {modal && (
        <div className="img-modal-overlay" onClick={() => setModal(null)}>
          <div className="img-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="img-modal-header">
              <span>{modal.title}</span>
              <button className="img-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <img src={modal.url} alt={modal.title} className="img-modal-img" />
          </div>
        </div>
      )}

      <h2 className="page-title">All Complaints</h2>

      <div className="filter-bar">
        <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}>
          <option value="">All Wards</option>
          {[1, 2, 3, 4, 5].map((w) => <option key={w} value={w}>Ward {w}</option>)}
        </select>

        <select value={issueFilter} onChange={(e) => setIssueFilter(e.target.value)}>
          <option value="">All Issue Types</option>
          {issueTypes.map((issue, i) => <option key={i} value={issue}>{issue}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue Type</th>
              <th>Description</th>
              <th>Ward</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Images</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.issueType}</td>
                  <td>{c.description}</td>
                  <td>{c.ward?.wardNo}</td>
                  <td>
                    <span className={`status ${c.status}`}>{c.status}</span>
                  </td>
                  <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</td>
                  <td>
                    <div className="img-btn-row">
                      {c.imageName ? (
                        <button
                          className="btn-img-view complaint"
                          onClick={() => setModal({ url: `${BASE}/uploads/${c.imageName}`, title: "Complaint Image" })}
                        >
                          🖼 Complaint
                        </button>
                      ) : (
                        <button className="btn-img-view disabled" disabled>🖼 None</button>
                      )}

                      {c.completionImage ? (
                        <button
                          className="btn-img-view completed"
                          onClick={() => setModal({ url: `${BASE}/uploads/${c.completionImage}`, title: "Completed Image" })}
                        >
                          ✅ Completed
                        </button>
                      ) : (
                        <button className="btn-img-view disabled" disabled>✅ None</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No complaints found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllComplaints;
