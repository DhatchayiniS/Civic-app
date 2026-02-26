import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const signup = async (signupData) => {
  const res = await axios.post(`${API_URL}/signup`, signupData);
  return res.data;
};

export const login = async (loginData) => {
  const res = await axios.post(`${API_URL}/login`, loginData);
  return res.data;
};