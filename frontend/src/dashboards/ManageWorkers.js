import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/manage-workers.css";

const ManageWorkers = () => {

  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  // ✅ SAFELY GET USER
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ PROPER VALIDATION
  useEffect(() => {
    if (!user || user.role !== "LOCAL_BODY") {
      window.location.href = "/";
    }
  }, [user]);

  const localBodyId = user?.localBodyId;

  // ✅ FETCH WORKERS
  const fetchWorkers = () => {
    if (!localBodyId) return;
    axios.get(`http://localhost:8080/api/workers/active/${localBodyId}`)
      .then(res => setWorkers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!localBodyId) return;
    axios.get(`http://localhost:8080/api/workers/active/${localBodyId}`)
      .then(res => setWorkers(res.data))
      .catch(err => console.error(err));
  }, [localBodyId]);

  // ✅ CREATE WORKER
  const createWorker = () => {

    if (!name) {
      alert("Enter worker name");
      return;
    }

    if (!localBodyId) {
      alert("localBodyId missing ❌");
      return;
    }

    const payload = {
      name,
      status,
      localBodyId: Number(localBodyId),
      email: email || undefined,
      password: password || undefined
    };

    console.log("Sending payload:", payload); // DEBUG

    axios.post("http://localhost:8080/api/workers", payload)
      .then(() => {
        alert("Worker Created");
        fetchWorkers();
        resetForm();
      })
      .catch(err => {
        console.error(err);
        alert("Error creating worker");
      });
  };

  // ✅ EDIT WORKER
  const editWorker = (worker) => {
    setSelectedWorkerId(worker.id);
    setName(worker.name);
    setStatus(worker.status);
  };

  // ✅ UPDATE WORKER
  const updateWorker = () => {

    if (!selectedWorkerId) {
      alert("Select a worker to update");
      return;
    }

    axios.put(`http://localhost:8080/api/workers/${selectedWorkerId}`, {
      name,
      status
    }).then(() => {
      alert("Worker Updated");
      fetchWorkers();
      resetForm();
    }).catch(err => {
      console.error(err);
      alert("Error updating worker");
    });
  };

  const resetForm = () => {
    setName("");
    setStatus("ACTIVE");
    setEmail("");
    setPassword("");
    setSelectedWorkerId(null);
  };

  return (
    <div className="admin-container">
      <h1>Manage Workers</h1>

      {/* FORM */}
      <div className="authority-section">
        <h2>Create / Update Worker</h2>

        <div className="authority-form">

          {/* NAME */}
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* STATUS */}
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Login Email (optional)</label>
            <input
              type="email"
              placeholder="worker@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password (optional)</label>
            <input
              type="password"
              placeholder="Set login password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="button-row">
            <button className="btn-primary left-btn" onClick={createWorker}>
              Create
            </button>

            <button className="btn-primary right-btn" onClick={updateWorker}>
              Update
            </button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="authority-list-section">
        <h2>Workers</h2>

        <table className="authority-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {workers.map(w => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.status}</td>
                <td>
                  <button className="btn-primary" onClick={() => editWorker(w)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default ManageWorkers;