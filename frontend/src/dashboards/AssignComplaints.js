import React, { useEffect, useState } from "react";
import "../styles/admin-dashboard.css";
import {
  getComplaintsByLocalBody,
  getActiveWorkers,
  assignComplaint
} from "../api/authorityApi";

const AssignComplaints = () => {

  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const localBodyId = user.localBodyId;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const c = await getComplaintsByLocalBody(localBodyId);
    const w = await getActiveWorkers(localBodyId);

    setComplaints(c);
    setWorkers(w);
  };

  const assign = async (complaintId, workerId) => {
    await assignComplaint(complaintId, workerId);
    alert("Assigned!");
    loadData(); // refresh after assign
  };

  return (
    <div className="admin-container">
      <h1>Assign Complaints</h1>

      <table className="authority-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Status</th>
            <th>Assign</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map(c => (
            <tr key={c.id}>
              <td>{c.issueType}</td>
              <td>{c.status}</td>
              <td>
                <select onChange={(e) => assign(c.id, e.target.value)}>
                  <option>Select Worker</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default AssignComplaints;