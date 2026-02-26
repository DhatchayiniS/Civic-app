import axios from "axios";

const API_URL = "http://localhost:8080/api/complaints";

/* =========================
   SUBMIT COMPLAINT
========================= */
export const submitComplaint = async (formData) => {
  try {
    const res = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data; // returns full complaint object
  } catch (err) {
    console.error(
      "Error submitting complaint:",
      err.response?.data || err.message
    );
    throw new Error("Failed to submit complaint");
  }
};

/* =========================
   GET COMPLAINTS BY WARD
========================= */
export const getUserComplaints = async (wardNo) => {
  try {
    const res = await axios.get(`${API_URL}/ward/${wardNo}`);
    return res.data;
  } catch (err) {
    console.error(
      "Error fetching ward complaints:",
      err.response?.data || err.message
    );
    throw new Error("Failed to fetch complaints");
  }
};

/* =========================
   GET ALL COMPLAINTS
========================= */
export const getAllComplaints = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error(
      "Error fetching complaints:",
      err.response?.data || err.message
    );
    throw new Error("Failed to fetch complaints");
  }
};