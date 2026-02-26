import { useEffect, useState } from "react"; 
import {
  getDashboardStats,
  getLocalBodies,
  createLocalBody,
  updateLocalBody,
  getAllWards,
} from "../api/adminService";
import "../styles/admin-dashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [localBodies, setLocalBodies] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedWardIds, setSelectedWardIds] = useState([]);

  const [form, setForm] = useState({
    name: "",
    district: "",
    state: "",
    officialEmail: "",
    officialPhone: "",
    address: "",
    password: "",
    status: "ACTIVE",
  });

  const [editingId, setEditingId] = useState(null);

  // Load dashboard, local bodies, and wards
  useEffect(() => {
    loadData();
    loadWards();
  }, []);

  const loadData = async () => {
    const dashboardData = await getDashboardStats();
    const lbData = await getLocalBodies();
    setStats(dashboardData);
    setLocalBodies(lbData);
  };

  const loadWards = async () => {
    const data = await getAllWards();
    setWards(Array.isArray(data) ? data : []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWardSelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(Number(options[i].value));
    }
    setSelectedWardIds(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      localBody: form,
      wardIds: selectedWardIds,
    };

    try {
      if (editingId) {
        await updateLocalBody(editingId, payload);
      } else {
        await createLocalBody(payload);
      }

      // Reset form
      setForm({
        name: "",
        district: "",
        state: "",
        officialEmail: "",
        officialPhone: "",
        address: "",
        password: "",
        status: "ACTIVE",
      });
      setSelectedWardIds([]);
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleEdit = (lb) => {
    setForm(lb);

    // Pre-select wards for editing safely
    if (lb.wards && Array.isArray(lb.wards)) {
      setSelectedWardIds(lb.wards.map((w) => w.id));
    } else {
      setSelectedWardIds([]);
    }

    setEditingId(lb.id);
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* 📊 Stats Cards */}
      <div className="stats-grid">
        <div className="card">
          <h3>Total Complaints</h3>
          <p>{stats.total || 0}</p>
        </div>
        <div className="card">
          <h3>Pending</h3>
          <p>{stats.pending || 0}</p>
        </div>
        <div className="card">
          <h3>In Progress</h3>
          <p>{stats.inProgress || 0}</p>
        </div>
        <div className="card">
          <h3>Resolved</h3>
          <p>{stats.resolved || 0}</p>
        </div>
      </div>

      {/* 🏛 Local Body Form */}
      <div className="form-section">
        <h2>{editingId ? "Update Local Body" : "Create Local Body"}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="district" placeholder="District" value={form.district} onChange={handleChange} required />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
          <input name="officialEmail" placeholder="Official Email" value={form.officialEmail} onChange={handleChange} required />
          <input name="officialPhone" placeholder="Phone" value={form.officialPhone} onChange={handleChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          {!editingId && <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required />}

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          {/* Multi-select for Wards */}
          <label>Select Wards:</label>
          <select multiple value={selectedWardIds} onChange={handleWardSelection}>
            {(wards || []).map((ward) => (
              <option key={ward.id} value={ward.id}>
                Ward {ward.wardNo || ward.id}
              </option>
            ))}
          </select>

          <button type="submit">{editingId ? "Update" : "Create"}</button>
        </form>
      </div>

      {/* 📋 Local Body Table */}
      <div className="table-section">
        <h2>Local Bodies</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>District</th>
              <th>Status</th>
              <th>Wards</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(localBodies || []).map((lb) => (
              <tr key={lb.id}>
                <td>{lb.name}</td>
                <td>{lb.district}</td>
                <td>{lb.status}</td>
                <td>{lb.wards && Array.isArray(lb.wards) ? lb.wards.map((w) => w.wardNo).join(", ") : "-"}</td>
                <td>
                  <button onClick={() => handleEdit(lb)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;