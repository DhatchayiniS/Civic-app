import React, { useEffect, useState } from "react";
import "../styles/admin-dashboard.css";
import { getComplaintsByLocalBody, getActiveWorkers, assignComplaint, holdComplaint } from "../api/authorityApi";

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

const statusBadge = (status) => {
  const styles = {
    PENDING:   { background: "rgba(251,191,36,0.15)",  color: "#d97706" },
    ASSIGNED:  { background: "rgba(79,70,229,0.1)",    color: "#4f46e5" },
    COMPLETED: { background: "rgba(16,185,129,0.15)",  color: "#059669" },
    ON_HOLD:   { background: "rgba(239,68,68,0.1)",    color: "#dc2626" },
  };
  const s = styles[status] || { background: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{ ...s, padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
      {status}
    </span>
  );
};

const AssignComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [modal, setModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const localBodyId = user.localBodyId;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [c, w] = await Promise.all([
      getComplaintsByLocalBody(localBodyId),
      getActiveWorkers(localBodyId)
    ]);
    // sort oldest first by default
    c.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setComplaints(c);
    setWorkers(w);
  };

  const assign = async (complaintId, workerId) => {
    if (!workerId) return;
    await assignComplaint(complaintId, workerId);
    loadData();
  };

  const hold = async (complaintId) => {
    await holdComplaint(complaintId);
    loadData();
  };

  const displayed = statusFilter
    ? complaints.filter(c => c.status === statusFilter)
    : complaints;

  return (
    <div className="admin-container">
      {modal && <ImageModal url={modal.url} title={modal.title} onClose={() => setModal(null)} />}

      <h1>Assign Complaints</h1>

      <div style={{ marginBottom: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label style={{ fontWeight: 600, fontSize: "13px" }}>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d0d7e2", fontSize: "13px", cursor: "pointer" }}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>

      <table className="authority-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assign Worker</th>
            <th>Actions</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(c => (
            <tr key={c.id}>
              <td>{c.issueType}</td>
              <td>{c.description}</td>
              <td>{statusBadge(c.status)}</td>
              <td>
                {c.status === "COMPLETED" ? (
                  <span style={{ color: "#059669", fontWeight: 500, fontSize: "13px" }}>
                    ✅ {c.fieldWorker?.name || "Completed"}
                  </span>
                ) : c.status === "ON_HOLD" ? (
                  <span style={{ color: "#dc2626", fontWeight: 500, fontSize: "13px" }}>⏸ On Hold</span>
                ) : (
                  <select
                    value={c.fieldWorker?.id || ""}
                    onChange={(e) => assign(c.id, e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d0d7e2", fontSize: "13px", cursor: "pointer" }}
                  >
                    <option value="">— Select Worker —</option>
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                )}
              </td>
              <td>
                {c.status === "PENDING" && !c.fieldWorker && (
                  <button
                    onClick={() => hold(c.id)}
                    style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "rgba(239,68,68,0.1)", color: "#dc2626", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
                  >
                    ⏸ Put On Hold
                  </button>
                )}
              </td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignComplaints;
