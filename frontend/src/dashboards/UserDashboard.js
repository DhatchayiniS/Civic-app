import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPlusCircle, FaClipboardList, FaListAlt } from "react-icons/fa";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">

      {/* Top Bar */}
      <div className="top-bar">
        <div className="app-name">SmartResolve</div>

        <div className="top-bar-actions">
          <button className="top-bar-btn" onClick={() => navigate("/profile")}>Profile</button>
          <button className="top-bar-btn logout" onClick={() => logoutUser()}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div className="dashboard-hero">
        <h2>Welcome to SmartResolve</h2>
        
      </div>

      {/* Dashboard Buttons */}
      <div className="dashboard-container">
        <div className="dashboard-buttons">

          <button
            className="dashboard-card blue"
            onClick={() => navigate("/report-issue")}
          >
            <FaPlusCircle className="button-icon" />
            <span>Report Issue</span>
          </button>

          <button
            className="dashboard-card purple"
            onClick={() => navigate("/my-complaints")}
          >
            <FaClipboardList className="button-icon" />
            <span>My Complaints</span>
          </button>

          <button
            className="dashboard-card green wide"
            onClick={() => navigate("/all-complaints")}
          >
            <FaListAlt className="button-icon" />
            <span>All Complaints</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
