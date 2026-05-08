import axiosInstance from "./axiosInstance";
import apiEndPoints from "./apiEndpoints";

// REGISTER USER
export const registerUser = async (userData) => {
  const response = await axiosInstance.post(apiEndPoints.register, userData);

  return response.data;
};

// LOGIN USER
export const loginUser = async (userData) => {
  const response = await axiosInstance.post(apiEndPoints.login, userData);
  const userId = response.data.data.user.id;
  localStorage.setItem("userId", userId);

  return response.data;
};
