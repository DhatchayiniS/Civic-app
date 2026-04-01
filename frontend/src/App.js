import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import UserDashboard from "./dashboards/UserDashboard";
import ReportIssue from "./dashboards/ReportIssue";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import MyComplaints from "./dashboards/MyComplaints";
import AllComplaints from "./dashboards/AllComplaints";
import UserProfile from "./dashboards/UserProfile";
import AdminDashboard from "./dashboards/AdminDashboard";
import AuthorityDashboard from "./dashboards/AuthorityDashboard";
import ManageWorkers from "./dashboards/ManageWorkers";
import AssignComplaints from "./dashboards/AssignComplaints";
import ViewStatus from "./dashboards/ViewStatus";
import FieldWorkerDashboard from "./dashboards/FieldWorkerDashboard";



import React from "react";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/user-dashboard" element={<PrivateRoute role="USER"><UserDashboard /></PrivateRoute>} />
          <Route 
            path="/my-complaints" 
            element={
              <PrivateRoute role="USER">
                <MyComplaints />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/all-complaints" 
            element={
              <PrivateRoute role="USER">
                <AllComplaints />
              </PrivateRoute>
            } 
          />

          <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
          <Route path="/manage-workers" element={<ManageWorkers />} />
          <Route path="/assign-complaints" element={<AssignComplaints />} />
          <Route path="/view-status" element={<ViewStatus />} />

          <Route
            path="/fieldworker-dashboard"
            element={
              <PrivateRoute role="FIELD_WORKER">
                <FieldWorkerDashboard />
              </PrivateRoute>
            }
          />

          <Route 
            path="/profile" 
            element={
              <PrivateRoute role="USER">
                <UserProfile />
              </PrivateRoute>
            } 
          />


          <Route path="/report-issue" element={<PrivateRoute role="USER"><ReportIssue /></PrivateRoute>} />
          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </Router>
    </AuthProvider>


  );
}

// Private route for role-based access
const PrivateRoute = ({ role, children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user || user.role !== role) return <Navigate to="/login" />;
  return children;
};

export default App;
