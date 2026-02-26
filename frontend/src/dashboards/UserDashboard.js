import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle, FaPlusCircle, FaClipboardList, FaListAlt } from "react-icons/fa";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="dashboard-wrapper">

      {/* Top Bar */}
      <div className="top-bar">
        
        {/* App Name */}
        <div className="app-name">
          SmartResolve
        </div>

        {/* Account Section */}
        <div className="account-container">
          <div className="account-avatar">
            <FaUserCircle className="account-icon" />
            <span className="status-dot"></span>
          </div>

          <div className="account-dropdown">
            <div className="user-name">
              {user?.name}
            </div>

            <button className="dropdown-item" onClick={goToProfile}>
              Profile
            </button>

            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
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
