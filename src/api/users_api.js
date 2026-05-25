import axios from "axios";

const BASE_URL = "https://69c51e048a5b6e2dec2bd6a4.mockapi.io/src/api/users";


export const registerUser = async (userData) => {
  return axios.post(BASE_URL, userData);
};


export const getUsers = async () => {
  return axios.get(BASE_URL);
};


export const updateUser = async (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data);
};


export const deleteUser = async (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};