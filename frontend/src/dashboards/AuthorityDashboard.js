import React from "react";
import { useNavigate } from "react-router-dom";
// import "./AuthorityDashboard.css";

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    
    localStorage.clear();

    // Redirect to login page
    navigate("/login");
  };


  return (
    <div className="admin-container">
      
      <div className="admin-header">
        <h1>SmartResolve</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="stats-grid">

        <div className="card" onClick={() => navigate("/manage-workers")}>
          <h3>Create & Manage</h3>
          <p>Field Workers</p>
        </div>

        <div className="card" onClick={() => navigate("/assign-complaints")}>
          <h3>Assign Complaints</h3>
          <p>Assign to Workers</p>
        </div>

        <div className="card" onClick={() => navigate("/view-status")}>
          <h3>View Status</h3>
          <p>Track Complaints</p>
        </div>

      </div>
    </div>
  );
};

export default AuthorityDashboard;