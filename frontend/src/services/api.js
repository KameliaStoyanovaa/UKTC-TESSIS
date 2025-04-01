import axios from "axios";

const API_URL = "http://localhost/backend/public/";

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}login`, { username, password });
  localStorage.setItem("token", response.data.token);
};

export const checkIn = async () => {
  await axios.post(`${API_URL}students`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};

export const checkOut = async () => {
  await axios.patch(`${API_URL}students`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};
