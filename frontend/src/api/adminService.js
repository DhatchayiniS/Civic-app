import axios from "axios";

// Correct backend endpoints
export const getDashboardStats = async () => {
  const response = await axios.get("http://localhost:8080/api/admin/dashboard");
  return response.data;
};

export const reuploadComplaintImage = async (complaintId, formData) => {
  const response = await axios.put(
    `http://localhost:8080/api/complaints/${complaintId}/reupload-image`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const getLocalBodies = async () => {
  const response = await axios.get("http://localhost:8080/admin/local-bodies");
  return response.data; // array of LocalBody objects
};

export const createAuthority = async (data) => {
  const response = await axios.post("http://localhost:8080/admin/create-authority", data);
  return response.data;
};

export const updateAuthority = async (data) => {
  const response = await axios.post(
    "http://localhost:8080/admin/update-authority",
    data
  );
  return response.data;
};

export const getAuthorities = async (localBodyId, status) => {
  let query = [];

  if (localBodyId) {
    query.push(`localBodyId=${localBodyId}`);
  }

  if (status) {
    query.push(`status=${status}`);
  }

  const queryString = query.length ? `?${query.join("&")}` : "";

  const response = await axios.get(
    `http://localhost:8080/admin/authorities${queryString}`
  );

  return response.data;
};