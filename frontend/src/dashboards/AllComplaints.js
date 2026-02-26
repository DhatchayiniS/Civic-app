import { useEffect, useState } from "react";
import { getAllComplaints } from "../api/complaintService";
import "../styles/AllComplaints.css";

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  const [wardFilter, setWardFilter] = useState("");
  const [issueFilter, setIssueFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const issueTypes = [
    "Garbage",
    "Water Leakage",
    "Street Lights",
    "Road Damage",
    "Drainage"
  ];

  // Fetch all complaints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data);
        setFilteredComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = complaints;

    if (wardFilter) {
      filtered = filtered.filter(
        (c) => c.ward?.wardNo === Number(wardFilter)
      );
    }

    if (issueFilter) {
      filtered = filtered.filter(
        (c) => c.issueType === issueFilter
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (c) => c.status === statusFilter
      );
    }

    setFilteredComplaints(filtered);
  }, [wardFilter, issueFilter, statusFilter, complaints]);

  return (
    <div className="all-complaints-container">
      <h2 className="page-title">All Complaints</h2>

      {/* FILTER BAR */}
      <div className="filter-bar">

        {/* Ward Filter */}
        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
        >
          <option value="">All Wards</option>
          {[1, 2, 3, 4, 5].map((ward) => (
            <option key={ward} value={ward}>
              Ward {ward}
            </option>
          ))}
        </select>

        {/* Issue Type Filter */}
        <select
          value={issueFilter}
          onChange={(e) => setIssueFilter(e.target.value)}
        >
          <option value="">All Issue Types</option>
          {issueTypes.map((issue, index) => (
            <option key={index} value={issue}>
              {issue}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

      </div>

      {/* TABLE */}
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
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.issueType}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.ward?.wardNo}</td>
                  <td>
                    <span className={`status ${complaint.status}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AllComplaints;
