import axios from "axios";

const BASE_URL = "http://localhost:8080";

// ✅ Get complaints for authority
export const getComplaintsByLocalBody = async (localBodyId) => {
  const res = await axios.get(`${BASE_URL}/api/complaints/localbody/${localBodyId}`);
  return res.data;
};

// ✅ Get active workers
export const getActiveWorkers = async (localBodyId) => {
  const res = await axios.get(`${BASE_URL}/api/workers/active/${localBodyId}`);
  return res.data;
};

// ✅ Assign complaint
export const assignComplaint = async (complaintId, workerId) => {
  const res = await axios.put(`${BASE_URL}/api/complaints/assign`, null, {
    params: { complaintId, workerId }
  });
  return res.data;
};