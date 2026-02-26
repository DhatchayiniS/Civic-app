import axios from "axios";

const API_URL = "http://localhost:8080/api/admin";  // Admin endpoints
const WARD_API_URL = "http://localhost:8080/api/wards"; // Ward endpoints

// 📊 Get Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/dashboard`);
    return res.data || {};
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {};
  }
};

// 🏛 Get All Local Bodies
export const getLocalBodies = async () => {
  try {
    const res = await axios.get(`${API_URL}/local-bodies`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error fetching local bodies:", error);
    return [];
  }
};

// 🗳 Get all Wards
export const getAllWards = async () => {
  try {
    const res = await axios.get(`${WARD_API_URL}`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    return [];
  }
};

// ➕ Create Local Body
export const createLocalBody = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/local-bodies`, data);
    return res.data;
  } catch (error) {
    console.error("Error creating local body:", error);
    throw error;
  }
};

// ✏ Update Local Body
export const updateLocalBody = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/local-bodies/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating local body:", error);
    throw error;
  }
};