import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserComplaints } from "../api/complaintService";
import "../styles/MyComplaints.css";

const MyComplaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.wardNo) {
      getUserComplaints(user.wardNo)
        .then((data) => {
          setComplaints(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <h2 className="loading">Loading complaints...</h2>;

  return (
    <div className="complaints-page">
      <h2 className="page-title">My Complaints</h2>

      {complaints.length === 0 ? (
        <p className="no-data">No complaints found.</p>
      ) : (
        <div className="complaints-grid">
          {complaints.map((comp) => (
            <div key={comp.id} className="complaint-card">

              <div className="card-header">
                <h3>{comp.issueType}</h3>
                <span className={`status ${comp.status?.toLowerCase()}`}>
                  {comp.status}
                </span>
              </div>

              <p className="description">{comp.description}</p>

              <div className="date">
                {new Date(comp.createdAt).toLocaleString()}
              </div>

              {comp.completionImage && (
                <img
                  src={`http://localhost:8080/${comp.completionImage}`}
                  alt="Complaint"
                  className="complaint-image"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
