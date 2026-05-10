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

//logout
export const logoutUser = async () => {
  const response = await axiosInstance.post(apiEndPoints.logout);
  return response.data;
};

//verify login
export const verifyLoginUser = async () => {
  try {
    const response = await axiosInstance.get(apiEndPoints.verifyLogin);
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
};

//holding
// buy socks
export const buyStockApi = async (payload) => {
  const response = await axiosInstance.post(apiEndPoints.buy_stocks, payload);
  return response.data;
};
