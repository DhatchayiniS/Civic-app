import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewStatus = () => {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ USE CONSISTENT STORAGE KEY (user)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const localBodyId = user?.localBodyId;

  useEffect(() => {

    if (!localBodyId) {
      console.error("localBodyId is missing ❌");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8080/api/complaints/localbody/${localBodyId}`)
      .then(res => {
        setComplaints(res.data);
      })
      .catch(err => {
        console.error("API Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [localBodyId]);

  if (loading) {
    return (
      <div className="admin-container">
        <h1>Complaint Status</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Complaint Status</h1>

      <table className="authority-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Status</th>
            <th>Worker</th>
          </tr>
        </thead>

        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="3">No complaints found</td>
            </tr>
          ) : (
            complaints.map(c => (
              <tr key={c.id}>
                <td>{c.issueType}</td>
                <td>{c.status}</td>
                <td>{c.fieldWorker?.name || "Not Assigned"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStatus;