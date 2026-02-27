import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getLocalBodies,
  createAuthority,
  updateAuthority,
  getAuthorities
} from "../api/adminService";
import "../styles/admin-dashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [localBodies, setLocalBodies] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBodies, setLoadingBodies] = useState(true);

  // ✅ NEW STATES
  const [authorities, setAuthorities] = useState([]);
  const [filterLocalBody, setFilterLocalBody] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    localBodyId: "",
    status: "ACTIVE"
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored auth data if you have
    localStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    loadStats();
    loadLocalBodies();
  }, []);

  // ✅ Reload authorities when filters change
  useEffect(() => {
    loadAuthorities();
  }, [filterLocalBody, filterStatus]);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadLocalBodies = async () => {
    try {
      const data = await getLocalBodies();
      setLocalBodies(data);
    } catch (error) {
      console.error("Error loading local bodies", error);
    } finally {
      setLoadingBodies(false);
    }
  };

  // ✅ NEW
  const loadAuthorities = async () => {
    try {
      const data = await getAuthorities(
        filterLocalBody ? Number(filterLocalBody) : null,
        filterStatus || null
      );
      setAuthorities(data);
    } catch (error) {
      console.error("Error loading authorities", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (mode) => {
    try {
      if (!form.localBodyId) {
        alert("Please select a Local Body.");
        return;
      }

      if (!form.name.trim()) {
        alert("Authority name is required.");
        return;
      }

      if (mode === "update") {

        await updateAuthority({
          name: form.name,
          localBodyId: Number(form.localBodyId),
          status: form.status
        });

        alert("Authority updated successfully!");

      } else {

        await createAuthority({
          ...form,
          localBodyId: Number(form.localBodyId)
        });

        alert("Authority created successfully!");
      }

      setForm({
        name: "",
        email: "",
        password: "",
        localBodyId: "",
        status: "ACTIVE"
      });

      loadAuthorities(); // refresh table

    } catch (error) {
      alert(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>SmartResolve</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loadingStats ? (
        <p className="loading-text">Loading statistics...</p>
      ) : (
        <div className="stats-grid">
          <div className="card">
            <h3>Total Complaints</h3>
            <p>{stats.total}</p>
          </div>
          <div className="card">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
          <div className="card">
            <h3>In Progress</h3>
            <p>{stats.inProgress}</p>
          </div>
          <div className="card">
            <h3>Resolved</h3>
            <p>{stats.resolved}</p>
          </div>
        </div>
      )}

      {/* ================= Create / Update ================= */}
      <div className="authority-section">
        <h2>Create / Update Authority</h2>

        <form
          className="authority-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Local Body</label>
            {loadingBodies ? (
              <p className="loading-text">Loading local bodies...</p>
            ) : (
              <select
                name="localBodyId"
                value={form.localBodyId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Local Body --</option>
                {localBodies.map((lb) => (
                  <option key={lb.id} value={lb.id}>
                    {lb.name} ({lb.type})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="button-row">
            <button
              type="button"
              className="btn-primary left-btn"
              onClick={() => handleSubmit("create")}
            >
              Create
            </button>

            <button
              type="button"
              className="btn-primary right-btn"
              onClick={() => handleSubmit("update")}
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* ================= Authority List ================= */}
      <div className="authority-list-section">
        <h2>Authority List</h2>

        <div className="filter-row">
          <select
            value={filterLocalBody}
            onChange={(e) => setFilterLocalBody(e.target.value)}
          >
            <option value="">All Local Bodies</option>
            {localBodies.map((lb) => (
              <option key={lb.id} value={lb.id}>
                {lb.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <table className="authority-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Local Body</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {authorities.length === 0 ? (
              <tr>
                <td colSpan="4">No authorities found</td>
              </tr>
            ) : (
              authorities.map((auth) => (
                <tr key={auth.id}>
                  <td>{auth.user.name}</td>
                  <td>{auth.user.email}</td>
                  <td>{auth.localBody.name}</td>
                  <td>{auth.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;