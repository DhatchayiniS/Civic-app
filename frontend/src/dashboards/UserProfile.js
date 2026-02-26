import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/${user.email}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [user.email]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleWardChange = (e) => {
    const selectedWardNo = parseInt(e.target.value);

    setProfile({
      ...profile,
      ward: {
        ...profile.ward,
        wardNo: selectedWardNo,
      },
    });
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:8080/api/users/${profile.id}`, profile)
      .then((res) => {
        setProfile(res.data);
        setEditMode(false);
      })
      .catch((err) => console.error(err));
  };

  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* HEADER */}
        <div className="profile-header">
          <div>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                className="name-input"
              />
            ) : (
              <h2>{profile.name}</h2>
            )}
            <span className="role-badge">{profile.role}</span>
          </div>

          {!editMode && (
            <button
              className="edit-profile-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* DETAILS */}
        <div className="profile-details">

          <div className="detail-row">
            <span>Email</span>
            <p>{profile.email}</p>
          </div>

          <div className="detail-row">
            <span>Ward Number</span>
            {editMode ? (
              <select
                value={profile.ward?.wardNo || ""}
                onChange={handleWardChange}
              >
                <option value="">Select Ward</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            ) : (
              <p>{profile.ward?.wardNo}</p>
            )}
          </div>

          <div className="detail-row">
            <span>Account Created</span>
            <p>
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : ""}
            </p>
          </div>

          {editMode && (
            <div className="action-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
